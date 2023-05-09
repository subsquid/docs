---
sidebar_position: 10
title: TypeormDatabase class
description: >-
  Optimized TypeORM-based store
---

# `TypeormDatabase` 

`TypeormDatabase` context store provides a wrapper over the [TypeORM `EntityManager`](https://typeorm.io/entity-manager-api) optimized for batch saving. It currently supports only Postgres-compatible databases and seamlessly integrates with entity classes generated from the [schema file](/basics/schema-file).

## Usage
 
```ts
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

processor.run(new TypeormDatabase(), async ctx => {
  // ...  
  await ctx.store.save([new FooEntity({ id: '1'}), new FooEntity({ id: '2'})])
})
``` 

In the snippet above, `ctx.store` passed to the handlers will be of type `Store`.


## Batch methods

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

## TypeORM methods

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

## Find Operators

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

### Example 

```ts
let accounts = await ctx.store.findBy(Account, {id: In([...accountIds])})
```

## Joining relations

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
