---
sidebar_position: 5
description: >-
  Block data for Solana
---

# Block Data for Solana

Solana Squid SDK consists of `DataSourceBuilder` and `SolanaBatchProcessor`, in which data processing happens within the [batch handler](/sdk/overview/#processorrun), a function repeatedly called on batches of on-chain data. `ctx.blocks` is an array of `Block` objects containing the data to be processed, aligned at the block level.

For `SolanaBatchProcessor` the `Block` interface is defined as follows:

```ts
export interface Block<F extends FieldSelection = {}> {
  header: BlockHeader<F>;
  transactions: Transaction<F>[];
  instructions: Instruction<F>[];
  logs: LogMessage<F>[];
  balances: Balance<F>[];
  tokenBalances: TokenBalance<F>[];
  rewards: Reward<F>[];
}
```

`F` here is the type of the argument of the [`setFields()`](/sdk/reference/processors/solana-batch/field-selection) processor method.

`BlockData.header` contains the block header data. The rest of the fields are iterables containing four kinds of blockchain data. The canonical ordering within each iterable depends on the data kind:

- `transactions` are ordered in the same way as they are within blocks;
- `instructions` follow the order of transactions that gave rise to them;
- `tokenBalances` are ordered in a deterministic but otherwise unspecified way.

The exact fields available in each data item type are inferred from the `setFields()` call argument. They are documented on the [field selection](/sdk/reference/processors/solana-batch/field-selection) page:

<!--
- [transactions section](/sdk/reference/processors/solana-batch/field-selection/#transactions);
- [logs section](/sdk/reference/processors/solana-batch/field-selection/#logs);
- [traces section](/sdk/reference/processors/solana-batch/field-selection/#traces);
- [state diffs section](/sdk/reference/processors/solana-batch/field-selection/#state-diffs);
- [block header section](/sdk/reference/processors/solana-batch/field-selection/#block-headers).

## Example

The handler below simply outputs all the log items emitted by the contract `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC` in [real time](/sdk/resources/basics/unfinalized-blocks):

```ts
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { EvmBatchProcessor } from "@subsquid/evm-processor";

const CONTRACT_ADDRESS =
  "0x2E645469f354BB4F5c8a05B3b30A929361cf77eC".toLowerCase();

const processor = new EvmBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/ethereum-mainnet")
  .setRpcEndpoint("<my_eth_rpc_url>")
  .setFinalityConfirmation(75)
  .setBlockRange({ from: 17000000 })
  .addLog({
    address: [CONTRACT_ADDRESS],
  })
  .setFields({
    // could be omitted: this call does not change the defaults
    log: {
      topics: true,
      data: true,
    },
  });

processor.run(new TypeormDatabase(), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let log of c.logs) {
      if (log.address === CONTRACT_ADDRESS) {
        ctx.log.info(log, `Log:`);
      }
    }
  }
});
```

One can experiment with the [`setFields()`](/sdk/reference/processors/evm-batch/field-selection) argument and see how the output changes.

For more elaborate examples, check [Solana Examples](/sdk/examples). -->
