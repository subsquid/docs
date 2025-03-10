---
sidebar_position: 10
title: General settings
description: >-
  Data sourcing and metrics
---

# General settings

:::tip
The method documentation is also available inline and can be accessed via suggestions in most IDEs.
:::

The following setters configure the global settings of `DataSourceBuilder` for Solana Procesor. They return the modified instance and can be chained.

One or both of [`setGateway()`](#set-gateway) or [`setRpcEndpoint()`](#set-rpc) must be called to make the data source usable. `setRpcEndpoint()` is required if you need real-time data; `setGateway()` is required if you want to get historical data from SQD Network at high speed. All other methods are optional.
 - If you add both a SQD Network gateway and an RPC endpoint, the processor will obtain as much data as is currently available from the gateway, then switch to ingesting recent data via RPC.
 - If you only add a SQD Network gateway, your data will be being several thousands of blocks behind the chain head most of the time.

### `setGateway(url: string | GatewaySettings)` {#set-gateway}

Use a [SQD Network](/subsquid-network) gateway. The argument is either a string URL of the gateway or

```ts
{
  url: string // gateway URL
  requestTimeout?: number // in milliseconds
}
```

### `setRpc(settings?: RpcSettings)` {#set-rpc}

Adds a RPC data source. If added, it will be used for [RPC ingestion](/sdk/resources/unfinalized-blocks). The argument format is:

```ts
type RpcSettings = {
  client: SolanaRpcClient;
  strideSize?: number; // `getBlock` batch call size, default 5
  strideConcurrency?: number; // num of concurrent connections, default 10
  concurrentFetchThreshold?: number; // min distance from head that triggers a fetch, default 50
};
```

`SolanaRpcClient` class is exported by `@subsquid/solana-stream`. Its constructor arg type is

```ts
{
  url: string; // http, https, ws and wss are supported
  capacity?: number; // num of concurrent connections, default 10
  rateLimit?: number; // requests per second, default is no limit
  requestTimeout?: number; // in milliseconds, default 30_000
  retryAttempts?: number, // num of retries on failed RPC calls, default 0
  retrySchedule?: number, // retry pauses in ms
  maxBatchCallSize?: number; // default 100
  headers?: Record<string, string>, // http headers
  log?: Logger | null // customize or disable RPC client logs
}
```

### `setBlockRange({from: number, to?: number})` {#set-block-range}

Limits the range of blocks to be processed. When the upper bound is specified, processor will terminate with exit code 0 once it reaches it.

Note that block ranges can also be specified separately for each data request. This method sets global bounds for all block ranges in the configuration.

### `includeAllBlocks(range?: {from: number, to?: number})` {#include-all-blocks}

By default, processor will fetch only blocks which contain requested items. This method modifies such behavior to fetch all chain blocks. Optionally a range of blocks can be specified for which the setting should be effective.
