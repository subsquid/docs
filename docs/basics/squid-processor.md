---
sidebar_position: 40
title: Squid processor
description: Data ingestion and transformation 
---

# Squid Processor

The processor service is a background node.js process responsible for data ingestion, transformation and data persisting into the target database. By convention, the processor entry point is at `src/main.ts`. It is run as
```bash
node lib/main.js
```

For local runs, one normally additionally exports environment variables from `.env` using `dotenv`:
```bash
node -r dotenv/config lib/main.js
```

## Processor choice

The Squid SDK currently offers specialized processor classes for EVM (`EvmBatchProcessor`) and Substrate networks (`SubstrateBatchProcessor`). More networks will be supported in the future. By convention, the processor object is defined at `src/processor.ts`.

![Processor choice based on the network](</img/network-choice.png>)

Navigate to a dedicated section for each processor class:

- [`EvmBatchProcessor`](/evm-indexing)
- [`SubstrateBatchProcessor`](/substrate-indexing)

## Configuration

A processor instance should be configured to define the block range to be indexed, and the selectors of data to be fetched from the archive. See the configuration pages of the corresponding sections.

## `processor.run()`

The actual data indexing is done by the `run()` method called on a processor instance (typically at `src/main.ts`). The method has the following signature:

```ts
run<Store>(db: Database<Store>, batchHander: (ctx: BatchContext<Store, Item>) => Promise<void>): void
```

The `db` argument defines the target data sink, and `batchHandler` is an `async` `void` function defining the data transformation and persistence logic.

The `Context` and `Store` interfaces are explained in the next sections.

To jump straight to examples, see [EVM Processor in action](/evm-indexing/batch-processor-in-action) and [Substrate Processor in action](/substrate-indexing/batch-processor-in-action).
