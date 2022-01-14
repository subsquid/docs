---
description: Explaining the main components of a Subsquid Query Node
---

# Architecture

### Squid

A Squid is a query node for ingesting, transforming and presenting Substrate blockchain data.

Thanks to the Subsquid framework, it is possible to:

* define the database schema, data type and entity definitions
* transform and store chain data efficiently
* present it thanks to the included GraphQL server

Developers only need to write mapping code capable of consuming block data and processing it to update database records, in any way it suits their needs.

A Squid replaces direct gRPC node access with performant Squid Archive gateways, allowing bandwidth reduction and quick synchronization of the API with the historical on-chain data. It can be run locally, in a server, or deployed to the Cloud, thanks to our SaaS solution.

### Squid archive

A Squid Archive continuously collects data from the blockchain to allow querying and fetching it quickly. It is responsible for ingesting raw data from the blockchain and exposing it with improved performance, compared to direct node access.

A Squid Archive can be shared by multiple Squids, which means it is possible to segment how data is presented, based on the user's needs, without having to replicate the data source.
