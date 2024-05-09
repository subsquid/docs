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
  where?: {
    feePayer?: string[]
  }

  // related data retrieval
  include?: {
    instructions?: boolean
    logs?: boolean
  }

  range?: {
    from: number
    to?: number
  }
}
```

Data requests:
- `feePayer` sets the addresses of the fee payers. Leave it undefined to subscribe to all transactions.

Enabling the `instructions` and/or `logs` flags will cause the processor to retrieve [instructions](/solana-indexing/sdk/solana-batch/instructions) and [logs](/solana-indexing/sdk/solana-batch/logs) that occured as a result of each selected transaction. The data will be added to the appropriate iterables within the [block data](/solana-indexing/sdk/solana-batch/context-interfaces). You can also call `augmentBlock()` from `@subsquid/solana-objects` on the block data to populate the convenience reference fields like `transaction.logs`.

Note that transactions can also be requested by the other `SolanaDataSource` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

## Examples

Request all transactions with fee payer `rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ` and include logs and instructions:

```ts
processor
  .addTransaction({
    where: {
      feePayer: ['rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ'],
    },
    include: {
      logs: true,
      instructions: true
    }
  })
  .build()
```
