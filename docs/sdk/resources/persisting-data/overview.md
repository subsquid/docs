---
sidebar_position: 1
title: Store interface
description: >-
  Store API for persisting the transformed data
---

# Store Interface

`Store` is a generic interface exposed by `DataHandlerContext.store` to the batch handler that defines an interface for persisting data. Its concrete type is inferred from the `Database` argument of the `run()` method:

```typescript
run<Store>(db: Database<Store>, handler: (ctx: DataHandlerContext<Store, F extends FieldSelection>) => Promise<void>): void
```

The `Database` interface only defines the logic of how the processor persists the processor status and the store. Squid SDK supports `Database` implementations for `TypeORM`-compatible databases ([`TypeormDatabase`](/store/postgres/typeorm-store)) and for file-based datasets ([the `file-store` packages](/store/file-store)). The interface allows implementation of adapters for custom data sinks. Support for more databases and analytics store will be added in the future.

---
sidebar_position: 30
title: Custom Database classes
description: >-
  Implement a custom data sink
---

# Custom Database

A custom implementation of the `Database` interface is a recommended solution for squids with multiple data sinks and/or for non-transactional or non-relational databases. In such a case, the inferred `Store` facade exposed to the handlers may provide multiple targets for persisting the data. `Database.transact` should handle potential edge-cases when writes to either of the data sinks fail.

In order to implement a custom adapter to a data sink, it suffices to implement the `Database` interface:

```ts
export type Database<S> = FinalDatabase<S> | HotDatabase<S>

export interface FinalDatabase<S> {
    supportsHotBlocks?: false
    connect(): Promise<HashAndHeight>
    transact(info: FinalTxInfo, cb: (store: S) => Promise<void>): Promise<void>
}

export interface HotDatabase<S> {
    supportsHotBlocks: true
    connect(): Promise<HotDatabaseState>
    transact(info: FinalTxInfo, cb: (store: S) => Promise<void>): Promise<void>
    transactHot(info: HotTxInfo, cb: (store: S, block: HashAndHeight) => Promise<void>): Promise<void>
}
```
Consult [this file](https://github.com/subsquid/squid-sdk/blob/master/util/util-internal-processor-tools/src/database.ts) for details.

The interface only defines how the processor advances with the indexing and connects to the data sink. The following is left as implementation details:
- persisting the indexing status
- opening and rolling back the transaction (if applicable)

Consult these implementations for details:
- (Transactional) Postgres-based [TypeormDatabase](https://github.com/subsquid/squid-sdk/blob/master/typeorm/typeorm-store/src/database.ts)
- (Non-transactional) [File-based database](https://github.com/subsquid/squid-csv-store/blob/main/src/database.ts)
