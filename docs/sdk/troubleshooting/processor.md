---
sidebar_position: 115
---

# Processor

### `Error: data out-of-bounds` `ethers` errors on EVM

Make sure you filter the data in your batch handler before parsing it. The processor only guarantees that the data that matches its filters gets into batches, not that the non-matching data does not. Typically each filter in the [processor configuration](/evm-indexing/configuration) should be matched in the batch handler, e.g.
```ts
//...
processor.addLog({
  address: [CONTRACT_ADDR]
}) // <- the config
// ...
processor.run(new TypeormDatabase(), async (ctx) => {
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (log.address === CONTRACT_ADDR) {// <- the filter matching the config
        // process the filtered event logs
      }
    }
  }
})
```

Another common source of this error is faulty RPC endpoints. If your EVM processor crashes during RPC ingestion on a log with `'0x'` in its data field, try switching to another RPC provider or, if you are developing locally, to another Ethereum network emulator.

### `BAD_DATA` when using a Multicall contract

This error can occur for a variety of reasons, but one common cause is choosing a Multicall deployment that is newer than the oldest blocks that have to be indexed. When [batch state queries](/evm-indexing/query-state/#batch-state-queries) are performed on historical chain state older than the Multicall deployment, EVM detects that and refuses to run.

Solutions:
1. Use an older Multicall deployment.
2. Delay your chain state queries until a later block.

These issues are explored in [Part 4 of the BAYC tutorial](/tutorials/bayc/step-four-optimizations).
