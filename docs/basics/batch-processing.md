---
sidebar_position: 43
title: Batch processing
description: Batch-based data transformation model 
---

# Batch processing

Batch data processing model employed by Squid SDK relies on the following principles:

- Minimize the number of database hits by grouping multiple single-row transactions into multi-row batch transactions.
- Transform the data in memory using vectorized operators.
- Use the [MakerDAO `Multicall` contract](/evm-indexing/query-state/#batch-state-queries) to batch EVM state queries.
- Use [`XXX.getMany()`](/substrate-indexing/storage-state-calls) to batch Substrate state queries.

In practice, batching is a more flexible (compared to handler parallelization) way to speed up the inherently sequential indexing of on-chain transactions and logs. 

To illustrate, assume the processor must infer the current state of an on-chain record. It is configured to listen to the two on-chain events, `Create` and `Update`, that are emitted once the record is created or updated. The [data batch](/basics/processor-context/#ctxblocks) received by the processor is then an array of event items, i.e.
```ts
[
    Create({id: 1, name: 'Alice'}), 
    Update({id: 1, name: 'Bob'}),
    Create({id: 2, name: 'Mikee'}), 
    Update({id: 1, name: 'Carol'}), 
    Update({id: 2, name: 'Mike'})
]
``` 
Following the principles above, a processor would update the intermediary entity states in memory, persisting only the final state:
```ts
[{id: 1, name: 'Carol'}, {id: 2, name: 'Mike'}]
```
in a single transaction. 

Let's see the batch processing principles in action.

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

Avoid loading or persisting single entities unless strictly necessary. For example, here is a possible antipattern for the [Gravatar example](https://github.com/subsquid/gravatar-squid):

```ts 
processor.run(new TypeormDatabase(), async (ctx) => {
    for (const c of ctx.blocks) {
      for (const e of c.items) {
        // e.kind may be 'evmLog' or 'transaction'
        if(e.kind !== "evmLog") {
          continue
        }
        const { id, owner, displayName, imageUrl } = extractData(e.evmLog)
        // ANTIPATTERN!!! 
        // Doing an upsert per event drastically decreases the indexing speed
        await ctx.store.save(Gravatar, new Gravatar({
            id: id.toHexString(),
            owner: decodeHex(owner),
            displayName,
            imageUrl
        }))
      }
    }
});
```

Instead, use an in-memory cache, and batch upserts:
```ts
processor.run(new TypeormDatabase(), async (ctx) => {
    const gravatars: Map<string, Gravatar> = new Map();
    for (const c of ctx.blocks) {
      for (const e of c.items) {
        // e.kind may be 'evmLog' or 'transaction'
        if(e.kind !== "evmLog") {
          continue
        }
        const { id, owner, displayName, imageUrl } = extractData(e.evmLog)
        gravatars.set(id.toHexString(), new Gravatar({
          id: id.toHexString(),
          owner: decodeHex(owner),
          displayName,
          imageUrl
        })) 
      }
    }
    await ctx.store.save([...gravatars.values()])
});
```

## Migrate from handlers

Batch-based processing can be used as a drop-in replacement for the handler based mappings employed by e.g. subgraphs. While the handler-based processing is significantly slower due to excessive database lookups and writes, it may be a good intermediary step while [migrating an existing subgraph to Squid SDK](/migrate/migrate-subgraph/).

One can simply re-use the existing handlers while looping over the `ctx` items:

```ts
processor.run(new TypeormDatabase(), async (ctx) => {
  for (const c of ctx.blocks) {
    for (const item of c.items) {
      switch (item.kind) {
        case 'evmLog':
          switch (item.evmLog.topics[0]) {
            case abi.events.FooEvent.topic:
              await handleFooEvent(ctx, item.evmLog)
              continue
            case abi.events.BarEvent.topic:
              await handleFooEvent(ctx, item.evmLog)
              continue
            default:
              continue
          }
        case 'transaction':
          // 0x + 4 bytes
          const sighash = item.transaction.input.slice(0, 10)
          switch (sighash) {
            case '0xa9059cbb': // transfer(address,uint256) sighash
              await handleTransferTx(ctx, item.transaction)
              continue
            case abi.functions.approve.sighash:
              await handleApproveTx(ctx, item.transaction)
              continue
            default:
              continue
          }  
        default:
          continue
      }
    }
  }
});
```

## Block hooks

Similarly, one can implement pre- and post- block hooks:

```ts
processor.run(new TypeormDatabase(), async (ctx) => {
  for (const c of ctx.blocks) {
    await preBlockHook(ctx, c)
    for (const item of c.items) {
      // some logic
    }
    await postBlockHook(ctx, c)
  }
})
```
