---
sidebar_position: 10
title: typeorm-store
description: >-
  Optimized TypeORM-based store
---

# `@subsquid/typeorm-store`

This page describes the interface of the classes from the `@subsquid/typeorm-store` NPM package. If you're looking for a guide on saving squid data to databases and the related workflows, check out the [Saving to PostgreSQL](/sdk/resources/persisting-data/typeorm) page.

## `TypeormDatabase` constructor arguments

The argument of the `TypeormDatabase` class constructor may have the following fields:
* `stateSchema: string`: the name of the [database schema](https://www.postgresql.org/docs/current/sql-createschema.html) that the processor uses to persist its status (hash + height of the highest reached block). Useful for making sure that each processor uses its own state schema when running multiple processors against the same database (e.g. in a multichain setting). Default: `'squid_processor'`.
* `isolationLevel: 'SERIALIZABLE' | 'READ COMMITTED' | 'REPEATABLE READ'`: sets the [transaction isolation level](https://www.postgresql.org/docs/current/transaction-iso.html) of processor transactions. Default: `'SERIALIZABLE'`.
* `supportHotBlocks: boolean`: controls the support for hot blocks. Necessary in all squids that must be able to handle short-lived [blockchain forks](https://en.wikipedia.org/wiki/Fork_(blockchain)). That includes all squids that index chain data in near-real time using RPC endpoints. Default: `true`.
* `projectDir: string`: the folder where `TypeormDatabase` will look for the TypeORM model definition (at `lib/model`) and for migrations (at `db/migrations`). Default: `process.cwd()`.

## `Store` interface

### Batch access methods

#### **`upsert(e: E | E[])`** {#upsert}

Upsert a single or multiple entities to the database. **Does not cascade the upsert to the relations.**

```ts
await ctx.store.upsert([new User({id: 'Bob'}), new User({id: 'Alice'}))])
```

#### **`save(e: E | E[])`** {#save}

Deprecated alias for [`upsert()`](#upsert).

#### **`insert(e: E | E[])`** {#insert}

Inserts a given entity or entities into the database. Does not check if the entity(s) exist in the database and will fail if a duplicate is inserted. Executes a primitive INSERT operation **without cascading to the relations**.

```ts
await ctx.store.insert([new User({id: 'Bob'}), new User({id: 'Alice'}))])
```

#### **`remove(e: E | E[] | EntityClass<E>, id?: string | string[])`** {#remove}

Deletes a given entity or entities from the database. Accepts either an object or an entity ID(s). **Does not cascade the deletion**.

```ts
await ctx.store.remove(User, ['Alice', 'Bob'])
```

### TypeORM methods

For details see [TypeORM EntityManager reference](https://typeorm.io/entity-manager-api).

#### **`get`**

Get an entity by ID.

```ts
await ctx.store.get(User, 'Bob')
```

#### **`count`**

Count the number of entities matching a where filter.

```ts
await ctx.store.count(User, {
    where: {
        firstName: "Timber",
    },
})
```

#### **`countBy`**

Count the number of entities matching a filter.

```ts
await ctx.store.countBy(User, { firstName: "Timber" })
```

#### **`find`**

Return a list matching a where filter.

```ts
await ctx.store.find(User, {
    where: {
        firstName: "Timber",
    },
})
```

#### **`findBy`**

Return a list matching a filter.

```ts
let accounts = await ctx.store.findBy(Account, {id: In([...accountIds])})
```

#### **`findOne`**

Return the first entity matching a where filter.

```ts
const timber = await ctx.store.findOne(User, {
    where: {
        firstName: "Timber",
    },
})
```

#### **`findOneBy`**

Return the first entity matching a filter.

```ts
const timber = await ctx.store.findOneBy(User, { firstName: "Timber" })
```

#### **`findOneOrFail`**

Throws if nothing is found.

```ts
const timber = await ctx.store.findOneOrFail(User, {
    where: {
        firstName: "Timber",
    },
})
```

#### **`findOneByOrFail`**

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

## Database connection parameters

Database credentials must be supplied via the environment variables:

* `DB_HOST` (default `localhost`)
* `DB_PORT` (default `5432`)
* `DB_NAME` (default `postgres`)
* `DB_USER` (default `postgres`)
* `DB_PASS` (default `postgres`)
* `DB_SSL` (default `false`)
* `DB_SSL_REJECT_UNAUTHORIZED` (default `true`)
* `DB_URL` (default `undefined`, see the [DB_URL section](#db_url))

:::info
When deploying to [Cloud](/cloud) with the [Postgres addon](/cloud/reference/pg) enabled in the [manifest](/cloud/reference/manifest), any user-supplied values are overwritten for most of these variables. See [Variable shadowing](/cloud/reference/pg/#variable-shadowing).
:::

`typorm-store` also supports the following variables for connecting to databases that require client-side SSL:

* `DB_SSL_CA` - the root certificate in plain text
* `DB_SSL_CA_FILE` - path to a root certificate file
* `DB_SSL_CERT` - client certificate in plain text
* `DB_SSL_CERT_FILE` - path to client certificate in plain text
* `DB_SSL_KEY` - client key in plain text
* `DB_SSL_KEY_FILE` - path to client key in plain text

:::tip
In case you're deploying to [Cloud](/cloud) you can set [secrets](/cloud/resources/env-variables/#secrets) to the contents of any given file via stdin:
```bash
sqd secrets set DB_SSL_CA < ca.crt
```
:::

### `DB_URL`

When set, `DB_URL` takes precedence over all individual variables. Its format is as follows:
```
postgres[ql]://[username[:password]@][host[:port]]/database[?parameter_list]
```
where `parameter_list` is an `&`-separated list of assignments of SSL connection parameters:
* `ssl=(0|1|true|false)`
* `sslmode=(disabled|no-verify|prefer|require|verify-ca|verify-full)`
* `sslcert=<path_to_cert_file>`
* `sslkey=<path_to_key_file>`
* `sslrootcert=<path_to_root_cert_file>`

When any value is omitted from the URL, the value of the corresponding individual `DB_*` variable will be used instead. If that is not set, the default will be used.
