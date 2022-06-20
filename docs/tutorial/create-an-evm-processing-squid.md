# Create an EVM-processing Squid

## Objective

This tutorial will take the Squid EVM template and go through all the necessary steps to customize the project, in order to interact with a different Squid Archive, synchronized with a different blockchain, and process data from Events different from the ones in the template.

The business logic to process such Events is very basic, and that is on purpose since the purpose of the Tutorial is to show a simple case, highlighting the changes a developer would typically apply to the template, removing unnecessary complexity.

The blockchain used in this example will be the [Astar network](https://astar.network/) and the final objective will be to observe which files have been added and deleted from the chain, as well as groups joined and storage orders placed by a determined account.

## Pre-requisites

The minimum requirements to follow this tutorial are the basic knowledge of software development, such as handling a Git repository, a correctly set up [Development Environment](development-environment-set-up.md), basic command line knowledge and the concepts explained in this documentation.

## Fork the template

The first thing to do, although it might sound trivial to GitHub experts, is to fork the repository into your own GitHub account, by visiting the [repository page](https://github.com/subsquid/squid-evm-template) and clicking the Fork button:

![How to fork a repository on GitHub](</img/.gitbook/assets/Screenshot-2022-02-02-111440.png>)

Next, clone the created repository (be careful of changing `<account>` with your own account)

```
git clone git@github.com:<account>/squid-evm-template.git
```

For reference on the complete work, you can find the entire project [here](https://github.com/RaekwonIII/squid-template/tree/crust-integration-demo).

### Run the project

Next, just follow the [Quickstart](../quickstart.mdx) to get the project up and running, here's a list of commands to run in quick succession:

```bash
npm ci
npm run build
docker compose up -d
npx sqd db create
npx sqd db migrate
node -r dotenv/config lib/processor.js
# open a separate terminal for this next command
npx squid-graphql-server
```

Bear in mind this is not strictly **necessary**, but it is always useful to check that everything is in order. If you are not interested, you could at least get the Postgres container running with `docker compose up -d.`

## Define Entity Schema

The next thing to do, in order to customize the project for our own purpose, is to make changes to the schema and define the Entities we want to keep track of.

Luckily, the EVM template already contains a schema that defines the exact entities we need for the purpose of this guide. For this reason, changes are necessary, but it's still useful to explain what is going on.

To index ERC-721 token transfers, we will need to track:

* Token transfers
* Ownership of tokens
* Contracts and their minted tokens

And the `schema.graphql` file defines them like shis:

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
npx sqd codegen
```

## ABI Definition and Wrapper

Subsquid offers support for automatically building TypeScript type-safe interfaces for Substrate data sources (events, extrinsics, storage items). Changes are automatically detected in the runtime.

This functionality has been extended to EVM indexing, with the release of an `evm-typegen` tool to generate TypeScript interfaces and decoding functions for EVM logs.

Once again, the template repository already includes interfaces for ERC-721 contracts, which is the subject of this guide. But it is still important to explain what needs to be done, in case, for example, one wants to index a different type of contract.

First of all, it is necessary to obtain the definition of its Application Binary Interface (ABI). This can be obtained in the form of a JSON file, which will be imported into the project.

1. It is advisable to copy the JSON file in the `src/abis` subfolder.
2. To automatically generate TypeScript interfaces from an ABI definition, and decode event data, simply run this command from the project's root folder

```bash
npx squid-evm-typegen --abi src/abi/ERC721.json --output src/abi/erc721.ts
```

The `abi` parameter points at the JSON file previously created, and the `output` parameter is the name of the file that will be generated by the command itself.

This command will automatically generate a TypeScript file named `erc721.ts`, under the `src/abi` subfolder, that defines data interfaces to represent output of the EVM events defined in the ABI, as well as a mapping of the functions necessary to decode these events (see the `events` dictionary in the aforementione file).

!!! note The ERC-721 ABI defines the signatures of all events in the contract. The `Transfer` event has three arguments, named: `from`, `to`, and `tokenId`. Their types are, respectively, `address`, `address`, and `uint256`. As such, the actual definition of the `Transfer` event looks like this: `Transfer(address, address, uint256)`.

## Define and Bind Event Handler(s)

The Subsquid SDK provides users with a [processor](https://docs.subsquid.io/key-concepts/processor) class, named `SubstrateProcessor` or, in this specific case [`SubstrateEvmProcessor`](https://docs.subsquid.io/reference/evm-processor). The processor connects to the [Subsquid archive](https://docs.subsquid.io/key-concepts/architecture#archive) to get chain data. It will index from the configured starting block, until the configured end block, or until new data is added to the chain.

The processor exposes methods to "attach" functions that will "handle" specific data such as Substrate events, extrinsics, storage items, or EVM logs. These methods can be configured by specifying the event or extrinsic name, or the EVM log contract address, for example. As the processor loops over the data, when it encounters one of the configured event names, it will execute the logic in the "handler" function.

### Managing the EVM contract

It is worth pointing out, at this point, that some important auxiliary code like constants and helper functions to manage the EVM contract is defined in the `src/contracts.ts` file. Here's a summary of what is in it:

* Define the chain node endpoint (optional but useful)
* Create a contract interface to store information such as the address and ABI
* Define functions to fetch a contract entity from the database or create one
* Define the `processTransfer` EVM log handler, implementing logic to track token transfers

In order to adapt the template to the scope of this guide, we need to apply a couple of changes:

1. edit the `CHAIN_NODE` constant to the endpoint URL of Astar network (e.g. `wss://astar.api.onfinality.io/public-ws`)
2. edit the hexadecimal address used to create the `contract` constant (we are going to use [this token](https://blockscout.com/astar/token/0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a/token-transfers) for the purpose of this guide)
3. change the `name`, `symbol` and `totalSupply` values used in the `createContractEntity` function to their correct values (see link in the previous point)

In case someone wants to index an EVM event different from `Transfer`, they would also have to implement a different handler function from `processTransfer`, especially the line where the event `"Transfer(address,address,uint256)"` is decoded.

```typescript
// src/contract.ts
import { assertNotNull, EvmLogHandlerContext, Store } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import { Contract, Owner, Token, Transfer } from "./model";
import { events, abi } from "./abi/erc721"

export const CHAIN_NODE = "wss://astar.api.onfinality.io/public-ws";

export const contract = new ethers.Contract(
  "0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a",
  abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntity(): Contract {
  return new Contract({
    id: contract.address,
    name: "AstarDegens",
    symbol: "DEGEN",
    totalSupply: 10000n,
  });
}

let contractEntity: Contract | undefined;

export async function getContractEntity({
  store,
}: {
  store: Store;
}): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contract.address);
  }
  return assertNotNull(contractEntity);
}


export async function processTransfer(ctx: EvmLogHandlerContext): Promise<void> {
  const transfer =
    events["Transfer(address,address,uint256)"].decode(ctx);

  let from = await ctx.store.get(Owner, transfer.from);
  if (from == null) {
    from = new Owner({ id: transfer.from, balance: 0n });
    await ctx.store.save(from);
  }

  let to = await ctx.store.get(Owner, transfer.to);
  if (to == null) {
    to = new Owner({ id: transfer.to, balance: 0n });
    await ctx.store.save(to);
  }

  let token = await ctx.store.get(Token, transfer.tokenId.toString());
  if (token == null) {
    token = new Token({
      id: transfer.tokenId.toString(),
      uri: await contract.tokenURI(transfer.tokenId),
      contract: await getContractEntity(ctx),
      owner: to,
    });
    await ctx.store.save(token);
  } else {
    token.owner = to;
    await ctx.store.save(token);
  }

  await ctx.store.save(
    new Transfer({
      id: ctx.txHash,
      token,
      from,
      to,
      timestamp: BigInt(ctx.substrate.block.timestamp),
      block: ctx.substrate.block.height,
      transactionHash: ctx.txHash,
    })
  );
}
```

The "handler" function takes in a `Context` of the correct type (`EvmLogHandlerContext`, in this case). The context contains the triggering event and the interface to store data, and is used to extract and process data and save it to the database.

!!! note For the event handler, it is also possible to bind an "arrow function" to the processor.

## Configure Processor and Attach Handler

The `src/processor.ts` file is where the template project instantiates the `SubstrateEvmProcessor` class, configures it for execution, and attaches the handler functions(s).

Luckily for us, most of the job is already done. It is important to note that, since the template was built for the `moonriver` network, there are a couple of things to change:

1. change the `name` argument passed to `SubstrateEvmProcessor` constructor (not necessary, but good practice)
2. Change the `archive` parameter of the `setDataSource` function to fetch the Archive URL for Astar.
3. Change the argument passed to the `setTypesBundle` function to `"astar"`.

Look at this code snippet for the end result:

```typescript
// src/processor.ts
import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import {
  CHAIN_NODE,
  contract,
  createContractEntity,
  processTransfer,
} from "./contract";
import { events } from "./abi/erc721";

const processor = new SubstrateEvmProcessor("astar-substrate");

processor.setBatchSize(500);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("astar")[0].url,
});

processor.setTypesBundle("astar");

processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
  await ctx.store.save(createContractEntity());
});

processor.addEvmLogHandler(
  contract.address,
  {
    filter: [events["Transfer(address,address,uint256)"].topic],
  },
  processTransfer
);

processor.run();
```

!!! note The `lookupArchive` function is used to consult the [archive registry](https://github.com/subsquid/archive-registry){target=\_blank} and yield the archive address, given a network name. Network names should be in lowercase.

## Launch and Set Up the Database

When running the project locally, as it is the case for this guide, it is possible to use the `docker-compose.yml` file that comes with the template to launch a PostgreSQL container. To do so, run the following command in your terminal:

```bash
docker-compose up -d
```

![Launch database container](https://i.gyazo.com/907ef55371e1cdb1839d2fe7ff108ee7.gif)

!!! note The `-d` parameter is optional, it launches the container in `daemon` mode so the terminal will not be blocked and no further output will be visible.

Squid projects automatically manage the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping).

To set up the database, you can take the following steps:

1.  Build the code

    ```bash
    npm run build
    ```
2.  Remove the template's default migration:

    ```bash
    rm -rf db/migrations/*.js
    ```
3.  Make sure the Postgres Docker container, `squid-evm-template_db_1`, is running

    ```bash
    docker ps -a
    ```
4.  Drop the current database (if you have never run the project before, this is not necessary), create a new database, create the initial migration, and apply the migration

    ```bash
    npx sqd db drop
    npx sqd db create
    npx sqd db create-migration Init
    npx sqd db migrate
    ```

## Launch the Project

To launch the processor (this will block the current terminal), you can run the following command:

```bash
node -r dotenv/config lib/processor.js
```

![Launch processor](https://i.gyazo.com/66ab9c1fef9203d3e24b6e274bba47e3.gif)

Finally, in a separate terminal window, launch the GraphQL server:

```bash
npx squid-graphql-server
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql) to access the [GraphiQl](https://github.com/graphql/graphiql) console. From this window, you can perform queries such as this one, to find out the account owners with the biggest balances:

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
