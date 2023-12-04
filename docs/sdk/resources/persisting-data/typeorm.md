---
sidebar_position: 10
title: Saving to PostgreSQL
description: >-
  Working with TypeORM-compatible DBs
---

# Saving to PostgreSQL and compatible databases

`TypeormDatabase` context store provides a wrapper over the [TypeORM `EntityManager`](https://typeorm.io/entity-manager-api) optimized for batch saving. It currently supports only Postgres-compatible databases and seamlessly integrates with entity classes generated from the [schema file](/sdk/reference/schema-file).

Check out [this section of the reference page](/sdk/reference/store/typeorm/#database-connection-parameters) to learn how to specify the database connection parameters.

## Usage
 
```ts
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { FooEntity } from './model'

const dbOptions = {/* ... constructor options ... */}

processor.run(new TypeormDatabase(dbOptions), async ctx => {
  // ...  
  await ctx.store.upsert([new FooEntity({ id: '1'}), new FooEntity({ id: '2'})])
})
```
Here,
 * `FooEntity` represents a TypeORM entity class. In squids, these are typically generated from [schema files](/sdk/reference/schema-file) with [squid-typeorm-codegen](/sdk/reference/schema-file/intro/#typeorm-codegen).
 * `TypeormDatabase` constructor options govern the behavior of the class at the highest level. They are described in [this section of the reference](/sdk/reference/store/typeorm/#typeormdatabase-constructor-arguments).
 * `ctx.store` is of type `Store`. See the [`Store` interface](/sdk/reference/store/typeorm/#store-interface) section of the reference page for more details.

## Database migrations

The Squid SDK manages the database schema with [TypeORM-based database migrations](https://typeorm.io/migrations) by means of the `squid-typeorm-migration(1)` tool.
The tool auto-generates the schema migrations from the TypeORM entities created by [codegen](/sdk/reference/schema-file/intro/#typeorm-codegen), so that custom migration scripts are rarely needed.

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

### Updating after schema changes

In most cases the simplest way to update the schema is to drop the database and regenerate the migrations from scratch.

**1. Update schema.graphql**

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

**5. Apply the database migration**
```bash
sqd migration:apply
```
If you skip this step the migrations will be applied automatially when you start the processor with `sqd process`.

### Updating a deployed squid schema

In some rare cases it is possible to update the schema without dropping the database and restarting the squid from a blank state. The most important case is adding an index to an entity field. More complex changes are usually not feasible.

**1. Update schema.graphql** 

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

### Subsquid Cloud deployment

By default, the TypeORM migrations are automatically applied by Cloud with the command `npx squid-typeorm-migration apply` before the squid services are started. For custom behavior, one can override the migration script using the optional `migrate:` section of [squid.yaml](/cloud/reference/manifest#deploy).

:::info
To force Cloud to reset the database and start with a blank state after a schema change, use the `--hard-reset` flag of [sqd deploy](/squid-cli/deploy).
:::
