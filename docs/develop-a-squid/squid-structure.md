---
sidebar_position: 10
title: Squid structure
---

# Squid structure

A squid is expected to follow the folder structure with the following conventions:

- `/db` -- a designated folder with the database migrations
- `/lib` -- the output folder for the compiled sources 
- `/src` -- a source folder for the squid processor
   + `/src/processor.ts` -- the entry point to run the [squid processor](/develop-a-squid/substrate-processor)
   + `/src/model` -- a typescript module for the entity classes 
   + `/src/model/generated` -- a folder for the TypeORM entities generated from `schema.graphql`
   + `/src/server-extension/resolvers` -- an (optional) folder for [user-defined GraphQL resolvers](/develop-a-squid/graphql-api/custom-resolvers)
   + `/src/types` -- an (optional) output folder for typescript definitions of the Substrate data generated with [`squid-substrate-typegen`](/develop-a-squid/typegen/squid-substrate-typegen)
   + `/src/abi` -- an (optional) output folder for the [EVM typegen](/develop-a-squid/typegen/squid-evm-typegen) or [WASM typegen](/develop-a-squid/typegen/squid-wasm-typegen) tools that generate type definitions and the decoding boilerplate
- `/assets` -- a designated folder for custom user-provided files (e.g. static data files for the seed data to the squid processor)
- `schema.graphql` -- [the schema definition file](/develop-a-squid/schema-file)
- `Dockerfile` -- a Docker build file used both for local Docker builds and for Aquarium deployments. See [Run in Docker](/run-squid/run-in-docker)
- `docker-compose.yml` -- a Docker compose file for local runs. Has a Postgres service definition by default. Ignored by Aquarium.
- `.env` -- defines environment variables for `docker-compose.yml`, and local processor and API server runs. Ignored by Aquarium
- `typegen.json` -- (optional) config file for `squid-substrate-typegen`. Ignored by Aquarium.
- `Makefile` -- (optional) script definitions for `Make`. Ignored by Aquarium.
- `tsconfig.json`, `package-lock.json`, `package.json` -- standard configs for a typescript-based node.js project
- `archive` -- an (optional) folder for running a local Archive. Ignored by Aquarium.

Further, the following scripts must be defined in `package.json`:
- `db:migrate` to run the database migrations. This script is run in a separate init container when the squid is deployed to the Aquarium.
- `processor:start` to start the processor
- `query-node:start` to start the [API server](/develop-a-squid/graphql-api)

The templates also defines the following auxiliary scripts (optional):
- `build` to build the squid
- `update` to update the squid packages to the latest version
