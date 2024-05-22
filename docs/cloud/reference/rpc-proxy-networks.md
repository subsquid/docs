---
sidebar_position: 35
title: RPC service networks
description: Request a built-in RPC service
---

# RPC service networks

Enable the add-on with:
```yaml
deploy:
  addons:
    rpc:
      - eth-goerli.http
```
See the [RPC proxy guide](/cloud/resources/rpc-proxy) for details.

<details>

<summary>Available EVM networks</summary>

| Network name          | network.protocol             |
|:---------------------:|:----------------------------:|
| Arbitrum One          | `arbitrum-one.http`          |
| Arbitrum One Goerli   | `arbitrum-goerli.http`       |
| Arbitrum One Sepolia  | `arbitrum-sepolia.http`      |
| Arbitrum Nova         | `arbitrum-nova.http`         |
| Astar                 | `astar.http`                 |
| AVA                   | `ava.http`                   |
| AVA Testnet           | `ava-testnet.http`           |
| Base                  | `base.http`                  |
| Base Goerli           | `base-goerli.http`           |
| Base Sepolia          | `base-sepolia.http`          |
| BSC                   | `bsc.http`                   |
| BSC Testnet           | `bsc-testnet.http`           |
| Ethereum              | `eth.http`                   |
| Ethereum Goerli       | `eth-goerli.http`            |
| Ethereum Holesky      | `eth-holesky.http`           |
| Ethereum Sepolia      | `eth-sepolia.http`           |
| Evmos                 | `evmos.http`                 |
| Fantom                | `fantom.http`                |
| Fantom Testnet        | `fantom-testnet.http`        |
| Gnosis                | `gnosis.http`                |
| Mantle                | `mantle.http`                |
| Metis                 | `metis.http`                 |
| Moonbase              | `moonbase-alpha.http`        |
| Moonbeam              | `moonbeam.http`              |
| Moonriver             | `moonriver.http`             |
| OKTC                  | `undefined.http`             |
| Optimism              | `optimism.http`              |
| Optimism Goerli       | `optimism-goerli.http`       |
| Polygon               | `polygon.http`               |
| Polygon Testnet       | `polygon-testnet.http`       |
| Polygon zkEVM         | `polygon-zkevm.http`         |
| Polygon zkEVM Testnet | `polygon-zkevm-testnet.http` |
| Shibuya               | `shibuya.http`               |
| Shiden                | `shiden.http`                |

</details>

<details>

<summary>Available Substrate networks</summary>

| Network name         | network.protocol            |
|:--------------------:|:---------------------------:|
| Acala                | `acala.http`                |
| Aleph Zero           | `aleph-zero.http`           |
| Aleph Zero Testnet   | `aleph-zero-testnet.http`   |
| Amplitude            | `amplitude.http`            |
| Asset Hub Kusama     | `asset-hub-kusama.http`     |
| Asset Hub Polkadot   | `asset-hub-polkadot.http`   |
| Asset Hub Rococo     | `asset-hub-rococo.http`     |
| Asset Hub Westend    | `asset-hub-westend.http`    |
| Astar                | `astar-substrate.http`      |
| Basilisk             | `basilisk.http`             |
| Bridge Hub Kusama    | `bridge-hub-kusama.http`    |
| Bridge Hub Polkadot  | `bridge-hub-polkadot.http`  |
| Bridge Hub Rococo    | `bridge-hub-rococo.http`    |
| Bridge Hub Westend   | `bridge-hub-westend.http`   |
| Centrifuge           | `centrifuge.http`           |
| Collectives Polkadot | `collectives-polkadot.http` |
| Collectives Westend  | `collectives-westend.http`  |
| Crust                | `crust.http`                |
| Darwinia             | `darwinia.http`             |
| Darwiniacrab         | `darwiniacrab.http`         |
| Eden                 | `eden.http`                 |
| Frequency            | `frequency.http`            |
| Hydradx              | `hydradx.http`              |
| Interlay             | `interlay.http`             |
| Karura               | `karura.http`               |
| Khala                | `khala.http`                |
| Kilt                 | `kilt.http`                 |
| Kintsugi             | `kintsugi.http`             |
| Kusama               | `kusama.http`               |
| Mainnet              | `litentry.http`             |
| Moonbase             | `moonbase.http`             |
| Moonbeam             | `moonbeam-substrate.http`   |
| Moonriver            | `moonriver-substrate.http`  |
| Pendulum             | `pendulum.http`             |
| Phala                | `phala.http`                |
| Polkadex             | `polkadex.http`             |
| Polkadot             | `polkadot.http`             |
| Rococo               | `rococo.http`               |
| Shibuya              | `shibuya-substrate.http`    |
| Shiden               | `shiden-substrate.http`     |
| Turing               | `turing.http`               |
| Zeitgeist            | `zeitgeist.http`            |

</details>
