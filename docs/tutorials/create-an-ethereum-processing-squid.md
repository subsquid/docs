---
id: create-an-ethereum-processing-squid
title: Create an Ethereum-indexing Squid
description: >-
  Create a simple squid indexing smart contract data on Ethereum Mainnet
sidebar_position: 3
---

# Create an Ethereum-indexing Squid

## Objective

This tutorial will take the Squid Ethereum template and go through all the necessary steps to customize the project, in order to interact with a different Squid Archive, synchronized with the Ethereum blockchain, and process data from a specific contract ([the Exosama NFT collection](https://exosama.com/)), with substantial configuration changes to what is defined in the template.

The business logic to process these contract is basic, and that is on purpose since the Tutorial aims show a simple case, highlighting the changes a developer would typically apply to the template, removing unnecessary complexity.

In this example  we will be connecting to the [Ethereum mainnet](https://ethereum.org/en/developers/docs/networks/#ethereum-mainnet) and the final objective will be to show the tokens that are part of the contract, who owns them and every time they have been transferred.

If you want to look at the end result, or inspect the code, the project of this tutorial is available at [this repository](https://github.com/subsquid/subsquid-ethereum-tutorial-example).

## Pre-requisites

The minimum requirements to follow this tutorial are the basic knowledge of software development, such as handling a Git repository, a correctly set up [Development Environment](/tutorials/development-environment-set-up), basic command line knowledge and the concepts explained in this documentation.

## Fork the template

The first thing to do, although it might sound trivial to GitHub experts, is to fork the repository into your own GitHub account, by visiting the [repository page](https://github.com/subsquid/squid-ethereum-template) and clicking the "Use this template" button:

![How to fork a repository on GitHub](</img/.gitbook/assets/Screenshot-2022-02-02-111440.png>)

Next, clone the created repository (be careful of changing `<account>` with your own account)

```bash
git clone git@github.com:<account>/squid-ethereum-template.git
```

## Define Entity Schema

The next thing to do, in order to customize the project for our own purpose, is to make changes to the schema and define the Entities we want to keep track of.

Luckily, the EVM template already contains a schema that defines the exact entities we need for the purpose of this guide. For this reason, changes are necessary, but it's still useful to explain what is going on.

To index ERC-721 token transfers, we will need to track:

* Token transfers
* Ownership of tokens
* Contracts and their minted tokens

And the `schema.graphql` file defines them like this:

```graphql
type Token @entity {
  id: ID!
  owner: Owner
  uri: String
  transfers: [Transfer!]! @derivedFrom(field: "token")
  contract: Contract
}
 
type Owner @entity {
  id: ID!
  ownedTokens: [Token!]! @derivedFrom(field: "owner")
  balance: BigInt! @index
}
 
type Contract @entity {
  id: ID!
  name: String! @index
  symbol: String! @index
  # contract URI updated once e.g. a day
  contractURI: String
  address: String
  # timestamp when the contract URI was updated last
  contractURIUpdated: BigInt @index
  totalSupply: BigInt!
  mintedTokens: [Token!]! @derivedFrom(field: "contract")
}
 
type Transfer @entity {
  id: ID!
  token: Token!
  from: Owner
  to: Owner
  timestamp: BigInt! @index
  block: Int! @index
  transactionHash: String! @index
}
```

It's worth noting a couple of things in this [schema definition](https://docs.subsquid.io/reference/openreader-schema):

* **`@entity`** - signals that this type will be translated into an ORM model that is going to be persisted in the database
* **`@derivedFrom`** - signals the field will not be persisted on the database, it will rather be derived
* **type references** (i.e. `from: Owner`) - establishes a relation between two entities
* **`@index`** - signals that the field should be indexed by the database. Very useful for increasing the performance on fields queried often.

The template already has automatically generated TypeScript classes for this schema definition. They can be found under `src/model/generated`.

Whenever changes are made to the schema, new TypeScript entity classes have to be generated, and to do that you'll have to run the `codegen` tool:

```bash
npx squid-typeorm-codegen
```

## ABI Definition and Wrapper

Subsquid offers support for automatically building TypeScript type-safe interfaces and decoding functions for EVM smart contracts, thanks to the `evm-typegen` tool.

First, it is necessary to obtain the definition of the Application Binary Interface (ABI). This can be obtained in the form of a JSON file, which will be imported into the project. 

In the context of this example, you can find the Exosama collection smart contract (a modified ERC-721) at [this address](https://etherscan.io/address/0xac5c7493036de60e63eb81c5e9a440b42f47ebf5).

1. It is advisable to copy the JSON file in the `src/abi` subfolder.
2. To automatically generate TypeScript interfaces from an ABI definition, and decode event data, simply run this command from the project's root folder

```bash
npx squid-evm-typegen --abi src/abi/exo.json --output src/abi/exo.ts
```

:::info
For verified contracts the ABI can be fetched using the Etherscan API. Here is a sample script for downloading it with CURL:

```bash
# replace the contract address below 
export CONTRACT_ADDRESS=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413
curl "https://api.etherscan.io/api?module=contract&action=getabi&address=${CONTRACT_ADDRESS}" --output src/abi/abi.json
```
:::


The `abi` parameter points at the JSON file previously created, and the `output` parameter is the name of the file that will be generated by the command itself.

This command will automatically generate a TypeScript file named `exo.ts`, under the `src/abi` subfolder, that defines data interfaces to represent output of the EVM events defined in the ABI, as well as a mapping of the functions necessary to decode these events (see the `events` dictionary in the aforementioned file).

### Managing the EVM contract

For the purpose of this tutorial, we are going to hardcode the information of the contract itself, including the total supply, the token name, and symbol. While this information can actually be sourced by accessing the state of the contract on-chain, this would have added complexity to the project. To isolate this part of our codebase, and potentially make it easier to improve it in the future, let's create a file named `src/contract.ts`, which will contain:

* The chain node endpoint (necessary for accessing the contract state). If you don't have access to a private Ethereum node endpoint, you can search for a public one [here](https://ethereumnodes.com/), be sure to use a WebSocket endpoint.
* The contract's address (`0xac5c7493036de60e63eb81c5e9a440b42f47ebf5`)
* A singleton instance of the `Contract` model, abstracting the database
* A function that will create and save an instance of `Contract` on the database, if one does not exist already. This is where the hardcoded values will go, for now.

Here is the entire content of the file:

```typescript
// src/contract.ts
import { Store } from "@subsquid/typeorm-store";
import { Contract } from "./model";

export const contractAddress = "0xac5c7493036de60e63eb81c5e9a440b42f47ebf5";

let contractEntity: Contract | undefined;

export async function getOrCreateContractEntity(store: Store): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contractAddress);
    if (contractEntity == null) {
      contractEntity = new Contract({
        id: contractAddress,
        name: "Exosama",
        symbol: "EXO",
        totalSupply: 10000n,
      });
      await store.insert(contractEntity);
    }
  }
  return contractEntity;
}

```

## Define logic to handle and save Events & Function calls

The Subsquid SDK provides users with the `EvmBatchProcessor`, that connects to the [Subsquid archive](/overview) to get chain data and apply custom transformation. It will index from the starting block, until the end block (if these are set in the configuration), or until new data is added to the chain.

The processor exposes methods to "subscribe" to EVM logs or smart contract function calls. These methods can be configured by specifying the EVM log contract address, and the signature of the EVM event, for example. The actual data processing is then started by calling the `.run()` function. This will start generating requests to the Archive for *batches* of the data specified in the configuration, and will trigger the callback function, or *batch handler* (passed to `.run()` as second argument) every time a batch is returned by the Archive itself.

It is in this callback function that all the mapping logic is expressed. This is where Event and Function decoding should be implemented, and where the code to save processed data on the database should be defined.

:::info
The ABI defines the signatures of all events in the contract. The `Transfer` event has three arguments, named: `from`, `to`, and `tokenId`. Their types are, respectively, `address`, `address`, and `uint256`. As such, the actual definition of the `Transfer` event looks like this: `Transfer(address, address, uint256)`.
:::

## Configure Processor and Batch Handler

The `src/processor.ts` file is where the template project instantiates the `EvmBatchProcessor` class, configures it for execution, and attaches the handler functions.

We have to make substantial changes here, and add the bulk of our logic. Here is a list of tasks that the code in this file should accomplish:

* Instantiate `TypeormDatabase` and `EvmBatchProcessor` classes (already present)
* Configure the processor by setting the block range, the Archive and RPC node endpoints, and subscribe to logs of the Exosama contract with the `setBlockRange`, `setDataSource` and `addLog` functions, respectively
* Declare a function to handle the EVM logs, using the decoding functions defined in `exo.ts` by the `evm-typegen` tool
* Declare a second function to save all the data extracted from the batch in one go. Saving vectors of models, instead of a single instance at a time will guarantee a much better performance and it is the preferred way to go
* Call the `processor.run()` function to start the data processing. This will unbundle the batch of EVM logs and use the previous two functions to handle and save data

And here is a code snippet with the final result:

```typescript
// src/processor.ts
import { lookupArchive } from "@subsquid/archive-registry";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { EvmBatchProcessor, BlockHandlerContext, LogHandlerContext } from "@belopash/evm-processor";
import { In } from "typeorm";
import { BigNumber } from "ethers";
import {
  CHAIN_NODE,
  contractAddress,
  getOrCreateContractEntity,
} from "./contract";
import { Owner, Token, Transfer } from "./model";
import * as exo from "./abi/exo";

const database = new TypeormDatabase();
const processor = new EvmBatchProcessor()
  .setBlockRange({ from: 15584000 })
  .setDataSource({
    chain: process.env.ETHEREUM_MAINNET_WSS,
    archive: 'https://eth.archive.subsquid.io',
  })
  .addLog(contractAddress, {
    filter: [[exo.events["Transfer(address,address,uint256)"].topic]],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    },
  });

processor.run(database, async (ctx) => {
  const transfersData: TransferData[] = [];

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === "evmLog") {
        if (item.address === contractAddress) {
          const transfer = handleTransfer({
            ...ctx,
            block: block.header,
            ...item,
          });

          transfersData.push(transfer);
        }
      }
    }
  }

  await saveTransfers({
    ...ctx,
    block: ctx.blocks[ctx.blocks.length - 1].header,
  }, transfersData);
});

type TransferData = {
  id: string;
  from: string;
  to: string;
  tokenId: bigint;
  timestamp: bigint;
  block: number;
  transactionHash: string;
};

function handleTransfer(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
  >
): TransferData {
  const { evmLog, transaction, block } = ctx;
  const addr = evmLog.address.toLowerCase()

  const { from, to, tokenId } = exo.events[
    "Transfer(address,address,uint256)"
  ].decode(evmLog);

  const transfer: TransferData = {
    id: `${transaction.hash}-${addr}-${tokenId.toBigInt()}-${evmLog.index}`,
    tokenId: tokenId.toBigInt(),
    from,
    to,
    timestamp: BigInt(block.timestamp),
    block: block.height,
    transactionHash: transaction.hash,
  };

  return transfer;
}

async function saveTransfers(ctx: BlockHandlerContext<Store>, transfersData: TransferData[]) {
  const tokensIds: Set<string> = new Set();
  const ownersIds: Set<string> = new Set();

  for (const transferData of transfersData) {
    tokensIds.add(transferData.tokenId.toString());
    ownersIds.add(transferData.from);
    ownersIds.add(transferData.to);
  }

  const transfers: Set<Transfer> = new Set();

  const tokens: Map<string, Token> = new Map(
    (await ctx.store.findBy(Token, { id: In([...tokensIds]) })).map((token) => [
      token.id,
      token,
    ])
  );

  const owners: Map<string, Owner> = new Map(
    (await ctx.store.findBy(Owner, { id: In([...ownersIds]) })).map((owner) => [
      owner.id,
      owner,
    ])
  );

  for (const transferData of transfersData) {
    const contract = new exo.Contract(
      ctx,
      { height: transferData.block },
      contractAddress
    );

    let from = owners.get(transferData.from);
    if (from == null) {
      from = new Owner({ id: transferData.from, balance: 0n });
      owners.set(from.id, from);
    }

    let to = owners.get(transferData.to);
    if (to == null) {
      to = new Owner({ id: transferData.to, balance: 0n });
      owners.set(to.id, to);
    }

    const tokenIdString = transferData.tokenId.toString();

    let token = tokens.get(tokenIdString);

    let tokenURI
    try {
      tokenURI = await contract.tokenURI(BigNumber.from(transferData.tokenId)) 
    } catch (error) {
      ctx.log.warn(`[API] Error during fetch tokenURI of ${tokenIdString}`);
      if (error instanceof Error)
        ctx.log.warn(`${error.message}`);
    }
    if (token == null) {
      token = new Token({
        id: tokenIdString,
        uri: tokenURI,
        contract: await getOrCreateContractEntity(ctx.store),
      });
      tokens.set(token.id, token);
    }
    token.owner = to;

    const { id, block, transactionHash, timestamp } = transferData;

    const transfer = new Transfer({
      id,
      block,
      timestamp,
      transactionHash,
      from,
      to,
      token,
    });

    transfers.add(transfer);
  }

  await ctx.store.save([...owners.values()]);
  await ctx.store.save([...tokens.values()]);
  await ctx.store.save([...transfers]);
}

```

:::info
Pay close attention to the line with `tokenURI = await contract.tokenURI(BigNumber.from(transferData.tokenId))`. This is a great example of how to use the `Contract` class, defined in the file `exo.ts` (generated automatically from the ABI), to access the contract status of the token, by connecting directly to the network's RPC endpoint.

We mentioned in a previous paragraph, that the `Contract` model information is hardcoded, but it could be fetched from the contract status, and this line shows you how.

For those who are curious, or want to improve upon this simple project, a great exercise would be to `Contract.name`, `Contract.symbol` and similar functions and edit the hardcoded part.
:::

:::warning
Make sure to edit the `.env` file and change the value for `ETHEREUM_MAINNET_WSS` to a real Ethereum node endpoint.
:::

## Launch and Set Up the Database

When running the project locally, as it is the case for this guide, it is possible to use the `docker-compose.yml` file that comes with the template to launch a PostgreSQL container. To do so, run the following command in your terminal:

```bash
docker compose up -d
```

![Launch database container](https://i.gyazo.com/907ef55371e1cdb1839d2fe7ff108ee7.gif)

!!! Note The `-d` parameter is optional, it launches the container in `daemon` mode, so the terminal will not be blocked, and no further output will be visible.

Squid projects automatically manage the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping).

The Subsquid SDK uses migration files, which apply the defined schema to the underlying database. Because we made changes to the schema, we need to remove existing migration(s) and create a new one, before applying the new migration to the database.

To set up the database, you can take the following steps:

1. Build the code

    ```bash
    npm run build
    ```

2. Make sure the Postgres Docker container, `squid-template_db_1`, is running (exact name of the container could be slightly different)

    ```bash
    docker ps -a
    ```

3. Remove existing migration(s), they are placed under the `db/migrations` folder

    ```bash
    rm db/migrations/*js
    ```

4. Generate the new migration

    ```bash
    npx squid-typeorm-migration generate
    ```
5. Apply the migration, so tables are created on the database

    ```bash
    npx squid-typeorm-migration apply
    ```

## Launch the Project

To launch the processor (this will block the current terminal), you can run the following command:

```bash
make process
```
:::info
This is an example of some of the command shortcuts that can be found in `Makefile`. Feel free to use them, to increase your productivity.
:::

![Launch processor](https://i.gyazo.com/66ab9c1fef9203d3e24b6e274bba47e3.gif)

Finally, in a separate terminal window, launch the GraphQL server:

```bash
npx squid-graphql-server
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql) to access the [GraphiQl](https://github.com/graphql/graphiql) console. From this window, you can perform queries such as this one, to find out the account owners with the biggest balances:

```graphql
query MyQuery {
  owners(limit: 10, orderBy: balance_DESC) {
    balance
    id
  }
}
```

Have some fun playing around with queries, after all, it's a _playground_!
