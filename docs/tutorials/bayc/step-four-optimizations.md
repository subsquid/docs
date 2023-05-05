---
title: "Step 4: Optimization"
description: >-
  Syncing faster while tracking changing data
sidebar_position: 40
---

# Step 4: Optimization

This is the fourth part of the tutorial where we build a squid that indexes [Bored Ape Yacht Club](https://boredapeyachtclub.com) NFTs, their transfers, and owners from the [Ethereum blockchain](https://ethereum.org), fetches the metadata from [IPFS](https://ipfs.tech/) and regular HTTP URLs, stores it in a database, and serves it over a GraphQL API. In the first three parts ([1](/tutorials/bayc/step-one-indexing-transfers), [2](/tutorials/bayc/step-two-deriving-owners-and-tokens), [3](/tutorials/bayc/step-three-adding-external-data)), we created a squid that does all the above but performs many IO operations sequentially, resulting in a long sync time. In this part, we discuss strategies for mitigating that shortcoming. We also discuss an alternative metadata fetching strategy that reduces redundant fetches and handles the changes in metadata of "cold" (i.e., not involved in any transfers) tokens more effectively.

Pre-requisites: Node.js, [Subsquid CLI](/squid-cli/installation), Docker, a project folder with the code from the third part ([this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/20206c337d443e3cb96133f527cc9fac2a8f1d2a)).

## Using Multicall for aggregating state queries

We begin by introducing [batch processing](/basics/batch-processing/) wherever possible, and our first step is to replace individual contract state queries with [batch calls](/evm-indexing/query-state/#batch-state-queries) to a [MakerDAO multicall contract](https://github.com/mds1/multicall). Retrieve the multicall contract ABI by re-running `squid-evm-typegen` with `--multicall` option:
```bash
npx squid-evm-typegen --multicall src/abi 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d#bayc
```
This adds a Typescript ABI interface at `src/abi/multicall.ts`. Let us use it in a rewrite of `completeTokens()`:
```typescript title=src/processor.ts
import { Multicall } from './abi/multicall'

const MULTICALL_ADDRESS = '0x5ba1e12693dc8f9c48aad8770482f4739beed696'
const MULTICALL_BATCH_SIZE = 100

// ...

async function completeTokens(
    ctx: Context,
    partialTokensMap: Map<string, PartialToken>
): Promise<Map<string, Token>> {

    let partialTokens: PartialToken[] = [...partialTokensMap.values()]

    let tokens: Map<string, Token> = new Map()
    if (partialTokens.length === 0) return tokens

    let lastBatchBlockHeader = ctx.blocks[ctx.blocks.length-1].header
    let contract = new Multicall(ctx, lastBatchBlockHeader, MULTICALL_ADDRESS)

    let tokenURIs = await contract.aggregate(
        bayc.functions.tokenURI,
        CONTRACT_ADDRESS,
        partialTokens.map(t => [BigNumber.from(t.tokenId)]),
        MULTICALL_BATCH_SIZE // paginating to avoid RPC timeouts
    )

    for (let [i, ptoken] of partialTokens.entries()) {
        let uri = tokenURIs[i]
        let metadata: TokenMetadata | undefined = await fetchTokenMetadata(ctx, uri)
        tokens.set(ptoken.id, new Token({
            ...ptoken,
            uri,
            ...metadata
        }))
    }

    return tokens
}

// ...
```
Here we replaced the direct calls to `tokenURI()` of the BAYC token contract with aggreaged batches of 100 state calls and called `aggregate()` of the multicall contract for each batch. `Multicall.aggregate()` takes care of splitting the set of state calls into chunks and merging the results together. The number 100 for the batch size was chosen to be as large as possible while not triggering any response size limits on the public RPC endpoint we use. For private RPC endpoints one would try to further increase the batch size.

You can find the full code after this optimization at [this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/d9f3b775ffb03aa1636bac674370a552a083c416). In our test this optimization reduced the time required for retrieving the contract state for all 10000 tokens once from 114 minutes to 94 seconds.

## Retrieving metadata from HTTPS concurrently

Next, we make our metadata retrieval requests concurrent.

Many metadata URIs point to the same HTTPS server or to IPFS that we are accessing through a single gateway. When retrieving data from just a few servers, it is a common courtesy to not send all the requests at once; often, this is enforced by rate limits. Our code takes that into account, limiting the rate of the outgoing requests.

We implement HTTPS batching at [`src/metadata.ts`](https://github.com/abernatskiy/tmp-bayc-squid-2/blob/b7023af18256360fe2c3d0f1c9f5ca682cdb4006/src/metadata.ts):
```typescript
import { asyncSleep, splitIntoBatches } from './util'

const MAX_REQ_SEC = 10

export async function fetchTokenMetadatasConcurrently(
    ctx: Context,
    uris: string[]
): Promise<(TokenMetadata | undefined)[]> {

    let metadatas: (TokenMetadata | undefined)[] = []
    for (let batch of splitIntoBatches(uris, MAX_REQ_SEC)) {
        let m = await Promise.all(batch.map((uri, index) => {
            // spread out the requests evenly within a second interval
            let sleepMs = Math.ceil(1000*(index+1)/MAX_REQ_SEC)
            return asyncSleep(sleepMs).then(() => fetchTokenMetadata(ctx, uri))
        }))
        metadatas.push(...m)
    }
    return metadatas
}
```
then we call the function from [`completeTokens()`](https://github.com/abernatskiy/tmp-bayc-squid-2/blob/b7023af18256360fe2c3d0f1c9f5ca682cdb4006/src/processor.ts#L117) and use its output to populate metadata fields of `Token` entity instances. Utility functions `asyncSleep()` and `splitIntoBathches()` are implemented [here](https://github.com/abernatskiy/tmp-bayc-squid-2/blob/b7023af18256360fe2c3d0f1c9f5ca682cdb4006/src/util.ts). Full code is available at [this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/b7023af18256360fe2c3d0f1c9f5ca682cdb4006).

On the first processor batch, when we retrieve metadata from `us-central1-bayc-metadata.cloudfunctions.net` for all 10000 tokens, this optimization reduced the required time from 45 to 21 minutes.

## Retrieving immutable metadata once

Another glaring inefficiency in our current code is the fact that we often retrieve metadata from each URI more than once. This is understandable when we work with HTTPS links that point to mutable data; however, the data IPFS links point to is immutable, so there is no need to retrieve it more than once.

To avoid these repeated retrievals we find the already known tokens in the database. If a token metadata URI is an immutable IPFS link (that is, does not [point to MFS](https://gateway.ipfs.io/ipfs/QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D/example#/ipfs/QmThrNbvLj7afQZhxH72m5Nn1qiVn3eMKWFYV49Zp2mv9B/ipns/readme.md)) and metadata is already available, we skip the retrieval. The implementation is at [`src/metadata.ts`](https://github.com/abernatskiy/tmp-bayc-squid-2/blob/dc8531dc99cee998bcf025a45fa0e792b031e0bd/src/metadata.ts):
```typescript
export async function selectivelyUpdateMetadata(
    ctx: Context,
    tokens: Map<string, Token>
): Promise<Map<string, Token>> {

    let knownTokens: Map<string, Token> = await ctx.store.findBy(
            Token,
            {id: In([...tokens.keys()])}
        )
        .then(ts => new Map(ts.map(t => [t.id, t])))

    let updatedTokens: Map<string, Token> = new Map()
    let tokensToBeUpdated: Token[] = []
    for (let [id, t] of tokens) {
        let ktoken: Token | undefined = knownTokens.get(id)
        if (ktoken != null &&
            ktoken.image != null && ktoken.attributes != null &&
            ktoken.uri === t.uri && uriPointsToImmutable(t.uri)) {

            ctx.log.info(`Repeated retrieval from ${t.uri} skipped`)
            updatedTokens.set(id, ktoken)
        }
        else {
            ctx.log.info(`Re-retrieving from ${t.uri}`)
            tokensToBeUpdated.push(t)
        }
    }

    let metadatas: (TokenMetadata | undefined)[] = await fetchTokenMetadatasConcurrently(
        ctx,
        tokensToBeUpdated.map(t => t.uri)
    )

    for (let [i, t] of tokensToBeUpdated.entries()) {
        let m = metadatas[i]
        if (m != null) {
            t.image = m.image
            t.attributes = m.attributes
        }
        updatedTokens.set(t.id, t)
    }

    return updatedTokens
}
```
`uriPointsToImmutable()` used to classify metadata URIs rejects any non-IPFS links and IPFS links that may point to MFS:
```typescript
export function uriPointsToImmutable(uri: string): boolean {
    return uri.startsWith('ipfs://') && !uri.includes('ipns')
}
```
Full code is available at [this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/dc8531dc99cee998bcf025a45fa0e792b031e0bd). In our test this optimization reduced the total sync time from about 4.1 to 1.5 hours.

## Alternative: Post-sync retrieval of metadata

Despite all the optimizations, our squid still takes 1.5 hours to sync instead of 11 minutes it needed [before we introduced metadata retrieval](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/6f41cba76b9d90d12638a17d64093dbeb19d00ec). This is the cost of maintaining a fully populated database at all stages of the sync, which is rarely a requirement. An alternative is to begin retrieving metadata only after the rest of the data has been fully synced, and the squid has caught up with the blockchain. We do that by reading `Token` entities from the database after the initial sync, retrieving their metadata and persisting them.

This approach has another advantage: metadata URIs can change without notice, and our old retrieval strategy would only pick up the changes when the token has been transferred. If our goal is to keep token metadata as up-to-date as possible, we have to constantly renew it even for tokens that are not involved in any recent transfers. This is easy to implement with our new metadata retrieval strategy: simply add a field to the `Token` entity that tracks the block height of the most recent metadata update and select `Token`s that were updated some fixed number of blocks ago for metadata updates.

Here is how the new metadata retrieval strategy reflects in the batch handler code:
```diff
processor.run(new TypeormDatabase(), async (ctx) => {
     let rawTransfers: RawTransfer[] = getRawTransfers(ctx)
 
     let owners: Map<string, Owner> = createOwners(rawTransfers)
     let tokens: Map<string, Token> = await createTokens(ctx, rawTransfers, owners)
     let transfers: Transfer[] = createTransfers(rawTransfers, owners, tokens)
 
     await ctx.store.upsert([...owners.values()])
     await ctx.store.upsert([...tokens.values()])
     await ctx.store.insert(transfers)
+
+    if (ctx.isHead) {
+        let updatedTokens = await updateTokensWithOutdatedMetadata(ctx)
+        await ctx.store.upsert(updatedTokens)
+        ctx.log.info(`Updated metadata for ${updatedTokens.length} tokens`)
+    }
 })
```
Full implementation requires changes to the schema, replacement of `completeTokens()` with `updateTokensWithOutdatedMetadata()` and rewrites of `createTokens()` and `selectivelyUpdateMetadata()`. It is available in [this branch](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/lazy-metadata). The resulting squid took 10 minutes for the initial sync, then 50 minutes more to retrieve metadata at least once for every token.

## Extra: Using Multicall for metadata exploration

In part 3 of this tutorial we [explored metadata URIs](/tutorials/bayc/step-three-adding-external-data/#exploring-token-metadata) by running `tokenURI()` directly on the BAYC token contract. This process took several hours. Replacing the exploration code with its [multicall]-based equivalent, we can reduce that time to about 17 minutes. Starting with the code [as it was at the end of part two](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/6f41cba76b9d90d12638a17d64093dbeb19d00ec), get `src/abi/multicall.ts` by running
```bash
npx squid-evm-typegen --multicall src/abi 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d#bayc
```
then supply a RPC endpoint to the processor and add the code for batch URI retrieval to the batch handler:
```diff title=src/processor.ts
 let processor = new EvmBatchProcessor()
     .setDataSource({
         archive: lookupArchive('eth-mainnet'),
+        chain: 'https://rpc.ankr.com/eth',
     })

# ...

+import { BigNumber } from 'ethers'
+import { Multicall } from './abi/multicall'

+const MULTICALL_ADDRESS = '0x5ba1e12693dc8f9c48aad8770482f4739beed696'
+const MUTLTICALL_BATCH_SIZE = 100
 
 processor.run(new TypeormDatabase(), async (ctx) => {
     let tokens: Map<string, Token> = createTokens(rawTransfers, owners)
     let transfers: Transfer[] = createTransfers(rawTransfers, owners, tokens)
 
+    let lastBatchBlockHeader = ctx.blocks[ctx.blocks.length-1].header
+    let contract = new Multicall(ctx, lastBatchBlockHeader, MULTICALL_ADDRESS)
+    let tokenURIs = await contract.aggregate(
+        bayc.functions.tokenURI,
+        CONTRACT_ADDRESS,
+        [...tokens.values()].map(t => [BigNumber.from(t.tokenId)]),
+        MUTLTICALL_BATCH_SIZE
+    )
+    for (let uri of tokenURIs) {
+        ctx.log.info(`Retrieved a metadata URI: ${uri}`)
+    }
+
     await ctx.store.upsert([...owners.values()])
     await ctx.store.upsert([...tokens.values()])
     await ctx.store.insert(transfers)
})
```
