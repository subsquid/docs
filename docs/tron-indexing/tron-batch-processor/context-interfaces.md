---
sidebar_position: 10
description: >-
  Block data for Tron
---

# Block data for Tron

In Tron Squid SDK, the data is processed by repeatedly calling the user-defined [batch handler](/sdk/reference/processors/architecture/#processorrun) function on batches of on-chain data. The sole argument of the batch handler is its context `ctx`, and `ctx.blocks` is an array of `Block` objects containing the data to be processed, aligned at the block level.

For `TronBatchProcessor` the `Block` interface is defined as follows:

```ts
export interface Block<F extends FieldSelection = {}> {
  header: BlockHeader<F>
  transactions: Transaction<F>[]
  logs: Log<F>[]
  internalTransactions: InternalTransaction<F>[]
}
```
`F` here is the type of the argument of the [`setFields()`](/tron-indexing/tron-batch-processor/field-selection) processor method.

`Block.header` contains the block header data. The rest of the fields are iterables containing the three kinds of blockchain data. The items within each iterable are ordered in the same way as they are within the block.

The exact fields available in each data item type are inferred from the `setFields()` call argument. The method is documented on the [field selection](/tron-indexing/tron-batch-processor/field-selection) page:

- [`Transaction` section](/tron-indexing/tron-batch-processor/field-selection/#transaction);
- [`Log` section](/tron-indexing/tron-batch-processor/field-selection/#log);
- [`InternalTransaction` section](/tron-indexing/tron-batch-processor/field-selection/#internal-transaction).
- [`BlockHeader` section](/tron-indexing/tron-batch-processor/field-selection/#block-header)
