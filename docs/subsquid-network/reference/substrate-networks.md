---
sidebar_position: 20
description: >-
  Public Substrate datasets
title: Substrate networks
---

# Substrate datasets

## From open private network

The table below lists the currently available public Substrate endpoints to be used with the [`setGateway()`](/sdk/reference/processors/substrate-batch/general/#set-gateway) `SubstrateBatchProcessor` configuration method. ArrowSquid URLs are served by the [open private network](/subsquid-network/overview/#open-private-network).

| Network              | FireSquid lookup command                            | ArrowSquid lookup command                                                    |
|:--------------------:|:---------------------------------------------------:|:----------------------------------------------------------------------------:|
| acala                | `lookupArchive('acala')`                            | `lookupArchive('acala',` `{release: 'ArrowSquid'})`                          |
| aleph-zero           | `lookupArchive('aleph-zero')`                       | `lookupArchive('aleph-zero',` `{release: 'ArrowSquid'})`                     |
| aleph-zero-testnet   | not available                                       | `lookupArchive('aleph-zero-testnet',` `{release: 'ArrowSquid'})`             |
| altair               | `lookupArchive('altair')`                           | temporarily unavailable                                                      |
| amplitude            | `lookupArchive('amplitude')`                        | `lookupArchive('amplitude',` `{release: 'ArrowSquid'})`                      |
| asset-hub-kusama (*) | not available                                       | `lookupArchive('asset-hub-kusama',` `{release: 'ArrowSquid'})`               |
| asset-hub-polkadot (*) | not available                                       | `lookupArchive('asset-hub-polkadot',` `{release: 'ArrowSquid'})`             |
| asset-hub-rococo     | not available                                       | `lookupArchive('asset-hub-rococo',` `{release: 'ArrowSquid'})`               |
| astar                | `lookupArchive('astar',` `{type: 'Substrate'})`     | `lookupArchive('astar',` `{type: 'Substrate',` `release: 'ArrowSquid'})`     |
| bajun                | `lookupArchive('bajun')`                            | temporarily unavailable                                                      |
| basilisk             | `lookupArchive('basilisk')`                         | `lookupArchive('basilisk',` `{release: 'ArrowSquid'})`                       |
| bifrost              | `lookupArchive('bifrost')`                          | temporarily unavailable                                                      |
| bifrost-polkadot     | `lookupArchive('bifrost-polkadot')`                 | `lookupArchive('bifrost-polkadot',` `{release: 'ArrowSquid'})`               |
| bridge-hub-kusama    | not available                                       | `lookupArchive('bridge-hub-kusama',` `{release: 'ArrowSquid'})`              |
| bridge-hub-polkadot  | not available                                       | `lookupArchive('bridge-hub-polkadot',` `{release: 'ArrowSquid'})`            |
| bridge-hub-rococo    | not available                                       | `lookupArchive('bridge-hub-rococo',` `{release: 'ArrowSquid'})`              |
| bridge-hub-westend   | not available                                       | `lookupArchive('bridge-hub-westend',` `{release: 'ArrowSquid'})`             |
| calamari             | `lookupArchive('calamari')`                         | temporarily unavailable                                                      |
| centrifuge           | `lookupArchive('centrifuge')`                       | `lookupArchive('centrifuge',` `{release: 'ArrowSquid'})`                     |
| cere                 | `lookupArchive('cere')`                             | `lookupArchive('cere',` `{release: 'ArrowSquid'})`                           |
| clover               | `lookupArchive('clover')`                           | `lookupArchive('clover',` `{release: 'ArrowSquid'})`                         |
| data-avail           | not available                                       | `lookupArchive('data-avail',` `{release: 'ArrowSquid'})`                     |
| collectives          | `lookupArchive('collectives')`                      | temporarily unavailable                                                      |
| collectives-polkadot | not available                                       | `lookupArchive('collectives-polkadot',` `{release: 'ArrowSquid'})`           |
| collectives-westend  | not available                                       | `lookupArchive('collectives-westend',` `{release: 'ArrowSquid'})`            |
| composable-finance   | `lookupArchive('composable-finance')`               | temporarily unavailable                                                      |
| crab                 | `lookupArchive('crab')`                             | `lookupArchive('crab',` `{release: 'ArrowSquid'})`                           |
| crust                | `lookupArchive('crust')`                            | `lookupArchive('crust',` `{release: 'ArrowSquid'})`                          |
| darwinia             | `lookupArchive('darwinia')`                         | `lookupArchive('darwinia',` `{release: 'ArrowSquid'})`                       |
| eden                 | not available                                       | `lookupArchive('eden',` `{release: 'ArrowSquid'})`                           |
| elysium              | `lookupArchive('elysium')`                          | temporarily unavailable                                                      |
| enjin-matrix         | `lookupArchive('enjin-matrix')`                     | `lookupArchive('enjin-matrix',` `{release: 'ArrowSquid'})`                   |
| equilibrium          | `lookupArchive('equilibrium')`                      | `lookupArchive('equilibrium',` `{release: 'ArrowSquid'})`                    |
| foucoco              | not available                                       | `lookupArchive('foucoco',` `{release: 'ArrowSquid'})`                        |
| frequency            | `lookupArchive('frequency')`                        | `lookupArchive('frequency',` `{release: 'ArrowSquid'})`                      |
| gmordie              | `lookupArchive('gmordie')`                          | temporarily unavailable                                                      |
| hashed               | `lookupArchive('hashed')`                           | temporarily unavailable                                                      |
| heiko                | `lookupArchive('heiko')`                            | temporarily unavailable                                                      |
| hydradx              | `lookupArchive('hydradx')`                          | `lookupArchive('hydradx',` `{release: 'ArrowSquid'})`                        |
| integritee-network   | `lookupArchive('integritee-network')`               | `lookupArchive('integritee-network',` `{release: 'ArrowSquid'})`             |
| interlay             | `lookupArchive('interlay')`                         | `lookupArchive('interlay',` `{release: 'ArrowSquid'})`                       |
| invarch-parachain    | not available                                       | `lookupArchive('invarch-parachain',` `{release: 'ArrowSquid'})`              |
| invarch-tinkernet    | `lookupArchive('invarch-tinkernet')`                | `lookupArchive('invarch-tinkernet',` `{release: 'ArrowSquid'})`              |
| joystream            | `lookupArchive('joystream')`                        | `lookupArchive('joystream',` `{release: 'ArrowSquid'})`                      |
| karura               | `lookupArchive('karura')`                           | `lookupArchive('karura',` `{release: 'ArrowSquid'})`                         |
| khala                | `lookupArchive('khala')`                            | `lookupArchive('khala',` `{release: 'ArrowSquid'})`                          |
| kilt                 | `lookupArchive('kilt')`                             | `lookupArchive('kilt',` `{release: 'ArrowSquid'})`                           |
| kintsugi             | `lookupArchive('kintsugi')`                         | `lookupArchive('kintsugi',` `{release: 'ArrowSquid'})`                       |
| kusama               | `lookupArchive('kusama')`                           | `lookupArchive('kusama',` `{release: 'ArrowSquid'})`                         |
| litentry             | `lookupArchive('litentry')`                         | `lookupArchive('litentry',` `{release: 'ArrowSquid'})`                       |
| litmus               | `lookupArchive('litmus')`                           | `lookupArchive('litmus',` `{release: 'ArrowSquid'})`                         |
| manta                | `lookupArchive('manta')`                            | temporarily unavailable                                                      |
| moonbase             | not available                                       | `lookupArchive('moonbase',` `{type: 'Substrate',` `release: 'ArrowSquid'})`  |
| moonbeam             | `lookupArchive('moonbeam',` `{type: 'Substrate'})`  | `lookupArchive('moonbeam',` `{type: 'Substrate',` `release: 'ArrowSquid'})`  |
| moonriver            | `lookupArchive('moonriver',` `{type: 'Substrate'})` | `lookupArchive('moonriver',` `{type: 'Substrate',` `release: 'ArrowSquid'})` |
| origin-trail         | `lookupArchive('origin-trail')`                     | temporarily unavailable                                                      |
| paseo                | not available                                       | `lookupArchive('paseo',` `{release: 'ArrowSquid'})`                          |
| pangolin             | `lookupArchive('pangolin')`                         | temporarily unavailable                                                      |
| pangoro              | `lookupArchive('pangoro')`                          | temporarily unavailable                                                      |
| peaq                 | `lookupArchive('peaq')`                             | temporarily unavailable                                                      |
| pendulum             | `lookupArchive('pendulum')`                         | `lookupArchive('pendulum',` `{release: 'ArrowSquid'})`                       |
| phala-testnet        | not available                                       | `lookupArchive('phala-testnet',` `{release: 'ArrowSquid'})`                  |
| phala                | `lookupArchive('phala')`                            | `lookupArchive('phala',` `{release: 'ArrowSquid'})`                          |
| picasso              | `lookupArchive('picasso')`                          | `lookupArchive('picasso',` `{release: 'ArrowSquid'})`                        |
| polimec              | not available                                       | `lookupArchive('polimec',` `{release: 'ArrowSquid'})`                        |
| polkadex             | `lookupArchive('polkadex')`                         | `lookupArchive('polkadex',` `{release: 'ArrowSquid'})`                       |
| polkadot             | `lookupArchive('polkadot')`                         | `lookupArchive('polkadot',` `{release: 'ArrowSquid'})`                       |
| polymesh             | not available                                       | `lookupArchive('polymesh',` `{release: 'ArrowSquid'})`                       |
| reef                 | `lookupArchive('reef')`                             | `lookupArchive('reef',` `{release: 'ArrowSquid'})`                           |
| reef-testnet         | not available                                       | `lookupArchive('reef-testnet',` `{release: 'ArrowSquid'})`                   |
| robonomics           | `lookupArchive('robonomics')`                       | `lookupArchive('robonomics',` `{release: 'ArrowSquid'})`                     |
| rococo               | not available                                       | `lookupArchive('rococo',` `{release: 'ArrowSquid'})`                         |
| rolimec              | not available                                       | `lookupArchive('rolimec',` `{release: 'ArrowSquid'})`                        |
| shibuya              | `lookupArchive('shibuya')`                          | `lookupArchive('shibuya',` `{release: 'ArrowSquid'})`                        |
| shiden               | `lookupArchive('shiden')`                           | `lookupArchive('shiden',` `{release: 'ArrowSquid'})`                         |
| sora                 | `lookupArchive('sora')`                             | `lookupArchive('sora',` `{release: 'ArrowSquid'})`                           |
| statemine            | `lookupArchive('statemine')`                        | temporarily unavailable                                                      |
| statemint            | `lookupArchive('statemint')`                        | temporarily unavailable                                                      |
| subsocial-parachain  | `lookupArchive('subsocial-parachain')`              | `lookupArchive('subsocial-parachain',` `{release: 'ArrowSquid'})`            |
| subsocial            | `lookupArchive('subsocial')`                        | temporarily unavailable                                                      |
| t0rn                 | `lookupArchive('t0rn')`                             | temporarily unavailable                                                      |
| tanganika            | `lookupArchive('tanganika')`                        | temporarily unavailable                                                      |
| ternoa               | `lookupArchive('ternoa')`                           | temporarily unavailable                                                      |
| turing               | `lookupArchive('turing')`                           | unavailable                                                                  |
| vara                 | `lookupArchive('vara')`                             | `lookupArchive('vara',` `{release: 'ArrowSquid'})`                           |
| vara-testnet         | not available                                       | `lookupArchive('vara-testnet',` `{release: 'ArrowSquid'})`                   |
| xx-network           | `lookupArchive('xx-network')`                       | temporarily unavailable                                                      |
| watr                 | not available                                       | `lookupArchive('watr',` `{release: 'ArrowSquid'})`                           |
| xsocial              | not available                                       | `lookupArchive('xsocial',` `{release: 'ArrowSquid'})`                        |
| zeitgeist            | `lookupArchive('zeitgeist')`                        | `lookupArchive('zeitgeist',` `{release: 'ArrowSquid'})`                      |
| zeitgeist-testnet    | not available                                       | `lookupArchive('zeitgeist-testnet',` `{release: 'ArrowSquid'})`              |

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
