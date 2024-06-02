---
sidebar_position: 30
description: >-
  Subscribe to txn data with addTransaction()
---

# Receipts

#### `addReceipt(options)` {#add-receipt}

Get some _or all_ transactions on the network. `options` has the following structure:

```typescript
{
  // data requests
  type?: ReceiptType[]
  contract?: string[]

  // related data retrieval
  transaction?: boolean

  range?: {
    from: number
    to?: number
  }
}
```

Data requests:

- `type` sets the type of the receipt. Receipt type has the following options: `'CALL' | 'RETURN' | 'RETURN_DATA' | 'PANIC' | 'REVERT' | 'LOG' | 'LOG_DATA' | 'TRANSFER' | 'TRANSFER_OUT' | 'SCRIPT_RESULT' | 'MESSAGE_OUT' | 'MINT' | 'BURN'`. Leave it undefined to subscribe to all receipts.
- `contract` sets the contract addresses to track. Leave it undefined to subscribe to all receipts.

Enabling the `transaction` flag will cause the processor to retrieve transactions that gave rise to the matching receipts. The data will be added to the appropriate iterables within the [block data](/fuel-indexing/fuel-datasource/context-interfaces). You can also call `augmentBlock()` from `@subsquid/fuel-objects` on the block data to populate the convenience reference fields like `receipt.transaction`.

Note that receipts can also be requested by the other `FuelDataSource` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

## Examples

Request all receipts of the `LOG_DATA` type and include parent transactions:

```ts
processor
  .addReceipt({
    type: ["LOG_DATA"],
    transaction: true,
  })
  .build();
```
