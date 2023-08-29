---
sidebar_position: 10
title: General settings
description: >-
  Data sourcing and metrics
---

# General settings

:::info
The method documentation is also available inline and can be accessed via suggestions in most IDEs.
:::

:::info
If contract address(-es) supplied to `EvmBatchProcessor` are stored in any wide-scope variables, it is recommended to convert them to flat lower case. This precaution is necessary because same variable(s) are often reused in the [batch handler](/basics/squid-processor/#processorrun) for data filtration, and all contract addresses in batch context data are **always** in flat lower case.
:::

The following setters configure the global settings of `EvmBatchProcessor`. They return the modified instance and can be chained.

#### `setDataSource(ds: ArchiveDataSource | ChainDataSource | MixedDataSource)` {#set-data-source}

**(Required)** Sets the blockchain data source. Squids can source data in three ways:

- **(Recommended)** When the data source is a `MixedDataSource = {archive: string, chain: ChainRpc}`, the processor will obtain as much data as is currently available from an archive, then switch to ingesting from the RPC endpoint. This combines the good syncing performance of the archive-only approach with the low network latency of the RPC-powered approach.

- When the data source is an `ArchiveDataSource = {archive: string}`, the processor will obtain data _only_ from an [archive](/archives). This allows retrieving vast amounts of data rapidly and eliminates the need for a node RPC endpoint, but introduces a network latency typically in thousands of blocks. Public EVM archive endpoints are listed on the [supported networks](/evm-indexing/supported-networks) page and published to the [`@subsquid/archive-registry`](/archives/overview/#archive-registry) package, which exposes them with the `lookupArchive()` function.

  A processor with an `ArchiveDataSource` cannot use [contract state queries](/evm-indexing/query-state). If you want to operate your squid in this regime but require state queries, use a `MixedDataSource` with the [`useArchiveOnly()`](#use-archive-only) setter.

- When the data source is a `ChainDataSource = {chain: ChainRpc}`, the processor will obtain data _only_ from a node RPC endpoint. This mode of operation is slow, but requires no archive and has almost [no chain latency](/basics/unfinalized-blocks). It can be used with EVM networks not listed on the [supported networks](/evm-indexing/supported-networks) page and with [local development nodes](/tutorials/ethereum-local-development).

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

#### `setFinalityConfirmation(nBlocks: number)` {#set-finality-confirmation}

Sets the number of blocks after which the processor will consider the consensus data final. Use a value appropriate for your network. For example, for Ethereum mainnet a widely cited value is 15 minutes/75 blocks. **Required for RPC ingestion** (i.e. whenever a `chain` was supplied to `setDataSource()`, but `useArchiveOnly()` was not called or was unset).

#### `setBlockRange({from: number, to?: number | undefined})` {#set-block-range}

Limits the range of blocks to be processed. When the upper bound is specified, processor will terminate with exit code 0 once it reaches it.

Note that block ranges can also be specified separately for each data request. This method sets global bounds for all block ranges in the configuration.

#### `useArchiveOnly(yes?: boolean | undefined)` {#use-archive-only}

Explicitly disables data ingestion from an RPC endpoint. Use this if you are making an Archive-only squid that also needs to [query contract state](/evm-indexing/query-state).

#### `setChainPollInterval(ms: number)` {#set-chain-poll-interval}

Sets the RPC poll interval in milliseconds. Default: 1000.

#### `includeAllBlocks(range?: Range | undefined)` {#include-all-blocks}

By default, processor will fetch only blocks which contain requested items. This method modifies such behavior to fetch all chain blocks. Optionally a `Range` (`{from: number, to?: number | undefined}`) of blocks can be specified for which the setting should be effective.

## RPC ingestion of traces and state diffs

Archives use the [debug API](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug) to get [traces](../traces) and the [trace API](https://openethereum.github.io/JSONRPC-trace-module) to extract [state diffs](../state-diffs). The default behavior of the processor during RPC ingestion is the same, but it can be overridden.

#### `useDebugApiForStateDiffs(yes?: boolean | undefined)` {#use-debug-api-for-state-diffs}

Use the debug API to get state diffs. **WARNING:** this will significantly increase the amount of data retrieved from the RPC endpoint. Expect download rates in the megabytes per second range.

[//]: # (???? Check the validity of the traffic claim on release)

#### `preferTraceApi(yes?: boolean | undefined)` {#prefer-trace-api}

Use the trace API to retrieve traces. Useful when requesting traces without state diffs: under these condition the processor will use the `trace_block()` method when ingesting trace data, and it is a very cheap call on many node providers.

## Miscellaneous

#### `setPrometheusPort(port: string | number)` {#set-prometheus-port}

Sets the port for a built-in prometheus metrics server. By default, the value of PROMETHEUS_PORT environment variable is used. When it is not set, processor will pick an ephemeral port.
