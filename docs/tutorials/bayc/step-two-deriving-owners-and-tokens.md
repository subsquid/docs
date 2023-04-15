---
title: "Step 2: Owners & tokens"
description: >-
  Deriving entities for NFTs and their owners
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
  let newOwner: Owner = new Owner({
      id: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  })
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
The new class should hold
- raw blockchain data;
- entities;
- callback functions that create new entities given the raw data and the previously generated entities;
- order of entity generation.

Adding this and a few convenience methods, we arrive at
```typescript
import assert from 'assert'

interface Entity {
    id: string
    constructor: {
        name: string
    }
}

export class EntityGenerator {
    /*
     * Maps freeform string keys to arrays of raw blockchain data
     */
    static rawData: Record<string, any[]> = {}
    /*
     * Maps entity names to maps from entity instance ids to entity instances
     */
    static entities: Record<string, Map<string, any>> = {}
    /*
     * Array of entity names in the order in which they have to be processed
     */
    private static entityGenerationOrder: string[] = []
    /*
     * Maps entity names to entity generating functions
     * TODO: type the functions
     */
    private static entityGenerators: Record<string, any> = {}

    private constructor() {}

    static setGenerationOrder(order: string[]): void {
        this.entityGenerationOrder = order
    }

    static addGenerator(entityName: string, generator: any): void {
        assert(this.entityGenerators[entityName] == null)
        this.entityGenerators[entityName] = generator
    }

    static addRawData(key: string, data: any): void {
        let rawDataArray = this.rawData[key]
        if (rawDataArray == null) {
            rawDataArray = this.rawData[key] = []
        }
        rawDataArray.push(data)
    }

    static addEntityInstance<E extends Entity>(e: E) {
        let entityMap = this.entities[e.constructor.name]
        if (entityMap == null) {
            entityMap = this.entities[e.constructor.name] = new Map()
        }
        entityMap.set(e.id, e)
    }

    static async generateAllEntities(store: any): Promise<void> {
        for (let entityName of this.entityGenerationOrder) {
            await this.entityGenerators[entityName](store)
        }
    }

    static clearBatchState(): void {
        this.rawData = {}
        this.entities = {}
    }
}
```

## Tweaking data collection and deriving the new entities

Adapting raw data collection for this new architecture is straighforward:
```diff title=src/mapping/contract.ts
-import {EntityBuffer} from '../entityBuffer'
-import {Transfer} from '../model'
+import {EntityGenerator} from '../entityGenerator'
+import {Owner, Token, Transfer} from '../model'
```
```diff title=src/mapping/contract.ts
function parseEvent(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: EventItem) {
    try {
         switch (item.evmLog.topics[0]) {
             case spec.events['Transfer'].topic: {
                 let e = normalize(spec.events['Transfer'].decode(item.evmLog))
-                EntityBuffer.add(
-                    new Transfer({
-                        id: item.evmLog.id,
-                        blockNumber: block.height,
-                        blockTimestamp: new Date(block.timestamp),
-                        transactionHash: item.transaction.hash,
-                        from: e[0],
-                        to: e[1],
-                        tokenId: e[2],
-                    })
-                )
+                EntityGenerator.addRawData('transferEvents', {
+                    id: item.evmLog.id,
+                    blockNumber: block.height,
+                    blockTimestamp: new Date(block.timestamp),
+                    transactionHash: item.transaction.hash,
+                    from: e[0],
+                    to: e[1],
+                    tokenId: e[2],
+                })
                 break
             }
         }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode event "${item.evmLog.topics[0]}"`)
    }
}
```
When done, all that's left is to add the callbacks that generate and persist the entities:
```typescript
export function addAllEntityGenerators() {
    EntityGenerator.addGenerator('Owner', generatorOfOwners)
    EntityGenerator.addGenerator('Token', generatorOfTokens)
    EntityGenerator.addGenerator('Transfers', generatorOfTransfers)
    EntityGenerator.addGenerationOrder(['Owner', 'Token', 'Transfers'])
}


async function generatorOfOwners(store: any) {
    let rawTransfers = EntityGenerator.rawData['transferEvents']
    let ownerIds = rawTransfers.map(re => re.from).concat(
        rawTransfers.map(re => re.to)
    )
    let ownerIdsSet = new Set(ownerIds)

    ownerIdsSet.forEach(id => {
        EntityGenerator.addEntityInstance(new Owner({id}))
    })

    await store.save([...EntityGenerator.entities['Owner'].values()])
}

async function generatorOfTokens(store: any) {
    let rawTransfers = EntityGenerator.rawData['transferEvents']
    rawTransfers.forEach(t => {
        EntityGenerator.addEntityInstance(new Token({
            id: `${t.tokenId}`,
            tokenId: t.tokenId,
            owner: EntityGenerator.entities['Owner'].get(t.to)
        }))
    })

    await store.save([...EntityGenerator.entities['Token'].values()])
}

async function generatorOfTransfers(store: any) {
    let rawTransfers = EntityGenerator.rawData['transferEvents']
    rawTransfers.forEach(t => {
        EntityGenerator.addEntityInstance(new Transfer({
            id: t.id,
            blockNumber: t.blockNumber,
            blockTimestamp: t.blockTimestamp,
            transactionHash: t.transactionHash,
            from: EntityGenerator.entities['Owner'].get(t.from),
            to: EntityGenerator.entities['Owner'].get(t.to),
            token: EntityGenerator.entities['Token'].get(t.tokenId)
        }))
    })

    await store.insert([...EntityGenerator.entities['Transfer'].values()])
}
```
