---
description: Explaining the main components of a Subsquid Query Node
---

# Architecture

## Overview

Subsquid takes a multi-layered approach that separates raw data ingestion from data processing and presentation.

This is very useful for the vast majority of developers, as it adds a layer of abstraction, taking care of data ingestion and synchronization and exposing decoded Substrate chain entities ([Events](substrate.md#events) and [Extrinsics](substrate.md#extrinsics), as well as entire Blocks), for developers to process.

The Squid data pipeline consists of two core components:

* **Squid Archive**: data source, can be shared by multiple query nodes
* **Squid**: the data transformation part of the pipeline

![Squid and Squid Archive are the main components](<../.gitbook/assets/Squid Architecture diagram.png>)

A [Squid Archive](architecture.md#squid-archive) is set up to continuously scan the blockchain it was developed for, process blocks, and save them in a database, along with [Events](substrate.md#events) and [Extrinsics](substrate.md#extrinsics) defined for that specific blockchain.

In the context of a Squid query node, a Processor is responsible to get data from a Squid Archive, transform it, and store it in the database.

The GraphQL Server is a separate web server providing a GraphQL API (more on the [official website](https://graphql.org)) for the entities in the data store.&#x20;

### Squid

A Squid is a query node for transforming, and presenting Substrate blockchain data. It consists of:

* **Processor**: each node has one but can have multiple if connected to multiple chains
* **Database**: A PostgreSQL database where processed data is stored
* **GraphQL Server**: every query node comes with a gateway to present processed data

A Squid replaces direct gRPC node access with more performant API calls to Squid Archive gateways, allowing bandwidth reduction and quick synchronization of the API with the historical on-chain data. It can be run locally, in a server, or deployed to the Cloud, thanks to our SaaS solution.

Thanks to the Subsquid framework, it is possible to:

* define the [database schema](../recipes/define-a-squid-schema.md), [data type, and entity definitions](../recipes/generate-typescript-definitions.md)
* transform and store chain data efficiently
* present it thanks to the included [GraphQL server](broken-reference)

Subsquid provides developers with a high-level GraphQL-like schema and codegen tools to model blockchain data with Entities and define data types.

The Processor extracts data from a Squid Archive Endpoint and does Transform-Load operations, saving to the database. The transform-load logic is fully custom and defined by the developer.

Once the schema and the mappings are set up, and the node is launched, it will start the continuous scan of the blockchain, processing the events through the Event handlers and updating the entities in the database.

The API requests are resolved by the GraphQL server by sourcing data from the Processor database. [OpenCRUD](https://www.opencrud.org) filtering, entity relations, pagination, and text queries are supported out-of-the-box by the API.

### Squid archive

A Squid Archive is responsible for continuously ingesting raw data from the blockchain, decoding it, and saving them in a database for easier access through GraphQL APIs.

It has the following components/services:

* Substrate archive
* Postgres database
* Redis
* Status service
* GraphQL Gateway

Ultimately, the Substrate Archive extracts Block Information, [Events](substrate.md#events), and [Extrinsics](substrate.md#extrinsics), then writes them to a Postgres Database, while the status updates are saved in a Redis cache. Archived data is available for clients' queries, thanks to a GraphQL server running as part of every Squid Archive node.

A Squid Archive can be shared by multiple Squids, which means it is possible to segment how data is presented, based on the user's needs, without having to replicate the data source.

To launch your own Squid Archive for a particular Blockchain, head over to [our dedicated page](../recipes/how-to-launch-a-squid-archive.md).
