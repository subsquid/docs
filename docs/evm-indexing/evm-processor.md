---
sidebar_position: 10
title: EVM processor
description: >-
  Overview of EvmBatchProcessor
---

# EVM Processor

:::warning
The EVM Archive API and `EvmBatchProcessor` are currently in beta. Breaking changes may be introduced in the future releases of the Squid SDK.
:::

This section applies to squids indexing EVM chains. Subsquid supports all major EVM chains, including Ethereum, Polygon, BSC and many others. See the [configuration page](/evm-indexing/configuration) for a full list.

## Overview and the data model

A squid processor is a Node.js process that fetches historical on-chain data from an [Archive](/archives), performs arbitrary transformations and saves the result. By convention, the processor entry point is `src/processor.ts`. `EvmBatchProcessor` is the central class that handles EVM data extraction, transformation and persistence. A single [batch handler](/basics/batch-processing) function supplied to `EvmBatchProcessor.run()` is responsible for transforming data from multiple events and transactions in a single in-memory batch.

A batch can be thought of a simplified execution trace of the EVM runtime. It consists of `evmLog` and `transaction` items. The list of items that get into the batch is determined by the filters defined by the `EvmBatchProcessor` [configuration](/evm-indexing/configuration). Configuration is set by calling the `addLog()` and `addTransaction()` methods. The items in the batch are canonically ordered. Any event log item placed in a batch will always be immediately followed by an item for the transaction that emitted the event.

Further, the processor can extract additional data by querying the [historical chain state](/evm-indexing/query-state) and indeed any [external API](https://github.com/subsquid/squid-external-api-example).

Results of the ETL process can be stored in any Postgres-compatible database. Support for storing to CSV and [Parquet](https://parquet.apache.org), located either on a local filesystem or on an Amazon S3-compatible cloud storage, [is currently experimental](https://github.com/subsquid/squid-file-store).

A typical processor looks as below:

![Batch processor context](</img/batch-context.png>)

## What's next?

- Move forward to the [`EvmBatchProcessor` configuration page](/evm-indexing/configuration)
- Explore the [migration guide](/migrate/migrate-subgraph/) and create a squid from a subgraph within minutes
- Follow the [tutorial](/tutorials/create-an-ethereum-processing-squid/) to build an Ethereum-indexing squid step by step
- Check the [examples](/examples)
