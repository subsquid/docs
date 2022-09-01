---
sidebar_position: 30
---

# Schema updates

This section describes how to update the squid schema in development and in production. All database changes are applied through migration files located at `db/migrations`. The `squid-typeorm-migration(1)` tool provides several commands to drive the process.

It is all [TypeORM](https://typeorm.io/#/migrations) under the hood.

```bash
# Connect to database, analyze its state and generate migration to match the target schema.
# The target schema is derived from entity classes generated earlier.
# Don't forget to compile your entity classes beforehand!
npx squid-typeorm-migration generate

# Create template file for custom database changes
npx squid-typeorm-migration create

# Apply database migrations from `db/migrations`
npx squid-typeorm-migration apply

# Revert the last performed migration
npx squid-typeorm-migration revert         
```


## Drop-create

In most cases the simplest way to update the schema is to drop the database and regenerate the migrations from scratch.

**1. Update `schema.graphql`**

**2. Regenerate the model classes and build the squid with**
```bash
make codegen
make build
```

**3. Recreate the database and remove the old migrations**
```bash
make down
rm -rf db/migrations/*.js
make up
```

**4. Create the new database migration**
```bash
npx squid-typeorm-migration generate
```

**5. Apply the database migration**
```bash
make migrate
```

## Updating a deployed squid schema

In some rare cases it is possible to update the schema without dropping the database and restarting the squid from a blank state. The most important case is adding an index to an entity field. More complex changes are usually not feasible.

** 1. Update `schema.graphql` ** 

For example, [add an index](/develop-a-squid/schema-file/indexes-and-constraints)

**2. Regenerate the model classes **

```bash
make codegen
make build
```

**3. Create new database migration**

Make sure the local database is running.

```bash
npx squid-typeorm-migration generate
```

**4. Apply the database migration**

Inspect the new migration in `db/migrations` and apply it:

```bash
make migrate
```

**5. Update the squid in Aquairum**

If the squid is deployed to Aquarium, [update the deployed version](/deploy-squid/update-and-kill).
