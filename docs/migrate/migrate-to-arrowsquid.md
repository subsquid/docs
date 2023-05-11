---
sidebar_position: 3
title: Migrate to ArrowSquid
description: Step-by-step guide to the ArrowSquid update
---

# Migrate to ArrowSquid

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.**

This is a EVM guide. For a Substrate guide see [this page](/dead).

ArrowSquid refers to the versions `@subsquid/evm-processor@1.x` and `@subsquid/evm-processor@3.x`. Both packages are currently are in beta and are published with the `@next` tag. Once fully stabilized, the packages will be released to general availability with the `@latest` tag. ArrowSquid is not compatible with the FireSquid archive endpoints, and a new `v2` Archive is currently released only Ethereum mainnet. ArrowSquid-compatible archives for the rest of EVM chains, including the Binance Chain, Polygon, Arbitrum will be gradually rolled out.

The main feature introduced by the ArrowSquid update on EVM is the new ability of the [processor](/dead) to ingest unfinalized blocks directly from a network node, instead of waiting for the [archive](/dead) to ingest and serve it first. The processor can now handle forks and rewrite the contents of its database if it happens to have indexed orphaned blocks. This allows Subsquid-based APIs to become near real-time and respond to the on-chain activity with subsecond latency. 

[//]: # "Additionally, this relaxes the requirements on how closely [archives](/dead) must follow the chain, making it easier to decentralize them. <-- Don't understand this sentence at all"

Another major feature introduced by ArrowSquid is the support for transaction execution receipts, [EVM traces](/dead) and [state diffs](/dead). It enables a significantly more fine-grained control over the smart contract states, especially in the situations when the EVM log data is insufficient. For example, one can reliably index:

- Transaction data, taking into account the transaction status
- Keep track of internal calls
- Watch smart contract state changes even if caused by internal transactions
- Track smart contract creation and destruction

The `EvmBatchProcessor` configuration and data selection interfaces has been simplifed, together with a more efficient way to fetch the data from the archives. See [release notes](/dead) for a full list of changes.

Here is a step-by-step guide for migrating a squid built with an older SDK version to the post-ArrowSquid tooling. An end-to-end ArrowSquid example indexing USDC transfers can be found [here](https://github.com/subsquid/squid-sdk/tree/master/test/eth-usdc-transfers). 

## Step 1

Update all packages affected by the update:
```bash
sqd bump
```

## Step 2

If your squid did not use an RPC endpoint before, find one for your network and supply it to the processor:
```diff
 processor.setDataSource({
-   archive: lookupArchive('your-network', {type: 'EVM'})
+  archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet'
+  chain: 'https://your-network.public.blastapi.io'
 })
```
Note the new `v2`-archive endpoint, which has to be explicitly provided. We recommend using a private endpoint for the best performance, e.g. from [BlastAPI](https://blastapi.io/).

[//]: # "(???? can we relax the requirement to use the archive node at least for some processor settings? e.g. no traces)"

## Step 3

Next, we have to account for the changes in the signatures of [`addLog()`](/evm-indexing/configuration/evm-logs/) and [`addTransaction()`](/evm-indexing/configuration/transactions/) processor methods. Previously, each call of these methods supplied its own fine-grained [data selectors](/evm-indexing/configuration/data-selectors/). In the new interface, these calls can only enable or disable access to additional data (with boolean flags `transaction` for `addLog()` and `logs` for `addTransaction()`). Fine-grained field selection is now done by the new `setFields()` method on a per-item-type basis: once for all `log`s, once for all `transaction`s etc. The setting is processor-wide: for example, all `log`s returned by the processor will have the same set of available fields, regardless of whether they are taken from the batch context directly or are accessed from within a `transaction` item.

Begin migrating to the new interface by finding all calls to `addLog()` and combining all the `evmLog` data selectors into a single processor-wide data selector that requests all fields previously requested by individual selectors. Remove the `id`, `logIndex` (previously `index`) and `transactionIndex` fields: now they are always available and cannot be requested explicitly. When done, make a call to `setFields()` and supply the new data selector at the `log` field of its argument. For example, suppose the processor was initialized with the following three calls:
```typescript
const processor = new EvmBatchProcessor()
  .addLog(CONTRACT_ADDRESS, {
    filter: [[ abi.events.Transfer.topic ]],
    data: {
      evmLog: {
        id: true
      }
    } as const
  })
  .addLog(CONTRACT_ADDRESS, {
    filter: [[ abi.events.Approval.topic ]],
    data: {
      evmLog: {
        id: true,
        data: true
      }
    } as const
  })
  .addLog(CONTRACT_ADDRESS, {
    filter: [[ abi.events.ApprovalForAll.topic ]],
    data: {
      evmLog: {
        topics: true
      }
    } as const
  })
```
then the new global selector should be added like this:
```typescript
const processor = new EvmBatchProcessor()
  // ... addLog() calls ...
  .setFields({
    log: {
      data: true,
      topics: true
    }
  })
```

The full documentation for the field selectors in under construction. Refer to this [gist](https://gist.github.com/eldargab/2e007a293ac9f82031d023f1af581a7d) for an early access.

[//]: # "(???? can using a union of all field subsets increase the amount of data retrieved? or in other words, when we applied the `data` selector on a per-filter basis, did we actually use a different subset of fields for each filter? cause now it's not the case, apparently)"

## Step 4

Repeat step 3 for the `transaction` data selector. Make sure to check any transaction data selections by `addLog()` calls in addition to these made by [`addTransaction()`](/evm-indexing/configuration/transactions/). Remove the default fields `id` and `transactionIndex` (previously `index`) and add the final data selector to the `.setFields()` call. For example, suppose the processor was initialized like this:
```typescript
const processor = new EvmBatchProcessor()
  .addLog(CONTRACT_ADDRESS, {
    filter: [[ abi.events.Transfer.topic ]],
    data: {
      evmLog: { /* ...some log data selections... */ },
      transaction: {
        hash: true
      }
    } as const
  })
  .addTransaction(CONTRACT_ADDRESS, {
    sighash: [ abi.functions.approve.sighash ],
    data: {
      transaction: {
        gas: true,
        gasPrice: true
      }
    } as const
  })
```
then the new global selector should be added like this:
```diff
 const processor = new EvmBatchProcessor()
   // ... addLog() and addTransaction() calls ...
   .setFields({
     log: { /* ...some log data selections... */ },
+    transaction: {
+      hash: true,
+      gas: true,
+      gasPrice: true
+    }
   })
```

The full documentation for the field selectors in under construction. Refer to this [gist](https://gist.github.com/eldargab/2e007a293ac9f82031d023f1af581a7d) for an early access.

## Step 5

Replace the old calls to `addLog()` and `addTransaction()` with the calls using [new signatures](/dead).

Old data selectors will be erased during the process. Make sure to request the appropriate data with the boolean flags (`transaction` for `addLog()` and `logs` for `addTransaction()`) while doing that.

For example, a processor originally initialized like this:
```typescript
const processor = new EvmBatchProcessor()
  .addLog(CONTRACT_ADDRESS, {
    filter: [[ abi.events.Transfer.topic ]],
    data: {
      evmLog: {
        topics: true,
        data: true
      },
      transaction: {
        hash: true
      }
    } as const
  })
  .addTransaction(CONTRACT_ADDRESS, {
    sighash: [ abi.functions.approve.sighash ],
    data: {
      transaction: {
        gas: true,
        gasPrice: true
      }
    } as const
  })
```
should now be made with
```typescript
const processor = new EvmBatchProcessor()
  .addLog({
    address: [ CONTRACT_ADDRESS ],
    topic0: [ abi.events.Transfer.topic ],
    transaction: true // IMPORTANT: set this to true whenever the old call defined options.data.transaction
  })
  .addTransaction({
    to: [ CONTRACT_ADDRESS ],
    sighash: [ abi.functions.approve.sighash ]
  })
  .setFields({
    log: {
      topics: true,
      data: true
    },
    transaction: {
      hash: true,
      gas: true,
      gasPrice: true
    }
  })
```

## Step 6

Finally, update the batch handler to use the new [batch context](/dead). There are two ways to do that:

1. If you're in a hurry, use the [`transformContext.ts`](https://gist.github.com/belopash/aa6b67dc374add44b9bdff1c9c1eee17) module. Download it with
   ```bash
   curl -o src/transformContext.ts https://gist.githubusercontent.com/belopash/aa6b67dc374add44b9bdff1c9c1eee17/raw/441d43a932591624822b5bfd51a23147b5cecac2/transformContext.ts
   ```
   then transform the new context to the old format at the beginning of the batch handler:
   ```typescript title=src/processor.ts
   import {transformContext} from './transformContext'
   
   // ...

   processor.run(db, async (newCtx: BatchHandlerContext<Store, any>) => {
     let ctx = transformContext(newCtx)
     // the rest of the batch handler should work unchanged
   })
   ```

2. Alternatively, rewrite your batch handler using the [new batch context interface](/dead).

## Step 7

If your squid uses [`typeorm-store`](/basics/store/typeorm-store/), enable hot blocks support when constructing the `TypeormDatabase` object:
```diff
-processor.run(new TypeormDatabase(), async ctx => {
+processor.run(new TypeormDatabase({supportHotBlocks: true}), async ctx => {
```

## Step 8

Iteratively reconcile any type errors arising when building your squid (e.g. with `sqd build`). In case you're using `tranformContext.ts` you may find the types it exports helpful.

[//]: # "(???? Where do I get the `Fields` type?)"

At this point your squid should be able to work with the ArrowSquid tooling. If it doesn't, read on.

## Troubleshooting

If these instructions did not work for you, please let us know at the [SquidDevs Telegram chat](https://t.me/HydraDevs).
