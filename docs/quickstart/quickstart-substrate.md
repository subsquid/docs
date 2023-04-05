---
sidebar_position: 20
title: Simple Substrate indexer
description: A simple squid for Substrate indexing transfers
---

# Quickstart: Substrate chains

The `substrate` squid template indexes transfers on the Kusama network. It is intended to be a stepping stone for building a custom squid for any Substrate-based chain. 

## Pre-requisites

Before getting to work on your very first squid, verify that you have installed the following software: 

- Node v16.x or newer
- [Squid CLI](/squid-cli/installation) v2.1.0 or newer

Please note:
- The squid template is **not** compatible with `yarn`. Use `npm` instead.

## Step 1: Scaffold from a template

Come up with a new memorable name for your squid. Choose the template matching your network and 
scaffold using [`sqd init`](/squid-cli/init).

- For indexing native events emitted by Substrate-based chains, use `substrate` 
- For indexing Frontier EVM contracts on Astar and Shiden use `frontier-evm`
- For indexing ink! smart contracts, use `ink`
- For indexing EVM+ contracts on Karura or Acala, use `acala`

For example:

```bash
sqd init my-awesome-squid --template substrate
cd my-awesome-squid
```

## Step 2: Install dependencies

```bash
npm ci
```

## Step 3: Launch Postgres in a detached Docker container

```bash
sqd up
```

## Step 4: Create the database schema and run the processor

The squid we have just built ingests pre-indexed data from a Kusama Archive. This data is then transformed, as defined by the data handler supplied to the `processor.run()` call in `src/processor.ts`.
 
This command will keep the console busy until manually terminated:

```bash
sqd process
```

## Step 5: Start the GraphQL server

Run in a separate terminal window:

```bash
sqd serve
```

The GraphQL playground is available at [`http://localhost:4350/graphql`](http://localhost:4350/graphql). Open it in a browser and run
sample queries by applying filters and data selections in the panel to the left.

```graphql
query MyQuery {
  accountsConnection(orderBy: id_ASC) {
    totalCount
  }
}
```

## Step 6: Customize

[Hack](/basics/schema-file) the schema file `schema.graphql` and the [processor](/substrate-indexing) `src/processor.ts` to index the data your way. Choose any supported network using the `lookupArchive()` method of [`@subsquid/archive-registry`](https://www.npmjs.com/package/@subsquid/archive-registry) or [run one locally](/archives/).

## What's next?

- Explore more [examples](/examples/#substrate-processor) of squids for substrate chains
- Define the [data schema](/basics/schema-file) and customize the API
- Explore how to use [typegen](/substrate-indexing/squid-substrate-typegen) for type-safe on-chain data access
- Explore how to efficiently transform the on-chain [data in batches](/substrate-indexing)
- Explore native support for [Frontier EVM](/substrate-indexing/evm-support) on Astar and Shiden
- Explore native support for [ink! contracts](/substrate-indexing/wasm-support)
- Explore native support for [Gear contracts](/substrate-indexing/gear-support)
- Explore native support for [Acala EVM+ contracts](/substrate-indexing/acala-evm-support)
- [Deploy](/deploy-squid) the squid to the Aquarium hosted service
