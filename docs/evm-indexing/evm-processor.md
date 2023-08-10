---
sidebar_position: 10
title: EVM processor
description: >-
  Overview of EvmBatchProcessor
---

# EVM Processor

This section applies to squids indexing EVM chains. See the [supported networks](/evm-indexing/supported-networks) page for a full list.
[//]: # (!!!! Subsquid supports all major EVM chains, including Ethereum, Polygon, BSC and many others.)

## Overview and the data model

A squid processor is a Node.js process that fetches historical on-chain data from an [Archive](/archives) and/or a chain node RPC endpoint, performs arbitrary transformations and saves the result. `EvmBatchProcessor` is the central class that handles EVM data extraction, transformation and persistence. By convention, the processor entry point is `src/main.ts`; it is started by calling `EvmBatchProcessor.run()` there. A single [batch handler](/basics/batch-processing) function supplied to that method is responsible for transforming data from multiple blocks in a single in-memory batch.

A batch provides iterables to access all items requested in [processor configuration](../configuration), which may include logs, transactions, traces and contract [state diffs](../configuration/state-diffs/); see the [batch context](/basics/squid-processor/#batch-context) and [block data](../context-interfaces/) pages for details. Further, the processor can extract additional data by querying the [historical chain state](../query-state) and indeed any [external API](https://github.com/subsquid/squid-external-api-example).

Results of the ETL process can be stored in any [Postgres-compatible database](/store/postgres/typeorm-store/) or in [filesystem-based datasets](/store/file-store/) in CSV and [Parquet](https://parquet.apache.org) formats.

[//]: # (???? The illustration needs updating)

[//]: # (!!!! A typical processor looks as below:)
[//]: # (!!!! Batch processor context/img/batch-context.png)

## RPC ingestion

Starting with the ArrowSquid release, the processor can ingest data either from an [Archive](/archives) or directly from an RPC endpoint. If both an Archive and an RPC endpoint are provided, the processor will use the Archive until it reaches the highest block available there, then index the few remaining blocks using the RPC endpoint. This allows squids to combine low sync times with near real-time chain data access. It is, however, possible to use either just the Archive (e.g. for analytics) or just the RPC endpoint (e.g. for [local development](/tutorials/ethereum-local-development)).

[//]: # (!!!! Add a reference to a page explaining the ArrowSquid release above)

## What's next?

- Move forward to the [`EvmBatchProcessor` configuration page](../configuration)
- Explore the [migration guide](/migrate/migrate-subgraph/) and create a squid from a subgraph within minutes
- Follow the [tutorial](/tutorials/bayc/) to build an Ethereum-indexing squid step by step
- Check ready-to-use [snippets](/evm-indexing/configuration/showcase) and [examples](/examples)
