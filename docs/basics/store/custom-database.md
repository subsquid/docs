---
sidebar_position: 30
title: Custom Database
description: >-
  Implement a custom data sink
---

# Custom Database

In order to implement a custom adapter to a data sink, it suffices to implement the `Database` interface:

```ts
export interface Database<S> {
    // initialize the connection and run migrations 
    connect(): Promise<number>
    // run handlers for blocks in the range `[from, to]` in a single transaction
    transact(from: number, to: number, cb: (store: S) => Promise<void>): Promise<void>
    // update and persist the processor status to `height`
    advance(height: number): Promise<void>
}
```

The interface only defines how the processor advances with the indexing and connects to the data sink. The following is left for implementations:
- persisting the indexing status
- opening and rolling back the transaction (if applicable)

Consult these implementations for details:
- (Transactional) Postgres-based [TypeORMDatabase](https://github.com/subsquid/squid-sdk/blob/master/typeorm/typeorm-store/src/database.ts) 
- (Non-transactional) [File-based database](https://github.com/subsquid/squid-csv-store/blob/main/src/database.ts)