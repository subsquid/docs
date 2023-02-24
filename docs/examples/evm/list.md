---
sidebar_position: 10
title: Examples list
description: >-
  Start here
---

# EVM indexing examples

:::info
Any GitHub repo can be used as a template for [sqd init](/squid-cli/init). Simply pass the repo URL to the `--template` flag.
:::

Browse a dedicated repository with [EVM squid examples](https://github.com/subsquid-labs/squid-evm-examples). It contains:

- A squid [indexing transfers](/examples/evm/evm-logs-example) by extracting `Transfer(address,address,uint256)` logs emitted by the USDC contract.
- A squid [indexing DEX trades](/examples/evm/factory-example) while dynamically tracking Uniswap v3 pool contracts as they are deployed. Shows [factory contract](/evm-indexing/factory-contracts) indexing in action.
- [A NFT indexing squid](/examples/evm/multicall-example) that additionally queries the NFT metadata from the contract state. Illustrates batching RPC calls using the [Multicall contract](/evm-indexing/squid-evm-typegen/#batching-contract-state-calls-using-the-multicall-contract).

and a few others.

Additionally, inspect the following benchmark squids:

- [Gravatar squid](https://github.com/subsquid/squid-evm-template/tree/gravatar-squid): a simple squid migrated from a subgraph
- [Exosama Marketplace squid](https://github.com/subsquid-labs/exosama-marketplace-squid)(*): A squid indexing Exosama NFT metadata to power the [Exosama](https://exosama.com) NFT marketplace.
- [Uniswap v3 squid](https://github.com/subsquid-labs/uniswap-squid)(*): A complex squid showcasing contract state calls, wildcard filters to index a dynamic set of contracts simultaneously and optimizations for batch saving.
- [A squid for ENS](https://github.com/subsquid-labs/ethereum-name-service-indexing/tree/ens-workshop) tokens. In the `ens-workshop` branch, token metadata is fetched from ENS APIs while indexing.
- [Bored Ape Yacht Club Indexer](https://github.com/subsquid-labs/bored-ape-yacht-club-indexing). A squid example that uses [Maker DAO's multicall smart contract](/evm-indexing/squid-evm-typegen/#batching-contract-state-calls-using-the-multicall-contract) and [API requests to fetch NFT metadata from IPFS](/basics/external-api). Also illustrates how to extend the GraphQL API with a  [custom resolver](/graphql-api/custom-resolvers) to show daily transfers.

(*) These archive squids use the older Makefile-based interface. Look into their README files for guidance.
