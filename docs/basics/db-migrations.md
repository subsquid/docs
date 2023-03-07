---
sidebar_position: 30
description: Define db migrations and init scripts
---

# Database migrations

Database migrations and setup scripts must be located in the reserved folder `db/migrations`. 

## TypeORM migrations

The Squid SDK offers first-class support for [TypeORM-based database migrations](https://typeorm.io/migrations) with the `squid-typeorm-migration(1)` tool.
The tool auto-generates the schema migrations from the TypeORM entities created by [codegen](/basics/schema-file) so that custom migration scripts are rarely needed.

Most use cases of the tool are covered by the pre-defined `sqd` commands that wrap around `squid-typeorm-migration`. From `sqd --help`:

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

**2. Regenerate the TypeORM entity classes and build the squid with**
```bash
# generate entites from the schema file
sqd codegen
sqd build
```

**3. Recreate the database and remove the old migrations**
```bash
# drop the database
sqd down
# wipe out old migrations
sqd migration:clean
# start a blank database
sqd up
```
Note that without dropping the database the next step will generate a migration only for the schema difference.

**4. Create the new database migration**
```bash
# generate new scripts in db/migrations
sqd migration:generate
```

**5. Apply the database migration**
```bash
# apply the migrations
sqd migration:apply
```

## Updating a deployed squid schema

In some rare cases it is possible to update the schema without dropping the database and restarting the squid from a blank state. The most important case is adding an index to an entity field. More complex changes are usually not feasible.

**1. Update `schema.graphql` ** 

For example, [add an index](/basics/schema-file/indexes-and-constraints)

**2. Regenerate the model classes **

```bash
sqd codegen
sqd build
```

**3. Create new database migration**

Make sure the local database is running.

```bash
sqd up
sqd migration:generate
```

**4. Apply the database migration**

Inspect the new migration in `db/migrations` and apply it:

```bash
sqd migration:apply
```

**5. Update the squid in Aquairum**

If the squid is deployed to Aquarium, [update the deployed version](/squid-cli/deploy).

## Aquarium deployment

By default, the TypeORM migrations are automatically applied by Aquarium with the command `npx squid-typeorm-migration apply` before the squid services are started. For custom behavior, one can override the migration script using the optional `migrate:` section of [squid.yaml](/deploy-squid/deploy-manifest#deploy).

:::info
To force Aquarium to reset the database and start with a blank state after a schema change, use the `--hard-reset` flag of [sqd deploy](/squid-cli/deploy).
:::
