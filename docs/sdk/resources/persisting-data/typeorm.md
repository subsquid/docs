---
sidebar_position: 20
title: Saving to PostgreSQL
description: >-
  Working with TypeORM-compatible DBs
---

# Saving to PostgreSQL

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

Here are some useful commands:
```bash
npx squid-typeorm-migration apply # Apply the DB migrations
```
```bash
npx squid-typeorm-migration generate # Generate a DB migration matching the TypeORM entities
```
```bash
rm -r db/migrations # Clean the migrations folder
```

Inspect the full list of available options with

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
npx squid-typeorm-codegen
```

**3. Recreate the database**
```bash
# drop the database
docker compose down
```
```bash
# start a blank database
docker compose up -d
```
Note that without dropping the database the next step will generate a migration only for the schema difference.

**4. Build the squid code**
```bash
npm run build
```

**5. Recreate the database migration**
```bash
rm -r db/migrations
```
```bash
npx squid-typeorm-migration generate
```

**6. Apply the database migration**
```bash
npx squid-typeorm-migration apply
```

### Updating a deployed squid schema

In some rare cases it is possible to update the schema without dropping the database and restarting the squid from a blank state. The most important case is adding an index to an entity field. More complex changes are usually not feasible.

Updating a running squid requires that you add an incremental migration.

**1. Ensure that your local database is running and has the same schema as the database of your Cloud squid**

In most situations re-creating the database container and applying existing migrations should be enough:
```bash
docker compose down
docker compose up -d
npx squid-typeorm-migration apply
```

**2. Update schema.graphql**

For example, [add an index](/sdk/reference/schema-file/indexes-and-constraints)

**3. Regenerate the model classes and build the code**

```bash
npx squid-typeorm-codegen
npm run build
```

**4. Add a new database migration**

```bash
npx squid-typeorm-migration generate
```
This will create a new file in `db/migrations`. You may want to examine it before proceeding to the next step.

**5. Update the squid in Cloud**

If the squid is deployed to SQD Cloud, [update the deployed version](/squid-cli/deploy).

If you're self-hosting it, update your remote codebase and run
```bash
npx squid-typeorm-migration apply
```

### SQD Cloud deployment

By default, the TypeORM migrations are automatically applied by Cloud with the command `npx squid-typeorm-migration apply` before the squid services are started. For custom behavior, one can override the migration script using the optional `migrate:` section of [squid.yaml](/cloud/reference/manifest#deploy).

:::info
To force Cloud to reset the database and start with a blank state after a schema change, use the `--hard-reset` flag of [sqd deploy](/squid-cli/deploy).
:::
