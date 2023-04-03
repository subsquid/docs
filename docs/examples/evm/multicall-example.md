---
sidebar_position: 32
title: Batch state queries for NFT
description: >-
  Getting NFT metadata with batch RPC queries
---

# NFT indexer with batch state queries

[The squid](https://github.com/subsquid-labs/multicall-example) indexes [Exosama NFT](https://etherscan.io/address/0xac5c7493036de60e63eb81c5e9a440b42f47ebf5) transfers on the Ethereum Mainnet by subscribing to the `Transfer` event logs. For each new [batch](/basics/processor-context/#ctxblocks), the processor detects the NFTs that have not yet been indexed and populates the metadata calling the contract state (see `initTokens()`). The contract state queries are batched using the [Multicall 
contract](https://etherscan.io/address/0x5ba1e12693dc8f9c48aad8770482f4739beed696) and [the `Multicall` facade class](/evm-indexing/query-state/#batch-state-queries) generated with `sqd codegen`. Note the `--multicall` flag in the `codegen` command defined in `commands.json`.

## Prerequisites

- Node v16.x
- Docker
- [Squid CLI](/squid-cli/installation)

## Running 

Clone the repo and navigate to the root folder.

```bash
sqd init my-new-squid --template https://github.com/subsquid-labs/multicall-example && cd my-new-squid
# or
git clone https://github.com/subsquid-labs/multicall-example && cd multicall-example

npm ci

# start the database
sqd up

# builds the project, starts a long-running ETL and blocks the terminal
sqd process

# starts the GraphQL API server at localhost:4350/graphql
sqd serve
```
