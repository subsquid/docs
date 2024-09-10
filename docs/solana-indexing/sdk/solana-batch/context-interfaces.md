---
sidebar_position: 5
description: >-
  Block data for Solana
---

# Block data for Solana

In Solana Squid SDK, the data is processed by repeatedly calling the user-defined [batch handler](/sdk/reference/processors/architecture/#processorrun) function on batches of on-chain data. The sole argument of the batch handler is its context `ctx`, and `ctx.blocks` is an array of `Block` objects containing the data to be processed, aligned at the block level.

For `SolanaBatchProcessor` the `Block` interface is defined as follows:

```ts
export interface Block<F extends FieldSelection = {}> {
  header: BlockHeader<F>;
  instructions: Instruction<F>[];
  transactions: Transaction<F>[];
  logs: LogMessage<F>[];
  balances: Balance<F>[];
  tokenBalances: TokenBalance<F>[];
  rewards: Reward<F>[];
}
```

`F` here is the type of the argument of the [`setFields()`](/solana-indexing/sdk/solana-batch/field-selection) processor method.

`BlockData.header` contains the block header data. The rest of the fields are iterables containing the six kinds of blockchain data. Canonical ordering within each iterable depends on the data kind:

- `transactions` are ordered in the same way as they are within blocks;
- `instructions` follow the order of transactions that gave rise to them;
- `tokenBalances` are ordered in a deterministic but otherwise unspecified way.

The exact fields available in each data item type are inferred from the `setFields()` call argument. They are documented on the [field selection](/solana-indexing/sdk/solana-batch/field-selection) page:

- [`Instruction` section](/solana-indexing/sdk/solana-batch/field-selection#instruction);
- [`Transaction` section](/solana-indexing/sdk/solana-batch/field-selection#transaction);
- [`LogMessage` section](/solana-indexing/sdk/solana-batch/field-selection#logmessage);
- [`Balance` section](/solana-indexing/sdk/solana-batch/field-selection#balance);
- [`TokenBalance` section](/solana-indexing/sdk/solana-batch/field-selection#tokenbalance);
- [`Reward` section](/solana-indexing/sdk/solana-batch/field-selection#reward);
- [`BlockHeader` section](/solana-indexing/sdk/solana-batch/field-selection#block-header).

<!--
## Example

The handler below simply outputs all the log items emitted by the contract `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC` in [real time](/sdk/resources/unfinalized-blocks):

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
