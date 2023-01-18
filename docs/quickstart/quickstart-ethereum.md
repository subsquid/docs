---
sidebar_position: 10
title: EVM chains (minimal)
description: A minimal squid for EVM indexing
---

# Quickstart: EVM chains

This guide follow through the steps to set up the environment, clone, build and run a template squid for EVM networks. The squid outputs the transactions to the "black hole" address `0x0000000000000000000000000000000000000000`. It is intended to be a starter project for building a custom squid indexing the EVM log and transaction data on Ethereum and other EVM chains.

## Pre-requisites

Before getting to work on your very first squid, verify that you have installed the following software: 

- Node v16.x
- [Squid CLI](/squid-cli/installation)
- [GNU Make](https://www.gnu.org/software/make/)

Please note:
- The squid template is **not** compatible with `yarn`. Use `npm` instead.
- Windows users are recommended to install [WSL](https://docs.microsoft.com/en-us/windows/wsl/).

Additional information about development environment setup is available [here](/tutorials/development-environment-set-up).

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

Inspect `src/processor.ts` and set the EVM network of interest. Consult the [processor configuration page](/evm-indexing/configuration) 
for the list of the supported networks and the configuration options. 

## Step 4: Build the squid

```bash
make build
```

## Step 5: Launch Postgres and detach

```bash
make up
```


## Step 5: Create the database schema and run the processor

 The squid we have just built ingests pre-indexed data from the Ethereum Archive. This data is then transformed, as defined by the data handler in `processor.ts`.
 
 This command will keep the console busy until manually terminated:

```bash
make process
```


## What's next?

- [Migrate the existing subgraphs to Subsquid](/migrate/migrate-subgraph)
- [Define your own data schema and the GraphQL API](/basics/schema-file)
- [Explore examples of squids for EVM networks, from simple transfer indexing to DEX analytics](/examples/evm)
- [Define the data schema and serve the data with a GraphQL API](/basics/schema-file)
- [Deeper dive into `EvmBatchProcessor`](/evm-indexing)
- [Explore how to enhance the GraphQL API with custom SQL, caching and limits](/graphql-api)
- [Deploy the squid to the Aquarium hosted service](/deploy-squid)
