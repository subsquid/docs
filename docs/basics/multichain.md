---
sidebar_position: 49
title: Multichain
description: Combine data from multiple chains
---

# Multichain indexing

It is possible to use Subsquid to get extract data from multiple into a common data target. In particular, in case of a Postgres DB as the target, one gets a unified GraphQL API for the multichain data. To do this, one simply runs multiple [processors](/basics/squid-processor) against the same database. A few special considerations apply:
* It is the squid developer responsibility to handle potential concurrency issues. 
* If your squid stores its data in a database:
  - its [schema](/basics/schema-file) and [GraphQL API](/graphql-api) must be shared between the processors;
  - each processor must use a [`Database`](/basics/store/store-interface) with a unique `stateSchema` setting (the name of the database schema where the processor status is kept).
* If the squid stores its data to a file-based dataset, please use a unique target folder for each processor.
* (Optional) One may want to rewrite `commands.json` to give each processor a unique shortcut. See an example [here](https://github.com/subsquid-labs/multichain-transfers-example/blob/master/commands.json).
* If you deploy your squid to [Aquarium](/deploy-squid), supply a list of processors at `deploy.processor`. Make sure to give each processor a unique name! See [this section](/deploy-squid/deploy-manifest/#processor).

A complete example of multichain squid is available [here](/examples/evm/multichain-example).
