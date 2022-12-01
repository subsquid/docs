---
id: create-an-evm-processing-squid
title: Create a Frontier EVM-indexing Squid
description: >-
  Create a sample squid indexing EVM data on Astar
sidebar_position: 3
---

# Create a Frontier EVM-indexing Squid

## Objective

This tutorial will take the Squid EVM template and go through all the necessary steps to customize the project, in order to interact with a different Squid Archive, synchronized with a different blockchain, and process data from two different contracts (AstarDegens and AstarCats), instead of the one used in the template.

The business logic to process these contract is basic, and that is on purpose since the Tutorial aims show a simple case, highlighting the changes a developer would typically apply to the template, removing unnecessary complexity.

The blockchain used in this example will be the [Astar network](https://astar.network/) and the final objective will be to show the tokens that are part of these smart contracts, who owns them and every time they have been transferred.

## Pre-requisites

The minimum requirements to follow this tutorial are the basic knowledge of software development, such as handling a Git repository, a correctly set up [Development Environment](/tutorials/development-environment-set-up), basic command line knowledge and the concepts explained in this documentation.

## Fork the template

The first thing to do, although it might sound trivial to GitHub experts, is to fork the repository into your own GitHub account, by visiting the [repository page](https://github.com/subsquid/squid-frontier-evm-template) and clicking the Fork button:

![How to fork a repository on GitHub](</img/.gitbook/assets/Screenshot-2022-02-02-111440.png>)

Next, clone the created repository (be careful of changing `<account>` with your own account)

```bash
git clone git@github.com:<account>/squid-frontier-evm-template.git
```

For reference on the complete work, you can find the entire project [here](https://github.com/subsquid/squid-astar-example/tree/astar-degens).

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
  balance: BigInt
}

type Contract @entity {
  id: ID!
  name: String
  symbol: String
  totalSupply: BigInt
  mintedTokens: [Token!]! @derivedFrom(field: "contract")
}

type Transfer @entity {
  id: ID!
  token: Token!
  from: Owner
  to: Owner
  timestamp: BigInt!
  block: Int!
  transactionHash: String!
}

```

It's worth noting a couple of things in this [schema definition](https://docs.subsquid.io/reference/openreader-schema):

* **`@entity`** - signals that this type will be translated into an ORM model that is going to be persisted in the database
* **`@derivedFrom`** - signals the field will not be persisted on the database, it will rather be derived
* **type references** (i.e. `from: Owner`) - establishes a relation between two entities

The template already has automatically generated TypeScript classes for this schema definition. They can be found under `src/model/generated`.

Whenever changes are made to the schema, new TypeScript entity classes have to be generated, and to do that you'll have to run the `codegen` tool:

```bash
make codegen
```

## ABI Definition and Wrapper

Subsquid offers support for automatically building TypeScript type-safe interfaces for Substrate data sources (events, extrinsics, storage items). Changes are automatically detected in the runtime.

This functionality has been extended to EVM indexing, with the release of a `evm-typegen` tool to generate TypeScript interfaces and decoding functions for EVM logs.

Once again, the template repository already includes interfaces for ERC-721 contracts, which is the subject of this guide. But it is still important to explain what needs to be done, in case, for example, one wants to index a different type of contract.

First, it is necessary to obtain the definition of its Application Binary Interface (ABI). This can be obtained in the form of a JSON file, which will be imported into the project.

1. It is advisable to copy the JSON file in the `src/abi` subfolder.
2. To automatically generate TypeScript interfaces from an ABI definition, and decode event data, simply run this command from the project's root folder

```bash
npx squid-evm-typegen --abi src/abi/ERC721.json --output src/abi/erc721.ts
```

The `abi` parameter points at the JSON file previously created, and the `output` parameter is the name of the file that will be generated by the command itself.

This command will automatically generate a TypeScript file named `erc721.ts`, under the `src/abi` subfolder, that defines data interfaces to represent output of the EVM events defined in the ABI, as well as a mapping of the functions necessary to decode these events (see the `events` dictionary in the aforementioned file).

:::info
The ERC-721 ABI defines the signatures of all events in the contract. The `Transfer` event has three arguments, named: `from`, `to`, and `tokenId`. Their types are, respectively, `address`, `address`, and `uint256`. As such, the actual definition of the `Transfer` event looks like this: `Transfer(address, address, uint256)`.
:::

## Define and Bind Event Handler(s)

The Subsquid SDK provides users with a [processor](/develop-a-squid/substrate-processor) class, named `SubstrateProcessor` or, in this specific case [`SubstrateBatchProcessor`](/develop-a-squid/substrate-processor/batch-processor-in-action). The processor connects to the [Subsquid archive](/overview) to get chain data. It will index from the configured starting block, until the configured end block, or until new data is added to the chain.

The processor exposes methods to "attach" functions that will "handle" specific data such as Substrate events, extrinsics, storage items, or EVM logs. These methods can be configured by specifying the event or extrinsic name, or the EVM log contract address, for example. As the processor loops over the data, when it encounters one of the configured event names, it will execute the logic in the "handler" function.

### Managing the EVM contract

It is worth pointing out, at this point, that some important auxiliary code like constants and helper functions to manage the EVM contract is defined in the `src/contracts.ts` file. Here's a summary of what is in it:

* Define the chain node endpoint (optional but useful)
* Create a contract interface(s) to store information such as the address and ABI
* Define functions to fetch or create contract entities from the database and the contract URI from the `ethers` instance
* Define a couple of functions to avoid that the connection generated by the `ethers` instance will stall

In order to adapt the template to the scope of this guide, we need to apply a couple of changes:

1. edit the `CHAIN_NODE` constant to the endpoint URL of Astar network (e.g. `https://astar-mainnet.g.alchemy.com/v2/ALCHEMY_API_KEY`. Create your free [Alchemy](https://docs.alchemy.com/reference/astar-api-quickstart) Astar API key for this)
2. define a map that relates the contract address with the contract model and the Contract instance defined by the `ethers` library
3. edit the hexadecimal address used to create the `contract` constant (we are going to use [this token](https://blockscout.com/astar/token/0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a/token-transfers) for the purpose of this guide)
4. change the `name`, `symbol` and `totalSupply` values used in the `createContractEntity` function to their correct values (see link in the previous point)
5. create a second `ethers` Contract for the second ERC721 token contract we want to index and a second entry in the map

In case someone wants to index an EVM event different from `Transfer`, they would also have to implement a different handler function from `processTransfer`, especially the line where the event `"Transfer(address,address,uint256)"` is decoded.

```typescript
// src/contract.ts
import { Store } from "@subsquid/typeorm-store";
import { Contract } from "./model";

export const CHAIN_NODE = "wss://astar.public.blastapi.io";
export const astarDegensAddress = "0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a";
export const astarCatsAddress = "0x8b5d62f396Ca3C6cF19803234685e693733f9779";

export const contractMapping: Map<string, Contract> = new Map<
  string,
  Contract
>();

contractMapping.set(astarDegensAddress, {
    id: astarDegensAddress,
    name: "AstarDegens",
    symbol: "DEGEN",
    totalSupply: 10000n,
    mintedTokens: [],
  }
);

contractMapping.set(astarCatsAddress, {
    id: astarCatsAddress,
    name: "AstarCats",
    symbol: "CAT",
    totalSupply: 7777n,
    mintedTokens: [],
  }
);

export function createContractEntity(address: string): Contract {
  const contractObj = contractMapping.get(address);
  if (contractObj)
    return new Contract(contractObj);
  
  throw new Error("could not find a contract with that address");
}

const contractAddresstoModel: Map<string, Contract> = new Map<
string,
Contract
>();

export async function getContractEntity(
  store: Store,
  address: string
): Promise<Contract | undefined> {
  if (contractAddresstoModel.get(address) == null) {
    let contractEntity = await store.get(Contract, address);
    if (contractEntity == null) {
      contractEntity = createContractEntity(address);
      await store.insert(contractEntity);
      contractAddresstoModel.set(address, contractEntity)
    }
  }
  
  return contractAddresstoModel.get(address);
}

```

## Configure Processor and Attach Handler

The `src/processor.ts` file is where the template project instantiates the `SubstrateBatchProcessor` class, configures it for execution, and attaches the handler functions.

Luckily for us, most of the job is already done, but we still need to adapt the code to handle two contracts, instead of only one. We also need to change the `addEvmLog` function call, with the appropriate contract address for AstarDegens, and add a second one for AstarCats.

Furthermore, we need to adapt the logic to save `Token`s in a way that avoids ID clashing.

:::info
It is also important to note that, since the template was built for the `moonriver` network, it is necessary to change the `archive` parameter of the `setDataSource` function to fetch the Archive URL for Astar.
The `lookupArchive` function is used to consult the [archive registry](https://github.com/subsquid/archive-registry) and yield the archive address, given a network name. Network names should be in lowercase.
:::

Look at this code snippet for the end result:

```typescript
// src/processor.ts
import { lookupArchive } from "@subsquid/archive-registry";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  BatchContext,
  BatchProcessorItem,
  EvmLogEvent,
  SubstrateBatchProcessor,
  SubstrateBlock,
} from "@subsquid/substrate-processor";
import { In } from "typeorm";
import { ethers } from "ethers";
import {
  CHAIN_NODE,
  astarDegensAddress,
  getContractEntity,
  astarCatsAddress,
  contractMapping,
} from "./contract";
import { Owner, Token, Transfer } from "./model";
import * as erc721 from "./abi/erc721";

const database = new TypeormDatabase();
const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setBlockRange({ from: 442693 })
  .setDataSource({
    chain: CHAIN_NODE,
    archive: lookupArchive("astar", { release: "FireSquid" }),
  })
  .setTypesBundle("astar")
  .addEvmLog(astarDegensAddress, {
    range: { from: 442693 },
    filter: [erc721.events["Transfer(address,address,uint256)"].topic],
  })
  .addEvmLog(astarCatsAddress, {
    range: { from: 800854 },
    filter: [erc721.events["Transfer(address,address,uint256)"].topic],
  });

type Item = BatchProcessorItem<typeof processor>;
type Context = BatchContext<Store, Item>;

processor.run(database, async (ctx) => {
  const transfersData: TransferData[] = [];

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "EVM.Log") {
        const transfer = handleTransfer(block.header, item.event);
        transfersData.push(transfer);
      }
    }
  }

  await saveTransfers(ctx, transfersData);
});

type TransferData = {
  id: string;
  from: string;
  to: string;
  token: ethers.BigNumber;
  timestamp: bigint;
  block: number;
  transactionHash: string;
  contractAddress: string;
};

function handleTransfer(
  block: SubstrateBlock,
  event: EvmLogEvent
): TransferData {
  const { from, to, tokenId } = erc721.events[
    "Transfer(address,address,uint256)"
  ].decode(event.args);

  const transfer: TransferData = {
    id: event.id,
    token: tokenId,
    from,
    to,
    timestamp: BigInt(block.timestamp),
    block: block.height,
    transactionHash: event.evmTxHash,
    contractAddress: event.args.address,
  };

  return transfer;
}

async function saveTransfers(ctx: Context, transfersData: TransferData[]) {
  const tokensIds: Set<string> = new Set();
  const ownersIds: Set<string> = new Set();

  for (const transferData of transfersData) {
    tokensIds.add(transferData.token.toString());
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
    const contract = new erc721.Contract(
      ctx,
      { height: transferData.block },
      transferData.contractAddress
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

    const tokenId = `${contractMapping.get(transferData.contractAddress)?.symbol || ""}-${transferData.token.toString()}`;
    let token = tokens.get(tokenId);
    if (token == null) {
      token = new Token({
        id: tokenId,
        uri: await contract.tokenURI(transferData.token),
        contract: await getContractEntity(ctx.store, transferData.contractAddress),
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
Pay close attention to the line with `id` in the `Token` model, because this is how we avoid the two token collection to clash. Both are using cardinal numbers to identify their own tokens, but we are now adding them to the same table, so we need a way to identify them uniquely and in this case, we chose the contract symbol to do so.
:::

:::info
It is also interesting to notice that `contract.tokenURI` is accessing the **state** of the contract, directly from the chain endpoint we provided. This is slowing down the indexing a little bit, because of the repeated RPC calls, but this data is only available this way. You'll find more information in the [dedicated section of our docs](/develop-a-squid/substrate-processor/evm-support#access-the-contract-state).
:::

## Launch and Set Up the Database

When running the project locally, as it is the case for this guide, it is possible to use the `docker-compose.yml` file that comes with the template to launch a PostgreSQL container. To do so, run the following command in your terminal:

```bash
make up
```

![Launch database container](https://i.gyazo.com/907ef55371e1cdb1839d2fe7ff108ee7.gif)

!!! Note The `-d` parameter is optional, it launches the container in `daemon` mode, so the terminal will not be blocked, and no further output will be visible.

Squid projects automatically manage the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping).

To set up the database, you can take the following steps:

1. Build the code

    ```bash
    make build
    ```

2. Make sure the Postgres Docker container, `squid-evm-template_db_1`, is running (the exact name depends on the name you gave the repository, when cloning it)

    ```bash
    docker ps -a
    ```

3. Remove existing migrations, because our schema may have changed

    ```bash
    rm db/migrations/*js
    ```
4. Generate a new migration, so tables are created on the database

    ```bash
    make migration
    ```

## Launch the Project

To launch the processor (this will block the current terminal), you can run the following command:

```bash
make process
```

![Launch processor](https://i.gyazo.com/66ab9c1fef9203d3e24b6e274bba47e3.gif)

Finally, in a separate terminal window, launch the GraphQL server:

```bash
make serve
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql) to access the [GraphiQL](https://github.com/graphql/graphiql) console. From this window, you can perform queries such as this one, to find out the account owners with the biggest balances:

```graphql
query MyQuery {
  owners(limit: 10, where: {}, orderBy: balance_DESC) {
    balance
    id
  }
}
```

Or this other one, looking up the tokens owned by a given owner:

```graphql
query MyQuery {
  tokens(where: {owner: {id_eq: "0x1210F3eA18Ef463c162FFF9084Cee5B6E5ccAb37"}}) {
    uri
    contract {
      id
      name
      symbol
      totalSupply
    }
  }
}
```

Have some fun playing around with queries, after all, it's a _playground_!
