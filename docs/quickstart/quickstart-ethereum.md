---
sidebar_position: 20
title: EVM chains (minimal)
description: A minimal squid for EVM indexing
---

# Quickstart: EVM chains

This guide follow through the steps to set up the environment, clone, build and run a template squid for EVM networks. The squid indexes the transactions to the "black hole" address `0x0000000000000000000000000000000000000000` and persists into a Postgres. It is intended to be a starter project for building a custom squid indexing the EVM log and transaction data on Ethereum and other EVM chains.

## Pre-requisites

Before getting to work on your very first squid, verify that you have installed the following software: 

- Node v16.x
- [Squid CLI](/squid-cli) v^2.1.0

:::info
Earlier versions of the template were based on `Makefile`. The new version uses [`@subsquid/commands` scripts](https://github.com/subsquid/squid-sdk/tree/master/util/commands), defined in `commands.json`, that are automatically recognized as `sqd` sub-commands.
:::

Please note:
- The squid template is **not** compatible with `yarn`. Use `npm` instead.

## Step 1: Scaffold from a template

Come up with a new memorable name for your squid and scaffold from [`squid-evm-template`](https://github.com/subsquid/squid-evm-template)
using [`sqd init`](/squid-cli/init):

```bash
sqd init my-awesome-squid --template evm
cd my-awesome-squid
```

:::info
Explore all available templates with `sqd init --help`. You may choose the `gravatar` template as a starting point for indexing EVM smart contracts 
as well.
:::

##  Step 2: Install dependencies

```bash
npm ci
```

## Step 3: Set the network

Inspect `src/processor.ts` and set the EVM network of interest. Consult the [processor configuration page](/develop-a-squid/evm-processor/configuration) 
for the list of the supported networks and the configuration options. 

## Step 4: Build the squid

```bash
sqd build
```

## Step 5: Launch Postgres and detach

```bash
sqd up
```

## Step 5: Inspect and run the processor

 The squid fetches, aggregates and persists burn transactions in the `processor.run()` method. The `Burn` entity is defined in `schema.graphql`, and the TypeORM model class was generated with `sqd codegen`.

 Let's run the processor:

```bash
sqd process
```

It outputs simple aggregations of the burned ETH and batch-inserts the tx data into the Postgres database.

## Step 6: Start the GraphQL server

This should be run in a separate terminal window:

```bash
sqd serve
# in another window
sqd open http://localhost:4350/graphql
```

This starts a GraphQL API console auto-serving the `Burn` entity data we upload to Postgres. One can for example explore top-10 historical burns:

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

## What's next?

- [Migrate](/migrate/migrate-subgraph) the existing subgraphs to Subsquid
- Define your own [data schema](/develop-a-squid/schema-file) and the [GraphQL API](/query-squid)
- Explore examples of squids for EVM networks, from [simple transfer indexing to DEX analytics](/develop-a-squid/examples)
- Dive deeper into [`EvmBatchProcessor`](/develop-a-squid/evm-processor)
- Explore how to enhance the GraphQL API with [custom SQL, caching and limits](/develop-a-squid/graphql-api)
- [Deploy](/deploy-squid) the squid to the Aquarium hosted service
