---
id: create-an-ethereum-processing-squid
title: NFT indexing on EVM
description: >-
  A simple squid indexing NFTs on Ethereum
sidebar_position: 20
---

# NFT indexing on EVM

## Objective

This tutorial starts with the standard `evm` template of [`sqd init`](/squid-cli/init) and turns it into a squid indexing the [Exosama NFT](https://exosama.com/) [contract](https://etherscan.io/address/0xac5c7493036de60e63eb81c5e9a440b42f47ebf5) deployed on Ethereum. The squid stores its data in a Postgres database and makes it available via a GraphQL API.

The goal is to index the contract NFTs, historical transfers and current owners. The tutorial applies to other EVM chains (Polygon, Binance Smart Chain, Arbitrum, etc). To switch to a different chain simply set its corresponding [Archive](/archives/overview/) as a data source during [processor configuration](/evm-indexing/configuration).

To look at the end result, inspect the code and play around, clone the [repo](https://github.com/subsquid/subsquid-ethereum-tutorial-example) or open Gitpod:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/subsquid/subsquid-ethereum-tutorial-example.git)

## Pre-requisites

- Familiarity with Git 
- A properly set up [development environment](/tutorials/development-environment-set-up) consisting of Node.js and Docker
- [Squid CLI](/squid-cli/installation)

:::info
This tutorial uses custom scripts defined in `commands.json`. The scripts are automatically picked up as `sqd` sub-commands. 
:::

## Scaffold using `sqd init`

We begin by retrieving the [`evm` template](https://github.com/subsquid/squid-evm-template) with [`sqd init`](/squid-cli/init) and installing the dependencies:

```bash
sqd init evm-tutorial --template evm
cd evm-tutorial
npm ci
```

## Define the schema

The next step is to define the target data entities and their relations at `schema.graphql`, then use that file to autogenerate TypeORM entity classes.

We track:

* Token transfer events
* Owners of tokens
* Contracts and their minted tokens

For that, we use the following `schema.graphql` definitions:

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
  contractURI: String # contract URI updated once e.g. a day
  address: String
  contractURIUpdated: BigInt @index # timestamp at the last contract URI update
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

It's worth noting a few things in this [schema definition](/basics/schema-file):

* **`@entity`**: Signals that this type will be translated into an ORM model that is going to be persisted in the database.
* **`@derivedFrom`**: Signals that the field will not be persisted in the database. Instead, it will be [derived from](/basics/schema-file/entity-relations) the entity relations.
* **type references** (e.g. `from: Owner`): When used on entity types, they establish a relation between two entities.
* **`@index`**: Signals that the field should be indexed by the database. Very useful for increasing the performance on fields queried often.

TypeScript entity classes have to be regenerated whenever the schema is changed, and to do that we use the `squid-typeorm-codegen` tool. The pre-packaged `commands.json` already comes with a `codegen` shortcut, so we can invoke it with `sqd`:

```bash
sqd codegen
```
The (re)generated entity classes can then be browsed at `src/model/generated`.

## ABI Definition and Wrapper

Squid SDK offers the `squid-evm-typegen` tool for generating type-safe facade classes for decoding EVM smart contract transaction and log data. It uses [`ethers.js`](https://docs.ethers.io/) under the hood and requires the contract [Application Binary Interface (ABI)](https://docs.ethers.io/v5/api/utils/abi/) as input. It accepts a local path or an URL of the contract ABI, and also supports fetching public ABIs from any Etherscan-like API. 

In our case, we take the Exosama smart contract ABI from an external repo `subsquid/exosama-marketplace-squid`.
 
We download the ABI with `cURL` into the `abi` folder pre-configured in the evm template. The filename we choose (`exo.json`) corresponds to the basename (`exo`) for the generated classes in the target (`src/abi`) folder.
```bash
curl https://raw.githubusercontent.com/subsquid/exosama-marketplace-squid/master/src/abi/ExosamaCollection.json -o abi/exo.json
```
Then we invokde the typegen tool via an `sqd` command:
```bash
sqd typegen
```
The generated Typescript ABI code should be available at `src/abi/exo.ts`.

:::info
The full version of the `squid-evm-typegen` version, invoked with `npx squid-evm-typegen` allows fetching the ABI by address using the Etherescan API. For example: 

```bash
npx squid-evm-typegen src/abi 0xac5c7493036de60e63eb81c5e9a440b42f47ebf5#my-contract 
```
Inspect all available options with
```bash
npx squid-evm-typegen --help
```

**Caveat:** in the wild, many contracts employ the [transparent proxy pattern](https://eips.ethereum.org/EIPS/eip-1967) and only expose the ABI for contract updates. To index the ongoing contract activity one must use the ABI of the implementation contract. To find this contract, visit the Etherscan page of the proxy contract, go to the "Contract" tab of contract details and look for the "Read as Proxy" button.
:::

Note that aside from the Exosama Typescript ABI module at `src/abi/exo.ts` the tool has also generated a module for handling the [Maker DAO muticall contract](https://github.com/makerdao/multicall). This contract will be used to access the state of the Exosama contract in a much more efficient way.

### Managing the EVM contract

Before we begin defining the mapping logic of the squid, we are going to hardcode some information on the involved contracts. While it can actually be sourced by accessing the state of the contract on-chain, this would have added complexity to the project. To isolate this part of our codebase let's create a module named `src/contract.ts`, which will export:

* The address of the [Maker DAO](https://github.com/makerdao/multicall) multicall contract (`0x5ba1e12693dc8f9c48aad8770482f4739beed696`)
* The address of the Exosama NFT collection contract (`0xac5c7493036de60e63eb81c5e9a440b42f47ebf5`)
* A function that will create and save an instance of the `Contract` entity to the database, if one does not exist already. This is where the hardcoded values will go, for now. The function returns either the already existing or the created `Contract` instance.

Here are the full file contents:

```typescript
// src/contract.ts
import { Store } from "@subsquid/typeorm-store";
import { Contract } from "./model";

// see https://github.com/makerdao/multicall
export const MULTICALL_ADDRESS='0x5ba1e12693dc8f9c48aad8770482f4739beed696'
export const EXOSAMA_NFT_CONTRACT = '0xac5c7493036de60e63eb81c5e9a440b42f47ebf5';

let contractEntity: Contract | undefined;

export async function getOrCreateContractEntity(store: Store): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, EXOSAMA_NFT_CONTRACT);
    if (contractEntity == null) {
      contractEntity = new Contract({
        id: EXOSAMA_NFT_CONTRACT,
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

## Define the logic to handle and save Events & Function calls

Subsquid SDK provides users with the [`EvmBatchProcessor` class](/evm-indexing). Its instances connect to a [Subsquid archive](/archives/overview) to get chain data and apply custom transformations. The indexing begins at the starting block and keeps up with new blocks after reaching the tip.

The processor exposes methods to "subscribe" to EVM logs or smart contract function calls. These methods [configure the processor](/evm-indexing/configuration) to retrieve a subset of archive data, by specifying things like addresses of contracts, signatures of public functions or topics of event of interest. The actual data processing is then started by calling the `.run()` function. This will start generating requests to the Archive for *batches* of data specified in the configuration, and will trigger the callback function, or *batch handler* (passed to `.run()` as second argument) every time a batch is returned by the Archive.

It is in this callback function that all the mapping logic is expressed. This is where event and function decoding should be implemented, and where the code to save processed data on the database should be defined.

## Configure Processor and Batch Handler

The `src/processor.ts` file is where the template project instantiates the `EvmBatchProcessor` class, configures it for execution, and attaches the handler functions.

We have to make substantial changes here, and add the bulk of our logic. Here is a list of tasks that the code in this file should accomplish:

* Instantiate `TypeormDatabase` and `EvmBatchProcessor` classes (already present).
* Configure the processor by setting the block range, the Archive and RPC node endpoints, and subscribe to logs of the Exosama contract with the `setBlockRange`, `setDataSource` and `addLog` functions, respectively.
* Declare a function to handle the EVM logs, using the decoding functions defined in `src/abi/exo.ts` by the `sqd typegen` tool.
* Declare a second function to save all the data extracted from the batch in one go. Saving vectors of models, instead of a single instance at a time will guarantee a much better performance, and it is the preferred way to go.
* Call the `processor.run()` function to start the data processing. This will unbundle the batch of EVM logs and use the previous two functions to handle and save data.

And here is the final result:

```typescript
// src/processor.ts
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  EvmBatchProcessor,
  BlockHandlerContext,
  LogHandlerContext
} from "@subsquid/evm-processor";
import { In } from "typeorm";
import { BigNumber } from "ethers";
import {
  EXOSAMA_NFT_CONTRACT,
  getOrCreateContractEntity,
  MULTICALL_ADDRESS,
} from "./contract";
import { Owner, Token, Transfer } from "./model";
import { events } from "./abi/exo";
import { Multicall } from "./abi/multicall";
import { functions } from "./abi/exo";
import { maxBy } from 'lodash'
import { lookupArchive } from "@subsquid/archive-registry";

const database = new TypeormDatabase();
const processor = new EvmBatchProcessor()
  .setBlockRange({ from: 15584000 })
  .setDataSource({
    chain: process.env.RPC_ENDPOINT || 'https://rpc.ankr.com/eth',
    archive: lookupArchive('eth-mainnet'),
  })
  .addLog(EXOSAMA_NFT_CONTRACT, {
    filter: [[events.Transfer.topic]],
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
        if (item.address === EXOSAMA_NFT_CONTRACT) {
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

  if (transfersData.length>0) {
    ctx.log.info(`Saving ${transfersData.length} transfers`)
    await saveTransfers({
      ...ctx,
      block: ctx.blocks[ctx.blocks.length - 1].header,
    }, transfersData);
  }
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

  const { from, to, tokenId } = events.Transfer.decode(evmLog);

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

async function saveTransfers(
  ctx: BlockHandlerContext<Store>,
  transfersData: TransferData[]
) {
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

    if (token == null) {
      token = new Token({
        id: tokenIdString,
        //uri: to be set later 
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

  

  const maxHeight = maxBy(transfersData, t => t.block)!.block; 
  // query the multicall contract at the max height of the chunk
  const multicall = new Multicall(ctx, {height: maxHeight}, MULTICALL_ADDRESS)

  ctx.log.info(`Calling mutlicall for ${transfersData.length} tokens...`)
  // call in pages of size 100
  const results = await multicall.tryAggregate(
    functions.tokenURI,
    transfersData.map(t => [
      EXOSAMA_NFT_CONTRACT,
      [BigNumber.from(t.tokenId)]
    ] as [string, any[]]),
    100
  );

  results.forEach((res, i) => {
    let t = tokens.get(transfersData[i].tokenId.toString());
    if (t) {
      let uri = '';
      if (res.success) {
        uri = <string>res.value;
      } else if (res.returnData) {
        uri = <string>functions.tokenURI.tryDecodeResult(res.returnData) || '';
      }
    }
  });
  ctx.log.info(`Done`);
  
  
  await ctx.store.save([...owners.values()]);
  await ctx.store.save([...tokens.values()]);
  await ctx.store.save([...transfers]);

}
```

:::info
Pay close attention to the line with `const results = await multicall.tryAggregate(...)`. This is an example of how to aggregate multiple contract calls using the [MakerDAO Multicall Contract](https://github.com/makerdao/multicall). It significantly increases the sync speed of the squid by reducing the number of JSON RPC requests. The first argument is `function.tokenURI` corresponds to the `tokenURI()` view method of the `EXOSAMA_NFT_CONTRACT` contract, and the second argument
```ts
transfersData.map(t => [EXOSAMA_NFT_CONTRACT, [BigNumber.from(t.tokenId)]] as [string, any[]])
```
tells that it should be called with a single argument `tokenId` for each entity in the `transfersData` array.
The last argument `100` corresponds to the page size, meaning that `tryAggreagate` splits the incoming array of calls to be executed into chunks of size `100`. If the page size is too large, the RPC node may time out or bounce the request.

For more details on see the Multicall section of the [`evm-typegen` page](/evm-indexing/squid-evm-typegen)
:::

:::warning
This code expects to find an URL of a working Ethereum RPC endpoint in the `RPC_ENDPOINT` environment variable. Set it in the `.env` file and in [Aquarium secrets](/deploy-squid/env-variables) if and when you deploy your squid there. Free endpoints for testing can be found at [Ethereumnodes](https://ethereumnodes.com/); for production, we recommend using private endpoints.
:::

We used the [lodash library](https://lodash.com) to simplify the processor code. Install it as follows:
```bash
npm i lodash
npm i --save-dev @types/lodash
```

## Launch and Set Up the Database

When running the project locally it is possible to use the `docker-compose.yml` file that comes with the template to launch a PostgreSQL container. To do so, run `sqd up` in your terminal.

[comment]: # (Launch database container https://i.gyazo.com/907ef55371e1cdb1839d2fe7ff108ee7.gif)

Squid projects automatically manage the database connection and schema via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping). In this approach the schema is managed through migration files. Because we made changes to the schema, we need to remove the existing migration(s) and create a new one, then apply the new migration.

This involves the following steps:

1. Build the code:

    ```bash
    sqd build
    ```

2. Make sure you start with a clean Postgres database. The following commands drop-create a new Postgres instance in Docker:

    ```bash
    sqd down
    sqd up
    ```

3. Generate the new migration (this will wipe any old migrations):

    ```bash
    sqd migration:generate
    ```
   
## Launch the Project

To launch the processor run the following command:

```bash
sqd process
```
Before actually executing the processor the command will apply the migrations. Once it starts, the processor will block the current terminal.

[comment]: # (Launch processor https://i.gyazo.com/66ab9c1fef9203d3e24b6e274bba47e3.gif)

Finally, in a separate terminal window, launch the GraphQL server:

```bash
sqd serve
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql) to access the [GraphiQL](https://github.com/graphql/graphiql) console. From this window, you can perform queries such as this one, to find out the account owners with the biggest balances:

```graphql
query MyQuery {
  owners(limit: 10, orderBy: balance_DESC) {
    balance
    id
  }
}
```

Have fun playing around with queries, after all, it's a _playground_!
