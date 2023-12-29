---
title: External tools
description: >-
  Third party tools and extensions
sidebar_position: 90
---

# External tools

## `@belopash/typeorm-store`

[`@belopash/typeorm-store`](https://github.com/belopash/squid-typeorm-store) is a [fork](/sdk/resources/persisting-data/overview/#custom-database) of [`@subsquid/typeorm-store`](/sdk/reference/store/typeorm) that automates collecting read and write database requests into [batches](/sdk/resources/basics/batch-processing) and caches the available entity records in RAM. See [this repository](https://github.com/subsquid-labs/belopash-typeorm-store-example) for a minimal example.

## DipDup

[DipDup](https://dipdup.io) is a Python indexing framework that can use [Subsquid Network](/subsquid-network) as a data source. It offers

* SQLite, PostgreSQL and TimescaleDB data sinks
* GraphQL APIs based on Hasura

Development workflow uses the `dipdup` tool to generate a stub project. Once done with that, all you have to do is to define the data schema and the handlers. Take a look at their [quickstart](https://dipdup.io/docs/quickstart-evm) for more details.
