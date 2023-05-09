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
- Moonbeam (Substrate data). For EVM data, use [EVM Processor](/evm-indexing)
- Moonriver (Substrate data). For EVM data, use [EVM Processor](/evm-indexing)
- Astar
- Acala

## Overview and the data model

A squid processor is a Node.js process that fetches historical on-chain data from an [Archive](/archives), performs arbitrary transformations and saves the result. By convention, the processor entry point is `src/processor.ts`. `SubstrateBatchProcessor` is the central class that handles Substrate data extraction, transformation and persistence. A single batch handler function supplied to `SubstrateBatchProcessor.run()` is responsible for transforming data from multiple events and transactions in a single in-memory batch.

Processor treats historical on-chain data as an ordered execution log. It subscribes to log items and receives items in batches. The order of items within the batch is identical to the order of data within the historical chain blocks. The batch handler function is called once for each batch.

For Substrate-based chains execution log items can be of the following kinds:

- Event items, corresponding to matching [Substrate runtime events](https://docs.substrate.io/main-docs/build/events-errors/).
- Call items, corresponding to matching calls executed by the Substrate runtime. All events emitted within a call are placed before the call. All the child calls are placed before the parent call. By default, both successful and failed calls will be handled.

Additional support is available for log items produced by the [Frontier EVM pallet](https://paritytech.github.io/frontier/frame/evm.html) (see [EVM support](/substrate-indexing/evm-support)), the [Contracts pallet](https://crates.parity.io/pallet_contracts/index.html) (see [ink! support](/substrate-indexing/wasm-support)) and the [Gear Messages pallet](/substrate-indexing/gear-support).

Further, processor can extract additional data by querying the [historical runtime state](/substrate-indexing/storage-state-calls) and indeed any [external API](https://github.com/subsquid/squid-external-api-example).
