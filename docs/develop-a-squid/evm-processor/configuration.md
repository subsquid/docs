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
   + `archive`: an archive endpoint. See the supported networks below.
   + `chain`: (Optional) A JSON-RPC endpoint (e.g. if the processor intents do make storage queries). The JSON-RPC endpoint is required for making contract state queries. If the squid indexes only event and/or transaction data, it can be omitted. 

The following EVM networks are supported

| Network                 |      Archive endpoint                         |  
|:-----------------------:|:---------------------------------------------:|
| Ethereum Mainnet        | `https://eth.archive.subsquid.io`             |
| Ethereum Goerli Testnet | `https://goerli.archive.subsquid.io`          | 
| Polygon                 | `https://polygon.archive.subsquid.io`         |
| Polygon Mumbai Testnet  | `https://polygon-mumbai.archive.subsquid.io`  |
| Avalance C-Chain        | `https://avalanche-c.archive.subsquid.io`     |
| Fantom                  | `https://fantom.archive.subsquid.io`          |
| Exosama Network         | `https://exosama.archive.subsquid.io`         |
| Binance Chain           | `https://binance.archive.subsquid.io`         |
| Binance Chain Testnet   | `https://binance-testnet.archive.subsquid.io` |
| Arbitrum                | `https://arbitrum.archive.subsquid.io` (*)    |
| Optimism                | Coming Soon                                   |

(*) Experimental support

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

## EVM transactions 

**Since `@subsquid/evm-processor@0.0.1`**

To subscribe to transaction data, use `addTransaction(address: string | string[], options?)`. The first argument specifies a single address or an array of addresses to which the transaction to which the transaction has been submitted. An empty array means that all transactions will be selected (matching the optional `options` filter if provided). 

The `options` argument specifies the additional filtering options and a data selector which tells which transaction data should be fetched from the archive. 

Currently, `options` accepts the following filters:
- `range: { from?: number, to?: number }`
- `sighash: string` a [function selector](https://docs.ethers.io/v5/api/utils/abi/interface/#Interface--specifying-fragments)

### Examples

Request all EVM calls to the contract `0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98`:
```ts
processor.addTransaction('0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98')
```

Request all `transfer(address,uint256)` transactions (matching the corresponding sighash):
```ts
processor.addTransaction([], {sighash: '0xa9059cbb'})
```

Request all `transfer(address,uint256)` to the specified addresses, from block `6_000_000` onwards:
```ts
processor.addTransaction([
  '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98',
  '0x3795C36e7D12A8c252A20C5a7B455f7c57b60283'
], {
  range: {
    from: 6_000_000
  },
  sighash: '0xa9059cbb'
})
```

## Data Selectors

The data selectors can define any subset of the fields below:

```ts
export interface EvmTransaction {
    id: string
    from: string
    gas: bigint
    gasPrice: bigint
    hash: string
    input: string
    nonce: bigint
    to?: string
    index: number
    value: bigint
    type: number
    chainId: number
    v: bigint
    r: string
    s: string
}

export interface EvmLog {
    id: string
    address: string
    data: string
    index: number
    removed: boolean
    topics: string[]
    transactionIndex: number
}
```

For example, the following configuration will tell the processor to enrich the transaction data of the evm log items with the `r`, `s`, `v` fields:

```ts
//...
    data: {
        evmLog: {
            id: true,
            topics: true,
            data: true,
        },
        transaction: { 
            r: true,
            s: true,
            v: true
        }
    }
//...
```

### Example

Below is an example of `EvmBatchProcessor` subscribing 

```ts
const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://eth.archive.subsquid.io',
  })
  .setBlockRange({ from: 10_000_000 })
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
     },
  })
  .addTransaction(['0xac5c7493036de60e63eb81c5e9a440b42f47ebf5'], {
     range: {
      from: 15_800_000
     },
     // setApprovalForAll(address,bool)
     sighash: '0xa22cb465',
     data: {
       transaction: {
         from: true,
         input: true,
         to: true
       }
     }
  });

processor.run(new TypeormDatabase(), async (ctx) => {
    // simply output all the items in the batch
    ctx.log.info(ctx.blocks, "Got blocks")
});
```
