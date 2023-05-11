---
sidebar_position: 10
title: EVM processor
description: >-
  Overview of EvmBatchProcessor
---

# EVM Processor

**Disclaimer: This page has been (re)written for ArrowSquid, but it is still work in progress. It may contain broken links and memos left by the documentation developers.**

:::warning
The EVM Archive API and `EvmBatchProcessor` are currently in beta. Breaking changes may be introduced in the future releases of the Squid SDK.
:::

This section applies to squids indexing EVM chains. Subsquid supports all major EVM chains, including Ethereum, Polygon, BSC and many others. See the [configuration page](/evm-indexing/configuration) for a full list.

## Overview and the data model

A squid processor is a Node.js process that fetches historical on-chain data from an [Archive](/archives), performs arbitrary transformations and saves the result. `EvmBatchProcessor` is the central class that handles EVM data extraction, transformation and persistence. By convention, the processor entry point is `src/main.ts`; it is started by calling `EvmBatchProcessor.run()` there. A single [batch handler](/basics/batch-processing) function supplied to that method is responsible for transforming data from multiple blocks in a single in-memory batch.

[//]: # (???? Update with the final processor capabilities)

A batch provides iterables to access all items requested in [processor configuration](/evm-indexing/configuration), which may include logs, transactions, traces and contract [state diffs](/dead); see the [batch context page](../context-interfaces/) for details. Further, the processor can extract additional data by querying the [historical chain state](../query-state) and indeed any [external API](https://github.com/subsquid/squid-external-api-example).

Results of the ETL process can be stored in any [Postgres-compatible database](/basics/store/typeorm-store/) or in [filesystem-based datasets](/basics/store/file-store/) in CSV and [Parquet](https://parquet.apache.org) formats.

A typical processor looks as below:

[//]: # (???? The illustration needs updating)

![Batch processor context](</img/batch-context.png>)

## What's next?

- Move forward to the [`EvmBatchProcessor` configuration page](/evm-indexing/configuration)
- Explore the [migration guide](/migrate/migrate-subgraph/) and create a squid from a subgraph within minutes
- Follow the [tutorial](/tutorials/create-an-ethereum-processing-squid/) to build an Ethereum-indexing squid step by step
- Check the [examples](/examples)
