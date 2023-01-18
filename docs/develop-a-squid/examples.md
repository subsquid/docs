---
sidebar_position: 60
description: >-
  Squid examples
---

# Examples

:::info
Any GitHub repo can be used as a template for [sqd init](/squid-cli/init). Simply pass the repo URL to the `--template` flag.
:::

To learn by example, inspect these squids:

## EVM Processor

Browse a dedicated repository with [EVM squid examples](https://github.com/subsquid/squid-evm-examples). It contains:

- A squid [indexing transfers](https://github.com/subsquid/squid-evm-examples/tree/master/1-evm-logs) by extracting `Transfer(address,address,uint256)` logs emitted by a given contract
- A squid [indexing token swaps](https://github.com/subsquid/squid-evm-examples/tree/master/3-factory) from dynamically created AMM pools. 
- [A squid](https://github.com/subsquid/squid-evm-examples/tree/master/4-contract) that additionally queries the historical state of the contract.


Additionally, inspect the following benchmark squids:

- [A Gravatar squid](https://github.com/subsquid/squid-evm-template/tree/gravatar-squid) a simple squid migrated from a subgraph
- [Exosama Marketplace squid](https://github.com/subsquid/exosama-marketplace-squid) A squid indexing Exosama NFT metadata to power the [Exosama](https://exosama.com) NFT marketplace.
- [A Uniswap v3 squid](https://github.com/subsquid/uniswap-squid). A complex squid showcasing contract state calls, wildcard filters and optimizations for batch saving.


## Substrate Processor

Browse a dedicated repository with [Substrate squid examples](https://github.com/subsquid/squid-substrate-examples):

- [A simple squid tracking Kusama transfers](https://github.com/subsquid/squid-substrate-template). Illustrates a basic usage of `SubstrateBatchProcessor`.
- [A complex squid tracking balances across multiple parachains](https://github.com/subsquid/subsquid-balances). This complex squid illustrates the usage of `SubstrateBatchProcessor`, storage calls and custom resolvers.
- [Simple EVM squid](https://github.com/subsquid/squid-frontier-evm-template/blob/master/src/processor.ts). Illustrates how to use `SubstrateBatchProcessor` to index EVM logs. See [EVM tutorial](/tutorials/create-an-evm-processing-squid) for details.
- [Simple WASM squid](https://github.com/subsquid/squid-wasm-template/blob/master/src/processor.ts). Illustrates how to use `SubstrateBatchProcessor` to index WASM smart contract data. See [WASM tutorial](/tutorials/create-a-wasm-processing-squid) for details.
- [An advanced squid tracking all the historical ERC20 and NFT transfers on Moonbeam](https://github.com/subsquid/moonbeam-erc-tokens). Illustrates the usage of wildcard selectors and a possible way to organize a growing squid codebase into submodules. 

More examples can be found by browsing the gallery of the [public squids in the Aquairum](https://app.subsquid.io/aquarium/squids?list=all). Inspect the squid sources by following the GitHub link on the squid page.