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
export interface Database<S> {
    // initialize the connection and run migrations 
    connect(): Promise<number>
    // run handlers for blocks in the range `[from, to]` in a single transaction
    // cb is the callback passed to processor.run()
    transact(from: number, to: number, cb: (store: S) => Promise<void>): Promise<void>
    // update and persist the processor status to `height`
    advance(height: number): Promise<void>
}
```

The interface only defines how the processor advances with the indexing and connects to the data sink. The following is left as implementation details:
- persisting the indexing status
- opening and rolling back the transaction (if applicable)

Consult these implementations for details:
- (Transactional) Postgres-based [TypeormDatabase](https://github.com/subsquid/squid-sdk/blob/master/typeorm/typeorm-store/src/database.ts)
- (Non-transactional) [File-based database](https://github.com/subsquid/squid-csv-store/blob/main/src/database.ts)
