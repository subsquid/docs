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
  type?: TransactionType[]

  // related data retrieval
  receipts?: boolean
  inputs?: boolean
  outputs?: boolean

  range?: {
    from: number
    to?: number
  }
}
```

Data requests:

- `type` sets the type of the transaction: `'Script' | 'Create' | 'Mint' | 'Upgrade' | 'Upload'`. Leave it undefined to subscribe to all transactions.

Enabling the `receipts` and/or `inputs` and `outputs` flags will cause the processor to retrieve receipts, inputs and outputs that occurred as a result of each selected transaction. The data will be added to the appropriate iterables within the [block data](/fuel-indexing/fuel-datasource/context-interfaces). You can also call `augmentBlock()` from `@subsquid/fuel-objects` on the block data to populate the convenience reference fields like `transaction.receipts`.

Note that transactions can also be requested by the other `FuelDataSource` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

## Examples

Request all transactions with `Create` and `Mint` types and include receipts, inputs and outputs:

```ts
processor
  .addTransaction({
    type: ["Create", "Mint"],
    receipts: true,
    inputs: true,
    outputs: true,
  })
  .build();
```
