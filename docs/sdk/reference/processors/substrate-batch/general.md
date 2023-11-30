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

#### `setDataSource(ds: ChainDataSource | MixedDataSource)` {#set-data-source}

**(Required)** Sets the blockchain data source. Squids can source data in three ways:

- **(Recommended)** When the data source is a `MixedDataSource = {archive: string, chain: ChainRpc}`, the processor will obtain as much data as is currently available from an archive, then switch to ingesting from the RPC endpoint. This combines the good syncing performance of the archive-only approach with the low network latency of the RPC-powered approach.

  Note that `SubstrateBatchProcessor` also uses the RPC to occasionally retrieve chain metadata. That makes it impossible to use the processor without an RPC.

- When the data source is a `ChainDataSource = {chain: ChainRpc}`, the processor will obtain data _only_ from a node RPC endpoint. This mode of operation is slow, but requires no archive and. Like `MixedDataSource`, it also has almost [no chain latency](/sdk/resources/unfinalized-blocks). It can be used with Substrate networks not listed on the [supported networks](/subsquid-network/reference/substrate-networks) page and with local development nodes.

The node RPC endpoint can be specified as a string URL or as an object:
```ts
type ChainRpc = string | {
  url: string // http, https, ws and wss are supported
  capacity?: number // num of concurrent connections, default 10
  maxBatchCallSize?: number // default 100
  rateLimit?: number // requests per second, default is no limit
  requestTimeout?: number // in milliseconds, default 30_000
}
```
Setting `maxBatchCallSize` to `1` disables batching completely.

:::tip
We recommend using private endpoints for better performance and stability of your squids. For Subsquid Cloud deployments you can use the [RPC proxy](/cloud/reference/rpc-proxy). If you use an external private RPC, keep the endpoint URL in an environment variable and set it via [secrets](/cloud/resources/env-variables#secrets).
:::

#### `setBlockRange({from: number, to?: number | undefined})` {#set-block-range}

Limits the range of blocks to be processed. When the upper bound is specified, processor will terminate with exit code 0 once it reaches it.

Note that block ranges can also be specified separately for each data request. This method sets global bounds for all block ranges in the configuration.

#### `useArchiveOnly(yes?: boolean | undefined)` {#use-archive-only}

Explicitly disables data ingestion from an RPC endpoint. Use this if you are making an Archive-only squid.

#### `setChainPollInterval(ms: number)` {#set-chain-poll-interval}

Sets the RPC poll interval in milliseconds. Default: 1000.

#### `includeAllBlocks(range?: Range | undefined)` {#include-all-blocks}

By default, processor will fetch only blocks which contain requested items. This method modifies such behavior to fetch all chain blocks. Optionally a `Range` (`{from: number, to?: number | undefined}`) of blocks can be specified for which the setting should be effective.

#### `setTypesBundle(bundle: string | OldTypesBundle | OldSpecsBundle | PolkadotjsTypesBundle)` {#set-types-bundle}

Sets a [types bundle](https://substrate.stackexchange.com/a/1231/4655).

Types bundle is only required for historical blocks which have metadata version below 14 and only if we don't have built-in support for the chain in question. Most chains listed in the [polkadot.js app](https://polkadot.js.org/apps/#/explorer) are supported.

Subsquid project has its own types bundle format, however, most of polkadotjs types bundles will work as well.

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

There a [mini-guide[(/archives/substrate/networks) on how to obtain type bundles for Substrate chains without relying on Subsquid tools.

## Miscellaneous

#### `setPrometheusPort(port: string | number)` {#set-prometheus-port}

Sets the port for a built-in prometheus health metrics server (serving at `http://localhost:${port}/metrics`). By default, the value of PROMETHEUS_PORT environment variable is used. When it is not set, processor will pick an ephemeral port.
