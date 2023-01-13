---
sidebar_position: 30
description: >-
  Transform the data in batches
---

# Data mapping


`EvmBatchProcessor` assumes single batch handler via the `processor.run()` method: 
```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
```

The batch handler ingests the incoming archive data stored in `ctx.block`, transforms it, and persists using the `ctx.store` interface. 

## `BatchContext` interface

`EvmBatchProcessor` defines a single data handler which is a pure function accepting a single argument of type `BatchContext`. `BatchContext` has the following structure

```ts title="src/types/support.ts"
export interface BatchContext<Store, Item> {
    /**
     * An internal handle
     */
    _chain: Chain
    // a logger to be used within the handler
    log: Logger
    // the facade interface for the target database
    store: Store
    // input on-chain data as requested by the subscriptions
    blocks: BatchBlock<Item>[]
}
```

### `BatchBlock`

The `blocks` field holds the log item data to be processed, aligned at the block level.
```ts
export interface BatchBlock<Item> {
    /**
     * Block header
     */
    header: EvmBlock

    /**
     * A unified log of events and calls.
     * List of the block events is a subsequence 
     * of the unified execution log.
     */
    items: Item[]
}
```

`BatchBlock.header` contains the block header data. `BatchBlock.items` is a unified log containing the event and the call data.
All events emitted by a call are placed before the call itself. All the child calls are placed before the parent call.

Each `Item` has the following structure:
```ts
{ 
    // either it's an `event` or `transaction` item
    kind: `evmLog` | `transaction`,
    // EVM address emitted the log or the transaction destination
    address: string, 
    // the evm log data as specified by the corresponding `addLog()` or `addTransaction()` data selectors
    evmLog?: {},
    // the transaction data as specified by the corresponding `addLog()` or `addTransaction()` data selectors
    transaction?: {}
}
```

The types of `evmLog` and `transaction` are inferred from the [data selectors](/evm-indexing/configuration/#data-selectors) set by the corresponding `processor.addLog()` and `processor.addTransaction()` init methods of `EvmBatchProcessor` [(see the previous page)](/evm-indexing/configuration).


### `Store`

A concrete `ctx.store` instance is derived at runtime from the run argument via 

```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
``` 
The most commonly used `ctx.store` is a TypeORM-like interface extended with additional support for batch updates. The core Squid SDK currently maintains only Postgres-compatible stores, with third-party support for other databases.

See [Store Interface](/basics/store-interface) for details.

### `Logger`

The `log` field is a dedicated `Logger` instance to be used for debug and otherwise. See [Logging](/basics/logging) for more details.


## Example

The handler below simply outputs all the log items emitted by the contract `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC` and saves some bogus data to the store:

```ts
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import { MyEntity } from "./model/generated/myEntity.model";

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://eth.archive.subsquid.io',
  })
  .setBlockRange({ from: 6175243 })
  .addLog('0x2E645469f354BB4F5c8a05B3b30A929361cf77eC', {
    filter: [[ ]],
    data: {
        evmLog: {
            topics: true,
            data: true,
        },
    } as const,
});


processor.run(new TypeormDatabase(), async (ctx) => {
  for (const c of ctx.blocks) {
    for (const i of c.items) {
      ctx.log.info(i, `Item:`)
    }
  }
  await ctx.store.save([
    new MyEntity({id: '1', foo: 'bar'}), 
    new MyEntity({id: '2', foo: 'baz'})
  ])
});
```

One can experiment with the [data selectors](/evm-indexing/configuration#data-selectors) and see how the output changes depending on it.

For a more elaborate example, check the [Gravatar squid](https://github.com/subsquid/squid-evm-template/tree/gravatar-squid) and the [EVM Examples](/examples).
