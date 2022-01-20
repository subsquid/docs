---
description: Explaining the main components of a Subsquid Query Node
---

# Architecture

### Overview

A Squid query node consists of the following core parts:

* Blockchain Squid Archive
* A Processor
* GraphQL-like data schema & event mappings
* PostgreSQL (Data Storage)
* GraphQL Server

The Squid project takes as an input a high-level GraphQL-like schema modeling the blockchain data ("entities") to be indexed. The mappings describe the event handlers telling the indexer how the blockchain events affect the schema entities.

Once the schema and the mappings are set up, the [Squid Archive](architecture.md#squid-archive) prepares the database and starts the continuous scan of the blockchain, processing the events through the mappings and updating the entities in the database.

The GraphQL Server is a separate web server providing a GraphQL API (more on the [official website](https://graphql.org)) for the entities in the data store. The API requests are resolved by the server into database queries, providing quick access to the most recent state of the entities. [OpenCRUD](https://www.opencrud.org) filtering, entity relations, pagination, and text queries are supported out-of-the-box by the API.

### Squid

A Squid is a query node for ingesting, transforming and presenting Substrate blockchain data.

Thanks to the Subsquid framework, it is possible to:

* define the [database schema](../recipes/how-to-define-a-database-schema.md), [data type and entity definitions](../tutorial/generate-typescript-definitions.md)
* transform and store chain data efficiently
* present it thanks to the included [GraphQL server](graphql-server.md)

Developers only need to write mapping code capable of consuming block data and processing it to update database records, in any way it suits their needs.

A Squid replaces direct gRPC node access with performant Squid Archive gateways, allowing bandwidth reduction and quick synchronization of the API with the historical on-chain data. It can be run locally, in a server, or deployed to the Cloud, thanks to our SaaS solution.

### Squid archive

A Squid Archive continuously collects data from the blockchain to allow querying and fetching it quickly. It is responsible for ingesting raw data from the blockchain and exposing it with improved performance, compared to direct node access.

A Squid Archive can be shared by multiple Squids, which means it is possible to segment how data is presented, based on the user's needs, without having to replicate the data source.

To launch your own Squid Archive for a particular Blockchain, head over to [our dedicated page](../recipes/how-to-launch-a-squid-archive.md).
