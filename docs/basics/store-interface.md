---
sidebar_position: 40
title: Processor store
description: >-
  Stores for persisting the transformed data
---

# Store interface

`Store` is a generic interface exposed by `XXXContext.store` to the handlers. The concrete type is inferred from the `Database` argument of the `BatchProcessor.run` method:

```typescript
run<Store>(db: Database<Store>, handler: (ctx: BatchContext<Store, Item>) => Promise<void>): void
```

The `Database` interface only defines the logic of how the processor persists the processor status:

```typescript
export interface Database<S> {
    // initialize the connection and run migrations 
    connect(): Promise<number>
    // run handlers for blocks in the range `[from, to]` in a single transaction
    transact(from: number, to: number, cb: (store: S) => Promise<void>): Promise<void>
    // update and persist the processor status to `height`
    advance(height: number): Promise<void>
}
```


Squid SDK offers off-the-shelf implementations of `Database` for transactional TypeORM-compatible targets. The support for non-transactional and analytic stores like BigQuery to be added in the future via separate packages.


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

**Usage:**
 
```ts
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

processor.run(new TypeormDatabase(), async ctx => {
  // ...  
  await ctx.store.save([new FooEntity({ id: 1}), new FooEntity({ id: 2})])
})
``` 
*Usage:*
 
```ts
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

processor.run(new TypeormDatabase(), async ctx => {
  // ...  
  await ctx.store.save([new FooEntity({ id: 1}), new FooEntity({ id: 2})])
})
```

In the snippet above, `ctx.store` passed to the handlers will be of type `Store`.

## `FullTypeormDatabase`

`FullTypeormDatabase` provides a `ctx.store` compatible with [EntityManager](https://orkhan.gitbook.io/typeorm/docs/entity-manager-api), albeit without `.get()` method
 
*Usage:*
```ts
import { FullTypeormDatabase } from '@subsquid/typeorm-store'
import { EntityManager } from 'typeorm'

processor.run(new FullTypeormDatabase(), async ctx => {  
  // ...
  await ctx.store.save(new FooEntity({ id: 1}))
})
```

In the snippet above, `ctx.store` passed to the handlers will be of type `EntityManager`.
 
## Custom `Database`

A custom implementation of the `Database` interface is a recommended solution for squids with multiple data sinks and/or for non-transactional or non-relational databases. In such a case, the inferred `Store` facade exposed to the handlers may provide multiple targets for persisting the data. 

As a reference example, see a Database implementation based on flat [CSV-files in a s3 bucket](https://github.com/subsquid/squid-csv-store).