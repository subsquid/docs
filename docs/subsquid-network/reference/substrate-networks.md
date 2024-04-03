---
sidebar_position: 20
description: >-
  Public Substrate datasets
title: Substrate networks
---

# Substrate datasets

## From open private network

The table below lists the currently available public Substrate endpoints to be used with the [`setGateway()`](/sdk/reference/processors/substrate-batch/general/#set-gateway) `SubstrateBatchProcessor` configuration method. ArrowSquid URLs are served by the [open private network](/subsquid-network/overview/#open-private-network).

| Network              | ArrowSquid lookup command                                                       |
|:--------------------:|:-------------------------------------------------------------------------------:|
| acala                | `lookupArchive('acala',` `{release: 'ArrowSquid'})`                             |
| agung                | `lookupArchive('agung',` `{release: 'ArrowSquid'})`                             |
| aleph-zero           | `lookupArchive('aleph-zero',` `{release: 'ArrowSquid'})`                        |
| aleph-zero-testnet   | `lookupArchive('aleph-zero-testnet',` `{release: 'ArrowSquid'})`                |
| amplitude            | `lookupArchive('amplitude',` `{release: 'ArrowSquid'})`                         |
| asset-hub-kusama (*) | `lookupArchive('asset-hub-kusama',` `{release: 'ArrowSquid'})`                  |
| asset-hub-polkadot (*) | `lookupArchive('asset-hub-polkadot',` `{release: 'ArrowSquid'})`                |
| asset-hub-rococo     | `lookupArchive('asset-hub-rococo',` `{release: 'ArrowSquid'})`                  |
| astar                | `lookupArchive('astar',` `{type: 'Substrate',` `release: 'ArrowSquid'})`        |
| basilisk             | `lookupArchive('basilisk',` `{release: 'ArrowSquid'})`                          |
| bifrost-kusama       | `lookupArchive('bifrost-kusama',` `{release: 'ArrowSquid'})`                    |
| bifrost-polkadot     | `lookupArchive('bifrost-polkadot',` `{release: 'ArrowSquid'})`                  |
| bridge-hub-kusama    | `lookupArchive('bridge-hub-kusama',` `{release: 'ArrowSquid'})`                 |
| bridge-hub-polkadot  | `lookupArchive('bridge-hub-polkadot',` `{release: 'ArrowSquid'})`               |
| bridge-hub-rococo    | `lookupArchive('bridge-hub-rococo',` `{release: 'ArrowSquid'})`                 |
| bridge-hub-westend   | `lookupArchive('bridge-hub-westend',` `{release: 'ArrowSquid'})`                |
| centrifuge           | `lookupArchive('centrifuge',` `{release: 'ArrowSquid'})`                        |
| cere                 | `lookupArchive('cere',` `{release: 'ArrowSquid'})`                              |
| chainflip            | `lookupArchive('chainflip',` `{release: 'ArrowSquid'})`                         |
| clover               | `lookupArchive('clover',` `{release: 'ArrowSquid'})`                            |
| data-avail           | `lookupArchive('data-avail',` `{release: 'ArrowSquid'})`                        |
| collectives-polkadot | `lookupArchive('collectives-polkadot',` `{release: 'ArrowSquid'})`              |
| collectives-westend  | `lookupArchive('collectives-westend',` `{release: 'ArrowSquid'})`               |
| dancebox             | `lookupArchive('dancebox',` `{release: 'ArrowSquid'})`                          |
| crab                 | `lookupArchive('crab',` `{release: 'ArrowSquid'})`                              |
| crust                | `lookupArchive('crust',` `{release: 'ArrowSquid'})`                             |
| darwinia             | `lookupArchive('darwinia',` `{release: 'ArrowSquid'})`                          |
| eden                 | `lookupArchive('eden',` `{release: 'ArrowSquid'})`                              |
| enjin-matrix         | `lookupArchive('enjin-matrix',` `{release: 'ArrowSquid'})`                      |
| equilibrium          | `lookupArchive('equilibrium',` `{release: 'ArrowSquid'})`                       |
| foucoco              | `lookupArchive('foucoco',` `{release: 'ArrowSquid'})`                           |
| frequency            | `lookupArchive('frequency',` `{release: 'ArrowSquid'})`                         |
| hydradx              | `lookupArchive('hydradx',` `{release: 'ArrowSquid'})`                           |
| integritee-network   | `lookupArchive('integritee-network',` `{release: 'ArrowSquid'})`                |
| interlay             | `lookupArchive('interlay',` `{release: 'ArrowSquid'})`                          |
| invarch-parachain    | `lookupArchive('invarch-parachain',` `{release: 'ArrowSquid'})`                 |
| invarch-tinkernet    | `lookupArchive('invarch-tinkernet',` `{release: 'ArrowSquid'})`                 |
| joystream            | `lookupArchive('joystream',` `{release: 'ArrowSquid'})`                         |
| karura               | `lookupArchive('karura',` `{release: 'ArrowSquid'})`                            |
| khala                | `lookupArchive('khala',` `{release: 'ArrowSquid'})`                             |
| kilt                 | `lookupArchive('kilt',` `{release: 'ArrowSquid'})`                              |
| kintsugi             | `lookupArchive('kintsugi',` `{release: 'ArrowSquid'})`                          |
| kusama               | `lookupArchive('kusama',` `{release: 'ArrowSquid'})`                            |
| litentry             | `lookupArchive('litentry',` `{release: 'ArrowSquid'})`                          |
| litmus               | `lookupArchive('litmus',` `{release: 'ArrowSquid'})`                            |
| moonbase             | `lookupArchive('moonbase',` `{type: 'Substrate',` `release: 'ArrowSquid'})`     |
| moonbeam             | `lookupArchive('moonbeam',` `{type: 'Substrate',` `release: 'ArrowSquid'})`     |
| moonriver            | `lookupArchive('moonriver',` `{type: 'Substrate',` `release: 'ArrowSquid'})`    |
| paseo                | `lookupArchive('paseo',` `{release: 'ArrowSquid'})`                             |
| peaq-mainnet         | `lookupArchive('peaq-mainnet',` `{type: 'Substrate',` `release: 'ArrowSquid'})` |
| pendulum             | `lookupArchive('pendulum',` `{release: 'ArrowSquid'})`                          |
| phala-testnet        | `lookupArchive('phala-testnet',` `{release: 'ArrowSquid'})`                     |
| phala                | `lookupArchive('phala',` `{release: 'ArrowSquid'})`                             |
| picasso              | `lookupArchive('picasso',` `{release: 'ArrowSquid'})`                           |
| polimec              | `lookupArchive('polimec',` `{release: 'ArrowSquid'})`                           |
| polkadex             | `lookupArchive('polkadex',` `{release: 'ArrowSquid'})`                          |
| polkadot             | `lookupArchive('polkadot',` `{release: 'ArrowSquid'})`                          |
| polymesh             | `lookupArchive('polymesh',` `{release: 'ArrowSquid'})`                          |
| reef                 | `lookupArchive('reef',` `{release: 'ArrowSquid'})`                              |
| reef-testnet         | `lookupArchive('reef-testnet',` `{release: 'ArrowSquid'})`                      |
| robonomics           | `lookupArchive('robonomics',` `{release: 'ArrowSquid'})`                        |
| rococo               | `lookupArchive('rococo',` `{release: 'ArrowSquid'})`                            |
| rolimec              | `lookupArchive('rolimec',` `{release: 'ArrowSquid'})`                           |
| shibuya              | `lookupArchive('shibuya',` `{release: 'ArrowSquid'})`                           |
| shiden               | `lookupArchive('shiden',` `{release: 'ArrowSquid'})`                            |
| sora                 | `lookupArchive('sora',` `{release: 'ArrowSquid'})`                              |
| subsocial-parachain  | `lookupArchive('subsocial-parachain',` `{release: 'ArrowSquid'})`               |
| ternoa               | `lookupArchive('ternoa',` `{release: 'ArrowSquid'})`                            |
| vara                 | `lookupArchive('vara',` `{release: 'ArrowSquid'})`                              |
| vara-testnet         | `lookupArchive('vara-testnet',` `{release: 'ArrowSquid'})`                      |
| watr                 | `lookupArchive('watr',` `{release: 'ArrowSquid'})`                              |
| xsocial              | `lookupArchive('xsocial',` `{release: 'ArrowSquid'})`                           |
| zeitgeist            | `lookupArchive('zeitgeist',` `{release: 'ArrowSquid'})`                         |
| zeitgeist-testnet    | `lookupArchive('zeitgeist-testnet',` `{release: 'ArrowSquid'})`                 |

(*) Asset Hub networks for Polkadot and Kusama were formerly known as Statemint and Statemine, respectively

### Example

```typescript
import { lookupArchive } from '@subsquid/archive-registry'

const processor = new SubstrateBatchProcessor()
  // the lookupArchive() call resolves to
  // 'https://v2.archive.subsquid.io/network/phala'
  .setGateway(lookupArchive('phala', {release: 'ArrowSquid'}))
  .setRpcEndpoint('https://api.phala.network/rpc')
```
