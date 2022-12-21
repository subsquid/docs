---
sidebar_position: 10
description: Introducing Subsquid, an on-chain data indexing framework and platform for serverless Web3 APIs.
---

# Overview

## Design

The Subsquid services stack separates data ingestion (Archives) from data transformation and presentation (squids). 
**Archives** ingest and store raw blockchain data in a normalized way. 

**Squids** are [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) projects that ingest historical on-chain data from Archives, transforming it according to user-defined data mappers. Squids are typically configured to present this data as a GraphQL API.  

## Archives

Archives allow squids to ingest data in batches spanning multiple blocks. These 'pre-indexers' significantly decrease indexing times while keeping squids lightweight.

See the [Archives](/archives/) section for more information on how to use public Archives or to learn how to run an Archive locally. 

At the moment, Subsquid maintains Archives for the following networks:

- Major EVM chains, including Ethereum, Polygon, Binance Smart Chain, Fantom, Arbitrum. See the full list [here](/develop-a-squid/evm-processor/configuration).
- Substrate chains, including parachains on Kusama and Polkadot. Additionally, Substrate Archives support EVM and Ink! smart contracts deployed to Moonbeam/Moonriver, Acala, Astar/Shiden, Gear, Aleph Zero.

## Squids

Squids have a certain structure and are supposed to be developed as regular node.js packages. Use [`sqd init`](/squid-cli/init) command to scaffold a new squid project from a suitable template.

Normally a squid project consists of a long-running `processor` service fetching and transforming the data from an archive and a `api` service exposing the transformed data with an GraphQL API generated from `schema.graphql`. 

The `processor` service is defined in `src/processor.ts` by default. Target data sink for the `processor` may include a Postgres compatible database, S3 buckets, BigQuery or a custom store. The `api` service is an independent node.js process and is optional. 

The deployment of the squid services to the Aquarium (see below) is managed by the [`squid.yaml` manifest](/deploy-squid/deploy-manifest).

The Open Source [Squid SDK](https://github.com/subsquid/squid-sdk) offers an extensive set of tools for developing squids:

- Core classes for the `processor` service: [`EvmBatchProcessor`](/develop-a-squid/evm-processor) for EVM chains and [`SubstrateBatchProcessor`](/develop-a-squid/substrate-processor) for Substrate-based chains.
- [`evm-typegen`](/develop-a-squid/typegen/squid-evm-typegen), [`substrate-typegen`](/develop-a-squid/typegen/squid-substrate-typegen) and [`ink-typegen`](https://github.com/subsquid/squid-sdk/tree/master/substrate/ink-typegen) tools for generating TypeScript facade classes for type-safe decoding of EVM, Substrate and Ink! smart contract data. 
- [`typeorm-codegen`](https://github.com/subsquid/squid-sdk/tree/master/typeorm/typeorm-codegen) generates entity classes from a declarative [schema file](/develop-a-squid/schema-file) defined by the squid developer. The entity classes define the schema of the target database and the GraphQL API.
- [`graphql-server`](https://github.com/subsquid/squid/tree/master/graphql-server) is the backend for the GraphQL API served by the `api` service. The GraphQL schema is auto-generated from `schema.graphql`. The resulting API loosely follows the [OpenCRUD](https://www.opencrud.org/) standard and supports the most common query filters and selectors out-of-the box. See [the GraphQL API section](/develop-a-squid/graphql-api) for more details and the configuration options.

## The Aquarium

Squids can be deployed to the Subsquid cloud service, called the [Aquarium](https://app.subsquid.io), free of charge. Go to the [Deploy Squid](/deploy-squid) section for more information.
