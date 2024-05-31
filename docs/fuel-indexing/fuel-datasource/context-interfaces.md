---
sidebar_position: 5
description: >-
  Block data for Fuel
---

# Block data for Fuel Network

In Fuel Squid SDK, the data is processed by repeatedly calling the user-defined [batch handler](/sdk/reference/processors/architecture/#processorrun) function on batches of on-chain data. The sole argument of the batch handler is its context `ctx`, and `ctx.blocks` is an array of `Block` objects containing the data to be processed, aligned at the block level.

For Fuel `DataSource` the `Block` interface is defined as follows:

```ts
export interface Block {
  header: BlockHeader;
  transactions: Transaction[];
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  receipts: Receipt[];
}
```

`Block.header` contains the block header data. The rest of the fields are iterables containing the four kinds of blockchain data. The items within each iterable are ordered in the same way as they are within blocks.

The exact fields available in each data item type are inferred from the `setFields()` call argument. The method is documented on the [field selection](/fuel-indexing/fuel-datasource/field-selection) page:

- [`Input` section](/fuel-indexing/fuel-datasource/field-selection#input);
- [`Transaction` section](/fuel-indexing/fuel-datasource/field-selection#transaction);
- [`Output` section](/fuel-indexing/fuel-datasource/field-selection#output);
- [`Receipt` section](/fuel-indexing/fuel-datasource/field-selection#receipt).
