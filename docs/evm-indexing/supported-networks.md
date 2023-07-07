---
sidebar_position: 21
description: >-
  A list of public EVM archives
title: Supported networks
---

# Supported EVM networks

[//]: # (!!!! keep the list updated, remove the notice below once it is final)

The table below lists the currently available public EVM ArrowSquid/v2 Archive endpoints to be used with the [`setDataSource()`](/evm-indexing/configuration/initialization) `EvmBatchProcessor` configuration method. For v1/FireSquid Archives consult [this page](/firesquid/evm-indexing/supported-networks).

| Network                 |  Endpoint lookup command                      |        Archive endpoint                                    |
|:-----------------------:|:---------------------------------------------:|:----------------------------------------------------------:|
| Arbitrum One            | `lookupArchive('arbitrum')`                   | `https://v2.archive.subsquid.io/network/arbitrum-one`      |
| Arbitrum Goerli         | `lookupArchive('arbitrum-goerli')`            | `https://v2.archive.subsquid.io/network/arbitrum-goerli`   |
| Arbitrum Nova           | `lookupArchive('arbitrum-nova')`              | `https://v2.archive.subsquid.io/network/arbitrum-nova`     |
| Binance Smart Chain     | `lookupArchive('binance')`                    | `https://v2.archive.subsquid.io/network/binance-mainnet`   |
| Ethereum Mainnet        | `lookupArchive('eth-mainnet')`                | `https://v2.archive.subsquid.io/network/ethereum-mainnet`  |
| Moonbeam EVM    (*)     | `lookupArchive('moonbeam',` `{type: 'EVM'})`  | `https://v2.archive.subsquid.io/network/moonbeam-mainnet`  |
| Moonriver EVM   (*)     | `lookupArchive('moonriver',` `{type: 'EVM'})` | `https://v2.archive.subsquid.io/network/moonriver-mainnet` |
| Sepolia                 | `lookupArchive('sepolia')`                    | `https://v2.archive.subsquid.io/network/ethereum-sepolia`  |
| Shibuya Testnet         | `lookupArchive('shibuya-testnet')`            | `https://v2.archive.subsquid.io/network/shibuya-testnet`   |
 
(*) Only for EVM data. For Substrate/ink! data use the corresponding [Substrate archive](/archives/substrate)

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
