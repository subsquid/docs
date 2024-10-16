---
sidebar_position: 50
description: >-
  Subscribe to internal txn data
---

# Internal transactions

#### `addInternalTransaction(options)` {#add-internal-transaction}

Get some _or all_ internal transactions on the network. `options` has the following structure:

```typescript
{
  where?: {
    caller?: string[]
    transferTo?: string[]
  }
  include?: {
    transaction?: boolean
  }
  range?: {
    from: number
    to?: number
  }
}
```

**Data requests** are located in the `where` field:

- `caller` is the set of caller addresses responsible for the internal transactons. Leave it undefined to subscribe to internal txs from all callers.
- `transferTo` is the set of receiver addresses that the internal txn is addressed to.

Omit the `where` field to subscribe to all txs network-wide.

**Related data** can be requested via the `include` field:

- `transaction = true`: will retrieve parent transactions for each selected internal txn.

The data will be added to the `.transactions` iterable within [block data](/tron-indexing/tron-batch-processor/context-interfaces) and made available via the `.transaction` field of each internal transaction item.

Note that internal transactions can also be requested by the other `TronBatchProcessor` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

#### Example

TBA
