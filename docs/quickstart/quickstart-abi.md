---
sidebar_position: 10
title: Generate from an ABI
description: A squid indexing events and txs from an ABI
---

# Quickstart: generate from ABI

The `abi` template generates a read-to-use squid from an EVM contract ABI. The squid decodes and indexes the EVM logs and transactions of the contract into a local Postgres database. Additionally, it serves the indexed with a rich GraphQL API supporting pagination and filtering. 

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

Come up with a new memorable name for your squid and scaffold from [squid-abi-template](https://github.com/subsquid/squid-abi-template)
using [`sqd init`](/squid-cli/init):

```bash
sqd init my-awesome-squid --template abi
cd my-awesome-squid
# install the dependencies
npm ci
```

##  Step 2: Generate and build the squid

- Consult the [EVM configuration page](/develop-a-squid/evm-processor/configuration) and choose an archive endpoint from the list of the supported EVM networks. 
- Prepare the contract ABI and save into the `assets` folder, e.g. as `assets/abi.json`

:::info
For public contracts the ABI is fetched automatically using the Etherscan API and the `--abi` flag can be omitted. Run 
```sh
sqd generate --help
```
for a full set of supported options.
:::

Generate and build the squid with
```bash
sqd generate -- \
--address <address> \
--abi assets/abi.json \
--archive <network archive alias> \
--event '*' \
--function '*' \
--from <starting block>

sqd build
```

### Example

```bash
npm run generate -- \
--address 0x6B175474E89094C44Da98b954EedeAC495271d0F \
--abi assets/abi.json \
--archive eth-mainnet \
--event '*' \
--function '*' \
--from 600000
```

## Step 3: Launch Postgres and detach

```bash
sqd up
```

## Step 4: Generate the schema migrations

```bash
sqd migration:generate
```

## Step 5: Run the squid processor

Run the processor with
```bash
sqd process
```

 The squid we have just built ingests the transaction and EVM log data emitted by the contract, decodes it and stores into the local Postgres database.

## Step 6: Start the GraphQL server

This should be run in a separate terminal window:

```bash
sqd serve
# in another window
sqd open http://localhost:4350/graphql
```

This starts a GraphQL server serving the indexed events and transactions from the local database. The GraphQL playground is available at `http://localhost:4350/graphql`. Open it in a browser and run sample queries by applying filters and data selections in the panel to the left.

```graphql
query MyQuery {
  events(limit: 10) {
    id
    name
  }
}
```

## Step 6: Customize

[Hack](/develop-a-squid/) the schema file `schema.graphql` and the processor `src/processor.ts` to index the data your way!

## What's next?

- [Migrate the existing subgraphs to Subsquid](/migrate/migrate-subgraph)
- [Define your own data schema and the GraphQL API](/develop-a-squid/schema-file)
- [Explore examples of squids for EVM networks, from simple transfer indexing to DEX analytics](/develop-a-squid/examples)
- [Define the data schema and serve the data with a GraphQL API](/develop-a-squid/schema-file)
- [Deeper dive into `EvmBatchProcessor`](/develop-a-squid/evm-processor)
- [Explore how to enhance the GraphQL API with custom SQL, caching and limits](/develop-a-squid/graphql-api)
- [Deploy the squid to the Aquarium hosted service](/deploy-squid)
