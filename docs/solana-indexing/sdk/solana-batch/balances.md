---
sidebar_position: 50
description: >-
  Track balance changes with addBalance()
---

# Balances

#### `addBalance(options)` {#add-balance}

This allows for tracking SOL account balances. `options` has the following structure:

```typescript
{
  // data requests
  where?: {
    account?: string[]
  }

  // related data retrieval
  include?: {
    transaction?: boolean
    transactionInstructions?: boolean
  }

  range?: {
    from: number
    to?: number
  }
}
```

The data requests here are:
- `account`: the set of accounts to track. Leave undefined to subscribe to balance updates of all accounts in the whole network.

Related data retrieval flags:
- `transaction = true`: retrieve the transaction that gave rise to the balance update
- `transactionInstructions = true`: retrieve all instructions executed by the parent transaction

The related data will be added to the appropriate iterables within the [block data](/solana-indexing/sdk/solana-batch/context-interfaces). You can also call `augmentBlock()` from `@subsquid/solana-objects` on the block data to populate the convenience reference fields like `instruction.inner`.

Selection of the exact fields to be retrieved for each balance item and the related data is done with the `setFields()` method documented on the [Field selection](../field-selection) page.
