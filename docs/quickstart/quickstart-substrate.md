---
sidebar_position: 20
title: Substrate chains
description: A simple squid for Substrate indexing transfers
---

# Quickstart: Substrate chains

This guide follow through the steps to set up the environment, clone, build and run a template squid for substrate networks. The squid indexes transfers on the Kusama network. It is intended to be a stepping stone for building a custom squid for any Substrate-based chain.

## Pre-requisites

Before getting to work on your very first squid, verify that you have installed the following software: 

- Node v16.x
- [Squid CLI](/squid-cli)
- [GNU Make](https://www.gnu.org/software/make/)

Please note:
- The squid template is **not** compatible with `yarn`. Use `npm` instead.
- Windows users are recommended to install [WSL](https://docs.microsoft.com/en-us/windows/wsl/).

Additional information about development environment setup is available [here](/tutorials/development-environment-set-up).

## Step 1: Scaffold from a template

Come up with a new memorable name for your squid. Choose the template matching your network and 
scaffold using [`sqd init`](/squid-cli/init).

- For indexing native events emitted by Substrate-based chains, use `substrate` 
- For indexing Frontier EVM contracts on Moonbeam, Moonriver, Astar, Shiden use `frontier-evm`
- For indexing Ink! smart contracts, use `ink`
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

## Step 3: Build the squid

```bash
make build
```

## Step 4: Launch Postgres and detach

```bash
make up
```


## Step 5: Create the database schema and run the processor

 The squid we have just built ingests pre-indexed data from a Kusama Archive. This data is then transformed, as defined by the data handler in `processor.ts`.
 
 This command will keep the console busy until manually terminated:

```bash
make process
```

## Step 6: Start the GraphQL server

This should be run in a separate terminal window:

```bash
make serve
```

The GraphQL playground is available at `http://localhost:4350/graphql`. Open it in a browser and run
sample queries by applying filters and data selections in the panel to the left.

```graphql
query MyQuery {
  accountsConnection(orderBy: id_ASC) {
    totalCount
  }
}
```

## What's next?

- Explore more [examples](/develop-a-squid/examples#substrate-processor) of squids for substrate chains
- Define the [data schema](/develop-a-squid/schema-file) and customize the API
- Explore how to use [typegen](/develop-a-squid/typegen/squid-substrate-typegen) for type-safe on-chain data access
- Explore how to efficiently transform the on-chain [data in batches](/develop-a-squid/substrate-processor)
- Explore native support for [Moonriver, Moombeam and Astar EVMs](/develop-a-squid/substrate-processor/evm-support)
- Explore native support for [Ink! contracts](/develop-a-squid/substrate-processor/wasm-support)
- Explore native support for [Gear contracts](/develop-a-squid/substrate-processor/gear-support)
- Explore native support for [Acala EVM+ contracts](/develop-a-squid/substrate-processor/acala-evm-support)
- [Deploy](/deploy-squid) the squid to the Aquarium hosted service
