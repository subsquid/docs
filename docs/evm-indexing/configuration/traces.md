---
sidebar_position: 50
description: >-
  Retrieve execution traces
---

# Traces

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.** 

[//]: # (!!!! Remove the /arrowsquid prefixes once the release becomes stable)

**`addTrace(options)`**: Subscribe to [call execution traces](https://docs.alchemy.com/reference/debug-tracecall). This allows for tracking internal calls. The `options` object has the following structure:
```typescript
{
  // filters
  callTo?: string[]
  callSighash?: string[]
  createFrom?: string[]
  rewardAuthor?: string[]
  suicideRefundAddress?: string[]
  type?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  transaction?: boolean
  subtraces?: boolean
}
```
The filters here are:
+ `type`: get traces of types from this set. Allowed types are `'create' | 'call' | 'suicide' | 'reward'`.
+ `callTo`: get `call` traces *to* the addresses in this set.
+ `callSighash`: get `call` traces with signature hashes in this set.
+ `createFrom`: get `create` traces *from* the addresses in this set.
+ `rewardAuthor`: get `reward` traces where block authors are in this set.
+ `suicideRefundAddress`: get `suicide` traces where refund addresses in this set.
+ `range`: get traces from transactions from this range of blocks.

[//]: # (!!!! Update when the filter set stabilizes)

Enabling the  `transaction` flag will cause the processor to retrieve transactions that the traces belong to. Enabling `subtraces` will cause the processor to retrieve the downstream traces in addition to those that matched the filters. These extra data items will be added to the appropriate iterables within the [block data](/arrowsquid/evm-indexing/context-interfaces/#blockdata).

[//]: # (???? Check whether the final version adds the transactions / subtraces to the items, too)

Selection of the exact data to be retrieved for each trace item is done with the `setFields()` method documented on the [Data selection](../data-selection) page. Be aware that field selectors for traces do not share their names with the fields of trace data items, unlike field selectors for other data item types. This is due to traces varying their structure depending on the value of the `type` field.

[//]: # (???? Example: Was `vitalik.eth` ever rewarded for authoring a block?)
