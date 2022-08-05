---
sidebar_position: 3
description: >-
  Define the data handler(s) to transform and persist the data
---

# Data handlers

A data handler is a stateless function which transforms the fetched on-chain data and optionally persists the output into the target data store.  

`SubstrateProcessor` defines specialized interfaces `BlockHandler`, `EventHandler`, `CallHandler`, `EvmLogHandler` and `ContractsContractEmittedHandler` for each type of log item it was subscribed to. Each handler accepts a context object as a single argument. The context contains references to the requested on-chain data and a reference to the store to which it will be saved. 

## `BatchContext` interface

`SubstrateBatchProcessor` defines a single data handler which is a pure function accepting a single argument of type `BatchContext`. `BatchContext` has the following structure

```ts
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

**`BatchBlock`**

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

**`Store`**

A concrete `ctx.store` instance is derived at runtime from the run argument via 

```ts
processor.run<Store>(db: Database<Store>, batchHandler: (ctx: BatchContext<Store>) => Promise<void>)
``` 

The `Database` interface is a minimal interface for providing a persistent storage for data handlers
and keeping the processor progress and the status. It is a convenient extension point for custom target data sinks.  

The package `@subsquid/typeorm-store` provides two readily available implementations of the `Database`. We recommend using `TypeormDatabase` that provides `ctx.store`, which

- Is an optimized and slightly trimmed version of the [TypeORM `EntityManager`](https://orkhan.gitbook.io/typeorm/docs/entity-manager-api) (no `.query()`, no cascading saves)
- Lazy (no transaction is opened if no data is read or written to the store). This is useful e.g. when one want to subscribe for some frequent events but only interested in the cases when the events were emitted under specific conditions (e.g. by a specific contract)
- Fast data updates 
- The schema name and the transaction isolation level can be passed as an optional constructor argument

**`Logger`**

The `log` field is a dedicated `Logger` instance to be used for debug and otherwise. See [Logging](/develop-a-squid/logging) for more details.

