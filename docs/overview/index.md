---
sidebar_position: 1
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

At the moment, Subsquid maintains an Archive for the following networks:

- Ethereum
- Major Substrate chains, including Kusama, Polkadot, Moonriver, Moonbeam, Astar and Acala

Archives for the following networks will be rolled out in the future:

- Polygon
- Binance Smart Chain
- Arbitrum

## Squids

Squids have a certain structure and are supposed to be developed as regular node.js packages. 
Use the following templates as a reference:
- [EVM template](https://github.com/subsquid/squid-ethereum-template) for EVM-based chains
- [Substrate template](https://github.com/subsquid/squid-substrate-template) for Substrate-based chains
- [EVM-Frontier template](https://github.com/subsquid/https://github.com/subsquid/squid-frontier-evm-template) for Substrate-based Frontier EVM chains.

A typical squid implements both data mapping and a GraphQL API server, which presents the data. The Subsquid framework provides an extensive set of tools for developing squids:

- A squid processor is tasked with fetching on-chain data from an archive and executing user-defined mapping code against it. It offers batching and fine-grained data selection interfaces to minimize database roundtrips and optimize archive data fetching. The Squid SDK currently provides two different implementation of a squid processor: `@subsquid/evm-processor` for EVM chains and `@subsquid/substrate-processor` for Substrate-based chains.
- [`substrate-typegen`](https://github.com/subsquid/squid/tree/master/substrate-typegen) and [`evm-typegen`](https://github.com/subsquid/squid/tree/master/evm-typegen) generate TypeScript facade classes for substrate and EVM log and tx data. 
- [`typeorm-codegen`](https://github.com/subsquid/squid/tree/master/typeorm-codegen) generates entity classes from a declarative [schema file](/develop-a-squid/schema-file). The entity classes are used by the squid to persist the transformed on-chain data into the target database.
- [`graphql-server`](https://github.com/subsquid/squid/tree/master/graphql-server) serves the data as a rich GraphQL API, generated from the schema file. These loosely follow the [OpenCRUD](https://www.opencrud.org/) standard and support all common filterings and selectors out-of-the box. They can also be extended with custom resolvers.
- [misc tools](https://github.com/subsquid/squid#other-tools) including a perfomant SCALE codec and ss58 decoder

## The Aquarium

Squids can be deployed to the Subsquid cloud service, called the [Aquarium](https://app.subsquid.io), free of charge. Go to the [Deploy Squid](/deploy-squid) section for more information.
