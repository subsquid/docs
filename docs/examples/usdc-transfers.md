---
sidebar_position: 30
description: >-
  Squid indexing USDC transfers on Ethereum
---

# USDC transfers

[The squid](https://github.com/subsquid-labs/evm-logs-example) indexes USDC transfers by tracking the historical `Transfer(address,address,uint256)` logs emitted by the [USDC contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) on the Ethereum Mainnet. 
For an extensive reference of Squid SDK and the Subsquid ecosystem, go to the [docs](https://docs.subsquid.io).

One can use this example as a template for scaffolding a new squid project with [`sqd init`](/squid-cli/init):

```bash
sqd init my-new-squid --template https://github.com/subsquid-labs/evm-logs-example
```

## Prerequisites

- Node v16.x
- Docker
- [Squid CLI](/squid-cli/)

## Running 

```bash
git clone https://github.com/subsquid-labs/evm-logs-example.git && cd evm-logs-example
npm ci
sqd build
# start the database
sqd up
# starts a long-running ETL and blocks the terminal
sqd process

# starts the GraphQL API server at localhost:4350/graphql
sqd serve
```
