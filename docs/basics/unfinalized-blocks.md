---
sidebar_position: 70
title: Indexing unfinalized blocks
description: Handling network consensus in squids
---

# Indexing unfinalized blocks

Starting with the ArrowSquid release, Subsquid SDK supports indexing blocks before they are [finalized](https://info.etherscan.com/epoch-in-ethereum/), enabling real-time use cases. To take advantage of this feature, a squid processor must

 * have a node RPC endpoint as one of its data sources and
 * use a [`Database`](/store/store-interface) with hot blocks support (e.g. [`TypeormDatabase`](/store/postgres/typeorm-store)) in its [`processor.run()`](/basics/squid-processor/#processorrun) call.

All blocks with fewer confirmations than the number set by the `setFinalityConfirmations()` ([EVM](/evm-indexing/configuration/initialization/#set-finality-confirmation)) processor method will be considered "hot". The processor will periodically ([EVM](/evm-indexing/configuration/initialization/#set-chain-poll-interval)) poll the RPC endpoint for changes in consensus. When the consensus changes, it will re-run the [batch handler](/basics/squid-processor/#processorrun) with the new consensus data and ask the `Database` to adjust its state. The `Database` then must roll back the changes made due to orphaned blocks and apply the new changes. With this, the state of the `Database` reflects the current blockchain consensus at all times.
