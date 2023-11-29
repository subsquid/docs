---
title: Subsquid Firehose
description: >-
  Leverage the power of Subsquid Network data sync subgraphs
sidebar_position: 30
---

# Run subgraphs without archival nodes

:::warning
This tutorial uses alpha-quality software. If you encouter any issues while using it please let us know at the [SquidDevs Telegram chat](https://t.me/HydraDevs).
:::

**Dependencies**: Docker, Git, NodeJS, Yarn.

It is now possible to run [subgraphs](https://thegraph.com/docs/en/glossary/) using Subsquid data sources such as [Archives](/subsquid-network/overview) and the [Subsquid network](/subsquid-network/public). To do this, run a regular Graph node against [firehose-grpc](https://github.com/subsquid/firehose-grpc), our drop-in replacement for [Firehose](https://firehose.streamingfast.io).

The easiest way to do so is to use our [graph-node-setup](https://github.com/subsquid-labs/graph-node-setup) repo. Here's how:

1. Clone the repo and install the dependencies:
   ```bash
   git clone https://github.com/subsquid-labs/graph-node-setup
   cd graph-node-setup
   npm ci
   ```

2. Interactively configure the environment with
   ```bash
   npm run configure
   ```

   ![Configuring the environment](subgraphs-support-configuration.gif)

   You will be asked to select a network and provide a node RPC endpoint. You can pick any network from our [supported EVM networks](/subsquid-network/reference/evm-networks); networks that are not currently [supported by TheGraph](https://thegraph.com/docs/en/developing/supported-networks/) will be available their under Subsquid names.

   The RPC endpoint will only be used to sync a few thousands of blocks at the chain end, so it does not have to be a paid one. However, `firehose-grpc` does not limit its request rate yet, so using a public RPC might result in a cooldown.

3. Download and deploy your subgraph of choice! For example, if you configured the environment to use Ethereum mainnet (`eth-mainnet`), you can deploy the well known Gravatar subgraph:
   ```bash
   git clone https://github.com/graphprotocol/example-subgraph
   cd example-subgraph

   # the repo is a bit outdated, giving it a deps update
   rm yarn.lock
   npx --yes npm-check-updates --upgrade
   yarn install

   # generate classes for the smart contract
   # and events used in the subgraph
   npm run codegen

   # create and deploy the subgraph
   npm run create-local
   npm run deploy-local
   ```
   GraphiQL playground will be available at [http://127.0.0.1:8000/subgraphs/name/example/graphql](http://127.0.0.1:8000/subgraphs/name/example/graphql).

## Disabling RPC ingestion

If you would like to use `firehose-grpc` without RPC ingestion, you can configure the environment to do so by running
```bash
npm run configure -- --disable-rpc-ingestion
```
You will still have to supply an RPC URL, but it won't be used for ingestion, so a public RPC will suffice.

Disabling RPC ingestion introduces a delay of several thousands of blocks between the highest block available to the subgraph and the actual block head.

## Troubleshooting

Do not hesitate to let us know about any issues (whether listed here or not) at the [SquidDevs Telegram chat](https://t.me/HydraDevs).

* If your subgraph is not syncing and you're getting
  ```
  thread 'tokio-runtime-worker' panicked at 'called `Option::unwrap()` on a `None` value', src/ds_rpc.rs:556:80
  ```
  errors in the `graph-node-setup-firehose` container logs, that likely means that the chain RPC is not fully Ethereum-compatible and a workaround is not yet implemented in `firehose-grpc`. You can still sync your subgraph with [RPC ingestion disabled](#disabling-rpc-ingestion).
