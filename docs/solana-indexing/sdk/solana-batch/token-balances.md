---
sidebar_position: 60
description: >-
  Track token balance changes with addTokenBalance()
---

# Token balances

#### `addTokenBalance(options)` {#add-token-balance}

This allows for tracking token balances. `options` has the following structure:

```typescript
{
  // data requests
  where?: {
    account?: string[]
    preProgramId?: string[]
    postProgramId?: string[]
    preMint?: string[]
    postMint?: string[]
    preOwner?: string[]
    postOwner?: string[]
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
- `account`: the set of accounts to track. Leave undefined to subscribe to balance updates of all accounts across the network.
- `preProgramId` : pubkeys of the Token program that owns the account.
- `postProgramId`: pubkeys of the Token program that owns the account.
- `preMint`: pubkeys of the token's mint prior to execution.
- `postMint`: pubkeys of the token's mint after execution.
- `preOwner`: pubkeys of token balance's owner after execution.
- `postOwner`: pubkeys of token balance's owner after execution.

All account/pubkeys should be base58-encoded strings.

Related data retrieval flags:
- `transaction = true`: retrieve the transaction that gave rise to the balance update
- `transactionInstructions = true`: retrieve all instructions executed by the parent transaction

The related data will be added to the appropriate iterables within the [block data](/solana-indexing/sdk/solana-batch/context-interfaces). You can also call `augmentBlock()` from `@subsquid/solana-objects` on the block data to populate the convenience reference fields like `balance.transaction`.

Selection of the exact fields to be retrieved for each token balance item and the related data is done with the `setFields()` method documented on the [Field selection](../field-selection) page.
