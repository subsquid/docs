---
sidebar_position: 35
title: addons.rpc section
description: Request a built-in RPC service
---

# addons.rpc manifest section

Enable the add-on like this:
```yaml
deploy:
  addons:
    rpc:
      - eth-goerli:http
```

<details>

<summary>Available EVM networks</summary>

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

</details>

<details>

<summary>Available Substrate networks</summary>

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

See [RPC proxy](/cloud/resources/rpc-proxy) guide for more details on the service.
