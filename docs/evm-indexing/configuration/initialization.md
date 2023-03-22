---
sidebar_position: 10
description: >-
  Set the source Archive and the block range
---

# Initialization

:::info
The method documentation is also available inline and can be accessed via suggestions in most IDEs.
:::

:::info
If contract address(-es) supplied to `EvmBatchProcessor` are stored in any wide-scope variables, it is recommended to convert them to flat lower case. This precaution is necessary because same variable(s) are often reused in the [batch handler](/evm-indexing/context-interfaces) for item filtration, and all contract addresses in the items are **always** in flat lower case.
:::

The following setters configure the global settings of `EvmBatchProcessor`. They return the modified instance and can be chained.

**`setBlockRange({from: number, to?: number | undefined})`**: Limits the range of blocks to be processed. When the upper bound is specified, the processor will terminate with exit code 0 once it reaches it.

**`setDataSource({archive: string, chain?: string | undefined})`**: Sets blockchain data source. Example:


Argument properties:
+ `archive`: An archive endpoint providing the data for the selected network. See [supported networks](/evm-indexing/supported-networks) for a list of endpoints for public EVM Archives and a usage example. The endpoints are also published to the [Archive registry](/archives/overview/#archive-registry) and exposed with `lookupArchive` function of `@subsquid/archive-regitry` package.

+ `chain?`: A JSON-RPC endpoint for the network of interest. Required if the processor has to make [contract state queries](/evm-indexing/query-state). For squids indexing only event and/or transaction data it can be omitted. HTTPS and WSS endpoints are supported.

## Less common settings

**`setPrometheusPort(port: string | number)`**: Sets the port for a built-in prometheus metrics server. By default, the value of PROMETHEUS_PORT environment variable is used. When it is not set, the processor will pick up an ephemeral port.

**`includeAllBlocks(range?: Range | undefined)`**: By default, the processor will fetch only blocks which contain requested items. This method modifies such behavior to fetch all chain blocks. Optionally a `Range` (`{from: number, to?: number | undefined}`) of blocks can be specified for which the setting should be effective.
