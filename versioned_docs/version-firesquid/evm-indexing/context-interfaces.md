---
sidebar_position: 30
description: >-
  BatchContext interfaces for EVM
---

# BatchContext for EVM

A `EvmBatchProcessor` instance expects a single user-defined batch handler to be implemented by the `run()` method: 
```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
```

The batch handler is an async void function. It repeatedly receives batches of archive data stored in `ctx.blocks`, transforms them and persists the results to the target database using the `ctx.store` interface.

## `BatchContext` interface

The batch handler accepts a single argument of type `BatchContext`. It has the following structure:

```ts
export interface BatchContext<Store, Item> {
  // an internal handle
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

The `blocks` field holds the log items data to be processed, aligned at the block level.
```ts
export interface BatchBlock<Item> {
  header: EvmBlock
  items: Item[]
}
```

`BatchBlock.header` contains the block header data. `BatchBlock.items` is a unified log containing the event and the transaction data items. It is canonically ordered following the EVM execution trace:
 - all transaction items respect the execution order with the block
 - all events emitted by a transaction are placed before the transaction item (if is requested);

Each data `Item` has the following structure:
```ts
{ 
  // either it's an `event` or `transaction` item
  kind: 'evmLog' | 'transaction',
  // address of the contract that emitted the log or the transaction destination
  address: string,
  // the evm log data as specified by the corresponding `addLog()` or `addTransaction()` data selectors
  evmLog?: {},
  // the transaction data as specified by the corresponding `addLog()` or `addTransaction()` data selectors
  transaction?: {}
}
```

### The block header

Here is the full list of fields for the `EvmBlock` type:

```ts
export interface EvmBlock {
  id: string
  height: number
  hash: string
  parentHash: string
  nonce?: bigint
  sha3Uncles: string
  logsBloom: string
  transactionsRoot: string
  stateRoot: string
  receiptsRoot: string
  miner: string
  difficulty?: string
  totalDifficulty?: string
  extraData: string
  size: bigint
  gasLimit: bigint
  gasUsed: bigint
  timestamp: number
  mixHash?: string
  baseFeePerGas?: bigint
}
```

### `evmLog` items

Here is a full list of fields for items with `item.kind==='evmLog'`.

```ts
{
  kind: 'evmLog'
  address: string
  evmLog: {
    id: string
    blockNumber: number
    address?: string
    data?: string
    index?: number
    removed?: boolean
    topics?: string[]
    transactionIndex?: number
  },
  // transaction emitted the log
  transaction: {
    id?: string
    from?: string
    gas?: biging
    gasPrice?: bigint
    hash?: string
    input?: string
    nonce?: bigint
    to?: string
    index?: number
    value?: bigint
    type?: number
    chainId?: number
    v?: bigint
    r?: string
    s?: string
    maxPriorityFeePerGas?: bigint
    maxFeePerGas?: bigint
  }
}
```

Note that to make the properties of `item.evmLog` and `item.transaction` available, one has to specify the corresponding [data selectors](/evm-indexing/configuration/data-selectors) in the [`addLog()`](/evm-indexing/configuration/evm-logs) configuration method.

### `transaction` items

Here is a full list of fields for items with `item.kind==='transaction'`.

```ts
{
  kind: 'transaction'
  address: string // transaction.to
  transaction: {
    id?: string
    from?: string
    gas?: biging
    gasPrice?: bigint
    hash?: string
    input?: string
    nonce?: bigint
    to?: string
    index?: number
    value?: bigint
    type?: number
    chainId?: number
    v?: bigint
    r?: string
    s?: string
    maxPriorityFeePerGas?: bigint,
    maxFeePerGas?: bigint,
  }
}
```

Note that to make the properties of `item.transaction` available, one has to specify the corresponding [data selectors](/evm-indexing/configuration/data-selectors) in the [`addTransaction()`](/evm-indexing/configuration/transactions) configuration method.

### `Store`

A concrete `ctx.store` instance is derived at runtime from the `run()` method argument via

```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
``` 
For Postgres-compatible `Database`s, `ctx.store` has a TypeORM [EntityManager](https://typeorm.io/entity-manager-api)-like [interface](/basics/store/typeorm-store) extended with additional support for batch updates. The interface may differ for other `Database` implementations, including the experimental `@subsquid/file-store` package.

See [Processor Store](/basics/store) for details.

### `Logger`

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
