---
sidebar_position: 30
title: USDC transfers
description: >-
  USDC Transfer events on Ethereum
---

# USDC transfers

[The squid](https://github.com/subsquid-labs/evm-logs-example) indexes USDC transfers by tracking the historical `Transfer(address,address,uint256)` logs emitted by the [USDC contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) on the Ethereum Mainnet. 

## Prerequisites

- Node v16.x
- Docker
- [Squid CLI](/squid-cli/installation)

## Running 

```bash
sqd init my-new-squid --template https://github.com/subsquid-labs/evm-logs-example && cd my-new-squid
# or
git clone https://github.com/subsquid-labs/evm-logs-example.git && cd evm-logs-example

npm ci

# start the database
sqd up

# builds the project, starts a long-running ETL and blocks the terminal
sqd process

# starts the GraphQL API server at localhost:4350/graphql
sqd serve
```
