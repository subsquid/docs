---
sidebar_position: 60
description: >-
  Fine-tuning the data request with setFields()
---

# Data selection

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.**

**`setFields(options)`**: Set the fields to be retrieved for data items of each supported type. The `options` object has the following structure:
```ts
{
  log?:         // field selector for logs
  transaction?: // field selector for transactions
  stateDiff?:   // field selector for state diffs
  trace?:       // field selector for traces
  block?:       // field selector for block headers
}
```

[//]: # (!!!! remove /arrowsquid from links)

Every field selector is a collection of boolean fields, typically (with a notable exception of [trace field selectors](#traces)) mapping one-to-one to the [fields of data items within the batch context](/arrowsquid/evm-indexing/context-interfaces/#data-item-types). Defining a field of a field selector of a given type and setting it to true will cause the processor to populate the corresponding field of all data items of that type. Here is a definition of a processor that requests `gas` and `value` fields for [transactions](/arrowsquid/evm-indexing/context-interfaces/#transaction):
```ts
let processor = new EvmBatchProcessor()
  .setFields({
    transaction: {
      gas: true,
      value: true
    }
  })
```
Same fields will be available for all data items of any given type, including nested items. Suppose we used the processor defined above to subscribe to some transactions as well as some logs, and for each log we requested a parent transaction:
```ts
processor
  .addLog({
    // some log filters
    transaction: true
  })
  .addTransaction({
    // some transaction filters
  })
```
As a result, `gas` and `value` fields would be available both within the transaction items of the `transactions` iterable of [block data](/arrowsquid/evm-indexing/context-interfaces/#blockdata) and within the transaction items that provide parent transaction information for the logs:
```ts
processor.run(db, async ctx => {
  for (let block of ctx.blocks) {
    for (let txn of block.transactions) {
      let txnGas = txn.gas // OK
    }
    for (let log of block.logs) {
      let parentTxnGas = log.transaction.gas // also OK!
    }
  }
})
```

Some data fields, like `hash` for transactions, are enabled by default but can be disabled by setting a field of a field selector to `false`. For example, this code will not compile:
```ts
let processor = new EvmBatchProcessor()
  .setFields({
    transaction: {
      hash: false
    }
  })
  .addTransaction({
    // some transaction filters
  })

processor.run(db, async ctx => {
  for (let block of ctx.blocks) {
    for (let txn of block.transactions) {
      let txnHash = txn.hash // ERROR: no such field
    }
  }
})
```

## Field selectors

:::info
Most IDEs support smart suggestions to show the possible field selectors. For VS Code, press `Ctrl+Space`.
:::

Here we list all valid fields of the field selectors. Unless otherwise mentioned, they map to the eponymous fields of the batch context data items and are disabled by default. Consult the [Data item types](/arrowsquid/evm-indexing/context-interfaces/#data-item-types) section of the batch context interface page to get the primitive type of each field.

[//]: # (!!!! update with final defaults and capabilities)

### Logs

```ts
{
  address // enabled by default
  data    // enabled by default
  topics  // enabled by default
  transactionHash
}
```

### Transactions

```ts
{
  from // enabled by default
  to   // enabled by default
  hash // enabled by default
  gas
  gasPrice
  maxFeePerGas
  maxPriorityFeePerGas
  input
  nonce
  value
  v
  r
  s
  yParity
  chainId
  gasUsed
  cumulativeGasUsed
  effectiveGasPrice
  contractAddress
  type
  status
  sighash
}
```

### State diffs

```ts
{
  kind // enabled by default
  prev // enabled by default
  next // enabled by default
}
```

### Traces

Field selection for [trace data items](/arrowsquid/evm-indexing/context-interfaces/#trace) is somewhat more involved because its fixed fields `action` and `result` may contain different fields depending on the value of the `type` field.

```ts
{
  error // enabled by default
  subtraces

  // selectors for .action and .result subfields

  // for when .type==='create'
  createFrom  // enables .action.from
  createValue // .action.value
  createGas   // .action.gas
  createInit  // .action.init
  createResultGasUsed // .result.gasUsed
  createResultCode    // .result.code
  createResultAddress // .result.address

  // for when .type==='call'
  callFrom    // .action.from
  callTo      // .action.to
  callValue   // .action.value
  callGas     // .action.gas
  callSighash // .action.sighash
  callInput   // .action.input
  callResultGasUsed // .result.gasUsed
  callResultOutput  // .result.output

  // for when .type==='suicide'
  suicideAddress       // .action.address
  suicideRefundAddress // .action.refundAddress
  suicideBalance       // .action.balance

  // for when .type==='reward'
  rewardAuthor // .action.author
  rewardValue  // .action.value
  rewardType   // .action.type
}
```

### Block headers

```ts
{
  timestamp // enabled by default
  nonce
  sha3Uncles
  logsBloom
  transactionsRoot
  stateRoot
  receiptsRoot
  mixHash
  miner
  difficulty
  totalDifficulty
  extraData
  size
  gasLimit
  gasUsed
  baseFeePerGas
}
```

## A complete example

[//]: # (!!!! revert to lookupArchive once it's available for arrowsquid)

```ts
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import * as gravatarAbi from './abi/gravatar'
import * as erc721abi from './abi/erc721'
import {TypeormDatabase} from '@subsquid/typeorm-store'

const gravatarRegistryContract = '0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'
const gravatarTokenContract = '0xac5c7493036de60e63eb81c5e9a440b42f47ebf5'

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
    chain: 'https://eth-rpc.gateway.pokt.network'
  })
  .setBlockRange({ from: 6_000_000 })
  .addLog({
    address: [
      gravatarRegistryContract
    ],
    topic0: [
      gravatarAbi.events.NewGravatar.topic,
      gravatarAbi.events.UpdatedGravatar.topic,
    ]
  })
  .addTransaction({
    to: [
      gravatarTokenContract
    ],
    range: { from: 15_500_000 },
    sighash: [
      erc721abi.functions.setApprovalForAll.sighash
    ]
  })
  .setFields({
    log: {
      topics: true,
      data: true,
    },
    transaction: {
      from: true,
      input: true,
      to: true
    }
  })

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
  // simply output all the items in the batch
  ctx.log.info(ctx.blocks, "Got blocks")
})
```
