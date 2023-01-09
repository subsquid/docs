---
sidebar_position: 10
description: >-
  Squid examples for EVM chains
---

# EVM indexing examples

Browse a dedicated repository with [EVM squid examples](https://github.com/subsquid/squid-evm-examples). It contains:

- A squid [indexing transfers](https://github.com/subsquid/squid-evm-examples/tree/master/1-evm-logs) by extracting `Transfer(address,address,uint256)` logs emitted by a given contract
- A squid [indexing token swaps](https://github.com/subsquid/squid-evm-examples/tree/master/3-factory) from dynamically created AMM pools. 
- [A squid](https://github.com/subsquid/squid-evm-examples/tree/master/4-contract) that additionally queries the historical state of the contract.


Additionally, inspect the following benchmark squids:

- [A Gravatar squid](https://github.com/subsquid/squid-evm-template/tree/gravatar-squid) a simple squid migrated from a subgraph
- [Exosama Marketplace squid](https://github.com/subsquid/exosama-marketplace-squid) A squid indexing Exosama NFT metadata to power the [Exosama](https://exosama.com) NFT marketplace.
- [A Uniswap v3 squid](https://github.com/subsquid/uniswap-squid). A complex squid showcasing contract state calls, wildcard filters and optimizations for batch saving.
