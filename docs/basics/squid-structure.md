---
sidebar_position: 20
title: Squid structure
description: The folder layout of a squid
---

# Squid structure

A squid is expected to follow the folder structure conventions listed below.

- `/db` -- **(Required)** The designated folder with the [database migrations](/store/postgres/db-migrations).
- `/lib` -- The output folder for the compiled squid code.
- `/src` -- **(Required)** The source folder for the squid processor.
   + `/src/main.ts` -- The entry point of the squid processor process. Typically contains a `processor.run()` call.
   + `/src/processor.ts` -- Processor object ([EVM](/evm-indexing) or [Substrate](/substrate-indexing)) definition and configuration.
   + `/src/model/generated` -- The folder for the TypeORM entities generated from `schema.graphql`.
   + `/src/model` -- The module exporting the entity classes.
   + `/src/server-extension/resolvers` -- An (optional) folder for [user-defined GraphQL resolvers](/graphql-api/custom-resolvers).
   + `/src/types` -- An (optional) output folder for typescript definitions of the Substrate data generated with [`squid-substrate-typegen`](/firesquid/substrate-indexing/squid-substrate-typegen).
   + `/src/abi` -- An (optional) output folder for the [EVM typegen](/evm-indexing/squid-evm-typegen) and [WASM typegen](https://github.com/subsquid/squid-sdk/tree/master/substrate/ink-typegen) tools that generate type definitions and the decoding boilerplate.
- `/assets` -- (optional) A designated folder for custom user-provided files (e.g. static data files to seed the squid processor with).
- `/abi` -- (optional) A designated folder for JSON ABI files used as input by the [EVM typegen](/evm-indexing/squid-evm-typegen) when it's called via `sqd typegen`.
- `schema.graphql` -- **(Required for GraphQL API)** [The schema definition file](/store/postgres/schema-file).
- `squid.yaml` -- **(Required)** A manifest file for deploying the squid to Aquarium. See [Deployment manifest](/deploy-squid/deploy-manifest) for details.
- `docker-compose.yml` -- A Docker compose file for local runs. Has a Postgres service definition by default. Ignored by Aquarium.
- `.env` -- Defines environment variables used by `docker-compose.yml` and when the squid is run locally. Ignored by Aquarium.
- `typegen.json` -- (optional) The config file for `squid-substrate-typegen`. Ignored by Aquarium.
- `Makefile` -- (optional) Script definitions for `Make`. Ignored by Aquarium.
- `tsconfig.json`, `package-lock.json`, `package.json` -- **(Required)** The `npm` and `tsc` configs.
- `/archive` -- An (optional) folder for running a local Archive. Ignored by Aquarium.

The templates also define the following auxiliary scripts (optional):
- `build` to build the squid.
- `update` to update the squid packages to the latest version.

[//]: # (!!!! Update the /firesquid link above once ArrowSquid for Substrate is released)
