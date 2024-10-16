---
sidebar_position: 100
description: >-
  Fine-tuning data requests with setFields()
---

# Field selection

#### `setFields(options)` {#set-fields}

Set the fields to be retrieved for data items of each supported type. The `options` object has the following structure:

```ts
{
  block?:               // field selector for block headers
  transaction?:         // field selector for transactions
  log?:                 // field selector for logs
  internalTransaction?: // field selector for internal transactions
}
```

Every field selector is a collection of boolean fields that map to the fields of data items within the batch context [iterables](/tron-indexing/tron-batch-processor/context-interfaces). Defining a field of a field selector of a given type and setting it to true will cause the processor to populate the corresponding field of all data items of that type. Here is a definition of a processor that requests `hash` and `fee` fields for transactions and the `data` field for logs:

```ts
const processor = new TronBatchProcessor().setFields({
  transaction: {
    hash: true,
    fee: true,
  },
  logs: {
    data: true,
  },
});
```

Same fields will be available for all data items of any given type, including the items accessed via nested references. Suppose we used the processor defined above to subscribe to some transactions as well as some logs, and for each log we requested its parent transaction:

```ts
processor
  .addTransaction({
    where: {
      // some transaction data requests
    }
  })
  .addLog({
    where: {
      // some log data requests
    },
    include: {
      transaction: true
    }
  })
```

The `hash` and `fee` fields will be available both within the data items of the `transactions` iterable of [block data](/tron-indexing/tron-batch-processor/context-interfaces) and within the transaction items populating the `.transaction` field of log data items:

```ts
processor.run(database, async (ctx) => {
  for (let block of blocks) {
    for (let txn of block.transactions) {
      let fee = txn.fee; // OK
    }
    for (let log of block.logs) {
      if (/* log matches the data request */) {
        let logTxFee = log.transaction?.fee; // also OK!
      }
    }
  }
})
```

Some data fields, like `hash` for transactions, are enabled by default but can be disabled by setting a field of a field selector to `false`. For example, this code will not compile:

```ts
const processor = new TronBatchProcessor()
  .setFields({
    transaction: {
      hash: false
    }
  })

processor.run(database, async (ctx) => {
  for (let block of ctx.blocks) {
    for (let txn of block.transactions) {
      let hash = txn.hash; // ERROR: no such field
    }
  }
});
```

Disabling unused fields will improve sync performance, as the fields' data will not be fetched from the SQD Network gateway.

## Data item types and field selectors

:::tip
Most IDEs support smart suggestions to show the possible field selectors. For VS Code, press `Ctrl+Space`.
:::

Here we describe the data item types as functions of the field selectors. On Tron, each data item type field maps to the eponymous field of its corresponding field selector. Item fields are divided into three categories:

- Fields that are always added regardless of the `setFields()` call.
- Fields that are enabled by default and can be disabled by `setFields()`. E.g. a `hash` field will be fetched for transactions by default, but can be disabled by setting `hash: false` within the `transaction` field selector.
- Fields that can be requested by `setFields()`.

### Transaction

Fields of `Transaction` data items may be requested by the eponymous fields of the field selector. Here's a detailed description of possible `Transaction` fields:

```ts
Transaction {
  // independent of field selectors
  transactionIndex: number

  // can be disabled with field selectors
  hash: string
  type: string

  // can be enabled with field selectors
  ret?: TransactionResult[]
  signature?: string[]
  parameter: any
  permissionId?: number
  refBlockBytes?: string
  refBlockHash?: string
  feeLimit?: bigint
  expiration?: number
  timestamp?: bigint
  rawDataHex: string
  fee?: bigint
  contractResult?: string
  contractAddress?: string
  resMessage?: string
  withdrawAmount?: bigint
  unfreezeAmount?: bigint
  withdrawExpireAmount?: bigint
  cancelUnfreezeV2Amount?: Record<string, bigint>
  result?: string
  energyFee?: bigint
  energyUsage?: bigint
  energyUsageTotal?: bigint
  netUsage?: bigint
  netFee?: bigint
  originEnergyUsage?: bigint
  energyPenaltyTotal?: bigint
}
```

Here, `TransactionResult` is defined as follows:

```ts
{
  contractRet?: string
}
```

Request the fields with eponymous field request flags.

### Log

Fields of `Log` data items may be requested by the eponymous fields of the field selector. Here's a detailed description of possible `Log` fields:

```ts
Log {
  // independent of field selectors
  transactionIndex: number
  logIndex: number

  // can be disabled with field selectors
  address: string
  data?: string
  topics?: string[]
}
```

Request the fields with eponymous field request flags.

### Internal transaction

Fields of `InternalTransaction` data items may be requested by the eponymous fields of the field selector. Here's a detailed description of possible `InternalTransaction` fields:

```ts
InternalTransaction {
  // independent of field selectors
  transactionIndex: number
  internalTransactionIndex: number

  // can be disabled with field selectors
  callerAddress: string
  transferToAddress?: string

  // can be enabled with field selectors
  hash: string
  callValueInfo: CallValueInfo[]
  note: string
  rejected?: boolean
  extra?: string
}
```

Here, `CallValueInfo` is defined as follows:

```ts
{
  callValue?: bigint
  tokenId?: string
}
```

Request the fields with eponymous field request flags.

### Block header

`BlockHeader` data items may have the following fields:

```ts
BlockHeader {
	// independent of field selectors
  height: number
  hash: string
  parentHash: string

  // can be disabled with field selectors
  timestamp: number

  // can be enabled with field selectors
  txTrieRoot: string
  version?: number
  witnessAddress: string
  witnessSignature?: string
}
```

Request the fields with eponymous field request flags.

## A complete example

TBA
