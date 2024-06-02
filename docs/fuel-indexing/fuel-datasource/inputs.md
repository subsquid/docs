---
sidebar_position: 30
description: >-
  Subscribe to Input data with addInput()
---

# Inputs

#### `addInput(options)` {#add-input}

Get some _or all_ inputs on the network. `options` has the following structure:

```typescript
{
  // data requests
  type?: InputType[]
  coinOwner?: string[]
  coinAssetId?: string[]
  contractContract?: string[]
  messageSender?: string[]
  messageRecipient?: string[]

  // related data retrieval
  transaction?: boolean

  range?: {
    from: number
    to?: number
  }
}
```

Data requests:

- `type` sets the type of the input. You can request one or more of `'InputCoin' | 'InputContract' | 'InputMessage'`. Leave it undefined to subscribe to all inputs.

Enabling the `transaction` flag will cause the processor to retrieve transactions where the selected inputs have occurred. The data will be added to the appropriate iterables within the [block data](/fuel-indexing/fuel-datasource/context-interfaces). You can also call `augmentBlock()` from `@subsquid/fuel-objects` on the block data to populate the convenience reference fields like `input.transaction`.

Note that inputs can also be requested by the other `FuelDataSource` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

## Examples

Request all inputs with `InputCoin` type and include transactions:

```ts
processor
  .addInput({
    type: ["InputCoin"],
    transaction: true,
  })
  .build();
```
