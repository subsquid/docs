---
sidebar_position: 5
title: ArrowSquid for Substrate
description: A step-by-step migration guide for Substrate
sidebar_class_name: hidden
---

# Migrate to ArrowSquid (Substrate)

This is a Substrate guide. EVM guide is available [here](/sdk/resources/migrate/migrate-to-arrowsquid).

ArrowSquid refers to `@subsquid/substrate-processor` versions `3.x` and above. It is not compatible with the FireSquid [archive](/glossary/#archives) endpoints. Instead, the new version uses [SQD Network](/subsquid-network) gateways. See the [Supported networks](/subsquid-network/reference/networks/#substrate-based) page.

The main feature introduced by the ArrowSquid update is the new ability of the [processor](/sdk/overview) to ingest unfinalized blocks directly from a network node, instead of waiting for an archive to ingest and serve it first. The processor can now handle forks and rewrite the contents of its database if it happens to have indexed orphaned blocks. This allows SQD-based APIs to become near real-time and respond to the on-chain activity with subsecond latency.

Other new features include the new streamlined processor configuration interface and automatic retrieval of execution traces. On the implementation side, the way in which data is fetched has been made more efficient.

[//]: # (!!!! add any new examples below)

End-to-end Substrate ArrowSquid examples:
 - [general Substrate indexing](https://github.com/subsquid-labs/squid-substrate-template);
 - [indexing an Ink! contract](https://github.com/subsquid-labs/squid-ink-template/);
 - [working with Frontier EVM pallet data](https://github.com/subsquid-labs/squid-frontier-evm-template).

Here is a step-by-step guide for migrating a squid built with an older SDK version to the post-ArrowSquid tooling.

## Step 1

Update all packages affected by the update:
```bash
npm i @subsquid/substrate-processor@latest @subsquid/typeorm-store@latest
```
```bash
npm i --save-dev @subsquid/substrate-typegen@latest
```
If your squid uses [`file-store`](/sdk/resources/persisting-data/file), please update any related packages to the `@latest` version.

## Step 2

Replace the old `setDataSource()` processor configuration call with a combination of [setGateway()](/sdk/reference/processors/substrate-batch/general/#set-gateway) and [setRpcEndpoint()](/sdk/reference/processors/substrate-batch/general/#set-rpc-endpoint). Use a [public SQD Network gateway URL for your network](/subsquid-network/reference/networks/#substrate-based). If your squid did not use an RPC endpoint before, find one for your network and set it with [setRpcEndpoint()](/sdk/reference/processors/substrate-batch/general/#set-rpc-endpoint). For Aleph Zero your edit might look like this:
```diff
 processor
-  .setDataSource({
-    archive: 'https://aleph-zero.archive.subsquid.io/graphql'
-  })
+  .setGateway('https://v2.archive.subsquid.io/network/aleph-zero')
+  .setRpcEndpoint({
+    url: 'https://aleph-zero-rpc.dwellir.com',
+    rateLimit: 10
+  })
```
We recommend using a private RPC endpoint for the best performance, e.g. from [Dwellir](https://www.dwellir.com). For squids deployed to [SQD Cloud](/cloud/overview) you may also consider using our [RPC addon](/cloud/resources/rpc-proxy).

Your squid will work with just an RPC endpoint, but it will sync significantly slower. With a SQD Network gateway available the processor will only use RPC to retrieve metadata **and** sync the few most recent blocks not yet made available by the gateway; without it it will retrieve all data from the endpoint.

## Step 3

Next, we have to account for the changes in signatures of the data requesting processor methods

- [`addEvent()`](/sdk/reference/processors/substrate-batch/data-requests/#events),
- [`addCall()`](/sdk/reference/processors/substrate-batch/data-requests/#calls),
- [`addEvmLog()`](/sdk/reference/processors/substrate-batch/data-requests/#addevmlog),
- [`addEthereumTransaction()`](/sdk/reference/processors/substrate-batch/data-requests/#addethereumtransaction),
- [`addContractsContractEmitted()`](/sdk/reference/processors/substrate-batch/data-requests/#addcontractscontractemitted),
- [`addGearMessageQueued()`](/sdk/reference/processors/substrate-batch/data-requests/#addgearmessagequeued),
- [`addGearUserMessageSent()`](/sdk/reference/processors/substrate-batch/data-requests/#addgearusermessagesent),

Previously, each call of these methods supplied its own fine-grained data fields selector. In the new interface, these calls only request data items, either directly or by relation (for example with the `call` flag for event-requesting methods). Field selection is now done by the new `setFields()` method on a per-item-type basis: once for all `Call`s, once for all `Event`s etc. The setting is processor-wide: for example, all `Call`s returned by the processor will have the same set of available fields, regardless of whether they were requested directly or as related data.

Begin migrating to the new interface by finding all calls to these methods and combining all the field selectors into processor-wide `event`, `call` and `extrinsic` field selectors that request all fields previously requested by individual selectors. Note that `call.args` and `event.args` are now requested by default and can be omitted. When done, add a call to `setFields()` supplying it with the new field selectors.

The new field selector format is fully documented on the [Field selection](/sdk/reference/processors/substrate-batch/field-selection) page.

:::info
Blanket field selections like `{data: {event: {extrinsic: true}}}` are not supported in ArrowSquid. If you used one of these, please find out which exact fields you use in the batch handler and specifically request them.
:::

:::warning
Do not include related data requests into the field selection. E.g.
```ts
  .setFields({
    event: {
      call: true
    }
  })
```
will at best fail to compile and at worst make your squid fail due to HTTP 400s from the network gateway.
:::

For example, suppose the processor was initialized with the following three calls:

```typescript
const processor = new SubstrateBatchProcessor()
  .addCall('Balances.transfer_keep_alive', {
    data: {
      call: {
        origin: true,
        args: true
      }
    }
  } as const)
  .addEvent('Balances.Transfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true,
          fee: true
        },
        call: {
          success: true,
          error: true
        }
      }
    }
  } as const)
  .addEvmLog(CONTRACT_ADDRESS,
    filter: [[ abi.events.SomeLog.topic ]],
    {
      data: {
        event: {
          extrinsic: {
            hash: true,
            tip: true
          }
        }
      }
    } as const
  )
```
then the new global selectors should be added like this:
```typescript
const processor = new SubstrateBatchProcessor()
  // ... addXXX() calls ...
  .setFields({
    event: {},
    call: {
      origin: true,
      success: true,
      error: true
    },
    extrinsic: {
      hash: true,
      fee: true,
      tip: true
    }
  })
```
Be aware that this operation will not increase the amount of data retrieved from the SQD Network gateway, since previously such coalescence was done under the hood and all fields were retrieved by the processor anyway. In fact, the amount of data should decrease due to a more efficient transfer mechanism employed by ArrowSquid.

There are two old field requests that have no direct equivalent in the new interface:

<details>
<summary>call.parent</summary>

It is currently impossible to request just the parent call. Work around by requesting the full call stack with `stack: true` in the call-requesting configuration calls, then using `.parentCall` property or `getParentCall()` method of `Call` data items to get parent calls.

</details>

<details>
<summary>event.evmTxHash</summary>

Processor no longer makes EVM transaction hashes explicitly available. Currently the only way to get hashes of logs' parent txs is to figure out the subset of calls that emitted the required logs, request them explicitly with their related events, filter out `Ethereum.Executed` events and decode these. See [this issue](https://github.com/subsquid/squid-sdk/issues/211).

</details>

## Step 4

Replace the old calls to the data requesting processor methods with calls using the new signatures.

:::warning
The meaning of passing `[]` as a set of parameter values has been changed in the ArrowSquid release: now it _selects no data_. Pass `undefined` for a wildcard selection:
```typescript
.addEvent({name: []}) // selects no events
.addEvent({}) // selects all events
```
:::

Old data request calls will be erased during the process. Make sure to request the appropriate related data with the boolean flags (`call` for event-requesting methods, `events` for call-requesting methods and `extrinsic`, `stack` for both).

Interfaces of data request methods are documented on the Data requests reference page:

- [`addEvent()`](/sdk/reference/processors/substrate-batch/data-requests/#events),
- [`addCall()`](/sdk/reference/processors/substrate-batch/data-requests/#calls),
- [`addEvmLog()`](/sdk/reference/processors/substrate-batch/data-requests/#addevmlog),
- [`addEthereumTransaction()`](/sdk/reference/processors/substrate-batch/data-requests/#addethereumtransaction),
- [`addContractsContractEmitted()`](/sdk/reference/processors/substrate-batch/data-requests/#addcontractscontractemitted),
- [`addGearMessageQueued()`](/sdk/reference/processors/substrate-batch/data-requests/#addgearmessagequeued),
- [`addGearUserMessageSent()`](/sdk/reference/processors/substrate-batch/data-requests/#addgearusermessagesent).

Here is a fully updated initialization code for the example processor from step 3:
```typescript
const processor = new SubstrateBatchProcessor()
  .addCall({
    name: [ 'Balances.transfer_keep_alive' ]
  })
  .addEvent({
    name: [ 'Balances.Transfer' ],
    call: true,
    extrinsic: true
  })
  .addEvmLog({
    address: [ CONTRACT_ADDRESS ],
    topic0: [ abi.events.SomeLog.topic ],
    extrinsic: true
  })
  .setFields({
    event: {},
    call: {
      origin: true,
      success: true,
      error: true
    },
    extrinsic: {
      hash: true,
      fee: true,
      tip: true
    }
  })

```

## Step 5

Finally, update the batch handler to use the new [batch context](/sdk/reference/processors/architecture/#batch-context). The main change here is that now `block.items` is split into three separate iterables: `block.calls`, `block.events` and `block.extrinsics`. There are two ways to migrate:

1. If you're in a hurry, use the `orderItems(block: Block)` function from [this snippet](https://gist.github.com/belopash/5d61dcce7739f60d55c4faaec0148282):
   ```typescript title="src/main.ts"
   // ...
   // paste the gist here

   processor.run(db, async ctx => {
     // ...
     for (let block of ctx.blocks) {
       for (let item of orderItems(block)) {
         // item processing code should work unchanged
       }
     }
     // ...
   })
   ```

2. Alternatively, rewrite your batch handler using the [new batch context interface](/sdk/reference/processors/architecture/#batch-context).

See [Block data for Substrate](/sdk/reference/processors/substrate-batch/context-interfaces) for the documentation on Substrate-specific part of batch context.

## Step 6

Rewrite your `typegen.json` in the new style. Here is an example:
```json
{
  "outDir": "src/types",
  "specVersions": "https://v2.archive.subsquid.io/metadata/kusama",
  "pallets": {
    "Balances": {
      "events": [
        "Transfer"
      ],
      "calls": [],
      "storage": [],
      "constants": []
    }
  }
}
```
Note the changes:
1. Archive URL as `"specVersions"` is replaced with an URL of our new metadata service (`"https://v2.archive.subsquid.io/metadata/kusama"`)
2. Requests for data wrappers are now made on a per-pallet basis.

Check out the updated [Substrate typegen documentation page](/sdk/tutorials/batch-processor-in-action). If you used any storage calls, consult [this documentation page](/sdk/resources/tools/typegen/state-queries) for guidance.

Once you're done migrating `typegen.json`, regenerate the wrapper classes with
```bash
npx squid-substrate-typegen typegen.json
```

## Step 7

Iteratively reconcile any type errors arising when building your squid (e.g. with `npm run build`). If you need to specify the field selection generic type argument explicitly, get it as a `typeof` of the `setFields` argument value:

```ts
import {Block} from '@subsquid/substrate-processor'

const fieldSelection = {
  event: {},
  call: {
    origin: true,
    success: true,
    error: true
  },
  extrinsic: {
    hash: true,
    fee: true,
    tip: true
  }
} as const

type MyBlock = Block<typeof fieldSelection>
// ...
```

At this point your squid should be able to work with the ArrowSquid tooling. If it doesn't, read on.

## Troubleshooting

If these instructions did not work for you, please let us know at the [SquidDevs Telegram chat](https://t.me/HydraDevs).
