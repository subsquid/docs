---
sidebar_position: 10
title: Store interface
description: >-
  Store API for persisting the transformed data
---

`Store` is a generic interface exposed by [`DataHandlerContext`](/sdk/reference/processors/architecture/#batch-context) at `.store`. It is used in the [batch handler](/sdk/reference/processors/architecture/#processorrun) to persist data. Its concrete type is inferred from the `Database` argument of the [`run()` processor method](/sdk/reference/processors/architecture/#processorrun):

```typescript
run<Store>(
  db: Database<Store>,
  handler: (ctx: DataHandlerContext<Store, F extends FieldSelection>)
    => Promise<void>
): void
```

The `Database` implementation supplied here defines the store and the way the processor [persists its status](/sdk/faq/#how-do-squids-keep-track-of-their-sync-progress). Squid SDK supports `Database` implementations for:
 * [`TypeORM`-compatible databases](/sdk/resources/persisting-data/typeorm)
 * [file-based datasets](/sdk/resources/persisting-data/file)
 * [Google BigQuery](/sdk/resources/persisting-data/bigquery)

Support for more databases and analytics storage will be added in the future.

## Custom `Database`

A custom implementation of the `Database` interface is the recommended solution for squids with multiple data sinks and/or for non-transactional or non-relational databases. In such a case, the inferred `Store` facade exposed to the handlers may provide multiple targets for persisting the data. `Database.transact` should handle potential edge-cases when writes to either of the data sinks fail.

In order to implement a custom data sink adapter, it suffices to implement the `Database` interface:

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
