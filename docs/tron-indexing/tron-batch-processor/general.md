---
sidebar_position: 20
title: General settings
description: >-
  Data sourcing and metrics
---

# General settings

:::tip
The method documentation is also available inline and can be accessed via suggestions in most IDEs.
:::

The following setters configure the global settings of `TronBatchProcessor`. They return the modified instance and can be chained.

The only requirement is to specify at least one data souce via [`setGateway()`](#set-gateway) or [`setHttpApi()](#set-http-api). If you need real-time data, providing an HTTP API data source is a hard requirement.

- If you add both an SQD Network gateway and an HTTP API endpoint, the processor will obtain as much data as is currently available from the gateway, then switch to ingesting recent data via HTTP API.
- If you only add an SQD Network gateway, your data will be being several thousands of blocks behind the chain head most of the time.

### `setGateway(url: string | GatewaySettings)` {#set-gateway}

Use a [SQD Network](/subsquid-network) gateway. The argument is either a string URL of the gateway or

```ts
{
  url: string // gateway URL
  requestTimeout?: number // in milliseconds
}
```

### `setHttpApi(settings?: HttpApiSettings)` {#set-http-api}

We must use a regular HTTP API endpoint to get through the last mile and stay on top of the chain. This is a limitation, and we promise to lift it in the future.

```ts
interface HttpApiSettings = {
  url: string
  strideConcurrency?: // num of concurrent connections, default 2
  strideSize?: number // query size, default 10
  headPollInterval?: number // milliseconds, default 1000
}
```

### `setBlockRange({from: number, to?: number})` {#set-block-range}

Limits the range of blocks to be processed. When the upper bound is specified, processor will terminate with exit code 0 once it reaches it.

Note that block ranges can also be specified separately for each data request. This method sets global bounds for all block ranges in the configuration.

### `includeAllBlocks(range?: {from: number, to?: number})` {#include-all-blocks}

By default, processor will fetch only blocks which contain requested items. This method modifies such behavior to fetch all chain blocks. Optionally a range of blocks can be specified for which the setting should be effective.

### `setPrometheusPort(port: string | number)` {#set-prometheus-port}

Sets the port for a built-in prometheus health metrics server (serving at `http://localhost:${port}/metrics`). By default, the value of PROMETHEUS_PORT environment variable is used. When it is not set, processor will pick an ephemeral port.
