---
title: Run a subgraph
description: >-
  Use Subsquid data lakes to sync a subgraph
sidebar_position: 70
---

# Run a subgraph

:::warning
This tutorial uses alpha-quality software. If you encouter any issues while using it please let us know at the [SquidDevs Telegram chat](https://t.me/HydraDevs).
:::

**Dependencies**: Docker, Git, NodeJS, Yarn.

It is now possible to run [subgraphs](https://thegraph.com/docs/en/glossary/) using Subsquid data sources such as [Archives](/archives) and the [Subsquid network](/subsquid-network). To do this, run a regular Graph node against [firehose-grpc](https://github.com/subsquid/firehose-grpc), our drop-in replacement for [Firehose](https://firehose.streamingfast.io).

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
   You will be asked to select a network and provice a node RPC endpoint. The endpoint does not have to have a high throughput, a public one from [Ankr](https://www.ankr.com/rpc/) or [BlastAPI](https://blastapi.io/public-api) should suffice.

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
