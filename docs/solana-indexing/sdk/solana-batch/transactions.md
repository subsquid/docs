---
sidebar_position: 30
description: >-
  Subscribe to txn data with addTransaction()
---

# Transactions

#### `addTransaction(options)` {#add-transaction}

Get some _or all_ transactions on the network. `options` has the following structure:

```typescript
{
  // data requests
  feePayer?: Base58Bytes[]
  // related data retrieval
  instructions?: boolean
  logs?: boolean
}
```

Data requests:

- `feePayer` sets the addresses of the fee payers. Omit to subscribe to transactions from/to any address.

Enabling the `instructions` and/or `logs` flags will cause the processor to retrieve [instructions](/solana-indexing/sdk/solana-batch/instructions) and [logs](/solana-indexing/sdk/solana-batch/logs) that occured as a result of each selected transaction. The data will be added to the appropriate iterables within the [block data](/solana-indexing/sdk/solana-batch/context-interfaces).

Note that transactions can also be requested by [`addInstructions()`](../instructions) and [`addLog()`](../logs) as related data.

Selection of the exact data to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page. Some examples are available below.

## Examples

1. Request all Transactions with fee payer `rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ` and include logs and instructions:

```ts
processor.addTransaction({where:{

  feePayer: ["rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ"],

}
logs: true,
instructions: true

});
```
