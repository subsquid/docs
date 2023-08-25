---
sidebar_position: 3
title: Migrate to ArrowSquid
description: Step-by-step guide to the ArrowSquid update
---

# Migrate to ArrowSquid

This is a EVM guide. Substrate guide will be released later.

[//]: # (!!!! add the substrate guide link)

ArrowSquid refers to the versions `@subsquid/evm-processor@1.x` and `@subsquid/substrate-processor@3.x`. ArrowSquid is not compatible with the FireSquid archive endpoints, and the new `v2` archives are currently released only for a limited set of networks (see the [Supported EVM networks](/evm-indexing/supported-networks/) page).

[//]: # (!!!! add a link to the archives page below)

The main feature introduced by the ArrowSquid update on EVM is the new ability of the [processor](/evm-indexing/evm-processor) to ingest unfinalized blocks directly from a network node, instead of waiting for the archive to ingest and serve it first. The processor can now handle forks and rewrite the contents of its database if it happens to have indexed orphaned blocks. This allows Subsquid-based APIs to become near real-time and respond to the on-chain activity with subsecond latency.

Another major feature introduced by ArrowSquid is the support for transaction execution receipts, [traces](/evm-indexing/configuration/traces) and [state diffs](/evm-indexing/configuration/state-diffs). It enables a significantly more fine-grained control over the smart contract states, especially in the situations when the EVM log data is insufficient. For example, one can:

- Reliably index transaction data, taking into account the transaction status
- Keep track of internal calls
- Observe smart contract state changes even if they are caused by internal transactions
- Track smart contract creation and destruction

The `EvmBatchProcessor` configuration and data selection interfaces has been simplified and the way in which the data is fetched from archives has been made more efficient.

End-to-end ArrowSquid examples can be found [in the SDK repo](https://github.com/subsquid/squid-sdk/tree/master/test/eth-usdc-transfers) and in the [EVM examples](/examples/evm) section.

Here is a step-by-step guide for migrating a squid built with an older SDK version to the post-ArrowSquid tooling.

## Step 1

Update all packages affected by the update:
```bash
npm i @subsquid/evm-processor@next
npm i @subsquid/typeorm-store@next
```
If your squid uses [`file-store`](/store/file-store), please update any related packages to the `@next` version, too.

## Step 2

Replace the old archive URL or lookup command with a [`v2` archive URL for your network](/evm-indexing/supported-networks) within the `setDataSource` configuration call. If your squid did not use an RPC endpoint before, find one for your network and supply it to the processor. Also configure the network-specific number of transaction confirmations sufficient for finality. For Ethereum mainnet your edit might look like this:
```diff
 processor
   .setDataSource({
-    archive: lookupArchive('eth-mainnet', {type: 'EVM'})
+    archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
+    chain: 'https://eth-rpc.gateway.pokt.network'
   })
+  .setFinalityConfirmation(75)
```
We recommend using a private RPC endpoint for the best performance, e.g. from [BlastAPI](https://blastapi.io/). For squids deployed to [Aquarium](/deploy-squid/quickstart/) you may also consider using our [RPC proxies](/deploy-squid/rpc-proxy) (currently experimental).

[//]: # (!!!! remove the experimental notice once RPC proxy is stable)

Your squid will work without an RPC endpoint, but with a significantly increased chain latency (a few hours for most chains, roughly a day for BSC). If that works for you, you can replace the archive URL without setting an RPC here and skip [Step 7](#step-7) altogether.

## Step 3

Next, we have to account for the changes in signatures of [`addLog()`](/evm-indexing/configuration/evm-logs/) and [`addTransaction()`](/evm-indexing/configuration/transactions/) processor methods. Previously, each call of these methods supplied its own fine-grained [data selectors](/evm-indexing/configuration/data-selection). In the new interface, these calls can only enable or disable the retrieval of related data (with boolean flags `transaction` for `addLog()` and `logs` and a few others for `addTransaction()`). Field selection is now done by the new `setFields()` method on a per-item-type basis: once for all `log`s, once for all `transaction`s etc. The setting is processor-wide: for example, all `transaction`s returned by the processor will have the same set of available fields, regardless of whether they are taken from the batch context directly or are accessed from within a `log` item.

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
Be aware that this operation will not increase the amount of data retrieved from the archive, since previously such coalescence was done under the hood and all fields were retrieved by the processor anyway. In fact, the amount of data should decrease due to a more efficient transfer mechanism employed by ArrowSquid.

See the [Data selection](/evm-indexing/configuration/data-selection) page for full documentation on field selectors.

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

See the [Data selection](/evm-indexing/configuration/data-selection) page for full documentation on field selectors.

## Step 5

Replace the old calls to `addLog()` and `addTransaction()` with calls using the [new signatures](/evm-indexing/configuration).

:::warning
The meaning of passing `[]` as a set of parameter values has been changed in the ArrowSquid release: now it _selects no data_. Pass `undefined` for a wildcard selection:
```typescript
.addLog({address: []}) // selects no logs
.addLog({}) // selects all logs
```
```typescript
.addTransaction({from: []}) // selects no transactions
.addTransaction({}) // selects all transactions
```
:::

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
[//]: # (???? .transaction may be removed from the log item interface in the final version, do check)

## Step 6

Finally, update the batch handler to use the new [batch context](/basics/squid-processor/#batch-context). There are two ways to do that:

1. If you're in a hurry, use the [`transformContext.ts`](https://gist.github.com/belopash/aa6b67dc374add44b9bdff1c9c1eee17) module. Download it with
   ```bash
   curl -o src/transformContext.ts https://gist.githubusercontent.com/belopash/aa6b67dc374add44b9bdff1c9c1eee17/raw/441d43a932591624822b5bfd51a23147b5cecac2/transformContext.ts
   ```
   then transform the new context to the old format at the beginning of the batch handler:
   ```typescript title=src/processor.ts
   import {transformContext} from './transformContext'
   
   // ...

   processor.run(db, async (newCtx: DataHandlerContext<Store, any>) => {
     let ctx = transformContext(newCtx)
     // the rest of the batch handler should work unchanged
   })
   ```

2. Alternatively, rewrite your batch handler using the [new batch context interface](/basics/squid-processor/#batch-context). Consult the [block data](/evm-indexing/context-interfaces) page for EVM-specific details on the new context format.

## Step 7

Update your transactions/events decoding code. The big change here is that now decoders generated by `@subsquid/evm-typegen` return `bigint` where `ethers.BigNumber` was used before. Regenerate all TypeScript ABI wrappers as described in the [EVM typegen](/evm-indexing/squid-evm-typegen) section, then find all places where `ethers.BigNumber`s returned by old decoders were handled in your code and rewrite it to use `bigint`s.

## Step 8

Iteratively reconcile any type errors arising when building your squid (e.g. with `sqd build`). In case you're using `tranformContext.ts` you may find the types it exports helpful. If you need to specify the field selection generic argument explicitly, get it as a `typeof` of the `setFields` argument value:

```ts
import { OldBlockData } from './transformContext'

const fieldSelection = {
  log: {
    data: true
  },
  transaction: {
    hash: true,
  }
} as const

let processor = new EvmBatchProcessor()
  .setFields(fieldSelection)
  /* the rest of the processor configuration */

type MyBlockData = OldBlockData<typeof fieldSelection>
// ...
```

At this point your squid should be able to work with the ArrowSquid tooling. If it doesn't, read on.

## Troubleshooting

If these instructions did not work for you, please let us know at the [SquidDevs Telegram chat](https://t.me/HydraDevs).
