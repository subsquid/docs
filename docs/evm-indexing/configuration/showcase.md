---
sidebar_position: 100
title: Config showcase
description: >-
  Code snippets requesting a variety of data
---

# Squid SDK showcase

The snippets below show how to configure [`EvmBatchProcessor`](/evm-indexing/evm-processor) and use Squid SDK to build a custom indexer for various use-cases. Each snippet comes with a link to a repository with full sources, and can be used [as a template](/squid-cli/init/#sqd-init-name).

<details><summary>Bulk-index Binance Chain transactions for a large number of wallets</summary>

[Full squid here](https://github.com/subsquid-labs/showcase00-analyzing-a-large-number-of-wallets).

```ts title=src/processor.ts
export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('binance'),
  })
  .addTransaction({})
```

```ts title=src/main.ts
const wallets: Set<string> = loadWallets()
// wallets.size can be very large (tested at 1.4M)

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

<details><summary>Index all USDC Transfer events on Ethereum with real time updates</summary>

Real time data is fetched from a chain node RPC; a Database object with hot blocks support is required to store it (see [this page](https://docs.subsquid.io/basics/unfinalized-blocks/) for more details). [Full squid here](https://github.com/subsquid-labs/showcase01-all-usdc-transfers).

```ts
export const USDC_CONTRACT_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
    chain: 'https://rpc.ankr.com/eth',
  })
  .setFinalityConfirmation(75)
  .addLog({
    range: {from: 6_082_465},
    address: [USDC_CONTRACT_ADDRESS],
    topic0: [usdcAbi.events.Transfer.topic],
  })
  .setFields({
    log: {
      transactionHash: true,
    },
  })
```

</details>

<details><summary>Index all Transfers to vitalik.eth</summary>

All `Transfer(address,address,uint256)` will be captured, including ERC20 and ERC721 transfers and possibly events with the same signature made with other protocols. [Full squid here](https://github.com/subsquid-labs/showcase02-all-transfers-to-a-wallet).

```ts
export const VITALIK_ETH_TOPIC = '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addLog({
    topic0: [erc20abi.events.Transfer.topic],
    topic2: [VITALIK_ETH_TOPIC],
  })
```

</details>

<details><summary>Get all calls to AAVE lending pool and all events they caused</summary>

Including events emitted by other contracts. Get ETH value involved in each call.

[Full squid here](https://github.com/subsquid-labs/showcase03-all-events-caused-by-contract-calls/).

```ts
export const AAVE_CONTRACT = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .setBlockRange({ from: 11_362_579 })
  .addTransaction({
    to: [AAVE_CONTRACT],
    logs: true,
  })
  .setFields({
    transaction: {
      value: true,
      sighash: true,
    },
    log: {
      transactionHash: true,
    },
  })
``` 

</details>

<details><summary>Index all Mint(address,address,uint256) event logs on Ethereum, extract the gas fees</summary>

[Full squid here](https://github.com/subsquid-labs/showcase04-all-mint-events).

```ts
export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
  })
  .addLog({
    topic0: [usdcAbi.events.Mint.topic],
    transaction: true,
  })
  .setFields({
    transaction: {
      gasUsed: true,
    }
  })
``` 

</details>

<details><summary>Index all Pancakeswap trading pairs and Swap logs</summary>

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

<details><summary>Index all call traces and historical state changes of the BAYC NFT contract</summary>

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

<details><summary>Scrape all NFT contract deployments on Ethereum, index Transfers</summary>

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
