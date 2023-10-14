---
sidebar_position: 70
title: Indexing unfinalized blocks
description: Handling network consensus in squids
---

# Indexing unfinalized blocks

Starting with the ArrowSquid release, Subsquid SDK supports indexing blocks before they are [finalized](https://info.etherscan.com/epoch-in-ethereum/), enabling real-time use cases. To take advantage of this feature, a squid processor must

1. have a node RPC endpoint as one of its data sources and
2. use a [`Database`](/store/store-interface) with hot blocks support (e.g. [`TypeormDatabase`](/store/postgres/typeorm-store)) in its [`processor.run()`](/basics/squid-processor/#processorrun) call, and
3. (EVM only) not set the [`useArchiveOnly(true)`](/evm-indexing/configuration/initialization/#use-archive-only) setting.

With this, the processor will consider some blocks to be "hot":

 - `EvmBatchProcessor`: all blocks with fewer confirmations than the number set by the [`setFinalityConfirmations()`](/evm-indexing/configuration/initialization/#set-finality-confirmation) setting
 - `SubstrateBatchProcessor`: all blocks above the latest finalized block provided by the [`chain_getFinalizedHead()`](https://polkadot.js.org/docs/substrate/rpc/#getfinalizedhead-blockhash) RPC method

The processor will periodically (interval setting for [EVM](/evm-indexing/configuration/initialization/#set-chain-poll-interval), [Substrate](/substrate-indexing/setup/general/#set-chain-poll-interval)) poll the RPC endpoint for changes in consensus. When the consensus changes, it will re-run the [batch handler](/basics/squid-processor/#processorrun) with the new consensus data and ask the `Database` to adjust its state. The `Database` then must roll back the changes made due to orphaned blocks and apply the new changes. With this, the state of the `Database` reflects the current blockchain consensus at all times.

RPC ingestion can create a heavy load on node endpoints. With Archives the load is typically short and the total number of requests is low, but their frequency may be sufficient to trigger http 429 responses. Use private endpoints and rate limit your requests with the [`rateLimit` chain source option](../configuration/initialization/#set-data-source).
