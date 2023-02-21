---
sidebar_position: 20
title: Squids for Substrate
description: >-
  Substrate indexing examples
---

# Substrate indexing examples

Browse a dedicated repository with [Substrate squid examples](https://github.com/subsquid/squid-substrate-examples):

- [A simple squid tracking Kusama transfers](https://github.com/subsquid/squid-substrate-template). Illustrates a basic usage of `SubstrateBatchProcessor`.
- [A complex squid tracking balances across multiple parachains](https://github.com/subsquid/subsquid-balances). This complex squid illustrates the usage of `SubstrateBatchProcessor`, storage calls and custom resolvers.
- [Simple EVM squid](https://github.com/subsquid/squid-frontier-evm-template/blob/master/src/processor.ts). Illustrates how to use `SubstrateBatchProcessor` to index EVM logs. See [EVM tutorial](/tutorials/create-an-evm-processing-squid) for details.
- [Simple WASM squid](https://github.com/subsquid/squid-wasm-template/blob/master/src/processor.ts). Illustrates how to use `SubstrateBatchProcessor` to index WASM smart contract data. See [WASM tutorial](/tutorials/create-a-wasm-processing-squid) for details.
- [An advanced squid tracking all the historical ERC20 and NFT transfers on Moonbeam](https://github.com/subsquid/moonbeam-erc-tokens). Illustrates the usage of wildcard selectors and a possible way to organize a growing squid codebase into submodules. 

More examples can be found by browsing the gallery of the [public squids in the Aquairum](https://app.subsquid.io/aquarium/squids?list=all). Inspect the squid sources by following the GitHub link on the squid page.
