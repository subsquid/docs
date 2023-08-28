---
sidebar_position: 10
title: TypeormDatabase class
description: >-
  Optimized TypeORM-based store
---

# `TypeormDatabase` 

`TypeormDatabase` context store provides a wrapper over the [TypeORM `EntityManager`](https://typeorm.io/entity-manager-api) optimized for batch saving. It currently supports only Postgres-compatible databases and seamlessly integrates with entity classes generated from the [schema file](/store/postgres/schema-file).

## Usage
 
```ts
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

const dbOptions = {} // see Constructor options

processor.run(new TypeormDatabase(dbOptions), async ctx => {
  // ...  
  await ctx.store.save([new FooEntity({ id: '1'}), new FooEntity({ id: '2'})])
})
``` 

In the snippet above, `ctx.store` passed to the handlers will be of type `Store`.

## Constructor options

The behavior of `TypeormDatabase` and the derived `Store` objects can be tuned by setting the following fields of the database class constructor arguments:
* `stateSchema: string`: the name of the [database schema](https://www.postgresql.org/docs/current/sql-createschema.html) that the processor uses to persist its status (currently just the highest reached block number). Useful for making sure that each processor uses its own state schema when running multiple processors against the same database (e.g. in a multichain setting). Default: `'squid_processor'`.
* `isolationLevel: 'SERIALIZABLE' | 'READ COMMITTED' | 'REPEATABLE READ'`: sets the [transaction isolation level](https://www.postgresql.org/docs/current/transaction-iso.html) of processor transactions. Default: `'SERIALIZABLE'`.
* `supportHotBlocks: boolean`: controls the support for hot blocks. Necessary in all squids that must be able to handle short-lived [blockchain forks](https://en.wikipedia.org/wiki/Fork_(blockchain)). That includes all squids that index chain data in near-real time using RPC endpoints. Default: `true`.
* `projectDir: string`: the folder where `TypeormDatabase` will look for the TypeORM model definition (at `lib/model`) and for migrations (at `db/migrations`). Default: `process.cwd()`.

## `Store` interface

### Batch methods

**`save(e: E | E[])`** 

Upsert a single or multiple entities to the database. **Does not cascade the upsert to the relations.**

```ts
await ctx.store.save([new User({id: 'Bob'}), new User({id: 'Alice'}))])
```

**`insert(e: E | E[])`**

Inserts a given entity or entities into the database. Does not check if the entity(s) exist in the database and will fail if a duplicate is inserted. Executes a primitive INSERT operation **without cascading to the relations**.

```ts
await ctx.store.insert([new User({id: 'Bob'}), new User({id: 'Alice'}))])
```

**`remove(e: E | E[] | EntityClass<E>, id?: string | string[])`**

Deletes a given entity or entities from the database. Accepts either an object or an entity ID(s). **Does not cascade the deletion**.

```ts
await ctx.store.remove(User, ['Alice', 'Bob'])
```

### TypeORM methods

For details see [TypeORM EntityManager reference](https://typeorm.io/entity-manager-api).

**`get`**

Get an entity by ID.

```ts
await ctx.store.get(User, 'Bob')
```

**`count`**

Count the number of entities matching a where filter.

```ts
await ctx.store.count(User, {
    where: {
        firstName: "Timber",
    },
})
```

**`countBy`**

Count the number of entities matching a filter.

```ts
await ctx.store.countBy(User, { firstName: "Timber" })
```

**`find`** 

Return a list matching a where filter.

```ts
await ctx.store.find(User, {
    where: {
        firstName: "Timber",
    },
})
```
**`findBy`** 

Return a list matching a filter.

```ts
let accounts = await ctx.store.findBy(Account, {id: In([...accountIds])})
```

**`findOne`** 

Return the first entity matching a where filter.

```ts
const timber = await ctx.store.findOne(User, {
    where: {
        firstName: "Timber",
    },
})
```

**`findOneBy`** 

Return the first entity matching a filter.

```ts
const timber = await ctx.store.findOneBy(User, { firstName: "Timber" })
```

**`findOneOrFail`**

Throws if nothing is found.

```ts
const timber = await ctx.store.findOneOrFail(User, {
    where: {
        firstName: "Timber",
    },
})
```

**`findOneByOrFail`** 

Throws if nothing is found.

```ts
const timber = await ctx.store.findOneByOrFail(User, { firstName: "Timber" })
```

### Find Operators

`find()` and `findXXX()` methods support the following operators:

- `In` (contains in array)
- `Not`
- `LessThan`
- `LessThanOrEqual`
- `MoreThan`
- `MoreThanOrEqual`
- `Like`
- `ILike`
- `Between`
- `Any`
- `IsNull`
- `Raw` (raw SQL fragments)

See the details and examples in the [TypeORM `FindOption` docs](https://typeorm.io/find-options#advanced-options).

#### Example

```ts
let accounts = await ctx.store.findBy(Account, {id: In([...accountIds])})
```

### Joining relations

To load an entity with relations, use `relations` field on the `find` options and specify which relations should be joined:

```ts
await ctx.store.find(User, {
    relations: {
        project: true,
    },
    where: {
        project: {
            name: "TypeORM",
            initials: "TORM",
        },
    },
})
```

See the [TypeORM docs](https://typeorm.io/find-options) sections for details. 


## `FullTypeormDatabase`

`FullTypeormDatabase` context store provides full access to the underlying database, including execution of arbitrary queries with `.query()`. The interface is identical to that of [TypeORM EntityManager](https://typeorm.io/entity-manager-api).

We recommend using `TypeormDatabase` store unless full access to the database is required.
