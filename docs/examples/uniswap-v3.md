---
sidebar_position: 31
description: >-
  Squid indexing Uniswap v3 trades
---

# Uniswap v3

[The squid](https://github.com/subsquid-labs/factory-example) indexes [Uniswap v3](https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984) swaps on Ethereum Mainnet. The squid listens to the `PoolCreated`
events to dynamically update the set of trading pools using the [factory contract](/evm-indexing/factory-contracts/) pattern.

One can use this example as a template for scaffolding a new squid project with [`sqd init`](https://docs.subsquid.io/squid-cli/):

```bash
sqd init my-new-squid --template https://github.com/subsquid-labs/factory-example
```


## Prerequisites

- Node v16.x
- Docker
- [Squid CLI](https://docs.subsquid.io/squid-cli/)

## Running 

```bash
git clone https://github.com/subsquid-labs/factory-example.git && cd factory-example
npm ci
sqd build
# start the database
sqd up
# starts a long-running ETL and blocks the terminal
sqd process

# starts the GraphQL API server at localhost:4350/graphql
sqd serve
```
