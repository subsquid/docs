---
sidebar_position: 30
description: Define db migrations and init scripts
---

# Database migrations

Database migrations and setup scripts must be located in the reserved folder `db/migrations`. 

## TypeORM migrations

The Squid SDK offers first-class support for [TypeORM-based database migrations](https://orkhan.gitbook.io/typeorm/docs/migrations) with the `squid-typeorm-migration(1)` tool.
The tool auto-generates the schema migrations from the TypeORM entities created by [codegen](/basics/schema-file) so that custom migration scripts are rarely needed.

To inspect the available options, run

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
make codegen
make build
```

**3. Recreate the database and remove the old migrations**
```bash
# drop the database
make down
# wipe out old migrations
rm -rf db/migrations/*.js
# start a blank database
make up
```
Note, that without dropping the database the next step will generate a migration only for the schema difference.

**4. Create the new database migration**
```bash
# generate new scripts in db/migrations
npx squid-typeorm-migration generate
```

**5. Apply the database migration**
```bash
# apply the migrations
npx squid-typeorm-migration apply
```

## Aquarium deployment

By default, the TypeORM migrations are automatically applied by Aquarium with the command `npx squid-typeorm-migration apply` before the squid services are started. For custom behavior, one can override the migration script using the optional `migrate:` section of [squid.yaml](/deploy-squid/deploy-manifest#deploy).

:::info
To force Aquarium to reset the database and start with a blank state after a schema change, use the `--hard-reset` flag of [sqd deploy](/squid-cli/deploy).
:::
