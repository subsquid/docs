---
sidebar_position: 20
description: >-
  Track instruction execution with addInstruction()
---

# Instructions

#### `addInstruction(options)` {#add-instruction}

This allows for tracking program instructions. `options` has the following structure:

```typescript
{
  // data requests
  where?: {
    programId?: string[]

    d1?: string[]
    d2?: string[]
    d3?: string[]
    d4?: string[]
    d8?: string[]

    a0?: string[]
    a1?: string[]
    a2?: string[]
    a3?: string[]
    a4?: string[]
    a5?: string[]
    a6?: string[]
    a7?: string[]
    a8?: string[]
    a9?: string[]

    isCommitted?: boolean
  }

  // related data retrieval
  include?: {
    transaction?: boolean
    transactionTokenBalances?: boolean
    logs?: boolean
    innerInstructions?: boolean
  }

  range?: {
    from: number
    to?: number
  }
}
```

The data requests here are:

- `programId`: the set of program addresses to track. Leave undefined to subscribe to instructions data of all programs from the whole network.
- `d1` through `d8`: sets of 1, 2, 3, 4 and 8-byte instruction discriminators, correspondingly.
- `a0` through `a9`: sets of base58-encoded account inputs to the instruction, at positions 0-9 correspondingly.
- `isCommitted`: `true` to request only instructions that did not revert.

Related data retrieval flags:
- `transaction = true`: retrieve the transaction that gave rise to instruction
- `transactionTokenBalances = true`: retrieve all token balance records in the parent instruction
- `logs = true`: retrieve all logs emitted due to the instruction
- `innerInstructions = true`: retrieve the data for all instruction calls due to the matching instruction

The related data will be added to the appropriate iterables within the [block data](/solana-indexing/sdk/solana-batch/context-interfaces). You can also call `augmentBlock()` from `@subsquid/solana-objects` on the block data to populate the convenience reference fields like `instruction.inner`.

Selection of the exact fields to be retrieved for each instruction item and the related data is done with the `setFields()` method documented on the [Field selection](../field-selection) page.
