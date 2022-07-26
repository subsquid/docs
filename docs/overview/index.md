---
sidebar_position: 1
description: Introducing Subsquid, an on-chain data indexing framework and platform for serverless Web3 APIs.
---

# Overview

## Design

The Subsquid services stack separates data ingestion (Archives) from data transformation and presentation (squids). 
**Archives** ingest and store raw blockchain data in a normalized way. 

<<<<<<< HEAD
**Squids** are [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) projects that ingest historical on-chain data from Archives, transforming it according to user-defined data mappers and presenting it as a GraphQL API.  
=======
**Squids** are [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) projects that ingest historical on-chain data from Archives, transforming it according to user-defined data mappers. Squids are typically configured to present this data as a GraphQL API.  
>>>>>>> 8b6f173 (fixed typos)

## Archives

Archives allow squids to ingest data in batches spanning multiple blocks. These 'pre-indexers' significantly decrease indexing times while keeping squids lightweight.

See the [Archives](/archives/) section for more information on how to use public Archives or to learn how to run an Archive locally. 

## Squids

Squids have a certain structure and are supposed to be developed as regular node.js packages. See [squid-template](https://github.com/subsquid/squid-template) for a reference.

<<<<<<< HEAD
A typical Squid implements both data mapping and a GraphQL API server presenting the data. The Subsquid framework provides an extensive set of tools for developing squids:

- [`substrate-processor`](https://github.com/subsquid/squid/tree/master/substrate-processor) fetches on-chain data from an archive and executes
user-defined mapping code against it. It offers batching and fine-grained data selection interfaces to minimize database roundtrips and optimize archive data fetching. 
- [`substrate-typegen`](https://github.com/subsquid/squid/tree/master/substrate-typegen) and [`substrate-evm-typegen`](https://github.com/subsquid/squid/tree/master/evm-typegen) generate TypeScript facade classes for substrate and EVM log data. It allows catching most of the data mapping bugs at compile time.
- [`typeorm-codegen`](https://github.com/subsquid/squid/tree/master/typeorm-codegen) generates entity classes from a declarative [schema file](/develop-a-squid/schema-spec)
- [`graphql-server`](https://github.com/subsquid/squid/tree/master/graphql-server) serves the data with a rich GraphQL API generated from the schema file. It loosely follows the [OpenCRUD](https://www.opencrud.org/) standard and supports all common filtering and selectors out-of-the box, together with an option to extend it with custom resolvers.
- [Misc substrate tools](https://github.com/subsquid/squid#other-tools) including a performant SCALE codec and ss58 decoder
=======
A typical Squid implements both data mapping and a GraphQL API server, which presents the data. The Subsquid framework provides an extensive set of tools for developing squids:

- [`substrate-processor`](https://github.com/subsquid/squid/tree/master/substrate-processor) is tasked with fetching on-chain data from an archive and executing user-defined mapping code against it. It offers batching and fine-grained data selection interfaces to minimize database roundtrips and optimize archive data fetching. 
- [`substrate-typegen`](https://github.com/subsquid/squid/tree/master/substrate-typegen) and [`substrate-evm-typegen`](https://github.com/subsquid/squid/tree/master/evm-typegen) generate TypeScript facade classes for substrate and evm log data. It allows to catch most of the data mapping bugs at compile time.
- [`typeorm-codegen`](https://github.com/subsquid/squid/tree/master/typeorm-codegen) generates entity classes from a declarative [schema file](./../develop-a-squid/define-a-squid-schema.md)
- [`graphql-server`](https://github.com/subsquid/squid/tree/master/graphql-server) serves the data as a rich GraphQL API, generated from the schema file. These loosely follow the [OpenCRUD](https://www.opencrud.org/) standard and support all common filterings and selectors out-of-the box. They can also be extended with custom resolvers.
- [misc substrate tools](https://github.com/subsquid/squid#other-tools) including a perfomant SCALE codec and ss58 decoder
>>>>>>> 8b6f173 (fixed typos)

## The Aquarium

Squids can be deployed to the Subsquid cloud service, called the [Aquarium](https://app.subsquid.io), free of charge. Go to the [Deploy Squid](/deploy-squid) section for more information.
