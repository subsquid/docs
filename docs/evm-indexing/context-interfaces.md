---
sidebar_position: 30
description: >-
  Batch context interface
---

# Batch context interface

A `EvmBatchProcessor` instance expects a single user-defined batch handler to be implemented by the `run()` method: 
```ts
processor.run<Store>(
  db: Database<Store>,
  batchHandler: (ctx: DataHandlerContext<Store, F>) => Promise<void>
): void
```
The batch handler is an async void function. It repeatedly receives batches of archive data stored in `ctx.blocks`, transforms them and persists the results to the target database using the `ctx.store` interface.

Here, `F` and `Store` are inferred from the `EvmBatchProcessor` method calls:
 * `F` is the type of the argument of the [`setFields()`](/evm-indexing/configuration/data-selection) processor configuration call and the argument of the `EvmBatchProcessor` generic:
   ```ts
    export class EvmBatchProcessor<F extends FieldSelection = {}> {
      ...
    }
   ```
   It is used to determine the exact set of fields within the [data items](#data-item-types) retrieved by the processor.
 * [`Store`](#the-store-interface) is the interface used to persist the processed data.

## `DataHandlerContext` interface

The batch handler accepts a single argument of type `DataHandlerContext`. It has the following structure:

```ts
export interface DataHandlerContext<Store, F extends FieldSelection = {}> {
  // an internal handle
  _chain: Chain
  // a logger to be used within the handler
  log: Logger
  // the facade interface for the target database
  store: Store
  // input on-chain data as requested by the subscriptions
  blocks: BlockData<F>[]
  // a flag indicating whether the processor is at the chain head
  isHead: boolean
}
```

## `BlockData`

The `blocks` field holds the data to be processed, aligned at the block level.
```ts
export type BlockData<F extends FieldSelection = {}> = {
  header: BlockHeader<F>
  transactions: Transaction<F>[]
  logs: Log<F>[]
  traces: Trace<F>[]
  stateDiffs: StateDiff<F>[]
}
```

`BlockData.header` contains the block header data. The rest of the fields are iterables containing various blockchain data:
 - `transactions` and `logs` are ordered in the same way as they are within blocks;
 - [`stateDiffs`](/evm-indexing/configuration/state-diffs) follow the order of transactions that gave rise to them;
 - `traces` are ordered in a deterministic but otherwise unspecified way.

The exact fields available in each data item type are inferred from the `setFields()` call argument. They are documented on the [data selection](/evm-indexing/configuration/data-selection) page:
 - [transactions section](/evm-indexing/configuration/data-selection/#transactions);
 - [logs section](/evm-indexing/configuration/data-selection/#logs);
 - [traces section](/evm-indexing/configuration/data-selection/#traces);
 - [state diffs section](/evm-indexing/configuration/data-selection/#state-diffs);
 - [block header section](/evm-indexing/configuration/data-selection/#block-headers).

## The `Store` interface

A concrete `ctx.store` instance is derived at runtime from the `run()` method argument via

```ts
processor.run<Store>(
  db: Database<Store>,
  batchHandler: (ctx: DataHandlerContext<Store, F>) => Promise<void>
): void
``` 
For Postgres-compatible `Database`s, `ctx.store` has a TypeORM [EntityManager](https://typeorm.io/entity-manager-api)-like [interface](/basics/store/typeorm-store) extended with additional support for batch updates. The interface may differ for other `Database` implementations, including [`@subsquid/file-store`](/basics/store/file-store).

See [Processor Store](/basics/store) for details.

## `Logger`

The `log` field is a dedicated `Logger` instance. See [Logging](/basics/logging) for more details.

## Example

The handler below simply outputs all the log items emitted by the contract `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC` and saves some bogus data to the store:

```ts
import { Store, TypeormDatabase } from '@subsquid/typeorm-store';
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { MyEntity } from './model/generated/myEntity.model';

const CONTRACT_ADDRESS = '0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'.toLowerCase()

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
    chain: 'https://eth-rpc.gateway.pokt.network'
  })
  .setFinalityConfirmation(75)
  .setBlockRange({ from: 17000000 })
  .addLog({
    address: [CONTRACT_ADDRESS]
  })
  .setFields({
    log: {
      topics: true,
      data: true
    }
  })

processor.run(new TypeormDatabase(), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let log of c.logs) {
      if (log.address === CONTRACT_ADDRESS) {
        ctx.log.info(log, `Log:`)
      }
    }
  }
  await ctx.store.save([
    new MyEntity({id: '1', foo: 'bar'}), 
    new MyEntity({id: '2', foo: 'baz'})
  ])
})
```

One can experiment with the [`setFields()`](/evm-indexing/configuration/data-selection) and see how the output changes.

For more elaborate examples, check [EVM Examples](/examples).
