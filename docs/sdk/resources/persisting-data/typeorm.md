---
sidebar_position: 10
title: TypeormDatabase class
description: >-
  Optimized TypeORM-based store
---

# `TypeormDatabase` 

`TypeormDatabase` context store provides a wrapper over the [TypeORM `EntityManager`](https://typeorm.io/entity-manager-api) optimized for batch saving. It currently supports only Postgres-compatible databases and seamlessly integrates with entity classes generated from the [schema file](/sdk/reference/schema-file).

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
---
sidebar_position: 50
description: Define db migrations and init scripts
---

# Database migrations

Database migrations and setup scripts must be located in the reserved folder `db/migrations`. 

## TypeORM migrations

The Squid SDK offers first-class support for [TypeORM-based database migrations](https://typeorm.io/migrations) with the `squid-typeorm-migration(1)` tool.
The tool auto-generates the schema migrations from the TypeORM entities created by [codegen](/sdk/reference/schema-file) so that custom migration scripts are rarely needed.

Most use cases of the tool are covered by `sqd` commands defined in `commands.json` of most templates that wrap around `squid-typeorm-migration`:

```bash
sqd migration:apply    Apply the DB migrations
sqd migration:generate Generate a DB migration matching the TypeORM entities
sqd migration:clean    Clean the migrations folder
```

To inspect the full list of available options, run

```bash
npx squid-typeorm-migration --help
```

To generate or update the migrations after a schema change, follow the steps below.

## Updating after schema changes

In most cases the simplest way to update the schema is to drop the database and regenerate the migrations from scratch.

**1. Update `schema.graphql`**

**2. Regenerate the TypeORM entity classes**
```bash
# generate entites code from the schema file
sqd codegen
```

**3. Recreate the database**
```bash
# drop the database
sqd down
# start a blank database
sqd up
```
Note that without dropping the database the next step will generate a migration only for the schema difference.

**4. Create the new database migration**
```bash
# builds the code,
# removes the old migrations and
# generates new scripts in db/migrations
sqd migration:generate
```

**5. (optional) Apply the database migration**
```bash
sqd migration:apply
```
If you skip this step the migrations will be applied automatially when you start the processor with `sqd process`.

## Updating a deployed squid schema

In some rare cases it is possible to update the schema without dropping the database and restarting the squid from a blank state. The most important case is adding an index to an entity field. More complex changes are usually not feasible.

**1. Update `schema.graphql` ** 

For example, [add an index](/sdk/reference/schema-file/indexes-and-constraints)

**2. Regenerate the model classes and build the code**

```bash
sqd codegen
sqd build
```

**3. Create a new database migration**

Make sure the local database is running.

```bash
sqd up
npx squid-typeorm-migration generate
```

**4. Apply the database migration**

Inspect the new migration in `db/migrations` and apply it:

```bash
sqd migration:apply
```

**5. Update the squid in Cloud**

If the squid is deployed to Subsquid Cloud, [update the deployed version](/squid-cli/deploy).

## Subsquid Cloud deployment

By default, the TypeORM migrations are automatically applied by Cloud with the command `npx squid-typeorm-migration apply` before the squid services are started. For custom behavior, one can override the migration script using the optional `migrate:` section of [squid.yaml](/cloud/reference/manifest#deploy).

:::info
To force Cloud to reset the database and start with a blank state after a schema change, use the `--hard-reset` flag of [sqd deploy](/squid-cli/deploy).
:::
---
sidebar_position: 60
title: External PostgreSQL
description: Supplying database credentials via env vars
---

# Using an external database

It is possible to use `TypeormDatabase` with non-local PostgreSQL. Credentials must be supplied via the environment variables:

* `DB_HOST` (default `localhost`)
* `DB_PORT` (default `5432`)
* `DB_NAME` (default `postgres`)
* `DB_USER` (default `postgres`)
* `DB_PASS` (default `postgres`)
* `DB_SSL` (SSL will not be used unless set to `true`)

`DB_SSL` sometimes does not suffice for connecting to SSL-only cloud databases. The workaround is to set `PGSSLMODE=require` in the [environment](/cloud/resources/env-variables).
