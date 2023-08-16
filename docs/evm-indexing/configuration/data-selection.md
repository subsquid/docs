---
sidebar_position: 60
description: >-
  Fine-tuning data requests with setFields()
---

# Data selection

#### `setFields(options)` {#set-fields}

Set the fields to be retrieved for data items of each supported type. The `options` object has the following structure:
```ts
{
  log?:         // field selector for logs
  transaction?: // field selector for transactions
  stateDiff?:   // field selector for state diffs
  trace?:       // field selector for traces
  block?:       // field selector for block headers
}
```

Every field selector is a collection of boolean fields, typically (with a notable exception of [trace field selectors](#traces)) mapping one-to-one to the fields of data items within the batch context [iterables](/evm-indexing/context-interfaces). Defining a field of a field selector of a given type and setting it to true will cause the processor to populate the corresponding field of all data items of that type. Here is a definition of a processor that requests `gas` and `value` fields for transactions:
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
    // some log data requests
    transaction: true
  })
  .addTransaction({
    // some transaction data requests
  })
```
As a result, `gas` and `value` fields would be available both within the transaction items of the `transactions` iterable of [block data](/evm-indexing/context-interfaces) and within the transaction items that provide parent transaction information for the logs:
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
    // some transaction data requests
  })

processor.run(db, async ctx => {
  for (let block of ctx.blocks) {
    for (let txn of block.transactions) {
      let txnHash = txn.hash // ERROR: no such field
    }
  }
})
```
Disabling unused fields will improve sync performance, as the disabled fields will not be fetched from the archive.

## Data item types and field selectors

:::info
Most IDEs support smart suggestions to show the possible field selectors. For VS Code, press `Ctrl+Space`.
:::

Here we describe the data item types as functions of the field selectors. Unless otherwise mentioned, each data item type field maps to the eponymous field of its corresponding field selector. Item fields are divided into three categories:
* Fields that are added independently of the `setFields()` call. These are either fixed or depend on the related data retrieval flags (e.g. `transaction` for logs).
* Fields that can be disabled by `setFields()`. E.g. a `topics` field will be fetched for logs by default, but can be disabled by setting `topics: false` within the `log` field selector.
* Fields that can be requested by `setFields()`. E.g. a `transactionHash` field will only be available in logs if the `log` field selector sets `transactionHash: true`.

[//]: # (!!!! update with final defaults and capabilities)

### Logs

`Log` data items may have the following fields:
```ts
Log {
  // independent of field selectors
  id: string
  logIndex: number
  transactionIndex: number
  block: BlockHeader
  transaction?: Transaction

  // can be disabled with field selectors
  address: string
  data: string
  topics: string[]

  // can be requested with field selectors
  transactionHash: string
}
```
See the [block headers section](#block-headers) for the definition of `BlockHeader` and the [transactions section](#transactions) for the definition of `Transaction`.

### Transactions

`Transaction` data items may have the following fields:
```ts
Transaction {
  // independent of field selectors
  id: string
  transactionIndex: number
  block: BlockHeader

  // can be disabled with field selectors
  from: string
  to?: string
  hash: string

  // can be requested with field selectors
  gas: bigint
  gasPrice: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  input: string
  nonce: number
  value: bigint
  v?: bigint
  r?: string
  s?: string
  yParity?: number
  chainId?: number
  gasUsed?: bigint
  cumulativeGasUsed?: bigint
  effectiveGasPrice?: bigint
  contractAddress?: string
  type?: number
  status?: number
  sighash: string
}
```
`status` field contains the value returned by [`eth_getTransactionReceipt`](https://docs.alchemy.com/reference/eth-gettransactionreceipt): `1` for successful transactions, `0` for failed ones and `undefined` for chains and block ranges not compliant with the post-Byzantinum hard fork EVM specification (e.g. 0-4,369,999 on Ethereum).

See the [block headers section](#block-headers) for the definition of `BlockHeader`.

### State diffs

`StateDiff` data items may have the following fields:
```ts
StateDiff {
  // independent of field selectors
  transactionIndex: number
  block: BlockHeader
  transaction?: Transaction
  address: string
  key: 'balance' | 'code' | 'nonce' | string

  // can be disabled with field selectors
  kind: '=' | '+' | '*' | '-'
  prev?: string | null
  next?: string | null
}
```
The meaning of the `kind` field values is as follows:
 - `'='`: no change has occured;
 - `'+'`: a value was added;
 - `'*'`: a value was changed;
 - `'-'`: a value was removed.

The values of the `key` field are regular hexadecimal contract storage key strings or one of the special keys `'balance' | 'code' | 'nonce'` denoting ETH balance, contract code and nonce value associated with the state diff.

See the [block headers section](#block-headers) for the definition of `BlockHeader` and the [transactions section](#transactions) for the definition of `Transaction`.

### Traces

Field selection for trace data items is somewhat more involved because its fixed fields `action` and `result` may contain different fields depending on the value of the `type` field. The retrieval of each one of these subfields is configured independently. For example, to ensure that all traces of `'call'` type contain the `.action.gas` field, the processor must be configured as follows:
```ts
processor.setFields({
  trace: {
    callGas: true
  }
})
```
The full `Trace` type with all its possible (sub)fields looks like this:

[//]: # (???? extra attention to any interface changes here)

```ts
Trace {
  // independent of field selectors
  transactionIndex: number
  block: BlockHeader
  transaction?: Transaction
  traceAddress: number[]
  type: 'create' | 'call' | 'suicide' | 'reward'
  subtraces: number

  // can be disabled with field selectors
  error: string | null

  // can be requested with field selectors
  // if (type==='create')
  action: {
                  // request the subfields with
    from: string  // createFrom: true
    value: bigint // createValue: true
    gas: bigint   // createGas: true
    init: string  // createInit: true
  }
  result?: {
    gasUsed: bigint  // createResultGasUsed: true
    code: string     // createResultCode: true
    address?: string // createResultAddress: true
  }
  // if (type==='call')
  action: {
    from: string    // callFrom: true
    to: string      // callTo: true
    value: bigint   // callValue: true
    gas: bigint     // callGas: true
    sighash: string // callSighash: true
    input: string   // callInput: true
  }
  result?: {
    gasUsed: bigint // callResultGasUsed: true
    output: string  // callResultOutput: true
  }
  // if (type==='suicide')
  action: {
    address: string        // suicideAddress: true
    refundAddress: string  // suicideRefundAddress: true
    balance: bigint        // suicideBalance: true
  }
  // if (type==='reward')
  action: {
    author: string // rewardAuthor: true
    value: bigint  // rewardValue: true
    type: string   // rewardType: true
  }
}
```

### Block headers

`BlockHeader` data items may have the following fields:
```ts
BlockHeader{
  // independent of field selectors
  hash: string
  height: number
  id: string
  parentHash: string

  // can be disabled with field selectors
  timestamp: number

  // can be requested with field selectors
  nonce?: string
  sha3Uncles: string
  logsBloom: string
  transactionsRoot: string
  stateRoot: string
  receiptsRoot: string
  mixHash?: string
  miner: string
  difficulty?: bigint
  totalDifficulty?: bigint
  extraData: string
  size: bigint
  gasLimit: bigint
  gasUsed: bigint
  baseFeePerGas?: bigint
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
  .setFinalityConfirmation(75)
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

processor.run(new TypeormDatabase(), async (ctx) => {
  // Simply output all the items in the batch.
  // It is guaranteed to have all the data matching the data requests,
  // but not guaranteed to not have any other data.
  ctx.log.info(ctx.blocks, "Got blocks")
})
```
