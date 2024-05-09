---
sidebar_position: 50
description: >-
  Track storage changes with addStateDiff()
---

# Token balances

#### `addTokenBalance(options)` {#add-token-balance}

This allows for tracking program instructions. `options` has the following structure:

```typescript
{
  // data requests
    account?: Base58Bytes[]
    preProgramId?: Base58Bytes[]
    postProgramId?: Base58Bytes[]
    preMint?: Base58Bytes[]
    postMint?: Base58Bytes[]
    preOwner?: Base58Bytes[]
    postOwner?: Base58Bytes[]
    //related data retrieval
    transaction?: boolean
    transactionInstructions?: boolean
}
```

The data requests here are:

- `account`: the set of addresses of contracts to track. Leave undefined or set to `[]` to subscribe to state changes of all contracts from the whole network.
- `preProgramId` : of the Token program that owns the account.
- `postProgramId`: of the Token program that owns the account.
- `preMint`: pubkey of the token's mint prior to execution.
- `postMint`: pubkey of the token's mint after execution.
- `preOwner`: pubkey of token balance's owner after execution.
- `postOwner`: pubkey of token balance's owner after execution.
- `transaction`: `true` to request transactions.
- `transactionInstructions`: `true` to request instructions.

Enabling the `transaction` flag will cause the processor to retrieve the transaction that gave rise to instruction and add it to the [`transactions` iterable of block data](/solana-indexing/sdk/solana-batch/context-interfaces).

Selection of the exact data to be retrieved for each instruction item and its optional parent transaction is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

[//]: # "!!!! Add example"
