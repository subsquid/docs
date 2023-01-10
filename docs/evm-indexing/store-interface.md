---
sidebar_position: 31
description: >-
  Persist the indexed data
---

# Store interface

`Store` is a generic interface exposed by `EvmBatchProcessor` batch handler for persisting the transformed data. The Squid SDK offers a `Store` implementation with a TypeORM [`EntityManager`](https://orkhan.gitbook.io/typeorm/docs/entity-manager-api)-like interface for Postgres-compatible databases. There are third-party implementations of `Store` exist for SQLite3 and other databases.

## `TypeormDatabase` (recommended)

`TypeormDatabase` provides a `ctx.store`, with the following methods:

**`save<E extends Entity>(e: E | E[]): Promise<void>`** 

Upsert a single or multiple entities to the database. Does not cascade the upsert to relations.

**`insert<E extends Entity>(e: E | E[]): Promise<void>`**

Inserts a given entity or entities into the database. Does not check if the entity(s) exist in the database and will fail if a duplicate is inserted. Executes a primitive INSERT operation without cascading the relations.


**`remove<E extends Entity>(e: E | E[] | EntityClass<E>, id?: string | string[]): Promise<void>`**

Deletes a given entity or entities from the database. Accepts either an object or entity ID(s). Does not cascade the deletion.

**TypeORM `EntityManager` methods:**

For details see [TypeORM EntityManager reference](https://orkhan.gitbook.io/typeorm/docs/entity-manager-api)

- `get`
- `count`
- `countBy` 
- `find`
- `findBy`
- `findOne`
- `findOneBy`
- `findOneOrFail`
- `findOneByOrFail`

*Usage:*
 
```ts
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

processor.run(new TypeormDatabase(), async ctx => {
  // ...  
  await ctx.store.save([new FooEntity({ id: 1}), new FooEntity({ id: 2})])
})
```

## `FullTypeormDatabase`

`FullTypeormDatabase` store gives full access to the underlying database, including the possibility to arbitrary queries with `.query()`.

The interface is identical to [TypeORM EntityManager](https://orkhan.gitbook.io/typeorm/docs/entity-manager-api).
 
## Custom `Database`

A custom implementation of the `Database` interface is a recommended solution for squids with multiple data sinks and/or for non-transactional or non-relational databases. In such a case, the inferred `Store` facade exposed to the handlers may provide multiple targets for persisting the data. `Database.transact` should handle potential edge-cases when writes to either of the data sinks fail. 

Reference implementations will be provided in due course.
