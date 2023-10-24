---
sidebar_position: 32
title: Multichain indexing
description: >-
  Getting Transfer events from ETH and BSC
---

# Multichain squid

[The squid](https://github.com/subsquid-labs/multichain-transfers-example) indexes ERC20 Transfer events emitted by USDC contracts on Ethereum mainnet and BSC. Events data is written to a shared database table and served over a common GraphQL API.

The Ethereum processor is located in `src/eth` and similarly the Binance Chain processor can be found in `src/bsc`. The scripts file `commands.json` was updated with the commands `process:eth` and `process:bsc` to run the processors. 

## Prerequisites

- Node v16.x
- Docker
- [Squid CLI](/squid-cli/installation)

## Running 

Clone the repo and navigate to the root folder.

```bash
sqd init my-new-squid --template https://github.com/subsquid-labs/multichain-transfers-example && cd my-new-squid
# or
git clone https://github.com/subsquid-labs/multichain-transfers-example && cd multichain-transfers-example

npm ci

# start the database
sqd up

# builds the project, starts a long-running ETL and blocks the terminal
sqd process:eth

# same for the BSC processor
sqd process:bsc

# starts the GraphQL API server at localhost:4350/graphql
sqd serve
```

## Deploying

The example contains a valid deployment manifest and can be used to check how Subsquid Cloud hosts multichain squids. Set the squid name to something unique at `squid.yaml`, [authenticate your Squid CLI](/squid-cli/installation/#2-authenticate-squid-cli) and run
```bash
sqd deploy .
```
