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
  instruction?:  // field selector for instructions
  transaction?:  // field selector for transactions
  log?:          // field selector for log messages
  balance?:      // field selector for balances
  tokenBalance?: // field selector for token balances
  reward?:       // field selector for reward
  block?:        // field selector for block headers
}
```

Every field selector is a collection of boolean fields, typically mapping one-to-one to the fields of data items within the batch context [iterables](/solana-indexing/sdk/solana-batch/context-interfaces). Defining a field of a field selector of a given type and setting it to true will cause the processor to populate the corresponding field of all data items of that type. Here is a definition of a processor that requests `signatures` and `err` fields for transactions and the `data` field for instructions:

```ts
const dataSource = new DataSourceBuilder()
  .setFields({
    transaction: {
      signatures: true,
      err: true
    },
    instruction: {
      data: true
    }
  })
```

Same fields will be available for all data items of any given type, including the items accessed via nested references. Suppose we used the processor defined above to subscribe to some transactions as well as some instructions, and for each instruction we requested a parent transaction:

```ts
dataSource
  .addInstruction({
    where: {
      // some instruction data requests
    },
    include: {
      transaction: true
    }
  })
  .addTransaction({
    where: {
      // some transaction data requests
    },
    include: {
      instruction: true
    }
  })
  .build()
```

After populating the convenience reference fields with `augmentBlock()` from `@subsquid/solana-objects`, `signatures` and `err` fields would be available both within the transaction items of the `transactions` iterable of [block data](/solana-indexing/sdk/solana-batch/context-interfaces) and within the transaction items that provide parent transaction information for the instructions matching the `addInstruction()` data request:

```ts
run(dataSource, database, async (ctx) => {
  let blocks = ctx.blocks.map(augmentBlock)
  for (let block of blocks) {
    for (let txn of block.transactions) {
      let sig = txn.signature; // OK
    }
    for (let ins of block.instructions) {
      if (/* ins matches the data request */) {
        let parentTxSig = log.transaction.signature; // also OK!
      }
    }
  }
})
```

Some data fields, like `signatures` for transactions, are enabled by default but can be disabled by setting a field of a field selector to `false`. For example, this code will not compile:

```ts
const dataSource = new DataSourceBuilder()
  .setFields({
    transaction: {
      signatures: false,
    }
  })
  .build()

run(dataSource, database, async (ctx) => {
  for (let block of ctx.blocks) {
    for (let txn of block.transactions) {
      let signatures = txn.signatures; // ERROR: no such field
    }
  }
})
```

Disabling unused fields will improve sync performance, as the disabled fields will not be fetched from the SQD Network gateway.

## Data item types and field selectors

:::tip
Most IDEs support smart suggestions to show the possible field selectors. For VS Code, press `Ctrl+Space`.
:::

:::info
All addresses and pubkeys are represented as base58-encoded strings.
:::

Here we describe the data item types as functions of the field selectors. Unless otherwise mentioned, each data item type field maps to the eponymous field of its corresponding field selector. Item fields are divided into three categories:

- Fields that are always added regardless of the `setFields()` call.
- Fields that are enabled by default and can be disabled by `setFields()`. E.g. a `signatures` field will be fetched for transactions by default, but can be disabled by setting `signatures: false` within the `log` field selector.
- Fields that can be requested by `setFields()`.

### Instruction

`Instruction` data items may have the following fields:

```ts
Instruction {
  // independent of field selectors
  transactionIndex: number
  instructionAddress: number[]

  // can be disabled with field selectors
  programId: string
  accounts: string[]
  data: string
  isCommitted: boolean

  // can be enabled with field selectors
  computeUnitsConsumed?: bigint
  error?: string
  hasDroppedLogMessages: boolean
}
```
Here, _instruction address_ is an array of tree indices addressing the instruction in the call tree:
 - Top level instructions get addresses `[0]`, `[1]`, ..., `[N-1]`, where N is the number of top level instructions in the transaction.
 - An address of length 2 indicates an inner instruction directly called by one of the top level instructions. For example, `[3, 0]` is the first inner instruction called by the fourth top level instruction.
 - Addresses of length 3 or more indicate inner instructions invoked by other inner instructions.

### Transaction

`Transaction` data items may have the following fields:

```ts
Transaction {
  // independent of field selectors
  transactionIndex: number
 
  // can be disabled with field selectors
  signatures: string[]
  err: null | object

  // can be requested with field selectors
  version: 'legacy' | number
  accountKeys: string[]
  addressTableLookups: AddressTableLookup[]
  numReadonlySignedAccounts: number
  numReadonlyUnsignedAccounts: number
  numRequiredSignatures: number
  recentBlockhash: string
  computeUnitsConsumed: bigint
  fee: bigint
  loadedAddresses: {
    readonly: string[]
    writable: string[]
  } // request the whole struct with loadedAddresses: true
  hasDroppedLogMessages: boolean
}
```

### LogMessage

`LogMessage` data items may have the following fields:

```ts
LogMessage {
  // independent of field selectors
  transactionIndex: number
  logIndex: number
  instructionAddress: number[]

  // can be disabled with field selectors
  programId: string
  kind: 'log' | 'data' | 'other'
  message: string
}
```

### Balance

`Balance` data items may have the following fields:

```ts
Balance{
  // independent of field selectors
  transactionIndex: number
  account: string[]

  // can be disabled with field selectors
  pre: bigint
  post: bigint
}
```

### TokenBalance

Field selection for token balances data items is more nuanced, as depending on the subtype of the token balance some fields may be `undefined`. `PostTokenBalance` and `PreTokenBalance` both represent token balances, however `PreTokenBalance` will have `postProgramId, postMint, postDecimals, postOwner and postAmount` as `undefined`.

`PostTokenBalance` will have `preProgramId, preMint, preDecimals, preOwner and preAmount` as `undefined`.

`TokenBalance` data items may have the following fields:

```ts
TokenBalance {
  // independent of field selectors
  transactionIndex: number
  account: string

  // can be disabled with field selectors
  preMint: string
  preDecimals: number
  preOwner?: string
  preAmount: bigint
  postMint: string
  postDecimals: number
  postOwner?: string
  postAmount: bigint

  // can be enabled by field selectors
  postProgramId?: string
  preProgramId?: string
}
```

### Reward

`Reward` data items may have the following fields:

```ts
Reward{
  // independent of field selectors
  pubkey: string

  // can be disabled with field selectors
  lamports: bigint
  rewardType?: string

  // can be enabled by field selectors
  postBalance: bigint
  commission?: number
}
```

### Block header

`BlockHeader` data items may have the following fields:

```ts
BlockHeader{
  // independent of field selectors
  hash: string
  height: number
  parentHash: string

  // can be disabled with field selectors
  slot: number
  parentSlot: number
  timestamp: number
}
```

## A complete example

```ts
import { run } from "@subsquid/batch-processor";
import { augmentBlock } from "@subsquid/solana-objects";
import { DataSourceBuilder, SolanaRpcClient } from "@subsquid/solana-stream";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as whirlpool from "./abi/whirpool";

const dataSource = new DataSourceBuilder()
  .setGateway("https://v2.archive.subsquid.io/network/solana-mainnet")
  .setRpc({
     client: new SolanaRpcClient({
       url: process.env.SOLANA_NODE,
     }),
     strideConcurrency: 10,
  })
  .setBlockRange({ from: 259_984_950 });
  .setFields({
    block: {
      timestamp: false
    },
    transaction: {
      signatures: false,
      version: true,
      fee: true
    },
    instruction: {
      accounts: false,
      error: true
    },
    tokenBalance: {
      postProgramId: true
    }
  })
  .addInstruction({
    // select instructions that
    where: {
      // were executed by the Whirlpool program
      programId: [whirlpool.programId],
      // have the first 8 bytes of .data equal to swap descriptor
      d8: [whirlpool.instructions.swap.d8],
      // were successfully committed
      isCommitted: true,
    },
    include: {
      // inner instructions
      innerInstructions: true,
      // transaction that executed the given instruction
      transaction: true,
      // all token balance records of executed transaction
      transactionTokenBalances: true
    },
  })
  .build();

processor.run(new TypeormDatabase(), async (ctx) => {
  // Simply output all the items in the batch.
  // It is guaranteed to have all the data matching the data requests,
  // but not guaranteed to not have any other data.
  ctx.log.info(ctx.blocks, "Got blocks");
})
```
