---
sidebar_position: 1
title: Use real-time Portal data on EVM
description: Get all of your EVM data from the Portal
sidebar_class_name: hidden
pagination_next: null
pagination_prev: null
---


:::info
SQD Network portals are currently in open beta. Please report any bugs or suggestions to the SQD Portal chat or to [Squid Devs](https://t.me/HydraDevs).
:::

This guide gets you through migrating EVM indexer setups that use RPC for real-time data ingestion to ingesting real time data from an SQD Network portal. The guide will work regardless of whether or not you already have migrated to using a portal for historical data.

Here are the steps to migrate:

## Step 1

Uninstall `@subsquid/evm-processor` and install the new packages plus `@subsquid/logger`:
```bash
npm uninstall @subsquid/evm-processor
npm i @subsquid/evm-stream@portal-api @subsquid/evm-objects@portal-api @subsquid/batch-processor@portal-api @subsquid/logger
```

## Step 2

Make sure that you have an SQD portal URL for your dataset, and that real time data is supported.

Try
```
https://portal.sqd.dev/datasets/<dataset-slug>
```
where `<dataset-slug>` is the last path segment of the gateway URL for your network found on [this page](/subsquid-network/reference/networks). For example, the URL for the Ethereum dataset is
```
https://portal.sqd.dev/datasets/ethereum-mainnet
```
You can find out whether the dataset has real time data by querying the `/metadata` endpoint:
```bash
$ curl -s --fail-with-body https://portal.sqd.dev/datasets/ethereum-mainnet/metadata
{
  "dataset": "ethereum-mainnet",
  "aliases": [],
  "real_time": true,
  "start_block": 0
}
```

## Step 3

Replace your processor configuration (at `src/processor.ts` or `src/main.ts`) with a data source configuration.

1. Make the necessary imports
   ```diff
   -import {EvmBatchProcessor} from '@subsquid/evm-processor'
   +import {DataSourceBuilder} from '@subsquid/evm-stream'
   +import {augmentBlock} from '@subsquid/evm-objects'
   +import {createLogger} from '@subsquid/logger'
   ```

2. Replace initialization of `EvmBatchProcessor` with `DataSourceBuilder`:
   ```diff
   -const processor = new EvmBatchProcessor()
   -  .setGateway('https://v2.archive.subsquid.io/network/ethereum-mainnet')
   -  // ^ this would be .setPortal if you already migrated to using portal for historical data
   -  .setRpcEndpoint('https://rpc.ankr.com/eth')
   -  .setFinalityConfirmation(75)
   +const dataSource = new DataSourceBuilder()
   +  .setPortal('https://portal.sqd.dev/datasets/ethereum-mainnet')
   ```
   RPC endpoint and finality confirmation settings are no longer needed.

3. Rewrite the data requests (`.addXXX` method calls) using the new `where-include-range` syntax. Previously, these accepted flat objects, e.g.
   ```ts
   // old style
   .addLog({
     address: [USDC_CONTRACT_ADDRESS],
     topic0: [usdcAbi.events.Transfer.topic],
     transaction: true, // include the parent transaction
     range: { from: 6_082_465 },
   })
   ```
   Now data requests, related data retrieval flags and the range spec are separated:
   ```ts
   // new style
   .addLog({
     where: {
       address: [USDC_CONTRACT_ADDRESS],
       topic0: [usdcAbi.events.Transfer.topic],
     },
     include: {
       transaction: true, // include the parent transaction
     },
     range: { from: 6_082_465 },
   })
   ```

4. Include a `.build()` call at the end of the data source initialization, e.g.
   ```diff
   .setFields({
     log: {
       transactionHash: true,
     },
   })
   +.build()
   ```

5. If you passed your processor object between any source code files (e.g. from `src/processor.ts` to `src/main.ts`), pass the `dataSource` object in the same way.

## Step 4

Replace the `processor.run()` call with a call to the unified `run` function.

1. Import the `run` function at the file where your `processor.run()` call is (typically `src/main.ts`):
   ```diff
   +import {run} from '@subsquid/batch-processor'
   ```

2. Manually create a logger for your batch handler:
   ```diff
   const logger = createLogger('sqd:processor:mapping')
   ```

3. Replace the `processor.run()` call:
   ```diff
   -processor.run(db, async (ctx) => {
   +run(dataSource, db, async (simpleCtx) => {
   ```
   Note that the data source will produce a much simpler context by default, and you have to enrich it to make it compatible with your old batch handler code:
   ```diff
   +  const ctx = {
   +    ...simpleCtx,
   +    blocks: simpleCtx.blocks.map(augmentBlock),
   +    log: logger
   +  }
   ```

<details>
<summary>Example of a full diff of edits up to this point</summary>

```diff
--- a/src/main.ts
+++ b/src/main.ts
@@ -1,29 +1,43 @@
-import {EvmBatchProcessor} from '@subsquid/evm-processor'
+import {DataSourceBuilder} from '@subsquid/evm-stream'
+import {augmentBlock} from '@subsquid/evm-objects'
+import {run} from '@subsquid/batch-processor'
+import {createLogger} from '@subsquid/logger'
 import {TypeormDatabase} from '@subsquid/typeorm-store'
 import * as usdcAbi from './abi/usdc'
 import {UsdcTransfer} from './model'
 
 const USDC_CONTRACT_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
 
-const processor = new EvmBatchProcessor()
-  .setGateway('https://v2.archive.subsquid.io/network/ethereum-mainnet')
-  .setRpcEndpoint('https://rpc.ankr.com/eth')
-  .setFinalityConfirmation(75)
+const dataSource = new DataSourceBuilder()
+  .setPortal('https://portal.sqd.dev/datasets/ethereum-mainnet')
   .addLog({
+    where: {
+      address: [USDC_CONTRACT_ADDRESS],
+      topic0: [usdcAbi.events.Transfer.topic],
+    },
+    include: {
+      transaction: true, // include the parent transaction
+    },
     range: { from: 6_082_465 },
-    address: [USDC_CONTRACT_ADDRESS],
-    topic0: [usdcAbi.events.Transfer.topic],
-    transaction: true, // include the parent transaction
   })
   .setFields({
     log: {
       transactionHash: true,
     },
   })
+  .build()
 
 const db = new TypeormDatabase({supportHotBlocks: true})
 
-processor.run(db, async (ctx) => {
+const logger = createLogger('sqd:processor:mapping')
+
+run(dataSource, db, async (simpleCtx) => {
+  const ctx = {
+    ...simpleCtx,
+    blocks: simpleCtx.blocks.map(augmentBlock),
+    log: logger,
+  }
+
   const transfers: UsdcTransfer[] = []
   for (let block of ctx.blocks) {
     for (let log of block.logs) {
```

</details>

## Step 5

If you use [direct RPC calls](/sdk/resources/tools/typegen/state-queries/?typegen=evm) in your batch handler code you'll need to add an RPC client to your context. If you do not, skip this step.

1. Install `@subsquid/rpc-client`

2. Import and initialize an `RpcClient`:
   ```diff
   +import {RpcClient} from '@subsquid/rpc-client'
   +const rpcClient = new RpcClient({
   +  url: 'https://my_rpc_url',
   +  rateLimit: 100
   +})
   ```

3. In your batch handler, enrich the context with the `_chain` field:
   ```diff
      const ctx = {
        ...simpleCtx,
        blocks: simpleCtx.blocks.map(augmentBlock),
        log: logger,
   +    _chain: {
   +      client: rpcClient
   +    }
      }
   ```

Now your old contract calls will work, e.g.
```ts
const usdcContract = new usdcAbi.Contract(
  ctx,
  blocks[0].header,
  USDC_CONTRACT_ADDRESS
)
// Decimals via a direct call to state at blocks[0].header.height
const decimals = await usdcContract.decimals()
```

## Migration is complete

Your squid is now ready to source its real time data from an SQD Network portal. Give it a try!

An example of a complete migration of a simple squid ([USDC transfers](https://github.com/subsquid-labs/showcase01-all-usdc-transfers)) can be found in the following branches:
 - [without an RPC client](https://github.com/subsquid-labs/squid-evm-rt-template/tree/with-logger)
 - [with an RPC client](https://github.com/subsquid-labs/squid-evm-rt-template/tree/with-rpc-client)
