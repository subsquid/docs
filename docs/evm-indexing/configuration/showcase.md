---
sidebar_position: 100
title: Config showcase
description: >-
  Code snippets requesting a variety of data
---

# Processor capabilities showcase

<details><summary>Analyze txs of a large number of BSC wallets</summary>

```ts
const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('binance'),
  })
  .addTransaction({})

const wallets: Set<string> = loadWallets()
// wallets.size can be very large (10-100k and beyond)

processor.run(new TypeormDatabase(), async (ctx) => {
  for (let block of ctx.blocks) {
    for (let txn of block.transactions) {
      if (wallets.has(txn.from)) {
        // process a txn initiated by the wallet
      }
      if (txn.to && wallets.has(txn.to)) {
        // process a txn directed to the wallet
      }
    }
  }
})
```

</details>

<details><summary>Get all USDC Transfer events on Ethereum</summary>

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

</details>

<details><summary>Get all token and NFT Transfers to vitalik.eth</summary>

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

</details>

<details><summary>Get all calls to AAVE lending pool and all events they caused</summary>

Including events emitted by other contracts. Get ETH value involved in each call.

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

</details>

<details><summary>Get all ERC20 token mints on Ethereum and measure gas spent on the parent txs</summary>

[Full squid here](https://github.com/subsquid-labs/showcase04-all-erc20-mints).

```ts
export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  // ERC20 token mints emit Transfer events originating from 0x0
  .addLog({
    topic0: [erc20.events.Transfer.topic],
    topic1: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
    transaction: true,
  })
  .setFields({
    transaction: {
      gasUsed: true,
    }
  })
``` 

</details>

<details><summary>Capture DEX (Pancakeswap) pair creation and Swap events</summary>

[Full squid here](https://github.com/subsquid-labs/showcase05-dex-pair-creation-and-swaps).

```ts
export const FACTORY_ADDRESSES = [
  '0xbcfccbde45ce874adcb698cc183debcf17952812',
  '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
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
  .setFields({
    log: {
      transactionHash: true,
    },
  })
```

</details>

<details><summary>Get all call traces to BAYC, fetch state diffs</summary>

Call traces will expose any internal calls to BAYC by other contracts. [Full squid here](https://github.com/subsquid-labs/showcase06-all-bayc-call-traces).

```ts
const BAYC_ADDRESS = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .setBlockRange({ from: 12_287_507 })
  .addTrace({
    type: ['call'],
    callTo: [BAYC_ADDRESS],
    transaction: true,
  })
  .addStateDiff({
    address: [BAYC_ADDRESS],
    transaction: true,
  })
  .setFields({
    trace: {
      callTo: true,
      callFrom: true,
      callSighash: true,
    },
 })
```

</details>

<details><summary>Scrape all NFT contract deployments on Ethereum, get their Transfer events</summary>

All contract creations are scraped; they will be checked for ERC721 compliance in the batch handler. All ERC721 `Transfer` events are scraped so that they can be filtered and binned by the contract in the batch handler. [Full squid here](https://github.com/subsquid-labs/showcase07-grab-all-nft-transfers).

```ts
export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addTrace({
    type: ['create'],
    transaction: true,
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

</details>
