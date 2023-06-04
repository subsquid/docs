---
sidebar_position: 50
description: >-
  Retrieve execution traces
---

# Traces

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.** 

[//]: # (!!!! Remove the /arrowsquid prefixes once the release becomes stable)

**`addTrace(options)`**: Subscribe to [call execution traces](https://docs.alchemy.com/reference/debug-tracecall). This allows for tracking internal calls. The `options` object has the following structure:
```typescript
{
  // filters
  callTo?: string[]
  callSighash?: string[]
  createFrom?: string[]
  rewardAuthor?: string[]
  suicideRefundAddress?: string[]
  type?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  transaction?: boolean
  subtraces?: boolean
}
```
The filters here are:
+ `type`: get traces of types from this set. Allowed types are `'create' | 'call' | 'suicide' | 'reward'`.
+ `callTo`: get `call` traces *to* the addresses in this set.
+ `callSighash`: get `call` traces with signature hashes in this set.
+ `createFrom`: get `create` traces *from* the addresses in this set.
+ `rewardAuthor`: get `reward` traces where block authors are in this set.
+ `suicideRefundAddress`: get `suicide` traces where refund addresses in this set.
+ `range`: get traces from transactions from this range of blocks.

[//]: # (!!!! Update when the filter set stabilizes)

Enabling the  `transaction` flag will cause the processor to retrieve transactions that the traces belong to. Enabling `subtraces` will cause the processor to retrieve the downstream traces in addition to those that matched the filters. These extra data items will be added to the appropriate iterables within the [block data](/arrowsquid/evm-indexing/context-interfaces/#blockdata).

Note that traces can also be requested by the [`addTransaction()`](../transactions) method as related data.

[//]: # (???? Check whether the final version adds the transactions / subtraces to the items, too)

Selection of the exact data to be retrieved for each trace item is done with the `setFields()` method documented on the [Data selection](../data-selection) page. Be aware that field selectors for traces do not share their names with the fields of trace data items, unlike field selectors for other data item types. This is due to traces varying their structure depending on the value of the `type` field.

## Examples

[//]: # (???? Example: Was `vitalik.eth` ever rewarded for authoring a block?)

### Exploring internal calls of a given transaction

For a [`mint` call to Uniswap V3 Positions NFT](https://etherscan.io/tx/0xf178718219151463aa773deaf7d9367b8408e35a624550af975e089ca6e015ca).

```ts
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {TypeormDatabase} from '@subsquid/typeorm-store'

const TARGET_TRANSACTION = '0xf178718219151463aa773deaf7d9367b8408e35a624550af975e089ca6e015ca'
const TO_CONTRACT = '0xc36442b4a4522e871399cd717abdd847ab11fe88' // Uniswap v3 Positions NFT
const METHOD_SIGHASH = '0x88316456' // mint

const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
        chain: 'https://rpc.ankr.com/eth'
    })
    .setBlockRange({ from: 16962349, to: 16962349 })
    .addTransaction({ to: [TO_CONTRACT], sighash: [METHOD_SIGHASH], traces: true })
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
