---
sidebar_position: 31
title: Dynamic Uniswap pools
description: >-
  Indexing Uniswap as it deploys new contracts
---

# Dynamic Uniswap pools

[The squid](https://github.com/subsquid-labs/factory-example) indexes [Uniswap v3](https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984) swaps on Ethereum Mainnet. The squid listens to the `PoolCreated` events to dynamically update the set of trading pools using the [factory contract](/evm-indexing/factory-contracts/) pattern.

## Prerequisites

- Node v16.x
- Docker
- [Squid CLI](/squid-cli/installation)

## Running 

```bash
sqd init my-new-squid --template https://github.com/subsquid-labs/factory-example && cd my-new-squid
# or
git clone https://github.com/subsquid-labs/factory-example.git && cd factory-example

npm ci

# start the database
sqd up

# builds the project, starts a long-running ETL and blocks the terminal
sqd process

# starts the GraphQL API server at localhost:4350/graphql
sqd serve
```
