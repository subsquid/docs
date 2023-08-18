---
sidebar_position: 21
description: >-
  A list of public EVM archives
title: Supported networks
---

# Supported EVM networks

[//]: # (!!!! keep the list updated, remove the notice below once it is final)

The table below lists the currently available public EVM ArrowSquid/v2 Archive endpoints to be used with the [`setDataSource()`](/evm-indexing/configuration/initialization) `EvmBatchProcessor` configuration method. For v1/FireSquid Archives consult [this page](/firesquid/evm-indexing/supported-networks).

| Network                          |  Endpoint lookup command                      |        Archive endpoint                                        |
|:--------------------------------:|:---------------------------------------------:|:--------------------------------------------------------------:|
| Arbitrum One (**)                | `lookupArchive('arbitrum')`                   | `https://v2.archive.subsquid.io/network/arbitrum-one`          |
| Arbitrum Goerli                  | `lookupArchive('arbitrum-goerli')`            | `https://v2.archive.subsquid.io/network/arbitrum-goerli`       |
| Arbitrum Nova                    | `lookupArchive('arbitrum-nova')`              | `https://v2.archive.subsquid.io/network/arbitrum-nova`         |
| Astar   (*)                      | `lookupArchive('astar',` `{type: 'EVM'})`     | `https://v2.archive.subsquid.io/network/astar-mainnet`         |
| Avalanche (**)                   | `lookupArchive('avalanche')`                  | `https://v2.archive.subsquid.io/network/avalanche-mainnet`     |
| Avalanche Testnet (**)           | `lookupArchive('avalanche-testnet')`          | `https://v2.archive.subsquid.io/network/avalanche-testnet`     |
| Base                             | `lookupArchive('base-mainnet')`               | `https://v2.archive.subsquid.io/network/base-mainnet`          |
| Base Goerli (**)                 | `lookupArchive('base-goerli')`                | `https://v2.archive.subsquid.io/network/base-goerli`           |
| Binance Smart Chain              | `lookupArchive('binance')`                    | `https://v2.archive.subsquid.io/network/binance-mainnet`       |
| Binance Smart Chain Testnet (**) | `lookupArchive('binance-testnet')`            | `https://v2.archive.subsquid.io/network/binance-testnet`       |
| Ethereum Mainnet                 | `lookupArchive('eth-mainnet')`                | `https://v2.archive.subsquid.io/network/ethereum-mainnet`      |
| Ethereum Goerli                  | `lookupArchive('eth-goerli')`                 | `https://v2.archive.subsquid.io/network/ethereum-goerli`       |
| Fantom Mainnet  (**)             | `lookupArchive('fantom')`                     | `https://v2.archive.subsquid.io/network/fantom-mainnet`        |
| Fantom Testnet (**)              | `lookupArchive('fantom-testnet')`             | `https://v2.archive.subsquid.io/network/fantom-testnet`        |
| Moonbase EVM    (*) (**)         | `lookupArchive('moonbase',` `{type: 'EVM'})`  | `https://v2.archive.subsquid.io/network/moonbase-testnet`      |
| Moonbeam EVM    (*) (**)         | `lookupArchive('moonbeam',` `{type: 'EVM'})`  | `https://v2.archive.subsquid.io/network/moonbeam-mainnet`      |
| Moonriver EVM   (*) (**)         | `lookupArchive('moonriver',` `{type: 'EVM'})` | `https://v2.archive.subsquid.io/network/moonriver-mainnet`     |
| Moonsama EVM   (*) (**)          | `lookupArchive('moonsama',` `{type: 'EVM'})`  | `https://v2.archive.subsquid.io/network/moonsama`              |
| Optimism                         | `lookupArchive('optimism-mainnet')`           | `https://v2.archive.subsquid.io/network/optimism-mainnet`      |
| Optimism Goerli                  | `lookupArchive('optimism-goerli')`            | `https://v2.archive.subsquid.io/network/optimism-goerli`       |
| Polygon (**)                     | `lookupArchive('polygon')`                    | `https://v2.archive.subsquid.io/network/polygon-mainnet`       |
| Polygon Mumbai (**)              | `lookupArchive('polygon-mumbai')`             | `https://v2.archive.subsquid.io/network/polygon-testnet`       |
| Polygon zkEVM (**)               | `lookupArchive('polygon-zkevm')`              | `https://v2.archive.subsquid.io/network/polygon-zkevm`         |
| Polygon zkEVM Testnet (**)       | `lookupArchive('polygon-zkevm-testnet')`      | `https://v2.archive.subsquid.io/network/polygon-zkevm-testnet` |
| Sepolia                          | `lookupArchive('sepolia')`                    | `https://v2.archive.subsquid.io/network/ethereum-sepolia`      |
| Shibuya Testnet (**)             | `lookupArchive('shibuya-testnet')`            | `https://v2.archive.subsquid.io/network/shibuya-testnet`       |
 
(*) Only for EVM data. For Substrate/ink! data use the corresponding [Substrate archive](/archives/substrate)

(**) Available without the support for [traces](/evm-indexing/configuration/traces) and [state diffs](/evm-indexing/configuration/state-diffs).

### Examples 

Explicit Archive endpoints:
```typescript
const processor = new EvmBatchProcessor()
  .setDataSource({
     chain: 'https://rpc.ankr.com/eth', // RPC endpoint
     archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet'
  })
```
Registry lookup (since `@subsquid/archive-registry` version `3.x`):
```typescript
import { lookupArchive } from '@subsquid/archive-registry'

const processor = new EvmBatchProcessor()
  .setDataSource({
     // resolved to 'https://v2.archive.subsquid.io/network/ethereum-mainnet'
     archive: lookupArchive('eth-mainnet')
   })
```
