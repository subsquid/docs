---
sidebar_position: 49
title: Multichain
description: Combine data from multiple chains
---

# Multichain indexing

It is possible to use Subsquid to get data from multiple chains simultaneously. To do this, simply write your squid to have multiple [processors](/basics/squid-processor). A few special considerations apply:
* If your squid stores its data in a database:
  - its [schema](/basics/schema-file) and [GraphQL API](/graphql-api) must be shared between the processors;
  - each processor must use a [`Database`](/basics/store/store-interface) with a unique `stateSchema` setting (the name of the database schema where the processor status is kept).
* If your squid stores its data to a file-based dataset, please use a unique target folder for each processor.
* If the convenience of running the squid locally is of concern, you may want to rewrite `commands.json` to give each processor a unique shortcut. See an example [here](https://github.com/subsquid-labs/multichain-transfers-example/blob/master/commands.json).
* If you deploy your squid to [Aquarium](/deploy-squid), supply a list of processors at `deploy.processor`. Make sure to give each processor a unique name! See [this section](/deploy-squid/deploy-manifest/#processor)

A complete example of multichain squid is available [here](/examples/evm/multichain-example).
