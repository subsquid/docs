---
sidebar_position: 40
description: >-
  Track storage changes with addStateDiff()
---

# Storage state diffs

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.**

:::warning
Processor data subscription methods guarantee that all data mathing their filters will be retrieved, but for technical reasons non-matching data may be added to the [batch context iterables](/evm-indexing/context-interfaces/#blockdata). As such, it is important to always filter the data within the batch handler.
:::

[//]: # (???? Consider replacing the coinsbench link with something else. The article is good, but I'm not sure it's a good idea to use it here.)

[//]: # (!!!! Remove the /arrowsquid prefixes once the release becomes stable)

**`addStateDiff(options)`**: Subscribe to changes in the [contract storage](https://coinsbench.com/solidity-layout-and-access-of-storage-variables-simply-explained-1ce964d7c738). This allows for tracking the contract state changes that are difficult to infer from events or transactions, such as the changes that take into account the output of internal calls. The `options` object has the following structure:
```typescript
{
  // filters
  address?: string[]
  key?: string[]
  kind?: ('=' | '+' | '*' | '-')[]
  range?: {from: number, to?: number}

  // related data retrieval
  transaction?: boolean
}
```
The filters here are:
+ `address`: the set of addresses of contracts to track. Leave undefined or set to `[]` to subscribe to state changes of all contracts from the whole network.
+ `key`: the set of storage keys that should be tracked. Regular hexadecimal contract storage keys and [special keys](/evm-indexing/context-interfaces/#statediff) (`'balance'`, `'code'`, `'nonce'`) are allowed. Leave undefined or set to `[]` to subscribe to all state changes.
+ `kind`: the set of diff kinds that should be tracked. Refer to the [`StateDiff` section](/evm-indexing/context-interfaces/#statediff) of data items documentation for an explanation of the meaning of the permitted values.
+ `range`: the range of blocks within which the storage changes should be tracked.

[//]: # (!!!! Update when the filter set stabilizes)

Enabling the `transaction` flag will cause the processor to retrieve the transaction that gave rise to each state change and add it to the [`transactions` iterable of block data](/evm-indexing/context-interfaces/#blockdata).

Note that state diffs can also be requested by the [`addTransaction()`](../transactions) method as related data.

[//]: # (???? Check whether the final version adds the transaction to the items, too)
[//]: # (???? Check that the statement about all fields being disable-only for state diffs still holds in the final version)

Selection of the exact data to be retrieved for each state diff item and its optional parent transaction is done with the `setFields()` method documented on the [Data selection](../data-selection) page. Unlike other data items, state diffs do not have any fields that can be enabled, but some can be disabled for improved sync performance.

[//]: # (!!!! Add example)
