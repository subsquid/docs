---
title: Index to Parquet files
description: >-
  Storing data in files for analysis
sidebar_position: 26
---

# Save indexed data in Parquet files

## Objective

This tutorial describes how to use the SQD indexing framework to save the processed blockchain data to [Parquet files](https://parquet.apache.org/) instead of a database. The intent is to show how Squid SDK can be used for data analytics, this time with focus on tools suitable for larger datasets.

File-based data formats like [CSV](/sdk/tutorials/file-csv) are convenient for data analysis, especially in the early prototyping stages. However, when working with large datasets the ability to read data files partially is a common requirement. This is rarely possible with CSV.

In contrast, the Parquet format is designed for efficient read/write operations without processing the entire file. To better serve data analysts' needs, the SQD Team developed a library for storing indexer data in this format.

The subject of this tutorial is the Uniswap DApp, namely the data from its pool contracts and positions held by investors. Uniswap was chosen because it generates a very large amount of information, and ultimately this helps to better show how to leverage a more performance-oriented format.

An article about this demo project [has been published on Medium](https://link.medium.com/7gU0BrLbDxb). The project source code can be found in the [`squid-parquet-storage` repo](https://github.com/subsquid-labs/squid-parquet-storage).

:::warning
As of 2023-12-17, the `squid-parquet-storage` repo is mostly still sound, but already somewhat outdated. You can take a look at the less sophisticated, yet regularly updated example [here](https://github.com/subsquid-labs/file-store-parquet-example/).
:::

[//]: # (!!!! Update all github URLs)
[//]: # (!!!! Update all outdated benchmark figures "figure/figures out of date")
[//]: # (!!!! Restore the Gitpod button https://gitpod.io/button/open-in-gitpod.svghttps://gitpod.io#https://github.com/subsquid-labs/squid-parquet-storage)

## Pre-requisites

- [Squid CLI](/squid-cli/installation)
- (optional) Python

## Setup

Let's start by creating a new blockchain indexer, or a "squid" in SQD terminology. In a terminal, launch this command:

```bash
sqd init local-parquet-indexing -t evm
```

Here, `local-parquet-indexing` is the name of the project, and can be changed to anything else. The `-t evm` option specifies that the [`evm` template](https://github.com/subsquid-labs/squid-evm-template) should be used as a starting point.

:::info
**Note:** The template actually has more than what we need for this project. Unnecessary packages have been removed in the tutorial repository. You can grab [`package.json`](https://github.com/subsquid-labs/squid-parquet-storage/blob/main/package.json) from there to do the same.

Files-wise, `docker-compose.yml`, `schema.graphql` and `squid.yaml` were removed. [`commands.json`](/squid-cli/commands-json), the list of local `sqd` scripts, has been significantly shortened ([here is the updated version](https://github.com/subsquid-labs/squid-parquet-storage/blob/main/commands.json)).
:::

Finally, make sure to install the dependencies:

```bash
npm i
```

### ERC-20 token ABI

Due to the size of this project most of the code will be explained rather than directly listed. The code of this section is no exception since this project indexes data from three kinds of Uniswap contracts, one of which is a factory that deploys new contracts. Additionally, it uses a Multicall contract.

For this project, you will need:

* The [Uniswap V3 Factory](https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984#code) smart contract address and ABI
* The ABI of [any one of the Uniswap V3 Pool](https://etherscan.io/address/0x390a4d096ba2cc450e73b3113f562be949127ceb#code) smart contracts deployed by the Factory
* The [Uniswap V3 Positions](https://etherscan.io/address/0xc36442b4a4522e871399cd717abdd847ab11fe88) smart contract address, and ABI
* The address of any deployed Maker DAO's Multicall smart contract. Luckily, [Uniswap have their own](https://etherscan.io/address/0x5ba1e12693dc8f9c48aad8770482f4739beed696)
* The ABI of an ERC-20 token (can be compiled from [OpenZeppelin repository](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol), or downloaded, for example from [here](https://gist.github.com/veox/8800debbf56e24718f9f483e1e40c35c), or from the [repository of this article's project](https://github.com/subsquid-labs/squid-parquet-storage/tree/main/abi)). Save it as `abi/ERC20.json`.

:::info
**Note:** The project also uses [`ERC20NameBytes`](https://github.com/subsquid-labs/squid-parquet-storage/blob/main/abi/ERC20NameBytes.json) and [`ERC20SymbolBytes`](https://github.com/subsquid-labs/squid-parquet-storage/blob/main/abi/ERC20SymbolBytes.json) ABIs, which OpenZeppelin defines in [`IERC20Metadata.sol`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/IERC20Metadata.sol) and includes in [`ERC20.sol`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol). Save these files to `./abi`.
:::

:::info
**Note:** you can find a pool and its ABI by inspecting the internal calls of one of the [Create Pool transactions of the Factory contract](https://etherscan.io/tx/0xd9e0fc1d737479e940d9807a535c75a31a2c8458792e2c66e2cc33f19f88e546#internal).
:::

Generate TypeScript code for them:

```bash
npx squid-evm-typegen ./src/abi ./abi/*.json
npx squid-evm-typegen ./src/abi 0x1f98431c8ad98523631ae4a59f267346ea31f984#factory
npx squid-evm-typegen ./src/abi 0xc36442b4a4522e871399cd717abdd847ab11fe88#NonfungiblePositionManager
npx squid-evm-typegen ./src/abi 0x390a4d096ba2cc450e73b3113f562be949127ceb#pool --multicall
```
This should create a few files in the `src/abi` folder for you. The last command also automatically generates a Typescript ABI for the Multicall contract due to the `--multicall` flag.

### Tables and Databases

The `@subsquid/file-store` library defines the `Table` and `Database` classes.

The `Database` class gets its name from the interface that was originally developed to [access an actual database](/sdk/resources/persisting-data/typeorm). Here, the interface is [used without modification](/sdk/resources/persisting-data/overview) in a class designed to access a filesystem. `Table`s play a similar role to that of tables of an actual database: they represent collections of rows, all of which share same set of fields/columns. Each such data structure requires one or more data files to store it in both CSV and Parquet, hence the mapping of `Table`s to files.

To summarize, `Table` instances are used to define data files along with their schemas and hold file-specific settings. `Database` facilitates the interactions with the processor, coordinates writing to the files and maintains any state that facilitates that process (configuration, cloud connections and so on).

There are two main differences from the [CSV tutorial](/sdk/tutorials/file-csv) and the first one is that for this project we will be using a `Table` implementation from `@subsquid/file-store-parquet`. Let's install it:

```bash
npm i @subsquid/file-store-parquet
```
The other one is that this project is more involved and is, in fact, using ten different tables instead of one.

It's advisable to define these tables in a separate file. The original project has them under `src/tables.ts`. The syntax is pretty much the same as for the CSV tables, except now the `Table`, `Column`, and `Types` classes are imported from the `@subsquid/file-store-parquet` library and the set of available types is different. We will also configure the parquet file compression using the new `Compression` class.

Here's a snippet:

```typescript
import {Table, Column, Compression, Types} from '@subsquid/file-store-parquet'

export const Tokens = new Table(
    'tokens.parquet',
    {
        blockNumber: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        symbol: Column(Types.String()),
        name: Column(Types.String()),
        totalSupply: Column(Types.Uint64()),
        decimals: Column(Types.Uint16()),
    },
    {
        compression: Compression.ZSTD,
    }
)
```

The rest of the tables definitions can be found [here](https://github.com/subsquid-labs/squid-parquet-storage/blob/main/src/tables.ts).

Similarly, a `src/db.ts` file should be created to configure the `Database` class. Here we specify the tables used, as well as the destination and the size of the chunks in which the data is going to be split.

Here are the contents of this file in full:

```typescript
import assert from 'assert'
import {Database, LocalDest, Store} from '@subsquid/file-store'
import {
    FactoryPairCreated,
    PoolBurn,
    PoolInitialize,
    PoolMint,
    PoolSwap,
    PositionCollect,
    PositionDecreaseLiquidity,
    PositionIncreaseLiquidity,
    PositionTransfer,
    Tokens,
} from './tables'
import {PoolsRegistry} from './utils'
import {S3Dest} from '@subsquid/file-store-s3'

type Metadata = {
    height: number
    pools: string[]
}

export const db = new Database({
    tables: {
        Tokens,
        FactoryPairCreated,
        PoolInitialize,
        PoolMint,
        PoolBurn,
        PoolSwap,
        PositionCollect,
        PositionDecreaseLiquidity,
        PositionIncreaseLiquidity,
        PositionTransfer,
    },
    dest: process.env.DEST === 'S3' ? new S3Dest('./uniswap', 'csv-store') : new LocalDest('./data'),
    hooks: {
        async onConnect(dest) {
            if (await dest.exists('status.json')) {
                let {height, pools}: Metadata = await dest.readFile('status.json').then(JSON.parse)
                assert(Number.isSafeInteger(height))

                let registry = PoolsRegistry.getRegistry()
                for (let pool of pools) {
                    registry.add(pool)
                }

                return height
            } else {
                return -1
            }
        },
        async onFlush(dest, range) {
            let metadata: Metadata = {
                height: range.to,
                pools: PoolsRegistry.getRegistry().values(),
            }
            await dest.writeFile('status.json', JSON.stringify(metadata))
        },
    },
    chunkSizeMb: 50,
})

export type Store_ = typeof db extends Database<infer R, any> ? Store<R> : never
```

:::info
**Note:** the `chunkSizeMb` option defines the size (in MB) of a parquet file before it's saved on disk, and a new one is created.
:::

### Data indexing

The orchestration of the indexing logic is defined in the file named `src/processor.ts`:

```typescript
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import * as positionsAbi from './abi/NonfungiblePositionManager'
import * as factoryAbi from './abi/factory'
import * as poolAbi from './abi/pool'
import {db} from './db'
import {processFactory} from './mappings/factory'
import {processPools} from './mappings/pools'
import {FACTORY_ADDRESS, POSITIONS_ADDRESS} from './utils/constants'
import {processPositions} from './mappings/positions'

let processor = new EvmBatchProcessor()
    .setBlockRange({from: 12369621})
    .setGateway('https://v2.archive.subsquid.io/network/ethereum-mainnet')
    .setRpcEndpoint({
        url: process.env.ETH_CHAIN_NODE,
        rateLimit: 10
    })
    .setFinalityConfirmation(75)
    .addLog({
        address: [FACTORY_ADDRESS],
        topic0: [factoryAbi.events.PoolCreated.topic]
    })
    .addLog({
        topic0: [
            poolAbi.events.Burn.topic,
            poolAbi.events.Mint.topic,
            poolAbi.events.Initialize.topic,
            poolAbi.events.Swap.topic,
        ]
    })
    .addLog({
        address: [POSITIONS_ADDRESS],
        topic0: [
            positionsAbi.events.IncreaseLiquidity.topic,
            positionsAbi.events.DecreaseLiquidity.topic,
            positionsAbi.events.Collect.topic,
            positionsAbi.events.Transfer.topic,
        ]
    })

processor.run(db, async (ctx) => {
    await processFactory(ctx)
    await processPools(ctx)
    await processPositions(ctx)
})
```

Here's a brief explanation of the code above:

* The `EvmBatchProcessor` class is instantiated and set to connect to the Ethereum gateway of SQD Network, as well as a blockchain node, requesting data after a certain block (**make sure to add a node URL to `ETH_CHAIN_NODE` variable in the `.env` file**). Real-time consensus data will be considered final after 75 block confirmations / 15 minutes.

* It is also configured to request data for EVM logs generated by the Factory and Positions smart contracts, filtering for certain events (`PoolCreated` and `IncreaseLiquidity`, `DecreaseLiquidity`, `Collect`, `Transfer`, respectively).
    
* Processor is configured to also request EVM logs from **any address** with topic0 matching one of the signatures of the following Pool smart contract events: `Burn`, `Mint`, `Initialize`, `Swap`. This will guarantee that events generated by all Pool contracts are captured regardless of when the contracts were deployed.
    
* Finally, the processor is launched and data is processed in batches, by functions defined in `src/mappings`.

For a brief explanation of what [`processFactory`](https://github.com/subsquid-labs/squid-parquet-storage/blob/main/src/mappings/factory.ts), [`processPools`](https://github.com/subsquid-labs/squid-parquet-storage/blob/main/src/mappings/pools.ts) and [`processPositions`](https://github.com/subsquid-labs/squid-parquet-storage/blob/main/src/mappings/positions.ts) do, let's take the `processPositions` functions as an example:

* it needs to "unbundle" the batch of logs received

* for each EVM log found it checks that it belongs to one of the pool addresses generated by the factory

* compares the log's topic0 against the topics of the Events of the position NFT contract

* uses the corresponding Event TypeScript class to decode the log

* writes the decoded information to the corresponding table (parquet file)

To better understand how data is transformed, and how the other functions are defined as well, it's advised to [browse the repository](https://github.com/subsquid-labs/squid-parquet-storage/tree/main/src/mappings) and inspect the code. Be sure to check the [`utils`](https://github.com/subsquid-labs/squid-parquet-storage/tree/main/src/utils) folder as well, as there are some auxiliary files and functions used in the mapping logic.

### Launch the project

When the logic is fully implemented, to launch the project and start indexing, open a terminal and run these three commands:

```bash
npm run build
```
```bash
node -r dotenv/config lib/main.js
```

The indexer should be able to catch up with the Ethereum blockchain, and **reach the chain's head in a very short time**. 

:::info
Bear in mind that this may vary a lot, depending on the Ethereum node used and on your hardware, as well as the connection, or physical distance from the Ethereum node. It took ~45 minutes while testing for this article. A test on a connection with a much higher latency and the same configuration finished indexing in 5 hours (figures out of date).
:::

The process will generate a series of sub-folders in the `data` folder, labelled after the block ranges where the data is coming from, and in each one of these folders there should be one `*.parquet` file for each of the *tables* we defined.

![multiple folders containing CSV files](</img/parquet-files.png>)

### Data analysis with Python

If you want to learn how to analyze this data using Python and Pandas, refer to [the Medium article dedicated to this demo project](https://link.medium.com/7gU0BrLbDxb).

## Conclusions

The purpose of this tutorial was to demonstrate how to use the SQD indexing framework for data analytics on larger datasets. The parquet data format is one of the most successful tools used in this setting, supported by the most common data analysis libraries such as Pandas and Pyarrow. We tested the performance of our parquet format tools on Uniswap, indexing the data from its pools and positions held by investors.

The project described here was able to index the entirety of Uniswap Pool events, across all the pools created by the Factory contract, as well as the Positions held by investors, in less than an hour (~45 minutes) (figure out of date).

:::info
**Note:** Indexing time may vary, depending on factors, such as the Ethereum node used, on the hardware, and quality of the connection.
:::

The simple Python script in the project's repository shows how to read multiple Parquet files, and perform some data analysis with Pandas.

SQD Team seeks feedback on this new tool. If you want to share any thoughts or have any suggestions, feel free to reach out to us at [the SquidDevs Telegram channel](https://t.me/HydraDevs).
