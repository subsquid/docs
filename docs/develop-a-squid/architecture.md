---
description: Explaining the main components of a Subsquid Query Node
---

# Architecture

## Overview

Subsquid takes a multi-layered approach that separates raw data ingestion from data processing and presentation.

This is very useful for the vast majority of developers, as it adds a layer of abstraction, taking care of data ingestion and synchronization, and exposing decoded Substrate chain entities ([Events](substrate.md#events) and [Extrinsics](substrate.md#extrinsics), as well as entire Blocks), for developers to process.

The Squid data pipeline consists of two core components:

* **Archive**: data source, can be shared by multiple query nodes
* **Squid**: the data transformation part of the pipeline

![Squid and Archive are the main components](</img/.gitbook/assets/Squid_Architecture.png>)

An [Archive](architecture.md#squid-archive) can be thought of as a blockchain crawler, a data pipeline that systematically browses blockchains and that is operated by a decentralized network of squid archive node operators for the purpose of blockchain indexing.

In the context of a Squid query node, a Processor is responsible to get data from an Archive, transform it, and store it in the database.

The GraphQL Server is a separate web server providing a GraphQL API (more on the [official website](https://graphql.org)) for the entities in the data store.

### Archive

[Archives](architecture.md#squid-archive) should not be confused with [Archive nodes](https://wiki.polkadot.network/docs/maintain-sync#types-of-nodes), although the concept is vaguely similar, since both preserve the full blockchain history, without any pruning. The difference is that our Archives are special services, with specific endpoints, tailored for data retrieval.

An [Archive](architecture.md#squid-archive) is responsible for continuously ingesting raw data from the blockchain, process blocks, and save them in a database, along with [Events](substrate.md#events) and [Extrinsics](substrate.md#extrinsics), for easier access through GraphQL APIs. Its main purpose is to provide a service, to be a high-performance, higher level data source for Squid(s).

An Archive includes the following components and services:

* Substrate archive
* Postgres database
* Redis data storage
* Status service
* GraphQL Gateway

![Archive components diagram](</img/.gitbook/assets/Squid_Archive.png>)

Ultimately, the Substrate Archive extracts block information, [Events](substrate.md#events), and [Extrinsics](substrate.md#extrinsics), then writes them to a Postgres database, while the status updates are saved in a Redis key-value database. Archived data is available for clients' queries, thanks to a GraphQL server running as part of every Squid Archive node.

An Archive can be shared by multiple Squids, which means it is possible to segment how data is presented, based on the user's needs, without having to replicate the data source.

To launch your own Archive for a particular Blockchain, head over to [our dedicated page](../recipes/how-to-launch-a-squid-archive.md) on the topic.

### Squid

A Squid is a pipeline for transforming and presenting Substrate blockchain data. It consists of:

* **Processor**: each node has one processor but can have multiple if connected to multiple chains
* **Database**: a PostgreSQL database where processed data is stored
* **GraphQL Server**: every query node comes with a gateway to present processed data

A Squid replaces direct gRPC node access with more performant API calls to Archive gateways, allowing bandwidth reduction and quick synchronization of the API with the historical on-chain data. It can be run locally, on a server, or deployed to the Cloud using [our SaaS solution](../tutorial/deploy-your-squid.md).

Thanks to the Subsquid framework, it is possible to:

* define the [database schema](../recipes/running-a-squid/define-a-squid-schema.md), [data type, and entity definitions](../recipes/running-a-squid/generate-typescript-definitions.md)
* transform and store chain data efficiently
* present it thanks to the included GraphQL server

Subsquid provides developers with a high-level GraphQL-like schema and codegen tools to model blockchain data with Entities. One of the advantages, here, is the removal of boilerplate code to unbox. A more significant advantage is certainly the elimination of incorrect data types due to wrong decoding and missing parameters.

Even more importantly, when handling unstructured data from events, the data format may change from one block to the next, due to runtime upgrades. Without type safety and automation guaranteed by [typegen](typegen.md), managing these alterations would be a nightmare.

The Processor extracts data from an Archive Endpoint and does Transform-Load operations, saving it to the database. The transform-load logic is fully custom and defined by the developer.

Once the schema and the mappings are set up, and the node is launched, it will start the continuous scan of the blockchain, processing the events through the Event handlers and updating the entities in the database.

The API requests are resolved by the GraphQL server by sourcing data from the Processor database. [OpenCRUD](https://www.opencrud.org) filtering, entity relations, pagination, and text queries are supported out-of-the-box by the API.

