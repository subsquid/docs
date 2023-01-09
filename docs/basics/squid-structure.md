---
sidebar_position: 10
title: Squid structure
---

# Squid structure

A squid is expected to follow the folder structure with the following conventions.

- `/db` -- **(Required)** The designated folder with the database migrations
- `/lib` -- The output folder for the compiled sources 
- `/src` -- **(Required)** The source folder for the squid processor
   + `/src/processor.ts` -- The entry point to run the [squid processor](/develop-a-squid/substrate-processor)
   + `/src/model` -- The module exporting the entity classes 
   + `/src/model/generated` -- The folder for the TypeORM entities generated from `schema.graphql`
   + `/src/server-extension/resolvers` -- An (optional) folder for [user-defined GraphQL resolvers](/develop-a-squid/graphql-api/custom-resolvers)
   + `/src/types` -- An (optional) output folder for typescript definitions of the Substrate data generated with [`squid-substrate-typegen`](/develop-a-squid/typegen/squid-substrate-typegen)
   + `/src/abi` -- An (optional) output folder for the [EVM typegen](/develop-a-squid/typegen/squid-evm-typegen) or [WASM typegen](/develop-a-squid/typegen/squid-wasm-typegen) tools that generate type definitions and the decoding boilerplate
- `/assets` -- **(Required)** A designated folder for custom user-provided files (e.g. static data files to seed the squid processor)
- `schema.graphql` -- **(Required)** [The schema definition file](/develop-a-squid/schema-file)
- `squid.yaml` -- **(Required)** A manifest file for deploying the squid to Aquarium. See [Deploy squid](/deploy-squid) for details.
- `docker-compose.yml` -- A Docker compose file for local runs. Has a Postgres service definition by default. Ignored by Aquarium.
- `.env` -- Defines environment variables used by `docker-compose.yml`, and when the squid is run locally. Ignored by Aquarium
- `typegen.json` -- (optional) The config file for `squid-substrate-typegen`. Ignored by Aquarium.
- `Makefile` -- (optional) Script definitions for `Make`. Ignored by Aquarium.
- `tsconfig.json`, `package-lock.json`, `package.json` -- **(Required)** The `npm` and `tsc` configs.
- `archive` -- An (optional) folder for running a local Archive. Ignored by Aquarium.

Further, the following scripts must be defined in `package.json`:
- `db:migrate` to run the database migrations. This script is run in a separate init container when the squid is deployed to the Aquarium.
- `squid-etl:start` to start the processor
- `squid-node:start` to start the [API server](/develop-a-squid/graphql-api)

The templates also defines the following auxiliary scripts (optional):
- `build` to build the squid
- `update` to update the squid packages to the latest version
