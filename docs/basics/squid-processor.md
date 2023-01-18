---
sidebar_position: 40
title: Squid Processor
description: Data ingestion and transformation 
---

# Squid Processor

The processor service is a background node.js process responsible for data ingestion, transformation and data persisting into the target database. By convention, the processor code is located in `src/processor.ts`. It is run as 
```bash
node lib/processor.js
```

For local runs, one normally additionally exports environment variables from `.env` using `dotenv`:
```bash
node -r dotenv/config lib/processor.js
```

## Processor choice

The Squid SDK currently offers specialized processor classes for EVM (`EvmBatchProcessor`) and Substrate networks (`SubstrateBatchProcessor`). More networks will be supported in the future.

![Processor choice based on the network](</img/network-choice.png>)

Navigate to a dedicated section for each processor class:

- [`EvmBatchProcessor`](/evm-indexing)
- [`SubstrateBatchProcessor`](/substrate-indexing)


## Structu