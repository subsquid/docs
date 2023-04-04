---
sidebar_position: 10
title: Examples list
description: >-
  Start here
---

# Substrate indexing examples

:::info
Any GitHub repo can be used as a template for [sqd init](/squid-cli/init). Simply pass the repo URL to the `--template` flag.
:::

Browse a dedicated repository with [Substrate squid examples](https://github.com/subsquid-labs/squid-substrate-examples):

- [A simple squid tracking Kusama transfers](https://github.com/subsquid-labs/squid-substrate-template). Illustrates a basic usage of `SubstrateBatchProcessor`.
- [A complex squid tracking balances across multiple parachains](/examples/substrate/balances-squid) (*). This complex squid illustrates the usage of `SubstrateBatchProcessor`, storage calls and custom resolvers.
- [Simple Frontier EVM squid](https://github.com/subsquid-labs/squid-frontier-evm-template) indexing an NFT collection on Astar. Illustrates how to use `SubstrateBatchProcessor` to index EVM logs. See [Frontier EVM tutorial](/tutorials/create-an-evm-processing-squid) for details.
- [Simple ink!/WASM squid](https://github.com/subsquid-labs/squid-wasm-template). Illustrates how to use `SubstrateBatchProcessor` to index WASM smart contract data. See [WASM tutorial](/tutorials/create-a-wasm-processing-squid) for details.
- [An advanced squid tracking all the historical ERC20 and NFT transfers on Moonbeam](https://github.com/subsquid/moonbeam-erc-tokens) (*). Illustrates the usage of wildcard selectors and a possible way to organize a growing squid codebase into submodules.

(*) These archive squids use the older Makefile-based interface. Look into their dedicated pages or repository README files for guidance.
