---
sidebar_position: 30
description: >-
  DataHandlerContext interfaces for EVM
---

# BatchContext for EVM

A `EvmBatchProcessor` instance expects a single user-defined batch handler to be implemented by the `run()` method: 
```ts
processor.run<Store>(
  db: Database<Store>,
  batchHandler: (ctx: DataHandlerContext<Store, F>) => Promise<void>
): void
```
The batch handler is an async void function. It repeatedly receives batches of archive data stored in `ctx.blocks`, transforms them and persists the results to the target database using the `ctx.store` interface.

Here, `F` and `Store` are inferred from the `EvmBatchProcessor` method calls:
 * `F` is the type of the argument of the [`setFields()`](/dead) processor configuration call and the argument of the `EvmBatchProcessor` generic:
   ```ts
    export class EvmBatchProcessor<F extends FieldSelection = {}> {
      ...
    }
   ```
   It is used to determine the exact set of fields within the [data items](#data-item-types) retrieved by the processor.
 * [`Store`](#store) is the interface used to persist the processed data.

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

(???? Update the interface with any final corrections)

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
 - [`stateDiffs`](/dead) follow the order of transactions that gave rise to them;
 - `traces` are ordered in a deterministic but otherwise unspecified way.

## Data item types

### `Log`

`Log<F extends FieldSelection>` is a generic type for EVM log data. Some of its fields are fixed and some can be added or removed [upon request](/dead).

```ts
Log<F> {
  // fixed fields
  id: string
  logIndex: number
  transactionIndex: number
  transaction?: Transaction<F>
  block: BlockHeader<F>

  // fields that can be disabled via F
  address: string
  data: string
  topics: string[]

  // fields that can be requested via F
  transactionHash: string
}
```
See the [block header section](#blockheader) for the definition of `BlockHeader<F>`.

### `Transaction`

```ts
Transaction<F> {
  from: string
  gas: bigint
  gasPrice: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  hash: string
  input: string
  nonce: number
  to?: string
  transactionIndex: number
  value: bigint
  v?: bigint
  r?: string
  s?: string
  yParity?: number
  chainId?: number
  gasUsed?: bigint
  cumulativeGasUsed?: bigint
  effectiveGasPrice?: bigint
  contractAddress?: string
  type?: number
  status?: number
  sighash: string
}
```

### `BlockHeader`

```ts
BlockHeader<F>{
  hash: string
  height: number
  id: string
  parentHash: string
  timestamp: number
}
```

## `Store`

A concrete `ctx.store` instance is derived at runtime from the `run()` method argument via

```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
``` 
For Postgres-compatible `Database`s, `ctx.store` has a TypeORM [EntityManager](https://typeorm.io/entity-manager-api)-like [interface](/basics/store/typeorm-store) extended with additional support for batch updates. The interface may differ for other `Database` implementations, including the experimental `@subsquid/file-store` package.

See [Processor Store](/basics/store) for details.

## `Logger`

The `log` field is a dedicated `Logger` instance. See [Logging](/basics/logging) for more details.

## Example

The handler below simply outputs all the log items emitted by the contract `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC` and saves some bogus data to the store:

```ts
import { Store, TypeormDatabase } from '@subsquid/typeorm-store';
import { EvmBatchProcessor } from '@subsquid/evm-processor'
import { MyEntity } from './model/generated/myEntity.model';

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

One can experiment with the [data selectors](/evm-indexing/configuration/data-selectors) and see how the output changes.

For more elaborate examples, check the [Gravatar squid](https://github.com/subsquid/squid-evm-template/tree/gravatar-squid) and [EVM Examples](/examples).
