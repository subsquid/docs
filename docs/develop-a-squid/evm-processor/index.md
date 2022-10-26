---
sidebar_position: 30
description: >-
  The squid processor ingests raw on-chain data from an Archive, transforms it and saves into the target data store.
---

# EVM Processor

This section applies to squids indexing EVM chains:

- Ethereum Mainnet. Archive endpoint: `https://ethereum-mainnet-beta.archive.subsquid.io`
- Polygon (Coming soon)

## Overview and the data model

A squid processor is a separate node.js process that fetches historical on-chain data from an [Archive](/archives), performs arbitrary transformations and saves the result into the target database schema. By convention, the processor entry point is `src/processor.ts`. `EvmBatchProcessor` is the central class that handles the EVM data extraction, transformation and persistence. The single `EvmBatchProcessor.run()` handler is responsible for transforming data from multiple events and transactions in a single in-memory batch.

The batch consists of canonically ordered execution log items of the following kinds:

- `evmLog` kind item. The processor subscribes to EVM logs with the `EvmBatchProcessor.addLog()` method. It supports filters and data selection options.
- `transaction` kind item. The processor subscribes to EVM transaction with `EvmBatchProcessor.addTransaction()`. 

Further, the processor can extract additional data by querying the [historical chain state](/develop-a-squid/evm-processor/query-state) and indeed any [external API](https://github.com/subsquid/squid-external-api-example).

