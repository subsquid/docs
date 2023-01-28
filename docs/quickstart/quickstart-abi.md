---
sidebar_position: 10
title: Generate from an ABI
description: A squid indexing events and txs from an ABI
---

# Quickstart: generate from ABI

The `abi` template generates a ready-to-use squid from an EVM contract ABI. The squid decodes and indexes EVM logs and transactions of the contract into a local Postgres database. Additionally, it serves the indexed data with a rich GraphQL API supporting pagination and filtering. 

## Pre-requisites

Before getting to work on your very first squid, verify that you have installed the following software: 

- Node v16.x or above
- [Squid CLI](/squid-cli/installation)
- [GNU Make](https://www.gnu.org/software/make/)

Please note:
- The squid template is **not** compatible with `yarn`. Use `npm` instead.
- For Windows users it is recommended to install [WSL](https://docs.microsoft.com/en-us/windows/wsl/).

## Step 1: Scaffold from a template 

Come up with a new memorable name for your squid and scaffold from [squid-abi-template](https://github.com/subsquid/squid-abi-template)
using [`sqd init`](/squid-cli/init):

```bash
sqd init my-awesome-squid --template abi
cd my-awesome-squid
# install the dependencies
npm ci
```

##  Step 2: Generate and build the squid

- Consult the [EVM configuration page](/evm-indexing/configuration) and choose an archive endpoint from the list of supported EVM networks. 
- Prepare the contract ABI and save it into the `assets` folder, e.g. as `assets/abi.json`.

:::info
For public contracts the ABI can be fetched automatically using the Etherscan API and then the `--abi` flag can be omitted. Run 
```
sqd generate --help
```
for a full set of supported options.
:::

Generate and build the squid with
```bash
sqd generate \
--address <address> \
--abi assets/abi.json \
--archive <network archive endpoint> \
--event '*' \
--function '*' \
--from <starting block>

sqd build
```

### Example

```bash
sqd generate \
--address 0x6B175474E89094C44Da98b954EedeAC495271d0F \
--abi assets/abi.json \
--archive https://eth.archive.subsquid.io \
--event '*' \
--function '*' \
--from 1000000

sqd build
```

## Step 3: Launch Postgres and generate a migration

`sqd up` starts Postgres in a detached Docker container:
```bash
sqd up
sqd migration:generate
```

## Step 4: Run the squid processor

Run the processor with
```bash
sqd process
```

The squid we have just built now ingests the data on contract transactions and events, decodes it and stores it into the database.

## Step 5: Start the GraphQL server

In a separate terminal window, run

```bash
sqd serve
```

This starts a GraphQL server serving the indexed events and transactions from the local database. The GraphQL playground is available at `http://localhost:4350/graphql`. Open it in a browser and run sample queries by applying filters and data selections in the panel to the left.

```graphql
query MyQuery {
  evmEvents(limit: 10) {
    id
    name
    params
  }
}
```

## Step 6: Customize

[Hack](/basics/squid-development) `schema.graphql` and `src/processor.ts` to customize your squid!

## What's next?

- [Migrate your existing subgraphs to Subsquid](/migrate/migrate-subgraph)
- [Define your own data schema](/basics/schema-file)
- [Explore examples of squids for EVM networks, from simple transfer indexing to DEX analytics](/examples/evm)
- [Deeper dive into `EvmBatchProcessor`](/evm-indexing)
- [Explore how to enhance the GraphQL API with custom SQL, caching and limits](/graphql-api)
- [Deploy the squid to the Aquarium hosted service](/deploy-squid)
