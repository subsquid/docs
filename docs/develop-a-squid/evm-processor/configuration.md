---
sidebar_position: 20
description: >-
  Configure the squid processor by setting the data source and the block range
---

# Configuration

## Initialization

The following setters configure the global settings. The setters return the modified instance and can be chained. Consult inline docs and the IDE assist for more details. 

- `setBlockRange(Range)`.  Limits the range of blocks to be processed

- `setDataSource(DataSource)`. Set the data source to fetch the data from.
   + `archive`: an archive endpoint. Currently, only Ethereum mainnet is supported, with the endpoint `https://ethereum-mainnet-beta.archive.subsquid.io`.
   + `chain`: (Optional) A JSON-RPC endpoint (e.g. if the processor intents do make storage queries). The JSON-RPC endpoint is required for making contract state queries. If the squid indexes only event and/or transaction data, it can be omitted. 

##  EVM logs
Use `addLog(contract: string | string[], options)` to subscribe to the EVM log data (event) emitted by a specific EVM contract.

The `option` argument supports filtering by topic and data selectors to specify which data is provided by the corresponding context item:

```typescript
{
   range?: DataRange,
   filter?: EvmTopicSet[],
   data?: {
     evmLog: { 
        // fields to be requested for this item 
     },
     transaction: {
        // fields to be requested from the tx emitted the log
     }
   }  
}
```

Note, that the topic filter follows the [Ether.js filter specification](https://docs.ethers.io/v5/concepts/events/#events--filters). For example, for a filter that accepts the ERC721 topic `Transfer(address,address,uint256)` AND `ApprovalForAll(address,address,bool)` use a double array as in the example below.

### Example

Below is an example of `EvmBatchProcessor` subscribing 

```ts
const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://ethereum-mainnet-beta.archive.subsquid.io',
  })
  .setBlockRange({ from: 6175243 })
  // Gravatar contract
  .addLog('0x2E645469f354BB4F5c8a05B3b30A929361cf77eC', {
    filter: [[
      // topic: 'NewGravatar(uint256,address,string,string)'
      '0x9ab3aefb2ba6dc12910ac1bce4692cf5c3c0d06cff16327c64a3ef78228b130b',
      // topic: 'UpdatedGravatar(uint256,address,string,string)'
      '0x76571b7a897a1509c641587568218a290018fbdc8b9a724f17b77ff0eec22c0c',
   ]],
    data: {
        evmLog: {
            topics: true,
            data: true,
        },
    } as const,
});



processor.run(new TypeormDatabase(), async (ctx) => {
    // simply output all the items in the batch
    ctx.log.info(ctx.blocks, "Got blocks")
});
```
