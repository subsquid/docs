---
sidebar_position: 21
description: >-
  A list of public EVM archives
title: Supported networks
---

# Supported EVM networks

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.**

[//]: # (!!!! keep the list updated, remove the notice below once it is final)
[//]: # (!!!! remove the /arrowsquid prefix from links)

The table below lists the currently available public EVM ArrowSquid/v2 Archive endpoints to be used with the [`setDataSource()`](/arrowsquid/evm-indexing/configuration/initialization) `EvmBatchProcessor` configuration method. For v1/FireSquid Archives consult [this page](/evm-indexing/supported-networks).

| Network                 |  Endpoint lookup command  |        Archive endpoint                            |
|:-----------------------:|:-------------------------:|:--------------------------------------------------:|
| Ethereum Mainnet        | n/a                       | `https://v2.archive.subsquid.io/network/ethereum-mainnet` |
| Binance Chain           | n/a                       | `https://v2.archive.subsquid.io/network/binance-mainnet`  |
| Moonbeam EVM    (*)     | n/a                       | `https://v2.archive.subsquid.io/network/moonbeam-mainnet` |
 
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
