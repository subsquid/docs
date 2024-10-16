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

The following setters configure the global settings of `DataSourceBuilder` for Fuel Procesor. They return the modified instance and can be chained.

The only required configuration method is [`setGateway()`](#set-gateway). If you need real-time data, please also use [`setGraphql()`](#set-graphql).

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

### `setGraphql(settings?: GraphqlSettings)` {#set-graphql}

We must use regular GraphQL endpoint to get through the last mile and stay on top of the chain. This is a limitation, and we promise to lift it in the future.

```ts
type GraphqlSettings = {
  url: string // e.g. https://mainnet.fuel.network/v1/graphql
  strideSize?: number; // `getBlock` batch call size, default 5
  strideConcurrency?: number; // num of concurrent connections, default 10
};
```

### `setBlockRange({from: number, to?: number})` {#set-block-range}

Limits the range of blocks to be processed. When the upper bound is specified, processor will terminate with exit code 0 once it reaches it.

Note that block ranges can also be specified separately for each data request. This method sets global bounds for all block ranges in the configuration.

### `includeAllBlocks(range?: {from: number, to?: number})` {#include-all-blocks}

By default, processor will fetch only blocks which contain requested items. This method modifies such behavior to fetch all chain blocks. Optionally a range of blocks can be specified for which the setting should be effective.
