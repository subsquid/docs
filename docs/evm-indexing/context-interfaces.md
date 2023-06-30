---
sidebar_position: 30
description: >-
  Block data for EVM
---

# Block data for EVM

`EvmBatchProcessor` follows the common [squid processor architecture](/basics/squid-processor), in which data processing happens within the [batch handler](/basics/squid-processor/#processorrun), a function repeatedly called on batches of on-chain data. The function takes a single argument called "batch context". Its structure follows the [common batch context layout](/basics/squid-processor/#batch-context), with `ctx.blocks` being an array of `BlockData` objects containing the data to be processed, aligned at the block level.

For `EvmBatchProcessor` the `BlockData` interface is defined as follows:
```ts
export type BlockData<F extends FieldSelection = {}> = {
  header: BlockHeader<F>
  transactions: Transaction<F>[]
  logs: Log<F>[]
  traces: Trace<F>[]
  stateDiffs: StateDiff<F>[]
}
```
`F` here is the type of the argument of the [`setFields()`](/evm-indexing/configuration/data-selection) processor method.

`BlockData.header` contains the block header data. The rest of the fields are iterables containing four kinds of blockchain data. The canonical ordering within each iterable depends on the data kind:
 - `transactions` and `logs` are ordered in the same way as they are within blocks;
 - [`stateDiffs`](/evm-indexing/configuration/state-diffs) follow the order of transactions that gave rise to them;
 - `traces` are ordered in a deterministic but otherwise unspecified way.

The exact fields available in each data item type are inferred from the `setFields()` call argument. They are documented on the [data selection](/evm-indexing/configuration/data-selection) page:
 - [transactions section](/evm-indexing/configuration/data-selection/#transactions);
 - [logs section](/evm-indexing/configuration/data-selection/#logs);
 - [traces section](/evm-indexing/configuration/data-selection/#traces);
 - [state diffs section](/evm-indexing/configuration/data-selection/#state-diffs);
 - [block header section](/evm-indexing/configuration/data-selection/#block-headers).

## Example

The handler below simply outputs all the log items emitted by the contract `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC` in [real time](/basics/unfinalized-blocks):

```ts
import { TypeormDatabase } from '@subsquid/typeorm-store'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

const CONTRACT_ADDRESS = '0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'.toLowerCase()

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
    chain: 'https://eth-rpc.gateway.pokt.network'
  })
  .setFinalityConfirmation(75)
  .setBlockRange({ from: 17000000 })
  .addLog({
    address: [CONTRACT_ADDRESS]
  })
  .setFields({ // could be omitted: this call does not change the defaults
    log: {
      topics: true,
      data: true
    }
  })

processor.run(new TypeormDatabase(), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let log of c.logs) {
      if (log.address === CONTRACT_ADDRESS) {
        ctx.log.info(log, `Log:`)
      }
    }
  }
})
```

One can experiment with the [`setFields()`](/evm-indexing/configuration/data-selection) argument and see how the output changes.

For more elaborate examples, check [EVM Examples](/examples).
