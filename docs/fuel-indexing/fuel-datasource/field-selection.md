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

  block?:        // field selector for block headers
  transaction?: // field selector for transactions
  receipt?: // field selector for receipts
  input?: // field selector for inputs
  output?: // field selector for output
}
```

Every field selector is a collection of boolean fields, typically mapping one-to-one to the fields of data items within the batch context [iterables](/solana-indexing/sdk/solana-batch/context-interfaces). Defining a field of a field selector of a given type and setting it to true will cause the processor to populate the corresponding field of all data items of that type. Here is a definition of a processor that requests `receipts` and `inputs` fields for transactions and the `transaction` field for receipt:

```ts
const dataSource = new DataSourceBuilder().setFields({
  transaction: {
    receipts: true,
    inputs: true,
  },
  receipt: {
    transaction: true,
  },
});
```

Same fields will be available for all data items of any given type, including the items accessed via nested references. Suppose we used the processor defined above to subscribe to some transactions as well as some receipts, and for each transaction we requested a parent receipt:

```ts
dataSource
  .addTransaction({

    // some transaction data requests
    ,
    include: {
      receipt: true,
    },
  })
  .addReceipt({

    // some transaction data requests
    ,
    include: {
      transaction: true,
    },
  })
  .build();
```

After populating the convenience reference fields with `augmentBlock()` from `@subsquid/fuel-objects`, `receipt` fields would be available both within the receipt items of the `receipts` iterable of [block data](/solana-indexing/sdk/fuel-datasource/context-interfaces) and within the receipt items that provide parent receipt information for the transactions matching the `addTransaction()` data request:

```ts
run(dataSource, database, async (ctx) => {
  let blocks = ctx.blocks.map(augmentBlock)
  for (let block of blocks) {
    for (let txn of block.transactions) {
      let parentReceipt = txn.receipt; // OK
    }
    for (let rec of block.receipts) {
      if (/* ins matches the data request */) {
        let receipt = rec; // also OK!
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
      let signatures = txn.hash; // ERROR: no such field
    }
  }
});
```

Disabling unused fields will improve sync performance, as the disabled fields will not be fetched from the Subsquid Network gateway.

## Data item types and field selectors

:::tip
Most IDEs support smart suggestions to show the possible field selectors. For VS Code, press `Ctrl+Space`.
:::

Here we describe the data item types as functions of the field selectors. Unless otherwise mentioned, each data item type field maps to the eponymous field of its corresponding field selector. Item fields are divided into three categories:

- Fields that are always added regardless of the `setFields()` call.
- Fields that are enabled by default and can be disabled by `setFields()`. E.g. a `hash` field will be fetched for transactions by default, but can be disabled by setting `hash: false` within the `transaction` field selector.
- Fields that can be requested by `setFields()`.

### Transaction

`Instruction` data items may have the following fields:

```ts
Transaction {
  // independent of field selectors
  index: number

  // can be disabled with field selectors
  hash: Bytes
  // can be enabled with field selectors
  inputAssetIds?: Bytes[]
    inputContracts?: Bytes[]
    inputContract?: {
        utxoId: Bytes
        balanceRoot: Bytes
        stateRoot: Bytes
        txPointer: string
        contract: Bytes
    }
    policies?: Policies
    gasPrice?: bigint
    scriptGasLimit?: bigint
    maturity?: number
    mintAmount?: bigint
    mintAssetId?: Bytes
    txPointer?: string
    isScript: boolean
    isCreate: boolean
    isMint: boolean
    type: TransactionType
    outputContract?: {
        inputIndex: number
        balanceRoot: Bytes
        stateRoot: Bytes
    }
    witnesses?: Bytes[]
    receiptsRoot?: Bytes
    status: Status
    script?: Bytes
    scriptData?: Bytes
    bytecodeWitnessIndex?: number
    bytecodeLength?: bigint
    salt?: Bytes
    storageSlots?: Bytes[]
    rawPayload?: Bytes
}
```

- `policies` field has the following interface:

```ts
export interface Policies {
  gasPrice?: bigint;
  witnessLimit?: bigint;
  maturity?: number;
  maxFee?: bigint;
}
```

### Receipt

`Receipt` data items may have the following fields:

```ts
Receipt {
  // independent of field selectors
  index: number

  // can be disabled with field selectors
  transactionIndex: number
  // can be requested with field selectors
  contract?: Bytes
    pc?: bigint
    is?: bigint
    to?: Bytes
    toAddress?: Bytes
    amount?: bigint
    assetId?: Bytes
    gas?: bigint
    param1?: bigint
    param2?: bigint
    val?: bigint
    ptr?: bigint
    digest?: Bytes
    reason?: bigint
    ra?: bigint
    rb?: bigint
    rc?: bigint
    rd?: bigint
    len?: bigint
    receiptType: ReceiptType
    result?: bigint
    gasUsed?: bigint
    data?: Bytes
    sender?: Bytes
    recipient?: Bytes
    nonce?: Bytes
    contractId?: Bytes
    subId?: Bytes
}
```

- `receiptType` has the following type:

```ts
export type ReceiptType =
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

`Input` data items can be of types `InputCoin`, `InputContract` or `InputMessage`. Each type has its own set of fields.

`InputCoin` data items may have the following fields:

```ts
export interface InputCoin {
  type: "InputCoin";
  index: number;
  transactionIndex: number;
  utxoId: Bytes;
  owner: Bytes;
  amount: bigint;
  assetId: Bytes;
  txPointer: string;
  witnessIndex: number;
  maturity: number;
  predicateGasUsed: bigint;
  predicate: Bytes;
  predicateData: Bytes;
}
```

`InputContract` data items may have the following fields:

```ts
export interface InputContract {
  type: "InputContract";
  index: number;
  transactionIndex: number;
  utxoId: Bytes;
  balanceRoot: Bytes;
  stateRoot: Bytes;
  txPointer: string;
  contract: Bytes;
}
```

`InputMessage` data items may have the following fields:

```ts
InputMessage {
  type: "InputMessage";
  index: number;
  transactionIndex: number;
  sender: Bytes;
  recipient: Bytes;
  amount: bigint;
  nonce: Bytes;
  witnessIndex: number;
  predicateGasUsed: bigint;
  data: Bytes;
  predicate: Bytes;
  predicateData: Bytes;
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

`Output` data items can be of types `CoinOutput`, `ContractOutput`, `ChangeOutput` or `VariableOutput`. Each type has its own set of fields.

`CoinOutput` data items may have the following fields:

```ts
CoinOutput {
    type: 'CoinOutput'
    index: number
    transactionIndex: number
    to: Bytes
    amount: bigint
    assetId: Bytes
}
```

`ContractOutput` data items may have the following fields:

```ts
ContractOutput {
  type: "ContractOutput";
  index: number;
  transactionIndex: number;
  inputIndex: number;
  balanceRoot: Bytes;
  stateRoot: Bytes;
}
```

`ChangeOutput` data items may have the following fields:

```ts
ChangeOutput {
    type: 'ChangeOutput'
    index: number
    transactionIndex: number
    to: Bytes
    amount: bigint
    assetId: Bytes
}

```

`VariableOutput` data items may have the following fields:

```ts
VariableOutput {
    type: 'VariableOutput'
    index: number
    transactionIndex: number
    to: Bytes
    amount: bigint
    assetId: Bytes
}
```

### A complete example

```ts
import { run } from "@subsquid/batch-processor";
import { augmentBlock } from "@subsquid/fuel-objects";
import { DataSourceBuilder } from "@subsquid/fuel-stream";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Contract } from "./model";

const dataSource = new DataSourceBuilder()
  // Provide Subsquid Network Gateway URL.
  .setGateway("https://v2.archive.subsquid.io/network/fuel-stage-5")

  .setGraphql({
    url: "https://beta-5.fuel.network/graphql",
    strideConcurrency: 2,
    strideSize: 50,
  })

  .setFields({
    receipt: {
      contract: true,
      receiptType: true,
    },
    transaction: {
      policies: true,
      transactionType: true,
      inputs: true,
      outputs: true,
    },
    inputMessage: {
      sender: true,
    },
    outputMessage: {
      recipient: true,
    },
  })

  .addReceipt({
    type: ["LOG_DATA"],
  })
  .addInput({
    type: ["InputCoin", "InputContract", "InputMessage"],
  })
  .addOutput({
    type: ["CoinOutput", "ContractOutput", "ChangeOutput", "VariableOutput"],
  })
  .addTransaction({
    type: ["Create", "Mint"],
    receipts: true,
    inputs: true,
    outputs: true,
  })
  .build();

const database = new TypeormDatabase();

// Now we are ready to start data processing
run(dataSource, database, async (ctx) => {
  let contracts: Map<String, Contract> = new Map();

  let blocks = ctx.blocks.map(augmentBlock);

  for (let block of blocks) {
    for (let receipt of block.receipts) {
      console.log(receipt);
      if (receipt.receiptType == "LOG_DATA" && receipt.contract != null) {
        let contract = contracts.get(receipt.contract);

        console.log(receipt.contract);
        if (!contract) {
          contract = await ctx.store.findOne(Contract, {
            where: { id: receipt.contract },
          });
          if (!contract) {
            contract = new Contract({
              id: receipt.contract,
              logsCount: 0,
              foundAt: block.header.height,
            });
          }
        }
        contract.logsCount += 1;
        contracts.set(contract.id, contract);
      }
    }
  }

  ctx.store.upsert([...contracts.values()]);
});
```
