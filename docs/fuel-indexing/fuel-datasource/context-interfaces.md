---
sidebar_position: 5
description: >-
  Block data for Fuel
---

# Block data for Fuel Network

In Fuel Squid SDK, the data is processed by repeatedly calling the user-defined [batch handler](/sdk/reference/processors/architecture/#processorrun) function on batches of on-chain data. The sole argument of the batch handler is its context `ctx`, and `ctx.blocks` is an array of `Block` objects containing the data to be processed, aligned at the block level.

For Fuel `DataSource` the `Block` interface is defined as follows:

```ts
export interface Block {
  header: BlockHeader;
  transactions: Transaction[];
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  receipts: Receipt[];
}
```

`Block.header` contains the block header data. The rest of the fields are iterables containing the four kinds of blockchain data. The items within each iterable are ordered in the same way as they are within blocks.

The exact fields available in each data item type are inferred from the `setFields()` call argument. They are documented on the [field selection](/fuel-indexing/fuel-datasource/field-selection) page:

- [`Input` section](/fuel-indexing/fuel-datasource/field-selection#input);
- [`Transaction` section](/fuel-indexing/fuel-datasource/field-selection#transaction);
- [`Output` section](/fuel-indexing/fuel-datasource/field-selection#output);
- [`Receipt` section](/fuel-indexing/fuel-datasource/field-selection#receipt);

<!--
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
