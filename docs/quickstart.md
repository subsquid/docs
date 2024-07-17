---
title: Quickstart (cross-product)
description: >-
  Getting your hands dirty ASAP
sidebar_position: 5
---

# Quickstart

**Time required:** 5 min

**Pre-requisites:** depending on the route you take, you might need
 - (On Windows) A working [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) environment
 - NodeJS v18 or newer
 - Git
 - Docker

I want to...

<details>
<summary>Build a blockchain indexer app</summary>

This tutorial will help you choose a suitable template and run in on your local machine, then direct you to resources that will help you develop your own indexer based on the template.

*You will need:* WSL (on Windows), NodeJS and Git.

**STEP 1:** Install the `sqd` command line tool:
```bash
npm i -g @subsquid/cli
```
If you prefer to install global NPM packages system-wide, add `sudo` to this command. Alternatively, follow [these instructions](https://github.com/sindresorhus/guides/blob/main/npm-global-without-sudo.md) to install to your home folder.

**STEP 2:** Choose a template.

My data comes from...

<details>
<summary>A EVM chain (Ethereum, Binance, Polygon etc)</summary>

I need the transformed data as...

<details>
<summary>A Postgres database and/or a GraphQL API</summary>

*You will need:* Docker.

Fetch one of the following:

- A minimal template intended for developing EVM squids. Indexes ETH burns.
  ```bash
  sqd init my-squid-name -t evm
  ```
- A template showing how to [combine data from multiple chains](/sdk/resources/basics/multichain). Indexes USDC transfers on Ethereum and Binance.
  ```bash
  sqd init my-squid-name -t multichain
  ```
- A starter squid for indexing ERC20 transfers.
  ```bash
  sqd init my-squid-name -t https://github.com/subsquid-labs/squid-erc20-template
  ```
- The classic [example Subgraph](https://github.com/graphprotocol/example-subgraph) after a [migration](/sdk/resources/migrate/migrate-subgraph) to SQD SDK.
  ```bash
  sqd init my-squid-name -t gravatar
  ```

**STEP 3:** Install the dependencies

```bash
cd my-squid-name
npm ci
```

**STEP 4:** Start a container with a PostgreSQL database

```bash
docker compose up -d
```

**STEP 5:** Build the project

```bash
npm run build
```

**STEP 6:** Run the indexer (all services)

```bash
sqd run .
```

**STEP 7:** Verify that the indexer works by visiting [localhost:4350/graphql](http://localhost:4350/graphql) and observing the GraphQL API working.

**STEP 8:** Shut down the indexer by pressing Ctrl+C, then stopping the database container:

```bash
docker compose down
```

**THIS IS THE END OF THE TUTORIAL**

Next steps:
 - [Read the SQD ecosystem overview](/overview) to learn how and why squid indexers rely on [Subsquid Network](/subsquid-network)
 - Visit the [list of Subsquid Network EVM datasets](/subsquid-network/reference/evm-networks) to see if there's one for your network. You can still use a squid indexer if the dataset is not available, but the syncing will be slower.
 - Read the [SDK overview](/sdk/overview) and follow through the [Indexer from scratch](/sdk/how-to-start/squid-from-scratch) tutorial to learn about the inner workings of squid indexers.
 - Take a look at the [master development guide](/sdk/how-to-start/squid-development)
 - [Browse the examples](https://docs.subsquid.io/sdk/examples)

</details>

<details>
<summary>A filesystem-based dataset</summary>

SQD indexers can output block height-sliced datasets consisting of CSV, Parquet or JSON/JSONL files.

I want my files...

<details>
<summary>On a local filesystem</summary>

Fetch one of the following:

- USDC transfers -> local CSV
  ```bash
  sqd init my-squid-name -t https://github.com/subsquid-labs/file-store-csv-example
  ```
- USDC transfers -> local Parquet
  ```bash
  sqd init my-squid-name -t https://github.com/subsquid-labs/file-store-parquet-example
  ```
- USDC transfers -> local JSON
  ```bash
  sqd init my-squid-name -t https://github.com/subsquid-labs/file-store-json-example
  ```

**STEP 3:** Install the dependencies

```bash
cd my-squid-name
npm ci
```

**STEP 4:** Build the project

```bash
npm run build
```

**STEP 5:** Run the indexer

```bash
sqd run .
```

**STEP 6:** Verify that the indexer works. If it does, it should create a `./data` folder populated with the dataset files. Might need a few minutes before it writes the first files.

**STEP 7:** Shut down the indexer by pressing Ctrl+C.

**THIS IS THE END OF THE TUTORIAL**

Next steps:
 - [Read the SQD ecosystem overview](/overview) to learn how and why squid indexers rely on [Subsquid Network](/subsquid-network)
 - Visit the [list of Subsquid Network EVM datasets](/subsquid-network/reference/evm-networks) to see if there's one for your network. You can still use a squid indexer if the dataset is not available, but the syncing will be slower.
 - Read the [SDK overview](/sdk/overview) and follow through the [Indexer from scratch](/sdk/how-to-start/squid-from-scratch) tutorial to learn about the inner workings of squid indexers.
 - Take a look at the [master development guide](/sdk/how-to-start/squid-development)
 - [Browse the examples](https://docs.subsquid.io/sdk/examples)

</details>

<details>
<summary>On an Amazon S3-compatible storage</summary>

The only available template produces CSV files. For other file formats consult the local filesystem templates.

Fetch the template with

```bash
sqd init my-squid-name -t https://github.com/subsquid-labs/file-store-s3-example
```
then follow the instructions in the [template README](https://github.com/subsquid-labs/file-store-s3-example/blob/main/README.md).

**THIS IS THE END OF THE TUTORIAL**

Next steps:
 - [Read the SQD ecosystem overview](/overview) to learn how and why squid indexers rely on [Subsquid Network](/subsquid-network)
 - Visit the [list of Subsquid Network EVM datasets](/subsquid-network/reference/evm-networks) to see if there's one for your network. You can still use a squid indexer if the dataset is not available, but the syncing will be slower.
 - Read the [SDK overview](/sdk/overview) and follow through the [Indexer from scratch](/sdk/how-to-start/squid-from-scratch) tutorial to learn about the inner workings of squid indexers.
 - Take a look at the [master development guide](/sdk/how-to-start/squid-development)
 - [Browse the examples](https://docs.subsquid.io/sdk/examples)

</details>

</details>

<details>
<summary>A BigQuery dataset</summary>

The only available template that writes to Google BigQuery fetches USDC `Transfer` events on Ethereum.

Fetch it with 

```bash
sqd init my-squid-name -t https://github.com/subsquid-labs/squid-bigquery-example
```
then follow the instructions in the [template README](https://github.com/subsquid-labs/squid-bigquery-example/blob/master/README.md).

**THIS IS THE END OF THE TUTORIAL**

Next steps:
 - [Read the SQD ecosystem overview](/overview) to learn how and why squid indexers rely on [Subsquid Network](/subsquid-network)
 - Visit the [list of Subsquid Network EVM datasets](/subsquid-network/reference/evm-networks) to see if there's one for your network. You can still use a squid indexer if the dataset is not available, but the syncing will be slower.
 - Read the [SDK overview](/sdk/overview) and follow through the [Indexer from scratch](/sdk/how-to-start/squid-from-scratch) tutorial to learn about the inner workings of squid indexers.
 - Take a look at the [master development guide](/sdk/how-to-start/squid-development)
 - [Browse the examples](https://docs.subsquid.io/sdk/examples)

</details>

</details>


<details>
<summary>A Substrate chain (Polkadot, Kusama etc)</summary>

All available Substrate templates store data to Postres / serve it over GraphQL. Consult EVM templates for alternative data sinks.

Fetch one of the following:

- Native events emitted by Substrate-based chains
  ```bash
  sqd init my-squid-name -t substrate
  ```
- ink! smart contracts
  ```bash
  sqd init my-squid-name -t ink
  ```
- Frontier EVM contracts on Astar and Moonbeam
  ```bash
  sqd init my-squid-name -t frontier-evm
  ```

</details>


<details>
<summary>Solana or a compatible chain</summary>

Solana template indexes SOL-USDC swaps on Whirlpool and stores the data in PostgreSQL.

Fetch it with:
```bash
sqd init my-squid-name -t https://github.com/subsquid-labs/solana-example
```

</details>


<details>
<summary>Fuel network</summary>

Fuel network template gets all `LOG_DATA` receipts from the testnet and stores the data in PostgreSQL.

Fetch it with:
```bash
sqd init my-squid-name -t https://github.com/subsquid-labs/fuel-example/
```

</details>

</details>



<details>
<summary>Deploy an SQD indexer to a managed cloud</summary>

lorem ipsum

</details>



<details>
<summary>Boost indexing speed of my subgraph</summary>

lorem ipsum

</details>



<details>
<summary>Just grab some raw data</summary>

lorem ipsum

</details>
