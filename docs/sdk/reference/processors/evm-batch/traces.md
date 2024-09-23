---
sidebar_position: 50
description: >-
  Retrieve execution traces with addTrace()
---

# Traces

:::tip
Traces for historical blocks are [currently available](/subsquid-network/reference/networks/#evm--ethereum-compatible) from [SQD Network](/subsquid-network) on the same basis as all other data stored there: for free. If you deploy a squid that indexes traces [in real-time](/sdk/resources/unfinalized-blocks) to SQD Cloud and use our [RPC addon](/cloud/resources/rpc-proxy), the necessary `trace_` or `debug_` RPC calls made will be counted alongside all other calls and [the price](/cloud/pricing/#rpc-requests) will be computed for the total count. There are no surcharges for traces or state diffs.
:::

#### `addTrace(options)` {#add-trace}

Subscribe to [execution traces](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbyhash). This allows for tracking internal calls. The `options` object has the following structure:
```typescript
{
  // data requests
  callTo?: string[]
  callFrom?: string[]
  callSighash?: string[]
  createFrom?: string[]
  rewardAuthor?: string[]
  suicideRefundAddress?: string[]
  type?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  transaction?: boolean
  transactionLogs?: boolean
  subtraces?: boolean
  parents?: boolean
}
```
The data requests here are:
+ `type`: get traces of types from this set. Allowed types are `'create' | 'call' | 'suicide' | 'reward'`.
+ `callTo`: get `call` traces *to* the addresses in this set.
+ `callFrom`: get `call` traces *from* the addresses in this set.
+ `callSighash`: get `call` traces with signature hashes in this set.
+ `createFrom`: get `create` traces *from* the addresses in this set.
+ `rewardAuthor`: get `reward` traces where block authors are in this set.
+ `suicideRefundAddress`: get `suicide` traces where refund addresses in this set.
+ `range`: get traces from transactions from this range of blocks.

Related data retrieval:
+ `transaction = true` will cause the processor to retrieve transactions that the traces belong to.
+ `transactionLogs = true` will cause the processor to retrieve all logs emitted by transactions that the traces belong to.
+ `subtraces = true` will cause the processor to retrieve downstream traces in addition to those that matched the data requests.
+ `parents = true` will cause the processor to retrieve upstream traces in addition to those that matched the data requests.

These extra data items will be added to the appropriate iterables within the [block data](/sdk/reference/processors/evm-batch/context-interfaces).

Note that traces can also be requested by [`addTransaction()`](../transactions) and [`addLog()`](../logs) method as related data.

Selection of the exact data to be retrieved for each trace item is done with the `setFields()` method documented on the [Field selection](../field-selection) page. Be aware that field selectors for traces do not share their names with the fields of trace data items, unlike field selectors for other data item types. This is due to traces varying their structure depending on the value of the `type` field.

## Examples

### Exploring internal calls of a given transaction

For a [`mint` call to Uniswap V3 Positions NFT](https://etherscan.io/tx/0xf178718219151463aa773deaf7d9367b8408e35a624550af975e089ca6e015ca).

```ts
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {TypeormDatabase} from '@subsquid/typeorm-store'

const TARGET_TRANSACTION = '0xf178718219151463aa773deaf7d9367b8408e35a624550af975e089ca6e015ca'
const TO_CONTRACT = '0xc36442b4a4522e871399cd717abdd847ab11fe88' // Uniswap v3 Positions NFT
const METHOD_SIGHASH = '0x88316456' // mint

const processor = new EvmBatchProcessor()
  .setGateway('https://v2.archive.subsquid.io/network/ethereum-mainnet')
  .setRpcEndpoint('<my_eth_rpc_url>')
  .setFinalityConfirmation(75)
  .setBlockRange({ from: 16962349, to: 16962349 })
  .addTransaction({
    to: [TO_CONTRACT],
    sighash: [METHOD_SIGHASH],
    traces: true
  })
  .setFields({ trace: { callTo: true } })

processor.run(new TypeormDatabase(), async ctx => {
  let involvedContracts = new Set<string>()
  let traceCount = 0

  for (let block of ctx.blocks) {
    for (let trc of block.traces) {
      if (trc.type === 'call' && trc.transaction?.hash === TARGET_TRANSACTION) {
        involvedContracts.add(trc.action.to)
        traceCount += 1
      }
    }
  }

  console.log(`txn ${TARGET_TRANSACTION} had ${traceCount-1} internal transactions`)
  console.log(`${involvedContracts.size} contracts were involved in txn ${TARGET_TRANSACTION}:`)
  involvedContracts.forEach(c => { console.log(c) })
})
```

### Grabbing addresses of all contracts ever created on Ethereum

Full code is available in [this branch](https://github.com/subsquid-labs/grab-all-contracts/tree/ascetic). WARNING: will contain addresses of some contracts that failed to deploy.

```ts
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {TypeormDatabase} from '@subsquid/typeorm-store'
import {CreatedContract} from './model'

const processor = new EvmBatchProcessor()
  .setGateway('https://v2.archive.subsquid.io/network/ethereum-mainnet')
  .setFields({
    trace: {
      createResultAddress: true,
    },
  })
  .addTrace({
    type: ['create'],
    transaction: true,
  })

processor.run(new TypeormDatabase({supportHotBlocks: false}), async (ctx) => {
  const contracts: Map<string, CreatedContract> = new Map()
  const addresses: Set<string> = new Set()
  for (let c of ctx.blocks) {
    for (let trc of c.traces) {
      if (trc.type === 'create' &&
          trc.result?.address != null &&
          trc.transaction?.hash !== undefined) {
        contracts.set(trc.result.address, new CreatedContract({id: trc.result.address}))
      }
    }
  }
  await ctx.store.upsert([...contracts.values()])
})
```
Currently there is no convenient way to check whether a trace had effect on the chain state, but this feature will be added in future releases.
