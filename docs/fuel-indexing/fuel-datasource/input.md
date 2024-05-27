---
sidebar_position: 30
description: >-
  Subscribe to Input data with addInput()
---

# Input

#### `addInput(options)` {#add-input}

Get some _or all_ inputs on the network. `options` has the following structure:

```typescript
{
  // data requests
    type?: InputType[]
    coinOwner?: Bytes[]
    coinAssetId?: Bytes[]
    contractContract?: Bytes[]
    messageSender?: Bytes[]
    messageRecipient?: Bytes[]
  // related data retrieval
  include?: {
    transaction?: boolean
  }
  range?: {
    from: number
    to?: number
  }
}
```

Data requests:
TODO Links

- `type` sets the type of the receipt. Receipt type has the following options: `'InputCoin' | 'InputContract' | 'InputMessage'`. Leave it undefined to subscribe to all inputs.

Enabling the `transaction` flag will cause the processor to retrieve [transactions](/fuel-indexing/fuel-datasource/transactions),[inputs](//fuel-indexing/fuel-datasource/inputs) that occured as a result of each selected receipt. The data will be added to the appropriate iterables within the [block data](/fuel-indexing/fuel-datasource/context-interfaces). You can also call `augmentBlock()` from `@subsquid/fuel-objects` on the block data to populate the convenience reference fields like `receipt.transaction`.

Note that inputs can also be requested by the other `FuelDataSource` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

## Examples

Request all inputs with `InputCoin` type and include transaction:

```ts
processor
  .addInput({
    type: ["InputCoin"],
    transaction: true,
  })
  .build();
```
