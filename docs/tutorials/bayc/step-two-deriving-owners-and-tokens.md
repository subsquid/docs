---
title: Step 2: Deriving owners and tokens
description: >-
  Creating entities for NFTs and tokens from Transfers data
sidebar_position: 20
---

# Step 1: Deriving owners and tokens

This is the second part of the tutorial in which we will build a squid that gets data about [Bored Ape Yacht Club](https://boredapeyachtclub.com) NFTs, their transfers and owners from the [Ethereum blockchain](https://ethereum.org) and [IPFS](https://ipfs.tech/), stores it in a database and serves it over a GraphQL API. In the [first part](/tutorials/bayc/step-one-indexing-transfers) we created a simple squid that scrapped the `Transfer` events emitted by [BAYC token contract](https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d) from Ethereum blockchain. Here we go a step further and derive separate entities for NFTs and their owners from the transfers data. The new entities will be connected to the `Transfer` entity in the database via foreign key columns, allowing efficient querying over GraphQL.

Pre-requisites: Node.js, [Subsquid CLI](/squid-cli/installation), Docker, a project folder with the code from the first part ([this commit](/dead)).

## Writing `schema.graphql`

Begin by adding the new [entities](/basics/schema-file/entities/) to `schema.graphql`:
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
Now `Token` is an _owning entity_ with respect to `Owner`. As a consequence,
- On the database side: the `token` table that maps to the `Token` entity gains a foreign key column `owner_id` holding primary keys of the `owner` table.
- On the Typeorm side: the `Token` entity gains an `owner` field decorated with [`@ManyToOne`](https://github.com/typeorm/typeorm/blob/master/docs/many-to-one-one-to-many-relations.md). To create a well-formed `Token` entity instance in processor code, we now will have to first get a hold of an appropriate `Owner` entity instance and populate the `owner` field of a new `Token` with a reference to it:
  ```typescript
  let newOwner: Owner = new Owner({id: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'})
  let newToken: Token = new Token({
      id: '1',
      tokenId: 1,
      owner: newOwner // the whole entity instance
  })
  ```
- On the GraphQL side: queries to `token` can now select `owner` and any of its subfields (`id` is the only one right now).

Add more entity relations by replacing the `from`, `to` and `tokenId` fields of the `Transfer` with fields of the new entity types:
```diff
 type Transfer @entity {
     id: ID!
     blockNumber: Int! @index
     blockTimestamp: DateTime! @index
     transactionHash: String! @index
-    from: String! @index
-    to: String! @index
-    tokenId: BigInt! @index
+    from: Owner!
+    to: Owner!
+    token: Token!
}
```

Finally, add the virtual [reverse lookup fields](/basics/schema-file/entity-relations/):
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
This adds no database columns, but makes `ownedTokens` and `transfers` fields available via GraphQL and Typeorm.

The final version of `schema.graphql` is available [here](/dead). Regenerate the Typeorm entity code once you're done:
```bash
sqd codegen
```

## An architecture for entity generation

Note how the entities we define form an acyclic dependency graph:
- `Owner` entity instances are generated straight from the raw `Transfer` events data;
- `Token`s require the raw data plus the `Owner`s;
- `Transfer` entities require all of the above.

As a consequence, entity generation must proceed in a [particular order](https://en.wikipedia.org/wiki/Topological_sorting). Squids usually use small graphs like this one, and in these the order can be easily found manually (e.g. `Owner`s then `Token`s then `Transfer`s in this case). Hence, we will not automate the search for the order, but will assume that it can be hardcoded by the programmer.

Some of the steps of entity generation may involve database lookups, IPFS retrieval or some other operations that take less time when done in batches. Hence, we will need some place to hold the raw data collected from the [whole batch of blocks](/basics/batch-processing/) and any previously generated entities that the new ones may depend on. For convenience, let's make an object that does that and also holds the functions that perform each entity generation step, as well as the correct order for calling them.

Let us repurpose the existing `EntityBuffer` singleton class to do that. Begin by renaming it:
```bash
sed -i -e 's/EntityBuffer/EntityGenerator/g' ./src/entityBuffer.ts ./src/mapping/contract.ts ./src/processor.ts
mv src/entityBuffer.ts src/entityGenerator.ts
sed -i -e 's/entityBuffer/entityGenerator/g' ./src/mapping/contract.ts ./src/processor.ts
```
