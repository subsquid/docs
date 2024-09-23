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

The following setters configure the global settings of `SubstrateBatchProcessor`. They return the modified instance and can be chained.

Calling [`setRpcEndpoint()`](#set-rpc-endpoint) is a hard requirement on Substrate, as chain RPC is used to retrieve chain metadata. Adding a [SQD Network gateway](/subsquid-network/reference/networks/#substrate-based) with [`setGateway()`](#set-gateway) is optional but highly recommended, as it greatly reduces RPC usage.

To reduce it further, you can explicitly disable [RPC ingestion](/sdk/resources/unfinalized-blocks) by calling [`setRpcDataIngestionSettings({ disabled: true })`](#set-rpc-data-ingestion-settings): in this scenario the RPC will only be used for metadata retrieval and to perform any [direct RPC queries](/sdk/resources/tools/typegen/state-queries/?typegen=substrate) you might be doing in your squid code. This will, however, introduce a delay of a few thousands of blocks between the chain head and the highest block available to your squid.

### `setGateway(url: string | GatewaySettings)` {#set-gateway}

Adds a [SQD Network](/subsquid-network) data source. The argument is either a string URL of a SQD Network gateway or
```ts
{
  url: string // gateway URL
  requestTimeout?: number // in milliseconds
}
```
See [Substrate gateways](/subsquid-network/reference/networks/#substrate-based).

### `setRpcEndpoint(rpc: ChainRpc)` {#set-rpc-endpoint}

Adds a RPC data source. If added, it will be used for
 - [RPC ingestion](/sdk/resources/unfinalized-blocks) (unless explicitly disabled with [`setRpcDataIngestionSettings()`](#set-rpc-data-ingestion-settings))
 - any [direct RPC queries](/sdk/resources/tools/typegen/state-queries/?typegen=substrate) you make in your squid code

A node RPC endpoint can be specified as a string URL or as an object:
```ts
type ChainRpc = string | {
  url: string // http, https, ws and wss are supported
  capacity?: number // num of concurrent connections, default 10
  maxBatchCallSize?: number // default 100
  rateLimit?: number // requests per second, default is no limit
  requestTimeout?: number // in milliseconds, default 30_000
  headers: Record<string, string> // http headers
}
```
Setting `maxBatchCallSize` to `1` disables batching completely.

:::tip
We recommend using private endpoints for better performance and stability of your squids. For SQD Cloud deployments you can use the [RPC addon](/cloud/resources/rpc-proxy). If you use an external private RPC, keep the endpoint URL in a [Cloud secret](/cloud/resources/env-variables#secrets).
:::

### `setDataSource(ds: {archive?: string, chain?: ChainRpc})` (deprecated) {#set-data-source}

Replaced by [`setGateway()`](#set-gateway) and [`setRpcEndpoint()`](#set-rpc-endpoint).

### `setRpcDataIngestionSetting(settings: RpcDataIngestionSettings)` {#set-rpc-data-ingestion-settings}

Specify the [RPC ingestion](/sdk/resources/unfinalized-blocks) settings.
```ts
type RpcDataIngestionSettings = {
  disabled?: boolean
  headPollInterval?: number
  newHeadTimeout?: number
}
```
Here,
 * `disabled`: Explicitly disables data ingestion from an RPC endpoint. **RPC endpoint is still required on Substrate because `SubstrateBatchProcessor` relies on it for metadata.** The only effect of this setting is to have the processor stop once it reaches the max SQD Network dataset height.
 * `headPollInterval`: Poll interval for new blocks in milliseconds. Poll mechanism is used to get new blocks via HTTP connections. Default: 5000.
 * `newHeadTimeout`: When ingesting from a websocket, this setting specifies the timeout in milliseconds after which the connection will be reset and subscription re-initiated if no new blocks were received. Default: no timeout.

### `setBlockRange({from: number, to?: number})` {#set-block-range}

Limits the range of blocks to be processed. When the upper bound is specified, processor will terminate with exit code 0 once it reaches it.

Note that block ranges can also be specified separately for each data request. This method sets global bounds for all block ranges in the configuration.

### `includeAllBlocks(range?: {from: number, to?: number})` {#include-all-blocks}

By default, processor will fetch only blocks which contain requested items. This method modifies such behavior to fetch all chain blocks. Optionally a range of blocks can be specified for which the setting should be effective.

### `setTypesBundle(bundle: string | OldTypesBundle | OldSpecsBundle | PolkadotjsTypesBundle)` {#set-types-bundle}

Sets a [types bundle](https://substrate.stackexchange.com/a/1231/4655).

Types bundle is only required for historical blocks which have metadata version below 14 and only if we don't have built-in support for the chain in question. Most chains listed in the [polkadot.js app](https://polkadot.js.org/apps/#/explorer) are supported.

SQD project has its own types bundle format, however, most of polkadotjs types bundles will work as well.

Types bundles can be specified in 2 different ways:

1. as a name of a JSON file:
   ```ts
   processor.setTypesBundle('typesBundle.json')
   ```
2. as an [`OldTypesBundle`/`OldSpecsBundle`](https://github.com/subsquid/squid-sdk/blob/master/substrate/substrate-runtime/src/metadata/old/types.ts) or [`PolkadotjsTypesBundle`](https://github.com/subsquid/squid-sdk/blob/master/substrate/substrate-runtime/src/metadata/old/types.ts) object:
   ```ts
   // OldTypesBundle object
   processor.setTypesBundle({
     types: {
       Foo: 'u8'
     }
   })
   ```

There a [mini-guide](/sdk/resources/substrate/types-bundle-miniguide) on how to obtain type bundles for Substrate chains without relying on SQD tools.

### `setPrometheusPort(port: string | number)` {#set-prometheus-port}

Sets the port for a built-in prometheus health metrics server (serving at `http://localhost:${port}/metrics`). By default, the value of PROMETHEUS_PORT environment variable is used. When it is not set, processor will pick an ephemeral port.
