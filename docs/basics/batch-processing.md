---
sidebar_position: 41
title: Batch processing
description: Batch-based data transformation model 
---

# Batch processing

Batch data processing model employed by Squid SDK relies on the following principles:

- Minimize the number of database hits by grouping multiple single-row transactions into multi-row batch transactions.
- Transform the data in memory using vectorized operators
- Use the [MakerDAO `Multicall` contract](/evm-indexing/query-state) to batch EVM state queries
- Use [`XXX.getMany()`](/substrate-indexing/storage-state-calls) to batch Substrate state queries.

Let's see how the principles apply in action.

## Patterns

An idiomatic use of [`processor.run()`](/basics/squid-processor) is as follows:

```ts
processor.run(new TypeormDatabase(), async (ctx) => {
    // a decoded and normalized ctx.blocks data
    const dataBatch = []

    for (const block of ctx.blocks) {
      for (const item of c.items) {
        // transform and normalize the raw item data
        // based on the onchain data
        dataBatch.push(decodeAndTransformToMyData(item))
      }
    }

    // the set of my target entity IDs to be updated/created
    const myEntityIds = new Set()
    for (const d of dataBatch) {
        // the business logic mapping 
        // the on-chain data with the target
        // entity ID
        myEntityIds.add(extractEntityId(d))
    }

    // load the enities by the list of IDs and 
    // put into an ID map
    const myEntities: Map<string, MyEntity> = new Map(
       // batch-load using IN operator
      (await ctx.store.findBy(MyEntity, { id: In([...myEntityIds]) }))
        // put the result into the ID map
        .map((entity) => [entity.id, entity])
    );

    // calculate the updated state of the entities
    for (const d of dataBatch) {
        const myEntity = myEntities.get(extractEntityId(d))
        if (myEntity == null) {
            // create a new instance with d and
            // add to myEntities map
        } else {
            // update myEntity using d
        }
    }

    // batch-update all entities in the map
    await ctx.store.save([...myEntities.values()])
});
```

For a full implementation of the above pattern, see [EVM squid example](https://github.com/belopash/evm-logs-example/blob/master/src/processor.ts) or [Substrate squid example](https://github.com/subsquid/squid-substrate-examples/tree/master/1-events).

## Anti-patterns

