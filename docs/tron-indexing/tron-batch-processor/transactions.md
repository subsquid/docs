---
sidebar_position: 30
description: >-
  Methods to subscribe to txn data
---

# Transactions

Tron Network has a diverse and dynamic set of transaction types. `TronBatchProcessor` has methods for subscribing to some common transaction types, all with fine-grained filters:
 * [`addTransferTransaction()`](#add-transfer-transaction)
 * [`addTransferAssetTransaction()`](#add-transfer-asset-transaction)
 * [`addTriggerSmartContractTransaction()`](#add-trigger-smart-contract-transaction)

For other transaction types you can use the general method [`addTransaction()`](#add-transaction) that does not offer much filtering.

If your application would benefit from fine-grained request methods for other transaction types, please let us know in the [SquidDevs Telegram channel](https://t.me/HydraDevs).

### `addTransferTransaction(options)` {#add-transfer-transaction}

Get some _or all_ [`TransferContract`](https://github.com/tronprotocol/java-tron/blob/c136a26f8140b17f2c05df06fb5efb1bb47d3baa/protocol/src/main/protos/core/Tron.proto#L340) transactions on the network. `options` has the following structure:

```typescript
{
  where?: {
    owner?: string[]
    to?: string[]
  }
  include?: {
    logs?: boolean
    internalTransactions?: boolean
  }
  range?: {
    from: number
    to?: number
  }
}
```

**Data requests** are located in the `where` field:

- `owner`: the set of addresses of owners of the token being transferred.
- `to`: the set of addresses of tokens' receivers.

Omit the `where` field to subscribe to all `TransferContract` txs network-wide.

**Related data** can be requested via the `include` field:

- `logs = true`: will retrieve event logs emitted by the selected transactions.
- `internalTransactions = true`: will retrieve internal txs that occurred due to the selected transactions.

The data will be added to the appropriate iterables within [block data](/tron-indexing/tron-batch-processor/context-interfaces) and made available via the `.logs` and `.internalTransactions` fields of each transaction item.

Note that transactions can also be requested by the other `TronBatchProcessor` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

#### Example

This requests `TransferContract` txs where owner is `41da9964294c8689bfee2778606e485221625496bf`, plus their logs, on block 64000675.

```ts
processor.addTransferTransaction({
  where: {
    owner: [ '41da9964294c8689bfee2778606e485221625496bf' ]
  },
  include: {
    logs: true
  },
  range: {
    from: 64000675,
    to: 64000675
  }
})
```

### `addTransferAssetTransaction(options)` {#add-transfer-asset-transaction}

Get some _or all_ [`TransferAssetContract`](https://github.com/tronprotocol/java-tron/blob/c136a26f8140b17f2c05df06fb5efb1bb47d3baa/protocol/src/main/protos/core/Tron.proto#L341) transactions on the network. `options` has the following structure:

```typescript
{
  where?: {
    asset?: string[]
    owner?: string[]
    to?: string[]
  }
  include?: {
    logs?: boolean
    internalTransactions?: boolean
  }
  range?: {
    from: number
    to?: number
  }
}
```

**Data requests** are located in the `where` field:

- `asset`: the set of token names / ids.
- `owner`: the set of addresses of owners of the token being transferred.
- `to`: the set of addresses of tokens' receivers.

Omit the `where` field to subscribe to all `TransferAssetContract` txs network-wide.

**Related data** can be requested via the `include` field:

- `logs = true`: will retrieve event logs emitted by the selected transactions.
- `internalTransactions = true`: will retrieve internal txs that occurred due to the selected transactions.

The data will be added to the appropriate iterables within [block data](/tron-indexing/tron-batch-processor/context-interfaces) and made available via the `.logs` and `.internalTransactions` fields of each transaction item.

Note that transactions can also be requested by the other `TronBatchProcessor` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

#### Example

This requests `TransferAssetContract` txs where owner is `4170d66a855afef04753f06c4d6210d6b77708cdb0`, plus their internal txs, on block 64000000.

```ts
processor.addTransferTransaction({
  where: {
    owner: [ '4170d66a855afef04753f06c4d6210d6b77708cdb0' ]
  },
  include: {
    internalTransactions: true
  },
  range: {
    from: 64000000,
    to: 64000000
  }
})
```

### `addTriggerSmartContractTransaction(options)` {#add-trigger-smart-contract-transaction}

Get some _or all_ [`TriggerSmartContract`](https://github.com/tronprotocol/java-tron/blob/c136a26f8140b17f2c05df06fb5efb1bb47d3baa/protocol/src/main/protos/core/Tron.proto#L360) transactions on the network. `options` has the following structure:

```typescript
{
  where?: {
    contract?: string[]
    sighash?: string[]
    owner?: string[]
  }
  include?: {
    logs?: boolean
    internalTransactions?: boolean
  }
  range?: {
    from: number
    to?: number
  }
}
```

**Data requests** are located in the `where` field:

- `contract`: the set of addresses of contracts being called.
- `sighash`: the set of 4-byte signature hashes to filter the calls by.
- `owner`: the set of addresses of call owners.

Omit the `where` field to subscribe to all `TriggerSmartContract` txs network-wide.

**Related data** can be requested via the `include` field:

- `logs = true`: will retrieve event logs emitted by the selected transactions.
- `internalTransactions = true`: will retrieve internal txs that occurred due to the selected transactions.

The data will be added to the appropriate iterables within [block data](/tron-indexing/tron-batch-processor/context-interfaces) and made available via the `.logs` and `.internalTransactions` fields of each transaction item.

Note that transactions can also be requested by the other `TronBatchProcessor` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

#### Example

This requests `TriggerSmartContract` txs made directly to the USDT contract (`41a614f803b6fd780986a42c78ec9c7f77e6ded13c`).

```ts
processor.addTriggerSmartContractTransaction({
  where: {
    contract: [ '41a614f803b6fd780986a42c78ec9c7f77e6ded13c' ]
  }
})
```

### `addTransaction(options)` {#add-transaction}

Get some _or all_ transactions on the network. `options` has the following structure:

```typescript
{
  where?: {
    type?: string[]
  }
  include?: {
    logs?: boolean
    internalTransactions?: boolean
  }
  range?: {
    from: number
    to?: number
  }
}
```

**Data requests** are located in the `where` field:

- `type` sets the allowed transaction types. Leave it undefined to subscribe to transactions of all types.

Omit the `where` field to subscribe to all txs network-wide.

**Related data** can be requested via the `include` field:

- `logs = true`: will retrieve event logs emitted by the selected transactions.
- `internalTransactions = true`: will retrieve internal txs that occurred due to the selected transactions.

The data will be added to the appropriate iterables within [block data](/tron-indexing/tron-batch-processor/context-interfaces) and made available via the `.logs` and `.internalTransactions` fields of each transaction item.

Note that transactions can also be requested by the other `TronBatchProcessor` methods as related data.

Selection of the exact fields to be retrieved for each transaction and the optional related data items is done with the `setFields()` method documented on the [Field selection](../field-selection) page.

#### Example

This requests all `FreezeBalanceV2Contract` txs network-wide, along with all the logs they emitted:
```ts
processor.addTransaction({
  where: {
    type: [ 'FreezeBalanceV2Contract' ]
  },
  include: {
    logs: true
  }
})
```
