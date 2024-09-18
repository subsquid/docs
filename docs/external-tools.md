---
title: External tools
description: >-
  Third party tools and extensions
sidebar_position: 90
---

# External tools

## `@belopash/typeorm-store`

[`@belopash/typeorm-store`](https://github.com/belopash/squid-typeorm-store) is a [fork](/sdk/resources/persisting-data/overview/#custom-database) of [`@subsquid/typeorm-store`](/sdk/reference/store/typeorm) that automates collecting read and write database requests into [batches](/sdk/resources/batch-processing) and caches the available entity records in RAM. Unlike the [standard `typeorm-store`](/sdk/resources/persisting-data/typeorm), @belopash's store is intended to be used with declarative code: it makes it easy to write mapping functions (e.g. event handlers) that explicitly define

 - what data you're going to need from the database
 - what code has to be executed once the data is available
 - how to save the results

Data dependencies due to [entity relations](/sdk/reference/schema-file/entity-relations) are handled automatically, along with the caching of intermediate resultsg and in-memory batching of database requests.

See [this repository](https://github.com/subsquid-labs/belopash-typeorm-store-example) for a minimal example.

## DipDup

[DipDup](https://dipdup.io) is a Python indexing framework that can use [SQD Network](/subsquid-network) as a data source. It offers

* SQLite, PostgreSQL and TimescaleDB data sinks
* GraphQL APIs based on Hasura

Development workflow uses the `dipdup` tool to generate a stub project. Once done with that, all you have to do is to define the data schema and the handlers. Take a look at their [quickstart](https://dipdup.io/docs/quickstart-evm) for more details.

With its handler-based architecture and the choice of Python as the transform logic language, DipDup is easier to develop for than [Squid SDK](/sdk), but has higher requirements on database IO bandwith and CPU. The IO bandwidth issue is partially solved by DipDup's caching layer used for database access.
