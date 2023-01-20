---
sidebar_position: 30
description: >-
  BatchContext interfaces for Substrate
---

# BatchContext for Substrate

A data handler is a stateless function which transforms the fetched on-chain data and optionally persists the output into the target data store.  

`SubstrateProcessor` defines specialized interfaces `BlockHandler`, `EventHandler`, `CallHandler`, `EvmLogHandler` and `ContractsContractEmittedHandler` for each type of log item it was subscribed to. Each handler accepts a context object as a single argument. The context contains references to the requested on-chain data and a reference to the store to which it will be saved. 

The rest of the page describes `SubstrateBatchProcessor` which accepts only a single batch handler via the `processor.run()` method: 
```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
```

The interfaces for `SubstrateProcessor` handlers are similar and are documented inline.

## `BatchContext` interface

`SubstrateBatchProcessor` defines a single data handler which is a pure function accepting a single argument of type `BatchContext`. `BatchContext` has the following structure

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
    header: SubstrateBlock

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



### `Store`

A concrete `ctx.store` instance is derived at runtime from the run argument via 

```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
``` 

See [Store Interface](/basics/store) for details.

### `Logger`

The `log` field is a dedicated `Logger` instance to be used for debug and otherwise. See [Logging](/basics/logging) for more details.


## Minimal Example

The handler below simply outputs all the log items fetched by the processor:

```ts
// an utility library for JSONifying objects with bigints
import { toJSON } from '@subsquid/util-internal-json'

const processor = new SubstrateBatchProcessor()
    // set the data source
    .setDataSource({
        archive: lookupArchive("kusama", {release: "FireSquid"})
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

For a more elaborate example, check [Batch processor in action](/substrate-indexing/batch-processor-in-action) and the [Examples](/examples) page.
