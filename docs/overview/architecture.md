---
description: Explaining the main components of a Subsquid Query Node
---

# Architecture

## Design

The Subsquid services stack separates data ingestion (archives) from data transformation and presentation (squids). 
**Archives** ingest and store raw blockchain data in a normalized way. 

**Squids** are [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) projects that ingest historical on-chain data from archives, transform it according to the user-defined data mappers and present it with a GraphQL API.  

Archives allow squids to ingest data in batches spanning multiple blocks, significantly improving the indexing time while keeping squids lightweight.

See [Archives Section](/docs/archives/) for more details, how to use public archives and how to run an archive locally. 


## Squid

Squids have a certain structure and are supposed to be developed as regular node.js packages. See [squid-template](https://github.com/subsquid/squid-template) for a reference.

A typical squid implements both data mapping and a GraphQL API server presenting the data. The Subsquid framework provides an extensive set of tools for developing squids:

- [`substrate-processor`](https://github.com/subsquid/squid/tree/master/substrate-processor) fetches on-chain data from an archive and executes
user-defined mapping code against it. It offers batching and fine-grained data selection interfaces to minimize database roundtrips and optimize archive data fetching. 
- [`substrate-typegen`](https://github.com/subsquid/squid/tree/master/substrate-typegen) and [`substrate-evm-typegen`](https://github.com/subsquid/squid/tree/master/evm-typegen) generate TypeScript facade classes for substrate and evm log data. It allows to catch most of the data mapping bugs at compile time.
- [`typeorm-codegen`](https://github.com/subsquid/squid/tree/master/typeorm-codegen) generates entity classes from a declarative [schema file](./../develop-a-squid/define-a-squid-schema.md)
- [`graphql-server`](https://github.com/subsquid/squid/tree/master/graphql-server) serves the data with a rich GraphQL API generated from the schema file. It loosely follows the [OpenCRUD](https://www.opencrud.org/) standard and supports all common filtering and selectors out-of-the box, together with an option to extend it with custom resolvers.
- [misc substrate tools](https://github.com/subsquid/squid#other-tools) including a perfomant SCALE codec and ss58 decoder


Squids can be [deployed](./../deploy-squid/) to a Subsquid cloud service called [Aquairum](https://app.subsquid.io). 

