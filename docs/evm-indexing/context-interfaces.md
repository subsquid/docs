---
sidebar_position: 30
description: >-
  DataHandlerContext interfaces for EVM
---

# BatchContext for EVM

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.**

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

[//]: # (???? Update the interface with any final corrections)

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

All data item types are generics depending on the field selection type, `F extends FieldSelection`. Some of their fields are fixed and some can be added or removed via [`setFields()`](/dead). Removing unnecessary fields will improve sync performance, as the data for these fields will not be fetched.

### `Log`

```ts
Log<F> {
  // fixed fields
  id: string
  logIndex: number
  transactionIndex: number
  block: BlockHeader<F>
  transaction?: Transaction<F>

  // fields that can be disabled via F
  address: string
  data: string
  topics: string[]

  // fields that can be requested via F
  transactionHash: string
}
```
See the [block header section](#blockheader) for the definition of `BlockHeader<F>` and the [transaction section](#transaction) for the definition of `Transaction<F>`.

### `Transaction`

```ts
Transaction<F> {
  // fixed fields
  id: string
  transactionIndex: number
  block: BlockHeader<F>

  // fields that can be disabled via F
  from: string
  to?: string
  hash: string

  // fields that can be requested via F
  gas: bigint
  gasPrice: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  input: string
  nonce: number
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
See the [block header section](#blockheader) for the definition of `BlockHeader<F>`.

### `StateDiff`

```ts
StateDiff<F> {
  // fixed fields
  transactionIndex: number
  block: BlockHeader<F>
  transaction?: Transaction<F>
  address: string
  key: 'balance' | 'code' | 'nonce' | string

  // fields that can be disabled via F
  kind: '=' | '+' | '*' | '-'
  prev?: string | null
  next?: string | null
}
```
The meaning of the `kind` field values is as follows:
 - `'='`: no change has occured;
 - `'+'`: a value was added;
 - `'*'`: a value was changed;
 - `'-'`: a value was removed.

The values of the `key` field are regular hexadecimal contract storage key strings or one of the special keys `'balance' | 'code' | 'nonce'` denoting ETH balance, contract code and nonce value associated with the state diff.

See the [block header section](#blockheader) for the definition of `BlockHeader<F>` and the [transaction section](#transaction) for the definition of `Transaction<F>`.

### `Trace`

[//]: # (???? extra attention to any interface changes here)

```ts
Trace<F> {
  // fixed fields
  transactionIndex: number
  block: BlockHeader<F>
  transaction?: Transaction<F>
  traceAddress: number[]
  type: 'create' | 'call' | 'suicide' | 'reward'

  // fields that can be disabled via F
  error: string | null

  // fields that can be requested via F
  subtraces: number
  // if (type==='create')
  action: {
    from: string
    value: bigint
    gas: bigint
    init: string
  }
  result?: {
    gasUsed: bigint
    code: string
    address?: string
  }
  // if (type==='call')
  action: {
    from: string
    to: string
    value: bigint
    gas: bigint
    sighash: string
    input: string
  }
  result?: {
    gasUsed: bigint
    output: string
  }
  // if (type==='suicide')
  action: {
    address: string
    refundAddress: string
    balance: bigint
  }
  // if (type==='reward')
  action: {
    author: string
    value: bigint
    type: string
  }
}
```

### `BlockHeader`

```ts
BlockHeader<F>{
  // fixed fields
  hash: string
  height: number
  id: string
  parentHash: string

  // fields that can be disabled via F
  timestamp: number

  // fields that can be requested via F
  nonce?: string
  sha3Uncles: string
  logsBloom: string
  transactionsRoot: string
  stateRoot: string
  receiptsRoot: string
  mixHash?: string
  miner: string
  difficulty?: bigint
  totalDifficulty?: bigint
  extraData: string
  size: bigint
  gasLimit: bigint
  gasUsed: bigint
  baseFeePerGas?: bigint
}
```

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

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
    chain: 'https://eth-rpc.gateway.pokt.network'
  })
  .setBlockRange({ from: 17000000 })
  .addLog({
    address: ['0x2E645469f354BB4F5c8a05B3b30A929361cf77eC']
  })
  .setFields({
    log: {
      topics: true,
      data: true
    }
  })

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let log of c.logs) {
      ctx.log.info(log, `Log:`)
    }
  }
  await ctx.store.save([
    new MyEntity({id: '1', foo: 'bar'}), 
    new MyEntity({id: '2', foo: 'baz'})
  ])
})
```

One can experiment with the [`setFields()`](/dead) and see how the output changes.

For more elaborate examples, check [EVM Examples](/examples).
