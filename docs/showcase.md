---
sidebar_class_name: hidden
---

# Processor capabilities showcase

Notes:
* I would not get into RPC ingestion here, but we can change that.

### Get all transactions on Binance Smart Chain

* easy
* very wide scope example

```ts
export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('binance'),
  })
  .addTransaction({})
```

### Get all USDC `Transfer` events on Ethereum

* easy
* logs retrieval by address & topic0

```ts
const USDC_CONTRACT_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addLog({
    range: {from: 6_082_465},
    address: [USDC_CONTRACT_ADDRESS],
    topic0: [erc20.events.Transfer.topic],
  })
  .setFields({
    log: {
      transactionHash: true,
    },
  })
```

### Get all token and NFT `Transfer`s to vitalik.eth

* easy
* logs retrieval by topic2

```ts
const VITALIK_ETH_TOPIC = '0x000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addLog({
    topic0: [erc20.events.Transfer.topic],
    topic2: [VITALIK_ETH],
  })
  .addLog({
    topic0: [erc721.events.Transfer.topic],
    topic2: [VITALIK_ETH],
  })
```

### Get all calls to AAVE lending pool and all events they caused

Including events emitted by other contracts. Get value involved in each call.

* easy
* txs retrieval by destination
* related logs retrieval

```ts
const AAVE_CONTRACT = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addTransaction({
    to: [AAVE_CONTRACT],
    logs: true
  })
  .setFields({
    transaction: {
      value: true,
    },
    log: {
      transactionHash: true,
    },
  })
``` 

### Get all ERC20 `Mint` events on Ethereum and measure gas spent on the parent txs

* easy
* wide-scoped event retrieval

```ts
export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addLog({
    topic0: [erc20.events.Mint.topic],
    transaction: true,
  })
  .setFields({
    transaction: {
      gasUsed: true,
    }
  })
``` 

### Capture a DEX (Pancakeswap) pair creation and `Swap` events

```ts
const FACTORY_ADDRESSES = [
  '0xBCfCcbde45cE874adCB698cC183deBcF17952812',
  '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
]

const PAIR_CREATED_TOPIC = '0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9'
const SWAP_TOPIC = '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('binance'),
  })
  .setBlockRange({ from: 586_851 })
  .addLog({
    address: FACTORY_ADDRESSES,
    topic0: [PAIR_CREATED_TOPIC],
  })
  .addLog({
    topic0: [SWAP_TOPIC],
  })
```

### Get all call traces to BAYC, fetching state diffs

Call traces will expose any internal calls to BAYC by other contracts.

```ts
const BAYC_ADDRESS = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .setBlockRange({ from: 12_287_507 })
  .addTrace({
    type: ['call'],
    callTo: ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'],
    transaction: true,
  })
  .addStateDiff({
    address: ['0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'],
    transaction: true,
  })
```

### Scrape all NFT contract deploymens from Ethereum, get their `Transfer` events

All contract creations are scraped; they will be checked for ERC721 compliance in the batch handler. All ERC721 `Transfer` events are scraped so that they can be filtered and binned by the contract in the batch handler.

```ts
export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addTrace({
    type: ['create'],
  })
  .addLog({
    topic0: [erc721.events.Transfer.topic],
  })
  .setFields({
    trace: {
      createResultCode: true, // for checking ERC721 compliance
      createResultAddress: true,
    },
  })
```
