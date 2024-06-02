---
sidebar_position: 30
description: >-
  Subscribe to outputs data with addOutput()
---

# Outputs

#### `addOutput(options)` {#add-output}

Get some _or all_ outputs on the network. `options` has the following structure:

```typescript
{
  // data requests
  type?: OutputType[]

  // related data retrieval
  transaction?: boolean

  range?: {
    from: number
    to?: number
  }
}
```

Data requests:

- `type` sets the type of the output. Output type has the following options: `'CoinOutput' | 'ContractOutput' | 'ChangeOutput' | 'VariableOutput' | 'ContractCreated'`. Leave it undefined to subscribe to all outputs.

Enabling the `transaction` flag will cause the processor to retrieve transactions where the selected outputs have occurred. The data will be added to the appropriate iterables within the [block data](/fuel-indexing/fuel-datasource/context-interfaces). You can also call `augmentBlock()` from `@subsquid/fuel-objects` on the block data to populate the convenience reference fields like `output.transaction`.

Note that receipts can also be requested by the other `FuelDataSource` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

## Examples

Request all outputs with `ChangeOutput` type and include transactions:

```ts
processor
  .addOutput({
    type: ["ChangeOutput"],
    transaction: true,
  })
  .build();
```
