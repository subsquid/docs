---
sidebar_position: 10
title: Examples list
description: >-
  Start here
---

# EVM indexing examples

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.**

:::info
Any GitHub repo can be used as a template for [sqd init](/squid-cli/init). Simply pass the repo URL to the `--template` flag.
:::

Browse a dedicated repository with [EVM squid examples](https://github.com/subsquid-labs/squid-evm-examples). It contains:

- A squid [indexing transfers](/examples/evm/evm-logs-example) by extracting `Transfer(address,address,uint256)` logs emitted by the USDC contract.
- A squid [indexing DEX trades](/examples/evm/factory-example) while dynamically tracking Uniswap v3 pool contracts as they are deployed. Shows [factory contract](/evm-indexing/factory-contracts) indexing in action.
- [A NFT indexing squid](/examples/evm/multicall-example) that additionally queries the NFT metadata from the contract state. Illustrates batching RPC calls using the [Multicall contract](/evm-indexing/squid-evm-typegen/#batching-contract-state-calls-using-the-multicall-contract).

and a few others.

[//]: # (!!!! Benchmark squids were cut out. Add them back in if and when they are migrated)
[//]: # (!!!! Remove the /arrowsquid prefix througout)
