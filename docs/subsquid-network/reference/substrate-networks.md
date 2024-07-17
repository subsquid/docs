---
sidebar_position: 20
description: >-
  Public Substrate gateways
title: Substrate networks
---

# Substrate gateways

## From open private network

The table below lists public Substrate gateways of the [open private network](/subsquid-network/overview/#open-private-network). Gateway URLs should be used with the [`setGateway()`](/sdk/reference/processors/substrate-batch/general/#set-gateway) `SubstrateBatchProcessor` configuration method, for example:

```typescript
const processor = new SubstrateBatchProcessor()
  .setGateway('https://v2.archive.subsquid.io/network/phala')
  .setRpcEndpoint('https://api.phala.network/rpc')
```

| Network                     | Gateway URL                                                   |
|:---------------------------:|:-------------------------------------------------------------:|
| Acala                       | https://v2.archive.subsquid.io/network/acala                  |
| Acurast Canary              | https://v2.archive.subsquid.io/network/acurast-canary         |
| Agung                       | https://v2.archive.subsquid.io/network/agung                  |
| Aleph Zero                  | https://v2.archive.subsquid.io/network/aleph-zero             |
| Aleph Zero Testnet          | https://v2.archive.subsquid.io/network/aleph-zero-testnet     |
| Amplitude                   | https://v2.archive.subsquid.io/network/amplitude              |
| Asset Hub Kusama (*)        | https://v2.archive.subsquid.io/network/asset-hub-kusama       |
| Asset Hub Polkadot (*)      | https://v2.archive.subsquid.io/network/asset-hub-polkadot     |
| Asset Hub Rococo            | https://v2.archive.subsquid.io/network/asset-hub-rococo       |
| Astar                       | https://v2.archive.subsquid.io/network/astar-substrate        |
| Avail Mainnet               | https://v2.archive.subsquid.io/network/avail                  |
| Basilisk                    | https://v2.archive.subsquid.io/network/basilisk               |
| Bifrost Kusama              | https://v2.archive.subsquid.io/network/bifrost-kusama         |
| Bifrost Polkadot            | https://v2.archive.subsquid.io/network/bifrost-polkadot       |
| Bittensor                   | https://v2.archive.subsquid.io/network/bittensor              |
| Bridge Hub Kusama           | https://v2.archive.subsquid.io/network/bridge-hub-kusama      |
| Bridge Hub Polkadot         | https://v2.archive.subsquid.io/network/bridge-hub-polkadot    |
| Bridge Hub Rococo           | https://v2.archive.subsquid.io/network/bridge-hub-rococo      |
| Bridge Hub Westend          | https://v2.archive.subsquid.io/network/bridge-hub-westend     |
| Centrifuge                  | https://v2.archive.subsquid.io/network/centrifuge             |
| Cere                        | https://v2.archive.subsquid.io/network/cere                   |
| Chainfliip                  | https://v2.archive.subsquid.io/network/chainflip              |
| Clover                      | https://v2.archive.subsquid.io/network/clover                 |
| Collectives Polkadot        | https://v2.archive.subsquid.io/network/collectives-polkadot   |
| Collectives Westend         | https://v2.archive.subsquid.io/network/collectives-westend    |
| Darwinia Crab               | https://v2.archive.subsquid.io/network/darwinia-crab          |
| Crust                       | https://v2.archive.subsquid.io/network/crust                  |
| Dancebox                    | https://v2.archive.subsquid.io/network/dancebox               |
| Darwinia                    | https://v2.archive.subsquid.io/network/darwinia               |
| Data Avail (Avail Goldberg) | https://v2.archive.subsquid.io/network/data-avail             |
| Eden                        | https://v2.archive.subsquid.io/network/eden                   |
| Enjin Canary Matrix         | https://v2.archive.subsquid.io/network/enjin-canary-matrix    |
| Enjin Matrix                | https://v2.archive.subsquid.io/network/enjin-matrix           |
| Equilibrium                 | https://v2.archive.subsquid.io/network/equilibrium            |
| Foucoco                     | https://v2.archive.subsquid.io/network/foucoco                |
| Frequency                   | https://v2.archive.subsquid.io/network/frequency              |
| HydraDX                     | https://v2.archive.subsquid.io/network/hydradx                |
| Integritee Network          | https://v2.archive.subsquid.io/network/integritee             |
| Interlay                    | https://v2.archive.subsquid.io/network/interlay               |
| Invarch Parachain           | https://v2.archive.subsquid.io/network/invarch-parachain      |
| Invarch Tinkernet           | https://v2.archive.subsquid.io/network/invarch-tinkernet      |
| Joystream                   | https://v2.archive.subsquid.io/network/joystream              |
| Karura                      | https://v2.archive.subsquid.io/network/karura                 |
| Khala                       | https://v2.archive.subsquid.io/network/khala                  |
| Kilt                        | https://v2.archive.subsquid.io/network/kilt                   |
| Kintsugi                    | https://v2.archive.subsquid.io/network/kintsugi               |
| Kusama                      | https://v2.archive.subsquid.io/network/kusama                 |
| Litentry                    | https://v2.archive.subsquid.io/network/litentry               |
| Litmus                      | https://v2.archive.subsquid.io/network/litmus                 |
| Moonbase                    | https://v2.archive.subsquid.io/network/moonbase-substrate     |
| Moonbeam                    | https://v2.archive.subsquid.io/network/moonbeam-substrate     |
| Moonriver                   | https://v2.archive.subsquid.io/network/moonriver-substrate    |
| Paseo                       | https://v2.archive.subsquid.io/network/paseo                  |
| Peaq                        | https://v2.archive.subsquid.io/network/peaq-mainnet-substrate |
| Pendulum                    | https://v2.archive.subsquid.io/network/pendulum               |
| Phala                       | https://v2.archive.subsquid.io/network/phala                  |
| Phala Testnet               | https://v2.archive.subsquid.io/network/phala-testnet          |
| Picasso                     | https://v2.archive.subsquid.io/network/picasso                |
| Polimec                     | https://v2.archive.subsquid.io/network/polimec                |
| Polkadex                    | https://v2.archive.subsquid.io/network/polkadex               |
| Polkadot                    | https://v2.archive.subsquid.io/network/polkadot               |
| Polymesh                    | https://v2.archive.subsquid.io/network/polymesh               |
| Reef                        | https://v2.archive.subsquid.io/network/reef                   |
| Reef Testnet                | https://v2.archive.subsquid.io/network/reef-testnet           |
| Robonomics                  | https://v2.archive.subsquid.io/network/robonomics             |
| Rococo                      | https://v2.archive.subsquid.io/network/rococo                 |
| Rolimec                     | https://v2.archive.subsquid.io/network/rolimec                |
| Shibuya                     | https://v2.archive.subsquid.io/network/shibuya-substrate      |
| Shiden                      | https://v2.archive.subsquid.io/network/shiden-substrate       |
| Sora                        | https://v2.archive.subsquid.io/network/sora-mainnet           |
| Subsocial Parachain         | https://v2.archive.subsquid.io/network/subsocial-parachain    |
| Ternoa                      | https://v2.archive.subsquid.io/network/ternoa                 |
| Turing                      | https://v2.archive.subsquid.io/network/turing-mainnet         |
| Turing Avail                | https://v2.archive.subsquid.io/network/turing-avail           |
| Vara                        | https://v2.archive.subsquid.io/network/vara                   |
| Vara Testnet                | https://v2.archive.subsquid.io/network/vara-testnet           |
| Westend                     | https://v2.archive.subsquid.io/network/westend                |
| xSocial                     | https://v2.archive.subsquid.io/network/xsocial                |
| Zeitgeist                   | https://v2.archive.subsquid.io/network/zeitgeist              |
| Zeitgeist Testnet           | https://v2.archive.subsquid.io/network/zeitgeist-testnet      |

(*) Asset Hub networks for Polkadot and Kusama were formerly known as Statemint and Statemine, respectively
