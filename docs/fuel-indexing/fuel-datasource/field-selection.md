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
  block?:       // field selector for block headers
  transaction?: // field selector for transactions
  receipt?:     // field selector for receipts
  input?:       // field selector for inputs
  output?:      // field selector for output
}
```

Every field selector is a collection of boolean fields that map to the fields of data items within the batch context [iterables](/fuel-indexing/fuel-datasource/context-interfaces). Defining a field of a field selector of a given type and setting it to true will cause the processor to populate the corresponding field of all data items of that type. Here is a definition of a processor that requests `hash` and `status` fields for transactions and the `contract` field for receipts:

```ts
const dataSource = new DataSourceBuilder().setFields({
  transaction: {
    hash: true,
    status: true,
  },
  receipt: {
    contract: true,
  },
});
```

Same fields will be available for all data items of any given type, including the items accessed via nested references. Suppose we used the processor defined above to subscribe to some transactions as well as some receipts, and for each receipt we requested its parent transaction:

```ts
dataSource
  .addTransaction({
    // some transaction data requests
  })
  .addReceipt({
    // some receipt data requests

    transaction: true
  })
  .build();
```

After populating the convenience reference fields with `augmentBlock()` from `@subsquid/fuel-objects`, the `contract` field will be available both within the data items of the `transactions` iterable of [block data](/fuel-indexing/fuel-datasource/context-interfaces) and within the transaction items that provide parent transaction information for the receipts matching the `addReceipt()` data request:

```ts
run(dataSource, database, async (ctx) => {
  let blocks = ctx.blocks.map(augmentBlock)
  for (let block of blocks) {
    for (let txn of block.transactions) {
      let contract = txn.contract; // OK
    }
    for (let rec of block.receipts) {
      if (/* rec matches the data request */) {
        let recContract = rec.transaction.contract; // also OK!
      }
    }
  }
})
```

Some data fields, like `hash` for transactions, are enabled by default but can be disabled by setting a field of a field selector to `false`. For example, this code will not compile:

```ts
const dataSource = new DataSourceBuilder()
  .setFields({
    transaction: {
      hash: false,
    },
  })
  .build();

run(dataSource, database, async (ctx) => {
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

Here we describe the data item types as functions of the field selectors. Unless otherwise mentioned, each data item type field maps to the eponymous field of its corresponding field selector. Item fields are divided into three categories:

- Fields that are always added regardless of the `setFields()` call.
- Fields that are enabled by default and can be disabled by `setFields()`. E.g. a `hash` field will be fetched for transactions by default, but can be disabled by setting `hash: false` within the `transaction` field selector.
- Fields that can be requested by `setFields()`.

### Transaction

Fields of `Transaction` data items may be requested by the eponymous fields of the field selector. Composite fields like `inputContract` are requested in their entirety by a single selector.

Here's a detailed description of possible `Transaction` fields:

```ts
Transaction {
  // independent of field selectors
  index: number

  // can be disabled with field selectors
  hash: string
  type: TransactionType
  status: Status

  // can be enabled with field selectors
  inputAssetIds?: string[]
  inputContracts?: string[]
  inputContract?: {
    utxoId: string
    balanceRoot: string
    stateRoot: string
    txPointer: string
    contractId: string
  }
  policies?: Policies
  scriptGasLimit?: bigint
  maturity?: number
  mintAmount?: bigint
  mintAssetId?: string
  mintGasPrice?: bigint
  txPointer?: string
  isScript: boolean
  isCreate: boolean
  isMint: boolean
  isUpgrade: boolean
  isUpload: boolean
  outputContract?: {
    inputIndex: number
    balanceRoot: string
    stateRoot: string
  }
  witnesses?: string[]
  receiptsRoot?: string
  script?: string
  scriptData?: string
  salt?: string
  storageSlots?: string[]
  rawPayload?: string
  bytecodeWitnessIndex?: number
  bytecodeRoot?: string
  subsectionIndex?: number
  subsectionsNumber?: number
  proofSet?: string[]
  upgradePurpose?: UpgradePurpose
}
```

- `transactionType` field has the following type:

  ```ts
  type TransactionType =
    "Script" |
    "Create" |
    "Mint" |
    "Upgrade" |
    "Upload"
  ```

- `status` field has the following type:

  ```ts
  type Status =
    SubmittedStatus |
    SuccessStatus |
    SqueezedOutStatus |
    FailureStatus
  ```
  `Status` can be one of the following:

  ```ts
  interface SubmittedStatus {
    type: "SubmittedStatus"
    time: bigint
  }

  interface SuccessStatus {
    type: "SuccessStatus"
    transactionId: string
    time: bigint
    programState?: ProgramState
  }

  interface SqueezedOutStatus {
    type: "SqueezedOutStatus"
    reason: string
  }

  interface FailureStatus {
    type: "FailureStatus"
    transactionId: string
    time: bigint
    reason: string
    programState?: ProgramState
    totalGas: bigint
    totalFee: bigint
  }
  ```
  `ProgramState` is defined as follows:

  ```ts
  interface ProgramState {
    returnType: "RETURN" | "RETURN_DATA" | "REVERT";
    data: string;
  }
  ```

- `policies` field has the following interface:

  ```ts
  interface Policies {
    gasPrice?: bigint
    witnessLimit?: bigint
    maturity?: number
    maxFee?: bigint
  }
  ```

- `upgradePurpose` field is of type `ConsensusParametersPurpose | StateTransitionPurpose`, where the types are defined as:
  ```ts
  interface ConsensusParametersPurpose {
    type: 'ConsensusParametersPurpose'
    witnessIndex: number
    checksum: string
  }

  interface StateTransitionPurpose {
    type: 'StateTransitionPurpose'
    root: string
  }
  ```

### Receipt

Fields of `Receipt` data items may be requested by the eponymous fields of the field selector. Here's a detailed description of possible `Receipt` fields:

```ts
Receipt {
  // independent of field selectors
  index: number
  transactionIndex: number

  // can be disabled with field selectors
  receiptType: ReceiptType

  // can be enabled with field selectors
  contract?: string
  pc?: bigint
  is?: bigint
  to?: string
  toAddress?: string
  amount?: bigint
  assetId?: string
  gas?: bigint
  param1?: bigint
  param2?: bigint
  val?: bigint
  ptr?: bigint
  digest?: string
  reason?: bigint
  ra?: bigint
  rb?: bigint
  rc?: bigint
  rd?: bigint
  len?: bigint
  result?: bigint
  gasUsed?: bigint
  data?: string
  sender?: string
  recipient?: string
  nonce?: string
  contractId?: string
  subId?: string
}
```

- `receiptType` has the following type:

  ```ts
  type ReceiptType =
    | "CALL"
    | "RETURN"
    | "RETURN_DATA"
    | "PANIC"
    | "REVERT"
    | "LOG"
    | "LOG_DATA"
    | "TRANSFER"
    | "TRANSFER_OUT"
    | "SCRIPT_RESULT"
    | "MESSAGE_OUT"
    | "MINT"
    | "BURN";
  ```

### Input

`Input` data items can be of types `InputCoin`, `InputContract` or `InputMessage`. Each type has its own set of fields. To access the type-specific fields, narrow down the type by asserting the value of the `type` field, e.g.
```ts
if (input.type === "InputCoin") {
  // use InputCoin-specific fields here
}
```

To get a name of a field selector field, apply a type prefix to a capitalized name of the data item field, e.g.
* `amount` field of `InputCoin` input items is requested by `coinAmount: true`;
* `witnessIndex` field of `InputMessage` input items is requested by `messageWitnessIndex: true`
etc.

All `Input*` data types have `transactionIndex`, `index` and `type` fields. These cannot be disabled. There aren't any fields that are enabled by default and can be disabled.

`InputCoin` data items may have the following fields:

```ts
interface InputCoin {
  type: "InputCoin";
  index: number;
  transactionIndex: number;
  utxoId: string;
  owner: string;
  amount: bigint;
  assetId: string;
  txPointer: string;
  witnessIndex: number;
  predicateGasUsed: bigint;
  predicate: string;
  predicateData: string;
}
```

`InputContract` data items may have the following fields:

```ts
interface InputContract {
  type: "InputContract";
  index: number;
  transactionIndex: number;
  utxoId: string;
  balanceRoot: string;
  stateRoot: string;
  txPointer: string;
  contractId: string;
}
```

`InputMessage` data items may have the following fields:

```ts
InputMessage {
  type: "InputMessage";
  index: number;
  transactionIndex: number;
  sender: string;
  recipient: string;
  amount: bigint;
  nonce: string;
  witnessIndex: number;
  predicateGasUsed: bigint;
  data: string;
  predicate: string;
  predicateData: string;
}
```

It is possible to request more than one type of input in the same data request. For example, to request all inputs of type `InputCoin` and `InputContract`:

```ts
dataSource
  .addInput({
    type: ["InputCoin", "InputContract"],
  })
  .build();
```

### Output

`Output` data items can be of types `CoinOutput`, `ContractOutput`, `ChangeOutput`, `VariableOutput` or `'ContractCreated'`. Each type has its own set of fields. To access the type-specific fields, narrow down the type by asserting the value of the `type` field, e.g.
```ts
if (output.type === "CoinOutput") {
  // use CoinOutput-specific fields here
}
```

To get a name of a field selector field, apply a type prefix to a capitalized name of the data item field, e.g.
* `to` field of `CoinOutput` items is requested by `coinTo: true`;
* `inputIndex` field of `ContractOutput` items is requested by `contractInputIndex: true`;
* `amount` field of `ChangeOutput` items is requested by `changeAmount: true`;
* `assetId` field of `VariableOutput` items is requested by `variableAssetId: true`;
* `stateRoot` field of `ContractCreated` items is requested by `contractCreatedStateRoot: true`
etc.

All output data types have `transactionIndex`, `index` and `type` fields. These cannot be disabled. There aren't any fields that are enabled by default and can be disabled.


`CoinOutput` data items may have the following fields:

```ts
CoinOutput {
  type: 'CoinOutput'
  index: number
  transactionIndex: number
  to: string
  amount: bigint
  assetId: string
}
```

`ContractOutput` data items may have the following fields:

```ts
ContractOutput {
  type: "ContractOutput";
  index: number;
  transactionIndex: number;
  inputIndex: number;
  balanceRoot: string;
  stateRoot: string;
}
```

`ChangeOutput` data items may have the following fields:

```ts
ChangeOutput {
  type: 'ChangeOutput'
  index: number
  transactionIndex: number
  to: string
  amount: bigint
  assetId: string
}

```

`VariableOutput` data items may have the following fields:

```ts
VariableOutput {
  type: 'VariableOutput'
  index: number
  transactionIndex: number
  to: string
  amount: bigint
  assetId: string
}
```

`ContractCreated` data items may have the following fields:

```ts
ContractCreated {
  type: 'ContractCreated'
  index: number
  transactionIndex: number
  contract: string
  stateRoot: string
}
```

### Block header

`BlockHeader` data items may have the following fields:
```ts
BlockHeader {
	// independent of field selectors
  hash: string
  height: number

  // can be disabled with field selectors
  time: bigint

  // can be enabled with field selectors
  daHeight: bigint
  transactionsRoot: string
  transactionsCount: number
  messageReceiptCount: number
  prevRoot: string
  applicationHash: string
  eventInboxRoot: string
  consensusParametersVersion: number
  stateTransitionBytecodeVersion: number
  messageOutboxRoot: string
}
```
Request the fields with eponymous field request flags.

## A complete example

```ts
import { run } from "@subsquid/batch-processor";
import { augmentBlock } from "@subsquid/fuel-objects";
import { DataSourceBuilder } from "@subsquid/fuel-stream";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Contract } from "./model";

const dataSource = new DataSourceBuilder()
  .setGateway("https://v2.archive.subsquid.io/network/fuel-mainnet")
  .setGraphql({
    url: "https://mainnet.fuel.network/v1/graphql",
  })
  .setFields({
    transaction: {
      hash: false,
      isMint: true,
    },
    receipt: {
      amount: true,
      gas: true,
    },
    input: {
      coinOwner: true,
      contractStateRoot: true,
    },
    output: {
      coinTo: true,
      contractCreatedStateRoot: true,
    },
    block: {
      daHeight: true
    }
  })
  .addTransaction({
    type: ['Mint', 'Script'],
    inputs: true,
    range: { from: 1_000_000 }
  })
  .addReceipt({
    type: ['LOG_DATA']
  })
  .addInput({
    type: ['InputCoin', 'InputContract']
  })
  .addOutput({
    type: ['CoinOutput', 'ContractCreated'],
    transaction: true
  })
  .build()
```
