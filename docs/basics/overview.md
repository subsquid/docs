---
sidebar_position: 10
title: Subsquid overview
description: Squid SDK, squids, Archives and Aquarium
---

# Subsquid Overview

## What is Subsquid 

Subsquid is a full-stack blockchain indexing solution which includes an open-source SDK, specialized data lakes for on-chain data (Archives) and a hosted service (Aquarium). Subsquid solves the data access problem for a wide range of online and analytical use cases, including:

- A flexible and performant backend for decentralized applications. In most cases, Subsquid can completely replace client RPC read requests with a tailored GraphQL API, significantly reducing the infrastructure costs and shortening the frontend development cycles.
- A data pipeline for preparing, transforming and loading large volumes of on-chain data for data analysis and forensics.
- A highly customizable data source for dashboards and on-chain activity monitoring.

Subsquid is designed ground-up around batch processing in contrast to other block-based and event-based indexers. The batch-based programming model embraced by the Squid SDK boosts the indexing performance to 50k+ blocks per second.

## Architecture

The Subsquid indexing stack separates on-chain data ingestion (Archives) from data transformation and presentation (squids). 

Squid SDK indexing projects (or simply **squids**) are [Extract-Transform-Load-Query (ETLQ)](https://en.wikipedia.org/wiki/Extract,_transform,_load) projects built using the open-source [Squid SDK](https://github.com/subsquid/squid-sdk). Squids ingest historical on-chain data from Archive in batches and transform it with a user-defined data processor. After reaching the blockchain head, squids continuously ingest and process the new blocks in near real-time. The Squid SDK offers a built-in server to present the transformed data with a GraphQL API as well as customizable adapters for transactional databases (e.g. Postgres) and data lakes (e.g. s3). 

**Archives** are specialized data lakes optimized for extracting and filtering large volumes of raw on-chain data in batches. Until fully decentralized, Subsquid Labs maintains public Archive endpoints and offers batch access via the Squid SDK free of charge. A full list of Archive endpoints for the supported EVM and Substrate networks is available in this [repo](https://github.com/subsquid/archive-registry) and is published as a package [`@subsquid/archive-registry`](https://www.npmjs.com/package/@subsquid/archive-registry) for easy access.

Squids can be run locally, on-premises or deployed to the [Aquarium hosted service](/deploy-squid). 

![Subsquid ecosystem](</img/subsquid-ecosystem.png>)

## Squid SDK

Squid SDK is a set of tools and libraries to efficiently query the Archive data, transform, enrich and persist into the target store. Squid SDK projects are called **squids**.

![Squid SDK](</img/archive-and-sdk.png>)

Squids have a certain structure and are supposed to be developed as regular node.js packages. Use [`sqd init`](/squid-cli/init) command to scaffold a new squid project from a suitable template.

A squid project consists of a long-running `processor` service fetching and transforming the data from an archive and an optional `api` service presenting the transformed data with a GraphQL API generated from `schema.graphql`. 

![Squid](</img/squid-diagram.png>)

The [Squid SDK](https://github.com/subsquid/squid-sdk) offers an extensive set of tools for developing squids:

- Core classes for the `processor` service: [`EvmBatchProcessor`](/evm-indexing) for EVM chains and [`SubstrateBatchProcessor`](/substrate-indexing) for Substrate-based chains.
- The `sqd-typeorm-codegen` tool for generating TypeORM entities from `schema.graphql`. See [schema file and codegen](/basics/schema-file).
- Tools for generating type-safe facade classes for decoding on-chain data. See [typegen](/glossary/#typegen).
- [`graphql-server`](https://github.com/subsquid/squid/tree/master/graphql-server) is the backend for the GraphQL API served by the `api` service. The GraphQL schema is auto-generated from `schema.graphql`. The resulting API loosely follows the [OpenCRUD](https://www.opencrud.org/) standard and supports the most common query filters and selectors out-of-the box. See the [GraphQL API section](/graphql-api) for more details and configuration options.



## Aquarium Hosted Service

Squids can be deployed to the Subsquid cloud service, called the [Aquarium](https://app.subsquid.io), free of charge. The deployment of the squid services to the Aquarium (see below) is managed by the [`squid.yaml` manifest](/deploy-squid/deploy-manifest). Go to the [Deploy Squid](/deploy-squid) section for more information.

## What's next?

- Follow the [Quickstart](/quickstart) to build your first squid
- Explore [Examples](/examples)
- Learn how to [migrate from The Graph](/migrate/migrate-subgraph)
- Dive deeper into [EVM Indexing](/evm-indexing) and [Substrate Indexing](/substrate-indexing)
- Explore the [GraphQL API options](/graphql-api) including custom extensions, caching and DoS protection in production
