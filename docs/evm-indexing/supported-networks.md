---
sidebar_position: 21
description: >-
  A list of public EVM archives
title: Supported networks
---

# Supported EVM networks

The table below lists the currently available public EVM ArrowSquid/v2 Archive endpoints to be used with the [`setDataSource()`](/evm-indexing/configuration/initialization) `EvmBatchProcessor` configuration method.

| Network               | State diffs | Traces | Lookup command                                |
|:---------------------:|:-----------:|:------:|:---------------------------------------------:|
| arbitrum              |             |        | `lookupArchive('arbitrum')`                   |
| arbitrum-goerli       |             | ✓      | `lookupArchive('arbitrum-goerli')`            |
| arbitrum-nova         |             | ✓      | `lookupArchive('arbitrum-nova')`              |
| astar (*)             |             |        | `lookupArchive('astar',` `{type: 'EVM'})`     |
| avalanche             |             |        | `lookupArchive('avalanche')`                  |
| avalanche-testnet     |             |        | `lookupArchive('avalanche-testnet')`          |
| base-mainnet          | ✓           | ✓      | `lookupArchive('base-mainnet')`               |
| base-goerli           |             |        | `lookupArchive('base-goerli')`                |
| binance               | ✓           | ✓      | `lookupArchive('binance')`                    |
| binance-testnet       |             |        | `lookupArchive('binance-testnet')`            |
| eth-mainnet           | ✓           | ✓      | `lookupArchive('eth-mainnet')`                |
| eth-goerli            | ✓           | ✓      | `lookupArchive('eth-goerli')`                 |
| fantom                |             |        | `lookupArchive('fantom')`                     |
| fantom-testnet        |             |        | `lookupArchive('fantom-testnet')`             |
| flare-mainnet         |             |        | `lookupArchive('flare-mainnet')`              |
| gnosis-mainnet        | ✓           | ✓      | `lookupArchive('gnosis-mainnet')`             |
| linea-mainnet         |             | ✓      | `lookupArchive('linea-mainnet')`              |
| mineplex-testnet      | ✓           | ✓      | `lookupArchive('mineplex-testnet')`           |
| moonbase (*)          |             |        | `lookupArchive('moonbase',` `{type: 'EVM'})`  |
| moonbeam (*)          |             |        | `lookupArchive('moonbeam',` `{type: 'EVM'})`  |
| moonriver (*)         |             | ✓      | `lookupArchive('moonriver',` `{type: 'EVM'})` |
| moonsama (*)          |             |        | `lookupArchive('moonsama',` `{type: 'EVM'})`  |
| neon-mainnet          |             |        | `lookupArchive('neon-mainnet')`               |
| optimism-mainnet      | ✓           | ✓      | `lookupArchive('optimism-mainnet')`           |
| optimism-goerli       | ✓           | ✓      | `lookupArchive('optimism-goerli')`            |
| polygon               |             |        | `lookupArchive('polygon')`                    |
| polygon-mumbai        |             |        | `lookupArchive('polygon-mumbai')`             |
| polygon-zkevm         |             |        | `lookupArchive('polygon-zkevm')`              |
| polygon-zkevm-testnet |             |        | `lookupArchive('polygon-zkevm-testnet')`      |
| sepolia               | ✓           | ✓      | `lookupArchive('sepolia')`                    |
| shibuya-testnet (*)   |             |        | `lookupArchive('shibuya-testnet')`            |
| shiden-mainnet (*)    |             |        | `lookupArchive('shiden-mainnet')`             |
| zksync-mainnet        |             | ✓      | `lookupArchive('zksync-mainnet')`             |
| zksync-testnet        |             | ✓      | `lookupArchive('zksync-testnet')`             |

(*) Only for EVM data. For Substrate/ink! data use the corresponding [Substrate archive](/substrate-indexing/supported-networks).

### Examples 

Registry lookup:
```typescript
import { lookupArchive } from '@subsquid/archive-registry'

const processor = new EvmBatchProcessor()
  .setDataSource({
     // resolves to 'https://v2.archive.subsquid.io/network/ethereum-mainnet'
     archive: lookupArchive('eth-mainnet')
   })
```
Explicit Archive endpoints:
```typescript
const processor = new EvmBatchProcessor()
  .setDataSource({
     chain: 'https://rpc.ankr.com/eth', // RPC endpoint
     archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet'
  })
```
