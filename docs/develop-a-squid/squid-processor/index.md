---
sidebar_position: 30
description: >-
  The squid processor ingests raw on-chain data from an Archive, transforms it and saves into the target data store.
---

# Squid Processor

## Overview and the data model

A squid processor is a separate node.js process that fetches historical on-chain data from an [Archive](/archives), performs arbitrary transformations and saves the result into the target database schema defined above. By convention, the processor entry point is `src/processor.ts`.

A processor treats the historical on-chain data as an ordered execution log. The processor subscribes to the log items of interest by defining data handlers. The data handlers define the data to be fetched and how the data is transformed and persisted to the target database. The execution log items are processed by the handlers strictly in the order defined by the data stored in the historical chain blocks.

For Substrate-based chains, the execution log items can be as the following kind.

- event item, corresponds to a matching [Substrate runtime event](https://docs.substrate.io/main-docs/build/events-errors/) 

- call item, corresponds to a matching call executed by the Substrate runtime. All the calls are processed sequentially according to their position in the unified log of events and calls. All events emitted within a call are placed
before the call. All the child calls are placed before the parent call. By default, only successful calls will be handled.

- EVM log item, corresponds to a matching EVM log emitted by a smart contract. Available only for chains with the [Frontier EVM pallet](https://paritytech.github.io/frontier/frame/evm.html), e.g. [Moonbeam](https://docs.moonbeam.network/learn/features/eth-compatibility/) or Astar.

- WASM log item, corresponds to a matching WASM log emitted by a WASM smart contract. Available only for chains with the [Contracts pallet](https://crates.parity.io/pallet_contracts/index.html), e.g. Astar.

The Subsquid SDK provides two flavors of squid processors. `SubstrateBatchProcessor`, introduced in the FireSquid release, and the legacy `SubstrateProcessor`. `SubstrateBatchProcessor`, is designed to have only a single data handler that processes an array of ordered log items of different kinds in a single batch. `SubstrateProcessor` expects a separate data handler to be defined for each kind of the log item to be processed. As `SubstrateBatchProcessor` delivers up to 100x better processing speed due to the reduced number of roundtrips to the database, the current documentation is focused around it.

