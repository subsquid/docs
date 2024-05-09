---
sidebar_position: 40
description: >-
  Subscribe to log messages with addLog()
---

# Log messages

#### `addLog(options)` {#add-log}

Get log messages emitted by some _or all_ programs in the network. `options` has the following structure:

```typescript
{
  // data requests
  where?: {
    programId?: string[]
    kind?: ('log' | 'data' | 'other')[]
  }

  // related data retrieval
  include?: {
    transaction?: boolean
    instruction?: boolean
  }

  range?: {
    from: number,
    to?: number
  }
}
```

Data requests:

- `programId`: the set of addresses of programs emitting the logs. Leave it undefined to subscribe to logs from all programs in the network.
- `kind`: the set of values of `kind`.

With `transaction = true` the processor will retrieve all parent transactions and add them to the `transactions` iterable within the [block data](/solana-indexing/sdk/solana-batch/context-interfaces). You can also call `augmentBlock()` from `@subsquid/solana-objects` on the block data to populate the convenience reference fields like `log.transaction`.

Note that logs can also be requested by the other `SolanaDataSource` methods as related data.

Selection of the exact fields to be retrieved for each log and its optional parent transaction is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

## Examples

Fetch all event logs emitted by Orca Whirlpool.

```ts
const dataSource = new DataSourceBuilder()
  .setGateway('https://v2.archive.subsquid.io/network/solana-mainnet')
  .addLog({
    where: {
      programId: [PYTH_PUSH_ORACLE_PROGRAM_ID]
    },
    include: {
      instruction: true
    },
    range: {
      from: 241_000_000
    }
  })
  .build()
```
