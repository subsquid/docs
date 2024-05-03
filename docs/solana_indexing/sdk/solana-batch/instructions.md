---
sidebar_position: 50
description: >-
  Track storage changes with addStateDiff()
---

# Instructions

#### `addInstruction(options)` {#add-instruction}

This allows for tracking program instructions. `options` has the following structure:

```typescript
{
  // data requests
 programId?: Base58Bytes[]
    d1?: Discriminator[]
    d2?: Discriminator[]
    d3?: Discriminator[]
    d4?: Discriminator[]
    d8?: Discriminator[]
    a0?: Base58Bytes[]
    a1?: Base58Bytes[]
    a2?: Base58Bytes[]
    a3?: Base58Bytes[]
    a4?: Base58Bytes[]
    a5?: Base58Bytes[]
    a6?: Base58Bytes[]
    a7?: Base58Bytes[]
    a8?: Base58Bytes[]
    a9?: Base58Bytes[]
    isCommitted?: boolean

  // related data retrieval
  transaction?: boolean
  transactionTokenBalances?: boolean
  logs?: boolean
  innerInstructions?: boolean
}
```

The data requests here are:

- `programId`: the set of addresses of contracts to track. Leave undefined or set to `[]` to subscribe to state changes of all contracts from the whole network.
- `d1` through `d8`: instruction discriminators
- `a1` through `a9`:
- `isCommitted`: `true` to request only instructions that did not revert.

Enabling the `transaction` flag will cause the processor to retrieve the transaction that gave rise to instruction and add it to the [`transactions` iterable of block data](/sdk/reference/processors/solana-batch/context-interfaces).

Selection of the exact data to be retrieved for each instruction item and its optional parent transaction is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

[//]: # "!!!! Add example"
