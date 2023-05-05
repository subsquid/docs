---
title: "Step 2: Owners & tokens"
description: >-
  Deriving entities for NFTs and their owners
sidebar_position: 20
---

# Step 2: Deriving owners and tokens

This is the second part of the tutorial in which we build a squid that indexes [Bored Ape Yacht Club](https://boredapeyachtclub.com) NFTs, their transfers, and owners from the [Ethereum blockchain](https://ethereum.org), fetches the metadata from [IPFS](https://ipfs.tech/) and regular HTTP URLs, stores it in a database, and serves it over a GraphQL API. In the [first part](/tutorials/bayc/step-one-indexing-transfers), we created a simple squid that scraped Transfer events emitted by the [BAYC token contract](https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d). Here, we go a step further and derive separate entities for the NFTs and their owners from the transfers. The new entities will reference the corresponding `Transfer` entities. It will be automatically translated into primary key-foreign key references in the new database schema, and enable efficient cross-entity GraphQL queries. 

Prerequisites: Node.js, [Subsquid CLI](/squid-cli/installation), Docker, a project folder with the code from the first part ([this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/d99cd9b3f6921c7f591e5817d54025a388925a08)).

## Writing `schema.graphql`

Start the process by adding new [entities](/basics/schema-file/entities/) to the `schema.graphql` file::
```graphql
# any unique string can be used as id
type Owner @entity {
    id: ID! # owner address
}

type Token @entity {
    id: ID! # string form of tokenId
    tokenId: Int!
}
```
Next, add [entity relations](/basics/schema-file/entity-relations/). Let us begin with adding a simple relation linking tokens to their owners:
```diff
 type Token @entity {
     id: ID! # string form of tokenId
     tokenId: Int!
+    owner: Owner!
 }
```
Now, the Tokenis considered an _owning entity_ in relation toOwner. As a result,

- On the database side: the `token` table that maps to the `Token` entity gains a foreign key column `owner_id` holding primary keys of the `owner` table. The column is automatically indexed - no need to add `@index`.
- On the Typeorm side: the `Token` entity gains an `owner` field decorated with [`@ManyToOne`](https://github.com/typeorm/typeorm/blob/master/docs/many-to-one-one-to-many-relations.md). To create a well-formed `Token` entity instance in processor code, we now will have to first get a hold of an appropriate `Owner` entity instance and populate the `owner` field of a new `Token` with a reference to it:
  ```typescript
  let newOwner: Owner = new Owner({
      id: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  })
  let newToken: Token = new Token({
      id: '1',
      tokenId: 1,
      owner: newOwner // the whole entity instance
  })
  ```
- On the GraphQL side: queries to `token` can now select `owner` and any of its subfields (`id` is the only one available now).

Introduce more entity relations by replacing the `from,` `to`, and `tokenId` fields of the `Transfer` entity with fields from the new entity types:
```diff
 type Transfer @entity {
     id: ID!
-    tokenId: Int! @index
-    from: String! @index
-    to: String! @index
+    token: Token!
+    from: Owner!
+    to: Owner!
     timestamp: DateTime!
     blockNumber: Int!
     txHash: String! @index
 }
```

Lastly, include the virtual (i.e., not mapped to a column in the database schema) [reverse lookup fields](/basics/schema-file/entity-relations/):

```diff
 type Owner @entity {
     id: ID! # owner address
+    ownedTokens: [Token!]! @derivedFrom(field: "owner")
 }

 type Token @entity {
     id: ID! # string form of tokenId
     tokenId: Int!
+    transfers: [Transfer!]! @derivedFrom(field: "token")
 }
```

This addition doesn't create any new database columns, but it makes the ownedTokensandtransfers fields accessible through GraphQL and Typeorm.

You can find the final version of schema.graphql [here](https://github.com/abernatskiy/tmp-bayc-squid-2/blob/f5928da72ef3a70ef9c0d3d9a215536e2eec0ebc/schema.graphql). Once you're finished, regenerate the Typeorm entity code with the following command:

```bash
sqd codegen
```

We also need to regenerate the database migrations to match the new schema. However, we'll postpone this step for now, as it requires recompiling the squid code, which is not possible until we fix the creation of all entities.

## Creating the entities

Note how the entities we define form an acyclic dependency graph:
- `Owner` entity instances can be made straight from the raw events data;
- `Token`s require the raw data plus the `Owner`s;
- `Transfer` entities require all the above.

As a consequence, the creation of entity instances must proceed in a [particular order](https://en.wikipedia.org/wiki/Topological_sorting). Squids usually use small graphs like this one, and in these the order can be easily found manually (e.g. `Owner`s then `Token`s then `Transfer`s in this case). We will assume that it can be hardcoded by the programmer.

Further, at each step we will [process the data for the whole batch](/basics/batch-processing/) instead of handling the items individually. This is crucial for achieving a good syncing performance.

With all that in mind, let's create a batch processor that generates and persists all of our entities:

```typescript
processor.run(new TypeormDatabase(), async (ctx) => {
    let rawTransfers: RawTransfer[] = getRawTransfers(ctx)

    let owners: Map<string, Owner> = createOwners(rawTransfers)
    let tokens: Map<string, Token> = createTokens(rawTransfers, owners)
    let transfers: Transfer[] = createTransfers(rawTransfers, owners, tokens)

    await ctx.store.upsert([...owners.values()])
    await ctx.store.upsert([...tokens.values()])
    await ctx.store.insert(transfers)
})
```
where
```typescript
interface RawTransfer {
    id: string
    tokenId: number
    from: string
    to: string
    timestamp: Date
    blockNumber: number
    txHash: string
}
```
is an interface very similar to that of the `Transfer` entity as it was at the beginning of this part of the tutorial. This allows us to reuse most of the code of the old batch handler in `getRawTransfers()`:
```typescript
function getRawTransfers(ctx: Context): RawTransfer[] {
    let transfers: RawTransfer[] = []

    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.kind !== 'evmLog') continue
            let {from, to, tokenId} = bayc.events.Transfer.decode(item.evmLog)
            transfers.push({
                id: item.evmLog.id,
                tokenId: tokenId.toNumber(),
                from,
                to,
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                txHash: item.transaction.hash,
            })
        }
    }

    return transfers
}
```
In this case, we used the Contexttype for the `ctx` variable. Let's define it:

```bash
import { TypeormDatabase, Store } from '@subsquid/typeorm-store'
import { EvmBatchProcessor, BatchProcessorItem, BatchHandlerContext } from '@subsquid/evm-processor'

type Item = BatchProcessorItem<typeof processor>
type Context = BatchHandlerContext<Store, Item>
```

The next step involves creating Ownerentity instances. We will need these instances to create both `Tokens` and `Transfers`. In both scenarios, we'll have the IDs of the owners (i.e., their addresses) prepared. To simplify future lookups, we choose to return the `Owner` instances as a `Map<string, Owner>`:

```typescript
function createOwners(rawTransfers: RawTransfer[]): Map<string, Owner> {
    let owners: Map<string, Owner> = new Map()
    for (let t of rawTransfers) {
        owners.set(t.from, new Owner({id: t.from}))
        owners.set(t.to, new Owner({id: t.to}))
    }
    return owners
}
```
Similarly, `Token` instances will also need to be looked up later, so we return them as a `Map<string, Token>`. To identify the most recent owner of each token, we traverse all the transfers in the order they appear on the blockchain and assign the owner of any involved tokens to their recipient:

```typescript
function createTokens(
    rawTransfers: RawTransfer[],
    owners: Map<string, Owner>
): Map<string, Token> {

    let tokens: Map<string, Token> = new Map()
    for (let t of rawTransfers) {
        let tokenIdString = `${t.tokenId}`
        tokens.set(tokenIdString, new Token({
            id: tokenIdString,
            tokenId: t.tokenId,
            owner: owners.get(t.to)
        }))
    }
    return tokens
}
```
Some `Token` and `Owner` instances might have been created in previous batches, so we use `ctx.store.upsert()` to store these instances while updating any existing ones.

:::info
In some circumstances we might have had to retrieve the old entity instances from the database before updating, but here we have all the required fields populated, so we simply overwrite the whole entity with `ctx.store.upsert()`. 
:::

Finally, we create an array of `Transfer` entity instances through a simple mapping:
```typescript
function createTransfers(
    rawTransfers: RawTransfer[],
    owners: Map<string, Owner>,
    tokens: Map<string, Token>
): Transfer[] {

    return rawTransfers.map(t => new Transfer({
        id: t.id,
        token: tokens.get(`${t.tokenId}`),
        from: owners.get(t.from),
        to: owners.get(t.to),
        timestamp: t.timestamp,
        blockNumber: t.blockNumber,
        txHash: t.txHash
    }))
}
```
Since `Transfer`s are unique, we can safely use `ctx.store.insert()` to persist them.

At this point, the squid has accomplished everything planned for this part of the tutorial. The only remaining task is to drop and recreate the database (if it's running) and regenerate the migrations:

```bash
sqd down
sqd up
sqd migration:generate
```
Full code can be found at [this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/6f41cba76b9d90d12638a17d64093dbeb19d00ec).

To test it, start the processor and the GraphQL server by running `sqd process` and `sqd serve` in separate terminals. Then, visit the [GraphiQL playground](http://localhost:4350/graphql):

![BAYC GraphiQL at step two](</img/bayc-playground-step-two.png>)

The new entities should be displayed in the query schema.

Thanks to the added entity relations, we can now execute more complex nested queries. For example, the one displayed in the screenshot selects a transfer, retrieves its token, looks up its owner, and finds out which tokens are currently owned by them.