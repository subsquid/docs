---
title: "Step 3: External data"
description: >-
  Retrieving data from state calls, IPFS and HTTP
sidebar_position: 30
---

# Step 3: Adding external data

This is the third part of the tutorial in which we build a squid that indexes [Bored Ape Yacht Club](https://boredapeyachtclub.com) NFTs, their transfers and owners from the [Ethereum blockchain](https://ethereum.org), fetches the metadata from [IPFS](https://ipfs.tech/) and regular HTTP URLs, stores it in a database and serves it over a GraphQL API. In the first two parts of the tutorial ([1](/tutorials/bayc/step-one-indexing-transfers), [2](/tutorials/bayc/step-two-deriving-owners-and-tokens)) we created a squid that scraped `Transfer` events emitted by the [BAYC token contract](https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d) and derived some information on tokens and their owners from that data. In this part we enrich token data with information obtained from contract state calls, IPFS and regular HTTP URLs.

Prerequisites: Node.js, [Subsquid CLI](/squid-cli/installation), Docker, a project folder with the code from the second part ([this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/6f41cba76b9d90d12638a17d64093dbeb19d00ec)).

## Exploring token metadata

Now that we have a record for each BAYC NFT. Let's explore how we can retrieve more data for each token.

[EIP-721](https://eips.ethereum.org/EIPS/eip-721) suggests that token metadata contracts may make token data available in a JSON referred to by the output of the `tokenURI()` contract function. Upon examining `src/abi/bayc.ts`, we find that the BAYC token contract implements this function. Also, the public ABI has no obvious contract methods that may set token URI or events that may be emitted on its change. In other words, it appears that the only way to retrieve this data is by [querying the contract state](/evm-indexing/query-state/).

We prepare for this by supplying a RPC endpoint of an archive Ethereum node on processor initialization:
```diff title=src/processor.ts
 let processor = new EvmBatchProcessor()
     .setDataSource({
         archive: lookupArchive('eth-mainnet'),
+        chain: 'https://rpc.ankr.com/eth',
     })
```

The next step is to prepare for retrieving and parsing the metadata proper. For this, we need to understand the protocols used in the URIs and the structure of the metadata JSONs. To learn that, we need to retrieve and inspect some URIs ahead of the main squid sync. The most straightforward way to achieve this is by adding the following to the batch handler:
```diff
+import { BigNumber } from 'ethers'
+
processor.run(new TypeormDatabase(), async (ctx) => {
     let tokens: Map<string, Token> = createTokens(rawTransfers, owners)
     let transfers: Transfer[] = createTransfers(rawTransfers, owners, tokens)

+    let lastBatchBlockHeader = ctx.blocks[ctx.blocks.length-1].header
+    let contract = new bayc.Contract(ctx, lastBatchBlockHeader, CONTRACT_ADDRESS)
+    for (let t of tokens.values()) {
+        const uri = await contract.tokenURI(BigNumber.from(t.tokenId))
+        ctx.log.info(`Token ${t.id} has metadata at "${uri}"`)
+    }
+
     await ctx.store.upsert([...owners.values()])
     await ctx.store.upsert([...tokens.values()])
     await ctx.store.insert(transfers)
})
```
Here, we utilize an instance of the `Contract` class provided by the `src/abi/bayc.ts` module. It uses an RPC endpoint supplied by the processor via `ctx` to call methods of contract `CONTRACT_ADDRESS` at the height corresponding to the last block of each batch. Once we have the `Contract` instance, we call `tokenURI()` for each token mentioned in the batch and print the retrieved URI.

This simple approach is rather slow: the modified squid needs about three to eight hours to get a reasonably sized sample of URIs. A faster yet more complex [alternative](../step-four-optimizations/#extra-using-multicall-for-metadata-exploration) will be discussed in the next part of the tutorial.

Running the modified squid reveals that some metadata URIs point to HTTPS and some point to IPFS. Here is [one](<https://us-central1-bayc-metadata.cloudfunctions.net/api/tokens/ 0>) of the metadata JSONs:
```json
{
    "image": "https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ",
    "attributes": [
        {
            "trait_type": "Fur",
            "value": "Robot"
        },
        {
            "trait_type": "Eyes",
            "value": "X Eyes"
        },
        {
            "trait_type": "Background",
            "value": "Orange"
        },
        {
            "trait_type": "Earring",
            "value": "Silver Hoop"
        },
        {
            "trait_type": "Mouth",
            "value": "Discomfort"
        },
        {
            "trait_type": "Clothes",
            "value": "Striped Tee"
        }
    ]
}
```
Note how it does not conform to the [ERC721 Metadata JSON Schema](https://eips.ethereum.org/EIPS/eip-721).

Summary of our findings:
- BAYC metadata URIs can point to HTTPS or IPFS -- we need to be able to retrieve both;
- Metadata JSONs have two fields: `"image"`, a string, and `"attributes"`, an array of pairs `{"trait_type": string, "value": string}`.

Once finished, roll back the exploratory code:
```diff
processor.run(new TypeormDatabase(), async (ctx) => {
     let tokens: Map<string, Token> = createTokens(rawTransfers, owners)
     let transfers: Transfer[] = createTransfers(rawTransfers, owners, tokens)

-    let lastBatchBlockHeader = ctx.blocks[ctx.blocks.length-1].header
-    let contract = new bayc.Contract(ctx, lastBatchBlockHeader, CONTRACT_ADDRESS)
-    for (let t of tokens.values()) {
-        const uri = await contract.tokenURI(BigNumber.from(t.tokenId))
-        ctx.log.info(`Token ${t.id} has metadata at "${uri}"`)
-    }
```

## Extending the `Token` entity

We will save both `image` and `attributes` metadata fields and the metadata URI to the database. To do this, we need to add some new fields to the existing `Token` entity:

```diff
 type Token @entity {
     id: ID! # string form of tokenId
     tokenId: Int!
     owner: Owner!
+    uri: String!
+    image: String
+    attributes: [Attribute!]
     transfers: [Transfer!]! @derivedFrom(field: "token")
 }
+
+type Attribute {
+    traitType: String!
+    value: String!
+}
```
Here, `Attribute` is a [non-entity type](/basics/schema-file/unions-and-typed-json/#typed-json) that we use to type the `attributes` field.

Once `schema.graphql` is updated, we regenerate the TypeORM data model code::

```bash
sqd codegen
```

To populate the new fields, let us add an extra step at the end of `createTokens()`:
```typescript
async function createTokens(
    ctx: Context,
    rawTransfers: RawTransfer[],
    owners: Map<string, Owner>
): Promise<Map<string, Token>> {

    let tokens: Map<string, PartialToken> = new Map()
    for (let t of rawTransfers) {
        let tokenIdString = `${t.tokenId}`
        let ptoken: PartialToken = {
            id: tokenIdString,
            tokenId: t.tokenId,
            owner: owners.get(t.to)!
        }
        tokens.set(tokenIdString, ptoken)
    }
    return await completeTokens(ctx, tokens)
}

interface PartialToken {
    id: string
    tokenId: number
    owner: Owner
}
```

Here, `PartialToken` stores the incomplete `Token` information obtained purely from blockchain events and function calls, before any [state queries](/evm-indexing/query-state/) or enrichment with [external data](/basics/external-api/). 
The function `completeTokens()` is responsible for filling `Token` fields that are missing in `PartialToken`s. This involves IO operations, so both the function and its caller `createTokens()` have to be asynchronous. The functions also require a batch context for state queries and logging. We modify the `createTokens()` call in the batch handler to accommodate these changes:
```diff
 processor.run(new TypeormDatabase(), async (ctx) => {
     let rawTransfers: RawTransfer[] = getRawTransfers(ctx)
 
     let owners: Map<string, Owner> = createOwners(rawTransfers)
-    let tokens: Map<string, Token> = createTokens(rawTransfers, owners)
+    let tokens: Map<string, Token> = await createTokens(ctx, rawTransfers, owners)
     let transfers: Transfer[] = createTransfers(rawTransfers, owners, tokens)
```
Next, we implement `completeTokens()`:
```typescript
async function completeTokens(
    ctx: Context,
    partialTokens: Map<string, PartialToken>
): Promise<Map<string, Token>> {

    let tokens: Map<string, Token> = new Map()
    if (partialTokens.size === 0) return tokens

    let lastBatchBlockHeader = ctx.blocks[ctx.blocks.length-1].header
    let contract = new bayc.Contract(ctx, lastBatchBlockHeader, CONTRACT_ADDRESS)

    for (let [id, ptoken] of partialTokens) {
        let uri = await contract.tokenURI(BigNumber.from(ptoken.tokenId))
        ctx.log.info(`Retrieved metadata URI ${uri}`)
        let metadata: TokenMetadata | undefined = await fetchTokenMetadata(ctx, uri)
        tokens.set(id, new Token({
            ...ptoken,
            uri,
            ...metadata
        }))
    }

    return tokens
}
```
URI retrieval here is similar to what we did in the exploration step: we create a `Contract` object and use it to call the `tokenURI()` method of the BAYC token contract. The retrieved URIs are then used by the `fetchTokenMetadata()` function, which is responsible for HTTPS/IPFS metadata retrieval and parsing. Once we have its output, we can create and return the final `Token` entity instances.

## Retrieving external resources

In the `fetchTokenMetadata()` implementation we first classify the URIs depending on the protocol. For IPFS links we replace `'ipfs://'` with an address of an IPFS gateway, then retrieve the metadata from all links using a regular HTTPS client. Here for the demonstration purposes we use the public [ipfs.io](https://ipfs.io) gateway, which is slow and prone to dropping requests due to rate-limiting. For production squids we recommend using a dedicated gateway, e.g. from [Filebase](https://docs.filebase.com/ipfs/about-ipfs/ipfs-gateways).

```typescript
export async function fetchTokenMetadata(
  ctx: Context,
  uri: string
): Promise<TokenMetadata | undefined> {

    try {
        if (uri.startsWith('ipfs://')) {
            const gatewayURL = path.posix.join(IPFS_GATEWAY, ipfsRegExp.exec(uri)![1])
            let res = await client.get(gatewayURL)
            ctx.log.info(`Successfully fetched metadata from ${gatewayURL}`)
            return res.data
        } else if (uri.startsWith('http://') || uri.startsWith('https://')) {
            let res = await client.get(uri)
            ctx.log.info(`Successfully fetched metadata from ${uri}`)
            return res.data
        } else {
            ctx.log.warn(`Unexpected metadata URL protocol: ${uri}`)
            return undefined
        }
    } catch (e) {
        throw new Error(`Failed to fetch metadata at ${uri}. Error: ${e}`)
    }
}

const ipfsRegExp = /^ipfs:\/\/(.+)$/
```
We use [Axios](https://axios-http.com) for HTTPS retrieval. Install it with
```bash
npm i axios
```
To avoid reinitializing the HTTPS client every time we call the function we bind it to a module-scope constant:
```typescript
const client = axios.create({
    headers: {'Content-Type': 'application/json'},
    httpsAgent: new https.Agent({keepAlive: true}),
    transformResponse(res: string): TokenMetadata {
        let data: {image: string; attributes: {trait_type: string; value: string}[]} = JSON.parse(res)
        return {
            image: data.image,
            attributes: data.attributes.map((a) => new Attribute({traitType: a.trait_type, value: a.value})),
        }
    },
})
```
We move all the code related to metadata retrieval to a separate module `src/metadata.ts`. Examine its full contents [here](https://github.com/abernatskiy/tmp-bayc-squid-2/blob/d98676253419e845e2e6c131a8ec9f7bcabe775f/src/metadata.ts).

Then all that is left is to import the relevant parts in `src/processor.ts`:
```diff title=src/processor.ts
+import { TokenMetadata, fetchTokenMetadata } from './metadata'
```
and we are done with the processor code for this part of the tutorial. Full squid code at this point is available at [this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/d98676253419e845e2e6c131a8ec9f7bcabe775f).

Recreate the database and refresh the migrations with
```bash
sqd down
sqd up
sqd migration:generate
```
and test the processor by running
```bash
sqd process
```
It runs much slower than before, requiring about three hours to get through the first batch and more than a day to sync. This is something we will address in the next part of the tutorial.

Nevertheless, the squid is already fully capable of scraping token metadata and serving it over GraphQL. Verify that by running `sqd serve` and visiting the [local GraphiQL playground](http://localhost:4350/graphql). It is now possible to retrieve image URLs and attributes for each token:

![BAYC GraphiQL at step three](</img/bayc-playground-step-three.png>)
