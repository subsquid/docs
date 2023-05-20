---
sidebar_position: 50
description: >-
  Retrieve execution traces
---

# Traces

[]: # (**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.**)

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

  // data selectors
  transaction?: boolean
  subtraces?: boolean
}
```
The filters here are:
+ `callTo`: get traces for all calls *to* the addresses in this set. Leave undefined or set to `[]` to retrieve traces of transactions to all addresses in the network.
+ `callSighash`: the set of signature hashes of calls for which the traces will be retrieved.
+ `createFrom`: get traces for contract deployment transactions from this set of addresses.
+ `rewardAuthor`: get traces for transactions rewarding miners from this set for authoring blocks.
+ `suicideRefundAddress`: get traces for transactions that resulted in contracts self-destructing and sending their funds to one of the addresses in this set. Set to `[]` to retrieve data for all transactions that resulted in contracts self-destructing.
+ `type`: set of allowed trace types from `'create' | 'call' | 'suicide' | 'reward'`.
+ `range`: get traces from transactions from this range of blocks.

[//]: # (???? Are these really the way I described, or e.g. setting callSighash to XXX will only return "call" trace items with sighash===XXX?)
[//]: # (!!!! Update when the filter set stabilizes)

Enabling the coarse-grained `transaction` data selector will cause the processor to retrieve the data of the transaction that is being traced. Enabling `subtraces` will add an eponymous field to each retrieved trace data item that indicates how many subtraces it has.

[//]: # (???? This subtraces field is weird. Does it really have to break all conventions that the rest of the code follows?)

Selection of the exact data to be retrieved for each trace item is done with the `setFields()` method documented on the [Data selection](../data-selection) page. Be aware that field selectors for traces do not share their names with the fields of trace data items, unlike field selectors for other data item types. This is due to traces varying their structure depending on the value of the `type` field.

[//]: # (!!!! Add example)
