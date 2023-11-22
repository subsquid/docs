---
sidebar_position: 10
title: Substrate processor
description: >-
  Overview of SubstrateBatchProcessor
---

# Substrate Processor

This section applies to squid processors indexing [Substrate](https://substrate.io)-based chains, including:

- Polkadot
- Kusama
- Acala

See [Supported networks](/substrate-indexing/supported-networks) for a full list.

If you are building on one of the networks implementing EVM on Substrate, such as

- Astar
- Moonbeam
- Moonriver

and only require EVM data, consider using [EVM processor](/evm-indexing).

## Overview and the data model

A squid processor is a Node.js process that fetches historical on-chain data from an [Archive](/archives) and/or a chain node RPC endpoint, performs arbitrary transformations and saves the result. `SubstrateBatchProcessor` is the central class that handles Substrate data extraction, transformation and persistence. By convention, the processor entry point is `src/main.ts`; it is started by calling `SubstrateBatchProcessor.run()` there. A single [batch handler](/basics/batch-processing) function supplied to that method is responsible for transforming data from multiple blocks in a single in-memory batch.

A batch provides iterables to access all items requested in [processor configuration](../setup), which may include

- Events, corresponding to matching [Substrate runtime events](https://docs.substrate.io/main-docs/build/events-errors/).
- Calls, corresponding to matching calls executed by the Substrate runtime.

See the [batch context](/basics/squid-processor/#batch-context) and [block data](../context-interfaces/) pages for details. 

Additional support is available for log items produced by the [Frontier EVM pallet](https://paritytech.github.io/frontier/frame/evm.html) (see [EVM support](../specialized/evm)), the [Contracts pallet](https://crates.parity.io/pallet_contracts/index.html) (see [ink! support](../specialized/wasm)) and the [Gear Messages pallet](../specialized/gear). Further, processor can extract additional data by querying the [historical runtime state](/substrate-indexing/storage-state-calls) and indeed any [external API](/basics/external-api).

Results of the ETL process can be stored in any [Postgres-compatible database](/store/postgres/typeorm-store/) or in [filesystem-based datasets](/store/file-store/) in CSV and [Parquet](https://parquet.apache.org) formats.

## RPC ingestion

Starting with the ArrowSquid release, the processor can ingest data either from an [Archive](/archives) or directly from an RPC endpoint. If both an Archive and an RPC endpoint are provided, the processor will use the Archive until it reaches the highest block available there, then index the remaining blocks using the RPC endpoint. This allows squids to combine low sync times with near real-time chain data access. It is, however, possible to use just the RPC endpoint.

RPC ingestion can create a heavy load on node endpoints. With Archives the load is typically short and the total number of requests is low, but their frequency may be sufficient to trigger http 429 responses. Use private endpoints and rate limit your requests with the [`rateLimit` chain source option](../setup/general/#set-data-source).

## What's next?

- Move forward to the [`SubstrateBatchProcessor` configuration page](../setup)
- Follow the [tutorial](/tutorials/create-a-simple-squid) to build a squid indexing the Crust parachain step by step
- Taka a look at the [examples](/examples/substrate)
