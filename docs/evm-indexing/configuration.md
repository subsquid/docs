---
sidebar_position: 20
description: >-
  Configure EvmBatchProcessor
---

# Configuration

## Initialization

:::info
Method documentation provided here is mostly also available as inline and accessible via suggestions in most IDEs.
:::

:::warning
All contract addresses supplied to `EvmBatchProcessor` configuration addresses must be in flat lower case.
:::

The following setters configure the global settings of `EvmBatchProcessor`. They return the modified instance and can be chained.

**`setBlockRange({from: number, to?: number | undefined})`**: Limits the range of blocks to be processed. When the upper bound is specified, the processor will terminate with exit code 0 once it reaches it.

**`setDataSource({archive: string, chain?: string | undefined})`**: Sets blockchain data source. Example:

```typescript
processor.setDataSource({
  chain: 'https://rpc.ankr.com/eth',
  archive: 'https://eth.archive.subsquid.io'
})
```
Argument properties:
+ `archive`: An archive endpoint providing the data for the selected network. A short list of Subsquid-maintained archives is provided below; use [Archive registry](/archives/overview/#archive-registry) to obtain exhaustive, up-to-date information. The registry also provides a `lookupArchive` function that maps archive aliases to endpoint URLs, like this: `archive: lookupArchive('eth-mainnet')`.
+ `chain?`: A JSON-RPC endpoint for the network of interest. Required if the processor has to make [contract state queries](/evm-indexing/query-state). For squids indexing only event and/or transaction data it can be omitted. HTTPS and WSS endpoints are supported.

| Network                 |  Alias                    |        Archive endpoint                            |
|:-----------------------:|:-------------------------:|:--------------------------------------------------:|
| Ethereum Mainnet        | `eth-mainnet`             | `https://eth.archive.subsquid.io`                  |
| Ethereum Goerli Testnet | `goerli`                  | `https://goerli.archive.subsquid.io`               | 
| Polygon                 | `polygon`                 | `https://polygon.archive.subsquid.io`              |
| Polygon Mumbai Testnet  | `polygon-mumbai`          | `https://polygon-mumbai.archive.subsquid.io`       |
| Avalance C-Chain        | `avalanche`               | `https://avalanche-c.archive.subsquid.io`          |
| Fantom                  | `fantom`                  | `https://fantom.archive.subsquid.io`               |
| Exosama Network         | `exosama`                 | `https://exosama.archive.subsquid.io`              |
| Binance Chain           | `binance`                 | `https://binance.archive.subsquid.io`              |
| Binance Chain Testnet   | `binance-testnet`         | `https://binance-testnet.archive.subsquid.io`      |
| SKALE Calypso NFT Hub   | `skale-calypso`           | `https://skale-calypso.archive.subsquid.io`        |
| SKALE Calypso (stage)   | `skale-calypso-stage`     | `https://skale-calypso-stage.archive.subsquid.io`  |
| BOBA Ethereum           | `boba-eth`                | `https://boba-eth.archive.subsquid.io`             |
| BOBA Moonbeam           | `boba-moonbeam`           | `https://boba-moonbeam.archive.subsquid.io`        |
| Arbitrum One            |                           | `https://arbitrum.archive.subsquid.io` (*)         |
| Optimism                | Coming Soon               |                                                    |
 
(*) Experimental support

## EVM logs

**`addLog(contract: string | string[], options?)`**: Subscribe to EVM log data (events) emitted by specific contracts.

The optional `options?` argument defines:
+ filters by block range and topic, and
+ [data selectors](/evm-indexing/configuration/#data-selectors) to specify the data provided by the corresponding [item](/evm-indexing/context-interfaces):

```typescript
{
   range?: Range,
   filter?: EvmTopicSet[],
   data?: {
     evmLog: { 
        // data selection, a subset of EvmLog fields
     },
     transaction: {
        // data selection for the associated transaction, 
        // a subset of EvmTransaction fields
     }
   }  
}
```
Topic filter format is a (fully expressive) subset of [Ethers.js filter specification](https://docs.ethers.io/v5/concepts/events/#events--filters). The difference here is due to `EvmTopicSet` being a non-nullable type: instead of `null`s empty lists `[]` must be used. See examples below.

`EvmBatchProcessor`s subscribed to events also *always* retrieve the transactions that emitted the events and place them immediately after their event log items in the batch.

#### Example 1

Fetch `NewGravatar(uint256,address,string,string)` and `UpdateGravatar(uint256,address,string,string)` event logs emitted by `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC`. For each log, fetch transaction input, topic set and log data.

```ts
const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addLog('0x2e645469f354bb4f5c8a05b3b30a929361cf77ec', {
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
      transaction: {
        input: true
      }
    },
  })
```

#### Example 2

Fetch every `Transfer(address,address,uint256)` event on Ethereum mainnet where *topic2* is set to the destination address (a common but [non-standard](https://eips.ethereum.org/EIPS/eip-20) practice) and the destination is `vitalik.eth` a.k.a. `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`. For each log, fetch transaction hash and log data.

```ts
const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://eth.archive.subsquid.io'
  })
  .addLog([], {
    filter: [
      // topic0: 'Transfer(address,address,uint256)'
      [ '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' ],
      // topic1: anything goes
      [],
      // topic2: vitalik.eth
      [ '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' ]
    ],
    data: {
      evmLog: { id: true, data: true },
      transaction: { hash: true }
    } as const
  })
```

:::info
Typescript ABI modules generated by [`squid-evm-typegen`](/evm-indexing/squid-evm-typegen) provide event signatures/topic0 values as constants, e.g.

```ts
  import * as gravatarAbi from './abi/gravatar'
  // ...
    filter: [[
      gravatarAbi.events.NewGravatar.topic,
      gravatarAbi.events.UpdatedGravatar.topic,
    ]],
  // ...
```
:::

## EVM transactions 

**`addTransaction(address: string | string[], options?)`**: Subscribe to transactions data. The first argument specifies a single address or an array of addresses to which the transaction has been submitted. An empty array means that all transactions will be selected (matching the optional `options` filter if provided). 

The `options` argument specifies additional filtering options and a data selector which tells which transaction data should be fetched from the archive. Currently the following filters are accepted:
+ `range?: { from: number, to?: number | undefined } | undefined`;
+ `sighash?: string | undefined`: [First four bytes](https://ethereum.org/en/developers/docs/transactions/#the-data-field) of the Keccak hash (SHA3) of the canonical representation of the function signature.

:::info
Typescript ABI modules generated by [`squid-evm-typegen`](/evm-indexing/squid-evm-typegen) provide function sighashes as constants, e.g.

```ts
  import * as erc20abi from './abi/erc20'
  // ...
    sighash: erc20abi.functions.transfer.sighash,
  // ...
```
:::

The optional `data?` field is expected to contain a [data selector](/evm-indexing/configuration/#data-selectors):o
```
{
  transaction: {
    // a subset of field of EvmTransactions 
    // to be fetched by the processor
  }
}
```
The requested fields will be populated in the corresponding [items](/evm-indexing/context-interfaces) of the `processor.run()` context.

#### Examples

Request all EVM calls to the contract `0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98`:
```ts
processor.addTransaction('0x6a2d262d56735dba19dd70682b39f6be9a931d98')
```

Request all transactions matching sighash of `transfer(address,uint256)`:
```ts
processor.addTransaction([], {sighash: '0xa9059cbb'})
```

Request all `transfer(address,uint256)` to the specified addresses, from block `6_000_000` onwards and fetch only inputs:
```ts
processor.addTransaction([
  '0x6a2d262d56735dba19dd70682b39f6be9a931d98',
  '0x3795c36e7d12a8c252a20c5a7b455f7c57b60283'
], {
  range: {
    from: 6_000_000
  },
  sighash: '0xa9059cbb',
  data: {
    transaction: {
      input: true
    }
  }
})
```

## Less common setters

**`setPrometheusPort(port: string | number)`**: Sets the port for a built-in prometheus metrics server. By default, the value of PROMETHEUS_PORT environment variable is used. When it is not set, the processor will pick up an ephemeral port.

**`includeAllBlocks(range?: Range | undefined)`**: By default, the processor will fetch only blocks which contain requested items. This method modifies such behaviour to fetch all chain blocks. Optionally a `Range` (`{from: number, to?: number | undefined}`) of blocks can be specified for which the setting should be effective.

## Data selectors

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
  maxPriorityFeePerGas: bigint
  maxFeePerGas: bigint
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

For example, the following configuration will tell the processor to enrich transaction data of event log items with the `r`, `s`, `v` fields:

```ts
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
```

:::info
Most IDEs support smart suggestions to show the possible data selectors for `EvmLog` and `EvmTransaction` options. For VS Code, press `Ctrl+Space`.
:::

## A complete example

```ts
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import * as gravatarAbi from './abi/gravatar'
import {TypeormDatabase} from '@subsquid/typeorm-store'

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .setBlockRange({ from: 10_000_000 })
  // Gravatar contract
  .addLog('0x2e645469f354bb4f5c8a05b3b30a929361cf77ec', {
    filter: [[
      gravatarAbi.events.NewGravatar.topic,
      gravatarAbi.events.UpdatedGravatar.topic,
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
