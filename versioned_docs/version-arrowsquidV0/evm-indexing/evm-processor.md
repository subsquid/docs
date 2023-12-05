---
sidebar_position: 10
title: EVM processor
description: >-
  Overview of EvmBatchProcessor
---

# EVM Processor

This section applies to squids indexing EVM chains. See the [supported networks](/arrowsquid-docs-v0/evm-indexing/supported-networks) page for a full list.
[//]: # (!!!! Subsquid supports all major EVM chains, including Ethereum, Polygon, BSC and many others.)

## Overview and the data model

A squid processor is a Node.js process that fetches historical on-chain data from an [Archive](/arrowsquid-docs-v0/archives) and/or a chain node RPC endpoint, performs arbitrary transformations and saves the result. `EvmBatchProcessor` is the central class that handles EVM data extraction, transformation and persistence. By convention, the processor entry point is `src/main.ts`; it is started by calling `EvmBatchProcessor.run()` there. A single [batch handler](/arrowsquid-docs-v0/basics/batch-processing) function supplied to that method is responsible for transforming data from multiple blocks in a single in-memory batch.

A batch provides iterables to access all items requested in [processor configuration](../configuration), which may include logs, transactions, traces and contract [state diffs](../configuration/state-diffs/); see the [batch context](/arrowsquid-docs-v0/basics/squid-processor/#batch-context) and [block data](../context-interfaces/) pages for details. Further, the processor can extract additional data by querying the [historical chain state](../query-state) and indeed any [external API](/arrowsquid-docs-v0/basics/external-api).

Results of the ETL process can be stored in any [Postgres-compatible database](/arrowsquid-docs-v0/store/postgres/typeorm-store/) or in [filesystem-based datasets](/arrowsquid-docs-v0/store/file-store/) in CSV and [Parquet](https://parquet.apache.org) formats.

[//]: # (???? The illustration needs updating)

[//]: # (!!!! A typical processor looks as below:)
[//]: # (!!!! Batch processor context/img/batch-context.png)

## RPC ingestion

Starting with the ArrowSquid release, the processor can ingest data either from an [Archive](/arrowsquid-docs-v0/archives) or directly from an RPC endpoint. If both an Archive and an RPC endpoint are provided, the processor will use the Archive until it reaches the highest block available there, then index the few remaining blocks using the RPC endpoint. This allows squids to combine low sync times with near real-time chain data access. It is, however, possible to use either just the Archive (e.g. for analytics) or just the RPC endpoint (e.g. for [local development](/arrowsquid-docs-v0/tutorials/ethereum-local-development)).

RPC ingestion can create a heavy load on node endpoints. With Archives the load is typically short and the total number of requests is low, but their frequency may be sufficient to trigger http 429 responses. Use private endpoints and rate limit your requests with the [`rateLimit` chain source option](../configuration/initialization/#set-data-source).

## What's next?

- Move forward to the [`EvmBatchProcessor` configuration page](../configuration)
- Explore the [migration guide](/arrowsquid-docs-v0/migrate/migrate-subgraph/) and create a squid from a subgraph within minutes
- Follow the [tutorial](/arrowsquid-docs-v0/tutorials/bayc/) to build an Ethereum-indexing squid step by step
- Check ready-to-use [snippets](/arrowsquid-docs-v0/evm-indexing/configuration/showcase) and [examples](/arrowsquid-docs-v0/examples/evm)
