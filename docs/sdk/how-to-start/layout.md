---
sidebar_position: 40
title: Project structure
description: The folder layout of a squid project
---

# Squid project structure

A squid is expected to follow the folder structure conventions listed below.

- `/db` -- **(Required)** The designated folder with the [database migrations](/sdk/resources/persisting-data/typeorm).
- `/lib` -- The output folder for the compiled squid code.
- `/src` -- **(Required)** The source folder for the squid processor.
   + `/src/main.ts` -- The entry point of the squid processor process. Typically, contains a `processor.run()` call.
   + `/src/processor.ts` -- Processor object ([EVM](/sdk) or [Substrate](/sdk)) definition and configuration.
   + `/src/model/generated` -- The folder for the TypeORM entities generated from `schema.graphql`.
   + `/src/model` -- The module exporting the entity classes.
   + `/src/server-extension/resolvers` -- An (optional) folder for [user-defined GraphQL resolvers](/sdk/resources/graphql-server/custom-resolvers).
   + `/src/types` -- An (optional) output folder for the [typegen](/sdk/resources/tools/typegen/)-generated types for data decoding.
   + `/src/abi` -- An (optional) output folder for the [typegen](/sdk/resources/tools/typegen/) tools that generate type definitions and the data decoding boilerplate.
- `/assets` -- (optional) A designated folder for custom user-provided files (e.g. static data files to seed the squid processor with).
- `/abi` -- (optional) A designated folder for JSON ABI files used as input by the [EVM typegen](/sdk/resources/tools/typegen/) when it's called via `sqd typegen`.
- `schema.graphql` -- **(Required for GraphQL API)** [The schema definition file](/sdk/reference/schema-file).
- `squid.yaml` -- **(Required)** A manifest file for deploying the squid to Subsquid Cloud and running it locally with [`sqd run`](/squid-cli/run). See [Deployment manifest](/cloud/reference/manifest) for details.
- `docker-compose.yml` -- A Docker compose file for local runs. Has a Postgres service definition by default. Ignored by Subsquid Cloud.
- `.env` -- Defines environment variables used by `docker-compose.yml` and when the squid is run locally. Ignored by Subsquid Cloud.
- `typegen.json` -- (optional) The config file for `sqd typegen`. Ignored by Subsquid Cloud.
- `commands.json` -- User-defined scripts picked up by [Squid CLI](/squid-cli). See also the [CLI cheatsheet](/sdk/how-to-start/cli-cheatsheet/).
- `tsconfig.json`, `package-lock.json`, `package.json` -- **(Required)** The `npm` and `tsc` configs.

