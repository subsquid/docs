---
sidebar_position: 50
title: TypeORM migration generation
description: Generate TypeORM models from a schema file
---

# TypeORM migration generation

The [`typeorm-migration`](https://github.com/subsquid/squid-sdk/tree/master/typeorm/typeorm-migration) tool is used
to generate, apply and revert database migrations. It follows the conventions:

* The migrations are generated in the `db/migrations` folder.
* The database connection is inferred from the `DB_XXX` environment variables.
* All entities should be exported from `lib/model` commonjs module, i.e. the entity classes must be compiled from TypeScript.

Normally, the tool is invoked using CLI aliases defined in `commands.json`:

```
sqd migration:apply             apply pending migrations
sqd migration:generate          generate the migration for the schema defined in schema.graphql
sqd migration:clean             clean the db/migrations folder
```