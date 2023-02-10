---
sidebar_position: 50
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

- A squid [indexing ERC20 transfers](https://github.com/subsquid-labs/evm-logs-example) by extracting `Transfer(address,address,uint256)` logs emitted by USDC the contract
- A squid [indexing DEX trades](https://github.com/subsquid-labs/factory-example) by dynamically tracking Uniswap v3 pools. Shows a [factory contract](/evm-indexing/factory-contracts) indexing in action
- [A NFT indexing squid](https://github.com/subsquid-labs/multicall-example) that additionally queries the NFT metadata from the contract state. Illustrates batching RPC calls using the [Multicall contract](/evm-indexing/squid-evm-typegen/#batching-contract-state-calls-using-the-multicall-contract).


Additionally, inspect the following benchmark squids:

- [A Gravatar squid](https://github.com/subsquid/squid-evm-template/tree/gravatar-squid) a simple squid migrated from a subgraph
- [Exosama Marketplace squid](https://github.com/subsquid/exosama-marketplace-squid) A squid indexing Exosama NFT metadata to power the [Exosama](https://exosama.com) NFT marketplace.
- [A Uniswap v3 squid](https://github.com/subsquid/uniswap-squid). A complex squid showcasing contract state calls, wildcard filters to index a dynamic set of contracts simultaneously and optimizations for batch saving.
- [A squid for ENS](https://github.com/subsquid-labs/ethereum-name-service-indexing/tree/ens-workshop) tokens. In the `ens-workshop` branch, token metadata is fetched from ENS APIs, while indexing.
- [Bored Ape Yacht Club Indexer](https://github.com/subsquid-labs/bored-ape-yacht-club-indexing). A squid example that uses [Maker DAO's multicall smart contract](/evm-indexing/squid-evm-typegen/#batching-contract-state-calls-using-the-multicall-contract) and [API requests to fetch NFT metadata from IPFS](/basics/external-api). Also illustrates how to extend the GraphQL API with a  [custom resolver](/graphql-api/custom-resolvers) to show daily transfers.


## Substrate Processor

Browse a dedicated repository with [Substrate squid examples](https://github.com/subsquid/squid-substrate-examples):

- [A simple squid tracking Kusama transfers](https://github.com/subsquid/squid-substrate-template). Illustrates a basic usage of `SubstrateBatchProcessor`.
- [A complex squid tracking balances across multiple parachains](https://github.com/subsquid/subsquid-balances). This complex squid illustrates the usage of `SubstrateBatchProcessor`, storage calls and custom resolvers.
- [Simple EVM squid](https://github.com/subsquid/squid-frontier-evm-template/blob/master/src/processor.ts). Illustrates how to use `SubstrateBatchProcessor` to index EVM logs. See [EVM tutorial](/tutorials/create-an-evm-processing-squid) for details.
- [Simple WASM squid](https://github.com/subsquid/squid-wasm-template/blob/master/src/processor.ts). Illustrates how to use `SubstrateBatchProcessor` to index WASM smart contract data. See [WASM tutorial](/tutorials/create-a-wasm-processing-squid) for details.
- [An advanced squid tracking all the historical ERC20 and NFT transfers on Moonbeam](https://github.com/subsquid/moonbeam-erc-tokens). Illustrates the usage of wildcard selectors and a possible way to organize a growing squid codebase into submodules. 

More examples can be found by browsing the gallery of the [public squids in the Aquairum](https://app.subsquid.io/aquarium/squids?list=all). Inspect the squid sources by following the GitHub link on the squid page.
