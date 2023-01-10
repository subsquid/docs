---
sidebar_position: 10
description: >-
  The squid processor ingests raw on-chain data from an Archive, transforms it and saves into the target data store.
---

# Substrate Processor

This section applies to squid processors indexing [Substrate](https://dcos.substrate.io)-based chains, including:

- Polkadot
- Kusama
- Moonbeam
- Moonriver
- Astar
- Acala

## Overview and the data model

A squid processor is a separate node.js process that fetches historical on-chain data from an [Archive](/archives), performs arbitrary transformations and saves the result into the target database schema defined above. By convention, the processor entry point is `src/processor.ts`.

A processor treats the historical on-chain data as an ordered execution log. The processor subscribes to the log items of interest by defining data handlers. The data handlers define the data to be fetched and how the data is transformed and persisted to the target database. The execution log items are processed by the handlers strictly in the order defined by the data stored in the historical chain blocks.

For Substrate-based chains, the execution log items can be of the following kind.

- event item, corresponds to a matching [Substrate runtime event](https://docs.substrate.io/main-docs/build/events-errors/) 

- call item, corresponds to a matching call executed by the Substrate runtime. All the calls are processed sequentially according to their position in the unified log of events and calls. All events emitted within a call are placed
before the call. All the child calls are placed before the parent call. By default, only successful calls will be handled.

Additional support is added for log items produced by the [Frontier EVM pallet](https://paritytech.github.io/frontier/frame/evm.html) (see [EVM support](/develop-a-squid/substrate-processor/evm-support)), [Contracts pallet](https://crates.parity.io/pallet_contracts/index.html) (see [Ink! support](/develop-a-squid/substrate-processor/wasm-support)) and the [Gear Messages pallet](/develop-a-squid/substrate-processor/gear-support).

Further, the processor can extract additional data by querying the [historical runtime state](/develop-a-squid/substrate-processor/storage-state-calls) and indeed any [external API](https://github.com/subsquid/squid-external-api-example).


The Subsquid SDK provides two flavors of squid processors. `SubstrateBatchProcessor`, introduced in the FireSquid release, and the legacy `SubstrateProcessor`. `SubstrateBatchProcessor`, is designed to have only a single data handler that processes an array of ordered log items of different kinds in a single batch. `SubstrateProcessor` expects a separate data handler to be defined for each kind of the log item to be processed. As `SubstrateBatchProcessor` delivers up to 100x better processing speed due to the reduced number of roundtrips to the database, the current documentation is focused around it.

