---
sidebar_position: 3
title: ArrowSquid for EVM
description: A step-by-step migration guide for EVM
sidebar_class_name: hidden
---

# Migrate to ArrowSquid (EVM)

This is a EVM guide. Substrate guide is available [here](/sdk/resources/migrate/migrate-to-arrowsquid-on-substrate).

ArrowSquid refers to the versions `@subsquid/evm-processor@1.x` and `@subsquid/substrate-processor@3.x`. ArrowSquid is not compatible with the FireSquid [archive](/glossary/#archives) endpoints. Instead, it uses [SQD Network](/subsquid-network) gateways (see the [Supported EVM networks](/subsquid-network/reference/networks/#evm--ethereum-compatible) page).

The main feature introduced by the ArrowSquid update on EVM is the new ability of the [processor](/sdk/overview) to ingest unfinalized blocks directly from a network node, instead of waiting for the archive to ingest and serve it first. The processor can now handle forks and rewrite the contents of its database if it happens to have indexed orphaned blocks. This allows SQD-based APIs to become near real-time and respond to the on-chain activity with subsecond latency.

Another major feature introduced by ArrowSquid is the support for transaction execution receipts, [traces](/sdk/reference/processors/evm-batch/traces) and [state diffs](/sdk/reference/processors/evm-batch/state-diffs). It enables a significantly more fine-grained control over the smart contract states, especially in the situations when the EVM log data is insufficient. For example, one can:

- Reliably index transaction data, taking into account the transaction status
- Keep track of internal calls
- Observe smart contract state changes even if they are caused by internal transactions
- Track smart contract creation and destruction

The `EvmBatchProcessor` configuration and data selection interfaces has been simplified and the way in which the data is fetched has been made more efficient.

End-to-end ArrowSquid examples can be found [in the SDK repo](https://github.com/subsquid/squid-sdk/tree/master/test/eth-usdc-transfers) and in the [EVM examples](/sdk/examples) section.

Here is a step-by-step guide for migrating a squid built with an older SDK version to the post-ArrowSquid tooling.

## Step 1

Update all packages affected by the update:
```bash
npm i @subsquid/evm-processor@next
npm i @subsquid/typeorm-store@next
```
If your squid uses [`file-store`](/sdk/resources/persisting-data/file), please update any related packages to the `@next` version, too.

## Step 2

Replace the old `setDataSource()` processor configuration call with a combination of [setGateway()](/sdk/reference/processors/evm-batch/general/#set-gateway) and [setRpcEndpoint()](/sdk/reference/processors/evm-batch/general/#set-rpc-endpoint). Use a [public SQD Network gateway URL for your network](/subsquid-network/reference/networks/#evm--ethereum-compatible). If your squid did not use an RPC endpoint before, find one for your network and set it with [setRpcEndpoint()](/sdk/reference/processors/evm-batch/general/#set-rpc-endpoint). Also [configure](/sdk/reference/processors/evm-batch/general/#set-finality-confirmation) the network-specific number of transaction confirmations sufficient for finality. For Ethereum mainnet your edit might look like this:
```diff
 processor
-  .setDataSource({
-    archive: lookupArchive('eth-mainnet', {release: 'FireSquid'})
-  })
+  .setGateway('https://v2.archive.subsquid.io/network/ethereum-mainnet')
+  .setRpcEndpoint({
+    url: '<my_eth_rpc_url>',
+    rateLimit: 10
+  })
+  .setFinalityConfirmation(75)
```
We recommend using a private RPC endpoint for the best performance, e.g. from [BlastAPI](https://blastapi.io/). For squids deployed to [SQD Cloud](/cloud/overview/) you may also consider using our [RPC addon](/cloud/resources/rpc-proxy).

Your squid will work without an RPC endpoint, but with a significantly increased chain latency (a few hours for most chains, roughly a day for BSC). If that works for you, you can use just the SQD Network gateway without setting an RPC here and skip [Step 7](#step-7) altogether.

## Step 3

Next, we have to account for the changes in signatures of [`addLog()`](/sdk/reference/processors/evm-batch/logs/) and [`addTransaction()`](/sdk/reference/processors/evm-batch/transactions/) processor methods. Previously, each call of these methods supplied its own fine-grained field selectors. In the new interface, these calls can only enable or disable the retrieval of related data (with boolean flags `transaction` for `addLog()` and `logs` and a few others for `addTransaction()`). Field selection is now done by the new [`setFields()`](/sdk/reference/processors/evm-batch/field-selection) method on a per-item-type basis: once for all `log`s, once for all `transaction`s etc. The setting is processor-wide: for example, all `transaction`s returned by the processor will have the same set of available fields, regardless of whether they are taken from the batch context directly or are accessed from within a `log` item.

Begin migrating to the new interface by finding all calls to `addLog()` and combining all the `evmLog` field selectors into a single processor-wide field selector that requests all fields previously requested by individual selectors. Remove the `id`, `logIndex` (previously `index`) and `transactionIndex` fields: now they are always available and cannot be requested explicitly. When done, make a call to `setFields()` and supply the new field selector at the `log` field of its argument. For example, suppose the processor was initialized with the following three calls:
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
Be aware that this operation will not increase the amount of data retrieved from SQD Network, since previously such coalescence was done under the hood and all fields were retrieved by the processor anyway. In fact, the amount of data should decrease due to a more efficient transfer mechanism employed by ArrowSquid.

See the [Field selection](/sdk/reference/processors/evm-batch/field-selection) page for full documentation on field selectors.

## Step 4

Repeat step 3 for the `transaction` field selector. Make sure to check any transaction field selections by `addLog()` calls in addition to these made by [`addTransaction()`](/sdk/reference/processors/evm-batch/transactions/). Remove the default fields `id` and `transactionIndex` (previously `index`) and add the final field selector to the `.setFields()` call. For example, suppose the processor was initialized like this:
```typescript
const processor = new EvmBatchProcessor()
  .addLog(CONTRACT_ADDRESS, {
    filter: [[ abi.events.Transfer.topic ]],
    data: {
      evmLog: { /* ...some log field selections... */ },
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
     log: { /* ...some log field selections... */ },
+    transaction: {
+      hash: true,
+      gas: true,
+      gasPrice: true
+    }
   })
```

See the [Field selection](/sdk/reference/processors/evm-batch/field-selection) page for full documentation on field selectors.

## Step 5

Replace the old calls to `addLog()` and `addTransaction()` with calls using the [new signatures](/sdk/reference/processors/evm-batch).

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

Old data requests will be erased during the process. Make sure to request the appropriate data with the boolean flags (`transaction` for `addLog()` and `logs` for `addTransaction()`) while doing that.

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

Finally, update the batch handler to use the new [batch context](/sdk/reference/processors/architecture/#batch-context). There are two ways to do that:

1. If you're in a hurry, use the [`transformContext.ts`](https://gist.github.com/belopash/aa6b67dc374add44b9bdff1c9c1eee17) module. Download it with
   ```bash
   curl -o src/transformContext.ts https://gist.githubusercontent.com/belopash/aa6b67dc374add44b9bdff1c9c1eee17/raw/441d43a932591624822b5bfd51a23147b5cecac2/transformContext.ts
   ```
   then transform the new context to the old format at the beginning of the batch handler:
   ```typescript title="src/processor.ts"
   import {transformContext} from './transformContext'
   
   // ...

   processor.run(db, async (newCtx: DataHandlerContext<Store, any>) => {
     let ctx = transformContext(newCtx)
     // the rest of the batch handler should work unchanged
   })
   ```

2. Alternatively, rewrite your batch handler using the [new batch context interface](/sdk/reference/processors/architecture/#batch-context). Consult the [block data](/sdk/reference/processors/evm-batch/context-interfaces) page for EVM-specific details on the new context format.

## Step 7

Update your transactions/events decoding code. The big change here is that now decoders generated by `@subsquid/evm-typegen` return `bigint` where `ethers.BigNumber` was used before. Regenerate all TypeScript ABI wrappers as described in the [EVM typegen](/sdk/resources/tools/typegen/state-queries/?typegen=evm) section, then find all places where `ethers.BigNumber`s returned by old decoders were handled in your code and rewrite it to use `bigint`s.

## Step 8

Iteratively reconcile any type errors arising when building your squid (e.g. with `npm run build`). In case you're using `tranformContext.ts` you may find the types it exports helpful. If you need to specify the field selection generic argument explicitly, get it as a `typeof` of the `setFields` argument value:

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
