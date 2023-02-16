---
id: index-to-local-csv-files
title: Save indexed data on CSV files, locally
description: >-
  Index blockchain data, save it on local CSV files, and do some data analysis prototyping
sidebar_position: 7
---

# Save indexed data on CSV files, locally

## Objective

This tutorial describes how to use Subsquid's indexing framework for saving processed blockchain data to CSV files, locally. Ultimately, this is a great example of how Subsquid SDK can be used for data analytics prototyping.

Following the indications on this page, users will be able to build an indexer that processes MATIC transactions on Ethereum mainnet, and dumps them on a local CSV files.

Both Python and CSV files are the bread and butter of data analysts, especially in the early prototyping stages, when trying to validate hypothesis, or get some inspiration from raw data.

Which is why it's so important to have a blockchain data framework with the flexibility to allow data analysts to save data to CSV files, in order to play with this data with the tools they are already familiar with.

MATIC transactions on Ethereum mainnet were chosen, because this provides enough data to be significant, both in terms of performance, and from a data analysis standpoint.

An article about this demo project [has been published on Medium](https://medium.com/@raekwonthethird/how-you-can-supercharge-blockchain-data-analysis-with-local-indexing-88b713e7948e), and the demo project can be found [in this repository on GitHub](https://github.com/RaekwonIII/local-csv-indexing).

## Pre-requisites

The minimum requirements for this tutorial are as follows:

- [Subsquid CLI installed](/squid-cli/index.md#0-install-and-setup-squid-cli)
- (optional) Python

## Setup

Let's start by creating a new squid ETL, so in a terminal, launch the command:

```bash
sqd init local-csv-indexing -t evm
```

Where `local-csv-indexing` is the name of the project, and can be changed to anything else. And `-t evm` specifies what template should be used and makes sure the setup will create a project from the EVM-indexing template.


:::info
**Note:** The template actually has more than what we need for this project. In the repository used for this article, unnecessary packages have been removed, so the [repository's `package.json`](https://github.com/RaekwonIII/local-csv-indexing/blob/main/package.json) can be used.

Similarly, the [list of available commands](https://github.com/RaekwonIII/local-csv-indexing/blob/main/commands.json) has been shortened, `docker-compoes.yml` has been removed, as well as `schema.graphql`, and `squid.yaml`, because they will not be used.
:::

### ERC-20 token ABI

To be able to index the transfers of a token, it's necessary to have the token's address, as well as the smart contract's ABI (Abstract Binary Interface), which defines the contract's functions, the events, as well as their inputs and outputs, and their types.

Luckily, both of these can be found on block explorers like [Etherscan](https://medium.com/r/?url=https%3A%2F%2Fetherscan.io%2Ftoken%2F0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0).

The indexer needs the ABI, because that's how it can decode the contract's events or functions inputs (and outputs), and provide the information they carry. The SDK has a handy command to generate some boilerplate TypeScript code to achieve this.

```bash
sqd typegen 0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0#matic
```
:::info
Because the contract is deployed on Ethereum, and available through Etherscan API, the SDK is able to generate the necessary code with just the smart contract address.

For all other cases, the same command needs the path to a JSON file containing the smart contract's ABI, instead of its address.
:::

This will generate some files under the `src/abi` folder, the most interesting of which is `matic.ts`.

### CSV, Tables and Databases

It's necessary to install the `file-store-csv` package, because the goal is to save data on CSV files locally, and this package is not available by default:

```bash
npm i @subsquid/file-store-csv
```

:::info
Equivalent packages for parquet files, and for uploading files using S3-compatible APIs are also available
:::

Next, let's create a new file, named `tables.ts`, in case the project should be expanded to multiple files. This is where it's possible to provide a filename for the CSV files, as well as configure their data structure, the same way as if they were a database table (the class name is no coincidence):

```typescript
import {Table, Column, Types} from '@subsquid/file-store-csv'

export const Transfers = new Table(
    'transfers.csv',
    {
        blockNumber: Column(Types.Integer()),
        timestamp: Column(Types.Timestamp()),
        contractAddress: Column(Types.String()),
        from: Column(Types.String()),
        to: Column(Types.String()),
        amount: Column(Types.Decimal()),
    },
    {
        header: false,
    }
)
```

Let's create another file next, this time named `db.ts`, to configure the data abstraction layer. This class is called `Database`, and it's on purpose, because it provides a transparent interface to the processor, which is consistent with how the ETL usually saves data on PostgreSQL, or any future data storage.

```typescript
import {Database, LocalDest, Store} from '@subsquid/file-store'
import { Transfers } from './tables'

export const db = new Database({
    tables: {
        Transfers,
    },
    dest: new LocalDest('./data'),
    chunkSizeMb: 100,
    syncIntervalBlocks: 10000
})
```

info:::
Note: the `chunkSizeMb` configuration defines the size (in MB) of a CSV file, before it's saved on disk, and a new one is created.
Similarly, the `syncIntervalBlocks` configuration defines how many blocks have to be ingested, before creating a new CSV file, when the indexing process has reached the blockchain's head and is in sync with it.
:::

### Data indexing

All the indexing logic is defined in the file named processor.ts, so let's open it, and edit the `EvmBatchProcessor` class configuration, to request data for the right smart contract, and the right EVM log:

```typescript
export const contractAddress =
  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0".toLowerCase();

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive("eth-mainnet"),
    chain: process.env.RPC_ENDPOINT,
  })
  .addLog(contractAddress, {
    filter: [[events.Transfer.topic]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
    } as const,
  });
```

:::warning
Note: the RPC_ENDPOINT environment variable is used, so make sure to edit the `.env` file and use a valid URL of an Ethereum RPC node, e.g.:

```bash
DB_NAME=squid
DB_PORT=23798
GQL_PORT=4350
# JSON-RPC node endpoint, both wss and https endpoints are accepted
RPC_ENDPOINT="https://rpc.ankr.com/eth"
```
:::

Let's then define the logic to process a batch of EVM log data, and save it in the CSV files.

A double loop is necessary to explore all the blocks in each batch, and the items in each block. In the innermost loop, it's necessary to check that the items are actually EVM logs (this favors TypeScript typings, as [different kind of items have access to different fields](/evm-indexing/index.md#overview-and-the-data-model)), that they have been generated by the right address and that they have the right topic signature.

It's then possible to decode the event and prepare an object with the right data structure, which is then written on the `Transfers` CSV file.
Here is a short summary of the logic:

```typescript
processor.run(db, async (ctx) => {
  let decimals = 18;
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.address !== contractAddress) continue;
      if (item.kind !== "evmLog") continue;
      if (item.evmLog.topics[0] !== events.Transfer.topic) continue;

      const { from, to, value } = events.Transfer.decode(item.evmLog);

      ctx.store.Transfers.write(({
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
        contractAddress: item.address,
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        amount: BigDecimal(value.toBigInt(), decimals).toNumber(),
      });
    }
  }
});
```

:::info
The file in the GitHub repository is slightly different, as there's some added logic to obtain the number of decimals for the token, using Subsquid's SDK to interact with the smart contract deployed on chain (this is where the `RPC_ENDPOINT` variable is being used).
:::

### Launch the project

To launch the project, simply open a terminal and run this command:

```bash
sqd process
```

And in a few minutes, a few sub-folders (whose names are the block ranges where the data is coming from) should be created under the `data` directory, each containing a `transfer.csv` file.

![multiple folders containing CSV files](</img/csv-files.png>)

### Data analysis with Python

If you want to learn how to analyze this data using Python and Pandas, refer to [the Medium article dedicated to this demo project](https://medium.com/@raekwonthethird/how-you-can-supercharge-blockchain-data-analysis-with-local-indexing-88b713e7948e), or consult the [project's repository on GitHub](https://github.com/RaekwonIII/local-csv-indexing).

## Conclusions

The purpose of this project was to demonstrate how to use Subsquid's indexing framework for data analytics prototyping: the indexer was able to ingest all this data, process it, and dump it on local CSV files in roughly 20 minutes, and a simple Python script in the project's repository shows how to read multiple CSV files, and perform some data analysis with Pandas.

Subsquid also wants to collect feedback on this new tool that Subsquid has made available for the developer community, so if you want to express an opinion, have suggestions, feel free to reach out.