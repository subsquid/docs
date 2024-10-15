---
sidebar_position: 40
description: >-
  Subscribe to event data with addLog()
---

# Logs

#### `addLog(options)` {#add-log}

Get event logs emitted by some _or all_ contracts in the network. `options` has the following structure:
```typescript
{
  where?: {
    address?: string[]
    topic0?: string[]
    topic1?: string[]
    topic2?: string[]
    topic3?: string[]
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

+ `address`: the set of addresses of contracts emitting the logs. Omit to subscribe to events from all contracts in the network.
+ `topicN`: the set of values of topicN.

Omit the `where` field to subscribe to all logs network-wide.

**Related data** can be requested via the `include` field:

- `transaction = true`: will retrieve the parent transacton for each selected log.

The data will be added to the `.transactions` iterable within [block data](/tron-indexing/tron-batch-processor/context-interfaces) and made available via the `.transaction` field of each log item.

Note that logs can also be requested by the other `TronBatchProcessor` methods as related data.

Selection of the exact fields to be retrieved for each log item and the optional parent transactions is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

#### Example

Request all `Transfer(address,address,uint256)` event logs emitted by the USDT smart contract, include parent txs.

```ts
const USDT_ADDRESS = 'a614f803b6fd780986a42c78ec9c7f77e6ded13c'
const TRANSFER_TOPIC = 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

processor.addLog({
  where: {
    address: [USDT_ADDRESS],
    topic0: [TRANSFER_TOPIC]
  },
  include: {
    transaction: true
  }
})
```
