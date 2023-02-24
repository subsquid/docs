---
sidebar_position: 30
description: >-
  BatchContext interfaces for Substrate
---

# BatchContext for Substrate

A `SubstrateBatchProcessor` instance expects a single user-defined batch handler to be implemented by the `run()` method: 
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
  header: SubstrateBlock
  items: Item[]
}
```

`BatchBlock.header` contains the block header data. `BatchBlock.items` is a unified log containing the event and the call data. It is canonically ordered:
 - all events emitted by a call are placed before the call itself;
 - all the child calls are placed before the parent call.

Each `Item` has the following structure:
```ts
{ 
  // either it's an `event` or `call` item
  kind: `event` | `call`,
  // the name of the event or the call 
  name: string, 
  // the event data as specified by the config
  event?: EventData,
  // the extrinsic data as specified by the config
  extrinsic?: ExtrinsicData
  // the call data as specified by the config
  call?: CallData
}
```

### `event` items

This is the full shape of the items with `item.kind == 'event'`. The actual set of fields corresponds to the [event data selector](/substrate-indexing/configuration#event-data-selector) specified by the `addEvent()`, `addEvmLog()` and similar event-based [processor config methods](/substrate-indexing/configuration):

```ts
interface EventItem {
  kind: 'event'
  name: string
  event: {
    args: any
    // call emitted the event
    call?: Partial<SubstrateCall>
    // top-level extrinsic emitted the event
    extrinsic?: Partial<SubstrateExtrinsic>
    // for addEvmLog() events, the hash of the evm tx
    evmTxHash?: string 
  }
}

interface SubstrateExtrinsic {
  id: string
  /**
   * Ordinal index in the extrinsics array of the current block
   */
  indexInBlock: number
  version: number
  signature?: SubstrateExtrinsicSignature
  call: SubstrateCall
  fee?: bigint
  tip?: bigint
  success: boolean
  error?: any
  /**
   * Blake2b 128-bit hash of the raw extrinsic
   */
  hash: string
  /**
   * Extrinsic position in a joint list of events, calls and extrinsics,
   * which determines data handlers execution order.
   */
  pos: number
}

interface SubstrateCall {
  id: string
  name: QualifiedName
  /**
   * JSON encoded call arguments
   */
  args: any
  parent?: SubstrateCall
  origin?: any
  success: boolean
  /**
   * Call error.
   *
   * Absence of error doesn't imply that call was executed successfully,
   * check {@link success} property for that.
   */
  error?: any
  /**
   * Position of the call in a joint list of events, calls and extrinsics,
   * which determines data handlers execution order.
   */
  pos: number
}
```

### `call` items

This is the full shape of the items with `item.kind == 'call'`. The actual set of fields corresponds to the [call data selector](/substrate-indexing/configuration#call-data-selector) specified by the [`addCall()`](/substrate-indexing/configuration) processor config method.

```ts
interface CallItem {
  kind: 'call'
  name: string
  call?: Partial<SubstrateCall>
  // top-level extrinsic executed the call
  extrinsic?: Partial<SubstrateExtrinsic>
}
```
See the [`event` items](/substrate-indexing/context-interfaces/#event-items) section for definitions of `SubstrateCall` and `SubstrateExtrinsic`.

### `Store`

A concrete `ctx.store` instance is derived at runtime from the run argument via 

```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
``` 
For Postgres-compatible `Database`s, `ctx.store` has a TypeORM [EntityManager](https://typeorm.io/entity-manager-api)-like [interface](/basics/store/typeorm-store) extended with additional support for batch updates. The interface may differ for other `Database` implementations, including the experimental `@subsquid/file-store` package.

See [Processor Store](/basics/store) for details.

### `Logger`

The `log` field is a dedicated `Logger` instance. See [Logging](/basics/logging) for more details.

## Minimal Example

The handler below simply outputs all the log items fetched by the processor:

```ts
// an utility library for JSONifying objects with bigints
import { toJSON } from '@subsquid/util-internal-json'

const processor = new SubstrateBatchProcessor()
  // set the data source
  .setDataSource({
    archive: lookupArchive("kusama")
  })
  // subscribe to Balances.Transfer events
 .addEvent('Balances.Transfer')

// run the batch handler and simply log all the context items
processor.run(new TypeormDatabase(), async ctx => {
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      ctx.log.info(`Item: ${JSON.stringify(toJSON(item))}`)
    }
  }
})
```

For more elaborate examples, check [Batch processor in action](/substrate-indexing/batch-processor-in-action) and the [Examples](/examples) page.
