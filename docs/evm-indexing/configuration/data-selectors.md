---
sidebar_position: 40
description: >-
  A reference of data selector fields
---

# Data selectors

Data selectors define which data should be fetched for log and transaction iterms. The selectors can define any subset of the fields below:

## EVM Logs

```ts
export interface EvmLog {
  id: string
  address: string
  data: string
  index: number
  removed: boolean
  topics: string[]
  transactionIndex: number
}
```

## EVM Transactions

```ts
export interface EvmTransaction {
  id: string
  from: string
  gas: bigint
  gasPrice: bigint
  hash: string
  input: string
  nonce: bigint
  to?: string
  index: number
  value: bigint
  type: number
  chainId: number
  v: bigint
  r: string
  s: string
  maxPriorityFeePerGas: bigint
  maxFeePerGas: bigint
}
```

For example, the following configuration will tell the processor to enrich transaction data of event log items with the `r`, `s`, `v` fields:

```ts
  data: {
    evmLog: {
      id: true,
      topics: true,
      data: true,
    },
    transaction: { 
      r: true,
      s: true,
      v: true
    }
  }
```

:::info
Most IDEs support smart suggestions to show the possible data selectors for `EvmLog` and `EvmTransaction` options. For VS Code, press `Ctrl+Space`.
:::

## A complete example

```ts
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import * as gravatarAbi from './abi/gravatar'
import {TypeormDatabase} from '@subsquid/typeorm-store'

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .setBlockRange({ from: 10_000_000 })
  // Gravatar contract
  .addLog('0x2e645469f354bb4f5c8a05b3b30a929361cf77ec', {
    filter: [[
      gravatarAbi.events.NewGravatar.topic,
      gravatarAbi.events.UpdatedGravatar.topic,
    ]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
    },
  })
  .addTransaction(['0xac5c7493036de60e63eb81c5e9a440b42f47ebf5'], {
    range: {
      from: 15_800_000
    },
    // setApprovalForAll(address,bool)
    sighash: '0xa22cb465',
    data: {
      transaction: {
        from: true,
        input: true,
        to: true
      }
    }
  });

processor.run(new TypeormDatabase(), async (ctx) => {
  // simply output all the items in the batch
  ctx.log.info(ctx.blocks, "Got blocks")
});
```
