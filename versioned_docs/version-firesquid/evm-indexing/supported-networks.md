---
sidebar_position: 21
description: >-
  A list of public EVM archives
title: Supported networks
---

# Supported EVM networks

The table below lists the public EVM Archive endpoints to be used with the [`setDataSource()`](/evm-indexing/configuration) `EvmBatchProcessor` configuration method.

| Network                 |  Endpoint lookup command                    |        Archive endpoint                            |  
|:-----------------------:|:-------------------------:|:--------------------------------------------------:|
| Ethereum Mainnet        | `lookupArchive('eth-mainnet')`             |  `https://eth.archive.subsquid.io`                 |
| Ethereum Goerli Testnet | `lookupArchive('goerli')`                  |   `https://goerli.archive.subsquid.io`             | 
| Ethereum Sepolia Testnet |  `lookupArchive('sepolia')`               |  `https://sepolia.archive.subsquid.io`   |
| Polygon                 | `lookupArchive('polygon')`                 |   `https://polygon.archive.subsquid.io`            |
| Polygon Mumbai Testnet  | `lookupArchive('polygon-mumbai')`          | `https://polygon-mumbai.archive.subsquid.io`       |
| Arbitrum One            | `lookupArchive('arbitrum')`                | `https://arbitrum.archive.subsquid.io`          |
| Arbitrum Nova           | `lookupArchive('arbitrum-nova')`           | `https://arbitrum-nova.archive.subsquid.io`          |
| Arbitrum Goerli         | `lookupArchive('arbitrum-goerli')`           | `https://arbitrum-goerli.archive.subsquid.io`          |
| Base Goerli             | `lookupArchive('base-goerli')`           | `https://base-goerli.archive.subsquid.io`          |
| Binance Chain           | `lookupArchive('binance')`                 | `https://binance.archive.subsquid.io`              |
| Binance Chain Testnet   | `lookupArchive('binance-testnet')`         | `https://binance-testnet.archive.subsquid.io`      |
| Avalanche C-Chain        | `lookupArchive('avalanche')`               |  `https://avalanche-c.archive.subsquid.io`         |
| Fantom                  | `lookupArchive('fantom')`                  | `https://fantom.archive.subsquid.io`               |
| Optimism                | `lookupArchive('optimism-mainnet')`     | `https://optimism-mainnet.archive.subsquid.io` |                                                  |
| Moonbeam EVM    (*)          | `lookupArchive('moonbeam', {type: 'EVM'})`            | `https://moonbeam-evm.archive.subsquid.io`         |
| Moonriver EVM    (*)       | `lookupArchive('moonriver', {type: 'EVM'})`           | `https://moonriver-evm.archive.subsquid.io`       |
| Moonbase  EVM    (*)         | `lookupArchive('moonbase', {type: 'EVM'})`           | `https://moonbase-evm.archive.subsquid.io`         |
| Astar EVM     (*)         | `lookupArchive('astar', {type: 'EVM'})` | `https://astar-evm.archive.subsquid.io`            |
| Scroll Alpha Testnet    | `lookupArchive('scroll-alpha-testnet')` | `https://scroll-alpha-testnet.archive.subsquid.io` |
| ZkSync                  | `lookupArchive('zksync')`   | `https://zksync.archive.subsquid.io` |
| ZkSync Testnet          | `lookupArchive('zksync-testnet')`   | `https://zksync-testnet.archive.subsquid.io` |
| SKALE Calypso           | `lookupArchive('skale-calypso')`           | `https://skale-calypso.archive.subsquid.io`        |
| SKALE Calypso (stage)   | `lookupArchive('skale-calypso-staging')`     | `https://skale-calypso-staging.archive.subsquid.io`  |
| SKALE Nebula            | `lookupArchive('skale-nebula')`           | `https://skale-nebula.archive.subsquid.io`        |
| SKALE Nebula (stage)    | `lookupArchive('skale-nebula-staging')`     | `https://skale-nebula-staging.archive.subsquid.io`  |
| BOBA Ethereum           | `lookupArchive('boba-eth')`                | `https://boba-eth.archive.subsquid.io`             |
| BOBA Moonbeam           | `lookupArchive('boba-moonbeam')`           |  `https://boba-moonbeam.archive.subsquid.io`       |
| Mantle testnet          | `lookupArchive('mantle-testnet')`          | `https://mantle-testnet.archive.subsquid.io`       |
| Exosama Network         | `lookupArchive('exosama')`                 |`https://exosama.archive.subsquid.io`               |
 
(*) Only for EVM data. For Substrate/ink! data use the corresponding [Substrate archive](/archives/substrate)


### Examples 

Explicit Archive endpoints:
```typescript
const processor = new EvmBatchProcessor()
  .setDataSource({
     chain: 'https://rpc.ankr.com/eth', // RPC endpoint
     archive: 'https://eth.archive.subsquid.io'
  })
```
Registry lookup:
```typescript
import { lookupArchive } from '@subsquid/archive-registry'

const processor = new EvmBatchProcessor()
  .setDataSource({
     // resolved to 'https://moonriver-evm.archive.subsquid.io'
     archive: lookupArchive('moonriver', {type: 'EVM'}) 
   })
```
