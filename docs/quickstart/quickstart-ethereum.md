---
sidebar_position: 20
title: EVM chains
description: A minimal squid for EVM indexing
---

# Quickstart: EVM chains

The `evm` squid template indexes the transactions to the "black hole" address `0x0000000000000000000000000000000000000000`, persists its data into a Postgres database and serves it over a GraphQL API. It is intended to be a starter project for building a custom squid indexing logs and transactions data on Ethereum and other EVM chains.

## Pre-requisites

Before getting to work on your very first squid, verify that you have installed the following: 

- Node v16.x or newer
- [Squid CLI](/squid-cli) v2.1.0 or newer
- Docker

:::info
Earlier versions of the template were based on `Makefile`. The new version uses [`@subsquid/commands` scripts](https://github.com/subsquid/squid-sdk/tree/master/util/commands), defined in `commands.json` that are automatically recognized as `sqd` sub-commands.
:::

Please note:
- The squid template is **not** compatible with `yarn` and expects a `npm`-generated `package-lock.json` file in the root.

## Step 1: Scaffold from a template

Come up with a new memorable name for your squid and scaffold from [`squid-evm-template`](https://github.com/subsquid/squid-evm-template)
using [`sqd init`](/squid-cli/init):

```bash
sqd init my-awesome-squid --template evm
cd my-awesome-squid
```

:::info
Explore all available templates with `sqd init --help`. You may choose the `gravatar` template as a starting point for indexing EVM smart contracts as well.
:::

##  Step 2: Install dependencies

```bash
npm ci
```

## Step 3: Set the network

Inspect `src/processor.ts` and set the EVM network of interest. Consult the [processor configuration page](/develop-a-squid/evm-processor/configuration) 
for the list of supported networks and configuration options.

## Step 4: Build the squid

```bash
sqd build
```

## Step 5: Launch Postgres and detach

```bash
sqd up
```

## Step 6: Inspect and run the processor

The squid fetches, aggregates and persists burn transactions in the `processor.run()` method. The `Burn` entity is defined in `schema.graphql`, and the TypeORM model class used by this template was generated with `sqd codegen`. You can learn more about this in the [squid development](/develop-a-squid) section.
 
Let's run the processor:
```bash
sqd process
```

It outputs simple aggregations of the burned ETH and batch-inserts the tx data into the Postgres database.

## Step 7: Start the GraphQL server

This should be run in a separate terminal window:
```bash
sqd serve
# in yet another window
sqd open http://localhost:4350/graphql
```

This starts a GraphQL API console auto-serving the `Burn` entity data we are uploading to Postgres. For example, one can explore the top-10 historical burns:

```graphql
query MyQuery {
  burns(orderBy: value_DESC) {
    address
    block
    id
    txHash
    value
  }
}
```

And you're done!

## What's next?

- [Migrate](/migrate/migrate-subgraph) the existing subgraphs to Subsquid
- Define your own [data schema](/develop-a-squid/schema-file)
- Explore examples of squids for EVM networks, from [simple transfer indexing to DEX analytics](/develop-a-squid/examples)
- Dive deeper into [`EvmBatchProcessor`](/develop-a-squid/evm-processor)
- Explore how to enhance the GraphQL API with [custom SQL, caching and limits](/develop-a-squid/graphql-api)
- [Deploy](/deploy-squid) the squid to the Aquarium hosted service
