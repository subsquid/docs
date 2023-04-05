---
sidebar_position: 10
title: Minimal EVM indexer
description: Minimal squid for EVM chains
---

# Quickstart: EVM chains

The `evm` squid template indexes transactions to the "black hole" address `0x0000000000000000000000000000000000000000`, persists its data into a Postgres database and serves it over a GraphQL API. It is intended to be a starter project for building a custom squid indexing logs and transactions data on Ethereum and other EVM chains.

## Pre-requisites

Before getting to work on your very first squid, verify that you have installed the following:

- Node v16.x or newer
- [Squid CLI](/squid-cli/installation) v2.1.0 or newer
- Docker

:::info
With the exception of `sqd init`, `sqd` commands mentioned here are just scripts defined in `commands.json` that the `sqd` executable automatically discovers. Take a look at the contents of this file to learn more about how squids work under the hood.
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

Inspect `src/processor.ts` and set the EVM network of interest. Consult the [processor configuration page](/evm-indexing/configuration) 
for the list of supported networks and configuration options.

## Step 4: Launch Postgres and detach

```bash
sqd up
```

## Step 5: Inspect and run the processor

The squid fetches, aggregates and persists burn transactions in the `processor.run()` method. The `Burn` entity is defined in `schema.graphql`, and the TypeORM model class used by this template was generated with `sqd codegen`. You can learn more about this in the [squid development](/basics/squid-development) section.
 
Let's run the processor:
```bash
sqd process
```

It outputs simple aggregations of the burned ETH and batch-inserts the tx data into the Postgres database.

## Step 6: Start the GraphQL server

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

## Step 7: Customize

[Hack](/basics/schema-file) the schema file `schema.graphql` and the [processor](/evm-indexing) `src/processor.ts` to index the data your way!

## What's next?

- [Migrate](/migrate/migrate-subgraph) the existing subgraphs to Subsquid
- Define your own [data schema](/basics/schema-file)
- Explore examples of squids for EVM networks, from [simple transfer indexing to DEX analytics](/examples)
- Dive deeper into [`EvmBatchProcessor`](/evm-indexing)
- Explore how to enhance the GraphQL API with [custom SQL, caching and limits](/graphql-api)
- [Deploy](/deploy-squid) the squid to the Aquarium hosted service
