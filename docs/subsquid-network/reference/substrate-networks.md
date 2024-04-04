---
sidebar_position: 20
description: >-
  Public Substrate datasets
title: Substrate networks
---

# Substrate datasets

## From open private network

The table below lists the currently available public Substrate endpoints to be used with the [`setGateway()`](/sdk/reference/processors/substrate-batch/general/#set-gateway) `SubstrateBatchProcessor` configuration method. ArrowSquid URLs are served by the [open private network](/subsquid-network/overview/#open-private-network).

| Network              | ArrowSquid lookup command                              |
|:--------------------:|:------------------------------------------------------:|
| acala                | `lookupArchive('acala')`                               |
| agung                | `lookupArchive('agung')`                               |
| aleph-zero           | `lookupArchive('aleph-zero')`                          |
| aleph-zero-testnet   | `lookupArchive('aleph-zero-testnet')`                  |
| amplitude            | `lookupArchive('amplitude')`                           |
| asset-hub-kusama (*) | `lookupArchive('asset-hub-kusama')`                    |
| asset-hub-polkadot (*) | `lookupArchive('asset-hub-polkadot')`                  |
| asset-hub-rococo     | `lookupArchive('asset-hub-rococo')`                    |
| astar                | `lookupArchive('astar',` `{type: 'Substrate'})`        |
| basilisk             | `lookupArchive('basilisk')`                            |
| bifrost-kusama       | `lookupArchive('bifrost-kusama')`                      |
| bifrost-polkadot     | `lookupArchive('bifrost-polkadot')`                    |
| bridge-hub-kusama    | `lookupArchive('bridge-hub-kusama')`                   |
| bridge-hub-polkadot  | `lookupArchive('bridge-hub-polkadot')`                 |
| bridge-hub-rococo    | `lookupArchive('bridge-hub-rococo')`                   |
| bridge-hub-westend   | `lookupArchive('bridge-hub-westend')`                  |
| centrifuge           | `lookupArchive('centrifuge')`                          |
| cere                 | `lookupArchive('cere')`                                |
| chainflip            | `lookupArchive('chainflip')`                           |
| clover               | `lookupArchive('clover')`                              |
| data-avail           | `lookupArchive('data-avail')`                          |
| collectives-polkadot | `lookupArchive('collectives-polkadot')`                |
| collectives-westend  | `lookupArchive('collectives-westend')`                 |
| dancebox             | `lookupArchive('dancebox')`                            |
| crab                 | `lookupArchive('crab')`                                |
| crust                | `lookupArchive('crust')`                               |
| darwinia             | `lookupArchive('darwinia')`                            |
| eden                 | `lookupArchive('eden')`                                |
| enjin-matrix         | `lookupArchive('enjin-matrix')`                        |
| equilibrium          | `lookupArchive('equilibrium')`                         |
| foucoco              | `lookupArchive('foucoco')`                             |
| frequency            | `lookupArchive('frequency')`                           |
| hydradx              | `lookupArchive('hydradx')`                             |
| integritee-network   | `lookupArchive('integritee-network')`                  |
| interlay             | `lookupArchive('interlay')`                            |
| invarch-parachain    | `lookupArchive('invarch-parachain')`                   |
| invarch-tinkernet    | `lookupArchive('invarch-tinkernet')`                   |
| joystream            | `lookupArchive('joystream')`                           |
| karura               | `lookupArchive('karura')`                              |
| khala                | `lookupArchive('khala')`                               |
| kilt                 | `lookupArchive('kilt')`                                |
| kintsugi             | `lookupArchive('kintsugi')`                            |
| kusama               | `lookupArchive('kusama')`                              |
| litentry             | `lookupArchive('litentry')`                            |
| litmus               | `lookupArchive('litmus')`                              |
| moonbase             | `lookupArchive('moonbase',` `{type: 'Substrate'})`     |
| moonbeam             | `lookupArchive('moonbeam',` `{type: 'Substrate'})`     |
| moonriver            | `lookupArchive('moonriver',` `{type: 'Substrate'})`    |
| paseo                | `lookupArchive('paseo')`                               |
| peaq-mainnet         | `lookupArchive('peaq-mainnet',` `{type: 'Substrate'})` |
| pendulum             | `lookupArchive('pendulum')`                            |
| phala-testnet        | `lookupArchive('phala-testnet')`                       |
| phala                | `lookupArchive('phala')`                               |
| picasso              | `lookupArchive('picasso')`                             |
| polimec              | `lookupArchive('polimec')`                             |
| polkadex             | `lookupArchive('polkadex')`                            |
| polkadot             | `lookupArchive('polkadot')`                            |
| polymesh             | `lookupArchive('polymesh')`                            |
| reef                 | `lookupArchive('reef')`                                |
| reef-testnet         | `lookupArchive('reef-testnet')`                        |
| robonomics           | `lookupArchive('robonomics')`                          |
| rococo               | `lookupArchive('rococo')`                              |
| rolimec              | `lookupArchive('rolimec')`                             |
| shibuya              | `lookupArchive('shibuya')`                             |
| shiden               | `lookupArchive('shiden')`                              |
| sora                 | `lookupArchive('sora')`                                |
| subsocial-parachain  | `lookupArchive('subsocial-parachain')`                 |
| ternoa               | `lookupArchive('ternoa')`                              |
| vara                 | `lookupArchive('vara')`                                |
| vara-testnet         | `lookupArchive('vara-testnet')`                        |
| watr                 | `lookupArchive('watr')`                                |
| xsocial              | `lookupArchive('xsocial')`                             |
| zeitgeist            | `lookupArchive('zeitgeist')`                           |
| zeitgeist-testnet    | `lookupArchive('zeitgeist-testnet')`                   |

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
