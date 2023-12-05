---
sidebar_position: 10
title: Examples list
description: >-
  Start here
---

# EVM indexing examples

:::info
Any GitHub repo can be used as a template for [sqd init](/arrowsquid-docs-v0/squid-cli/init). Simply pass the repo URL to the `--template` flag.
:::

Browse a dedicated repository with [EVM squid examples](https://github.com/subsquid-labs/squid-evm-examples). It contains:

- A squid [indexing transfers](../evm-logs-example) by extracting `Transfer(address,address,uint256)` logs emitted by the USDC contract.
- A squid [indexing DEX trades](../factory-example) while dynamically tracking Uniswap v3 pool contracts as they are deployed. Shows [factory contract](/arrowsquid-docs-v0/evm-indexing/factory-contracts) indexing in action.
- [A NFT indexing squid](../multicall-example) that additionally queries the NFT metadata from the contract state. Illustrates batching RPC calls using the [Multicall contract](/arrowsquid-docs-v0/evm-indexing/squid-evm-typegen/#batching-contract-state-calls-using-the-multicall-contract).
- A [multichain squid](../multichain-example) tracking USDC `Transfer` events on both Ethereum and BSC.

and a few others.

[//]: # (!!!! Benchmark squids were cut out. Add them back in if and when they are migrated)
