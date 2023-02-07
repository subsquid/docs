---
sidebar_position: 30
description: >-
  The squid processor ingests raw on-chain data from an Archive, transforms it and saves into the target data store.
---

# EVM Processor

This section applies to squids indexing EVM chains. Subsquid supports all major EVM chains, including Ethereum, Polygon, BSC, see the [configuration page](/evm-indexing/configuration) for a full list.

## Overview and the data model

A squid processor is a separate node.js process that fetches historical on-chain data from an [Archive](/archives), performs arbitrary transformations and saves the result into the target database schema. By convention, the processor entry point is `src/processor.ts`. `EvmBatchProcessor` is the central class that handles the EVM data extraction, transformation and persistence. The single `EvmBatchProcessor.run()` handler is responsible for transforming data from multiple events and transactions in a single in-memory batch.

A batch can be thought of a simplified execution trace of the EVM runtime. It consists of `evmLog` and `transaction` items. The list of items that get into the batch is defined by the filters defined by the `EvmBatchProcessor` [config](/evm-indexing/configuration):

- `evmLog` kind item. The processor subscribes to EVM logs with the `EvmBatchProcessor.addLog()` method. It supports filters and data selection options.
- `transaction` kind item. The processor subscribes to EVM transaction with `EvmBatchProcessor.addTransaction()`. The transaction item is always placed immediately after the logs emitted by the corresponding on-chain transaction.

Further, the processor can extract additional data by querying the [historical chain state](/evm-indexing/query-state) and indeed any [external API](https://github.com/subsquid/squid-external-api-example).

The target database for the ETL process defined by `EvmBatchProcessor` can be configured at runtime. Squid SDK currently supports Postgres-compatible target databases, as well as flat files stored in a `s3`-compatible storage.

A typical processor looks as below:

![Batch processor context](</img/batch-context.png>)

## What's next?

- Move forward to the [`EvmBatchProcessor` configuration page](/evm-indexing/configuration)
- Explore the [migration guide](/migrate/migrate-subgraph/) and create a squid from a subgraph within minutes
- Follow the [tutorial](/tutorials/create-an-ethereum-processing-squid/) to how to build an Ethereum-indexing squid step by step
- Check the [examples](/examples)
