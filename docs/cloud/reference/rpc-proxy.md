---
sidebar_position: 35
title: addons.rpc section
description: Built-in caching RPC endpoints
---

# RPC proxy

Since the Arrowsquid release, Subsquid Cloud provides a built-in caching RPC proxy service. Currently, it is a premium feature, with plans to make a subset of calls available to free tier users.

## Available networks

<details>

<summary>EVM</summary>

| Network name            | network:protocol             |
|-------------------------|------------------------------|
| Arbitrum One Mainnet    | `arbitrum-one:http`          |
| Arbitrum Goerli Testnet | `arbitrum-goerli:http`       |
| Arbitrum Nova Mainnet   | `arbitrum-nova:http`         |
| Astar Mainnet           | `astar:http`                 |
| Avalanche Mainnet       | `ava:http`                   |
| Avalanche Testnet       | `ava-testnet:http`           |
| Base Goerli             | `base-goerli:http`           |
| Base Mainnet            | `base:http`                  |
| BNB Smart Chain Mainnet | `bsc:http`                   |
| BNB Smart Chain Testnet | `bsc-testnet:http`           |
| Ethereum Goerli         | `eth-goerli:http`            |
| Ethereum Mainnet        | `eth:http`                   |
| Ethereum Sepolia        | `eth-sepolia:http`           |
| Evmos Mainnet           | `evmos:http`                 |
| Fantom Mainnet          | `fantom:http`                |
| Fantom Testnet          | `fantom-testnet:http`        |
| Mantle Mainnet          | `mantle:http`                |
| Metis Mainnet           | `metis:http`                 |
| Moonbase Alpha Testnet  | `moonbase-alpha:http`        |
| Moonbeam Mainnet        | `moonbeam:http`              |
| Moonriver Mainnet       | `moonriver:http`             |
| OKTC Mainnet            | `oktc:http`                  |
| Optimism Goerli         | `optimism-goerli:http`       |
| Optimism Mainnet        | `optimism:http`              |
| Polygon Mainnet         | `polygon:http`               |
| Polygon Testnet         | `polygon-testnet:http`       |
| Polygon zkEVM Mainnet   | `polygon-zkevm:http`         |
| Polygon zkEVM Testnet   | `polygon-zkevm-testnet:http` |
| Shiden Shibuya          | `shibuya:http`               |
| Shiden Mainnet          | `shiden:http`                |
| StarkNet Mainnet        | `starknet:http`              |
| Sui Testnet             | `sui-testnet:http`           |

</details>

<details>

<summary>Substrate</summary>

| Network name | network:protocol           |
|--------------|----------------------------|
| Acala        | `acala:http`               |
| Aleph        | `aleph:http`               |
| Amplitude    | `amplitude:http`           |
| Astar        | `astar-substrate:http`     |
| Basilisk     | `basilisk:http`            |
| Darwinia     | `darwinia:http`            |
| Darwiniacrab | `darwiniacrab:http`        |
| Eden         | `eden:http`                |
| Frequency    | `frequency:http`           |
| Hydradx      | `hydradx:http`             |
| Interlay     | `interlay:http`            |
| Karura       | `karura:http`              |
| Khala        | `khala:http`               |
| Kilt         | `kilt:http`                |
| Kintsugi     | `kintsugi:http`            |
| Kusama       | `kusama:http`              |
| Litentry     | `litentry:http`            |
| Moonbase     | `moonbase-substrate:http`  |
| Moonbeam     | `moonbeam-substrate:http`  |
| Moonriver    | `moonriver-substrate:http` |
| Phala        | `phala:http`               |
| Polkadot     | `polkadot:http`            |
| Shibuya      | `shibuya-substrate:http`   |
| Shiden       | `shiden-substrate:http`    |
| Turing       | `turing:http`              |
| Zeitgeist    | `zeitgeist:http`           |

</details>

Enable the RPC add-on like this:
```yaml
deploy:
  addons:
    rpc:
      - eth-goerli:http

scale:
  addons:
    rpc:
      max-rate: 10rps
```

## Processor configuration

With the add-on successfully enabled, your squid will get a unique proxied endpoint to the requested network. Subsquid Cloud will make its URL available to the deployed squid at the `RPC_${Upper(network)}_${Upper(protocol)}` environment variable. Assert it to avoid compilation errors. We also recommend rate limiting RPC proxy requests on the processor side to the same rate as was used in the manifest: 
```ts
import {assertNotNull} from '@subsquid/util-internal'

processor.setRpcEndpoint({
  // dash in "eth-goerli" becomes an underscore
  url: assertNotNull(process.env.RPC_ETH_GOERLI_HTTP),
  rateLimit: 10
})
```

## Pricing

RPC proxy requests are priced [at a flat rate](/cloud/pricing/#rpc-requests), with substantial packages included for free for all [organization types](/cloud/resources/organizations). Pricing does not depend on the call method.
