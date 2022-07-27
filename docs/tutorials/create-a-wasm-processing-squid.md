# Create a WASM-processing Squid

## Objective

This tutorial will take the Squid template and go through all the necessary steps to customize the project, in order to interact with a different Squid Archive, synchronized with a different blockchain, and process data from a sample WASM smart contract (an ERC20 contract, written in Rust, with [Parity's own Ink! framework](https://www.parity.io/blog/ink-3-0-paritys-rust-based-language-gets-a-major-update)).

The business logic to process these contract is basic, and that is on purpose since the Tutorial aims show a simple case, highlighting the changes a developer would typically apply to the template, removing unnecessary complexity.

The blockchain used in this example will be the Sibuya network, which is the testnet for [Astar network](https://astar.network/) and the final objective will be to show who owns the token issued with the smart contract and every time they have been transfered.

## Pre-requisites

The minimum requirements to follow this tutorial are the basic knowledge of software development, such as handling a Git repository, a correctly set up [Development Environment](development-environment-set-up.md), basic command line knowledge and the concepts explained in this documentation.

## Fork the template

The first thing to do, although it might sound trivial to GitHub experts, is to fork the repository into your own GitHub account, by visiting the [repository page](https://github.com/subsquid/squid-template) and clicking the _Use this template_ button:

![How to fork a repository on GitHub](</img/.gitbook/assets/Screenshot-2022-02-02-111440.png>)

Next, clone the created repository (be careful of changing `<account>` with your own account)

```bash
git clone git@github.com:<account>/squid-template.git
```

The final result of this tutorial is actually available as a [repository](https://github.com/subsquid/squid-wasm-template) and it's the new template for WASM projects.

### Run the project

Next, just follow the [Quickstart](/docs/quickstart) to get the project up and running, here's a list of commands to run in quick succession:

```bash
npm ci
npm run build
docker compose up -d
npx squid-typeorm-migration apply
node -r dotenv/config lib/processor.js
# open a separate terminal for this next command
npx squid-graphql-server
```

Bear in mind this is not strictly **necessary**, but it is always useful to check that everything is in order. If you are not interested, you could at least get the Postgres container running with `docker compose up -d.`

## Install new dependencies

On top of adding WASM compatibility to our Processor, Subsquid has developed two new libraries that are helpful when it comes to dealing with a WASM smart contract and it's metadata. We need to install them by running this command:

```bash
npm i @subsquid/ink-abi && npm i @subsquid/ink-typegen --save-dev
```

This has been split into two commands, because it is preferrable to install the second library, `@subsquid/ink-typegen`, as a development dependency.

## Define Entity Schema

The next thing to do, in order to customize the project for our own purpose, is to make changes to the schema and define the Entities we want to keep track of.

The logic in this tutorial is very simple, so the schema will be simple as well: we only want to save ownership and transfer of ERC-20 tokens of a dummy contract.

To index ERC-20 token transfers, we will need to track:

* Ownership of tokens
* Token transfers

And the `schema.graphql` file defines them like shis:

```graphql
type Owner @entity {
  id: ID!
  balance: BigInt!
}
 
type Transfer @entity {
  id: ID!
  from: Owner
  to: Owner
  amount: BigInt!
  timestamp: DateTime!
  block: Int!
}
 
```

It's worth noting a couple of things in this [schema definition](https://docs.subsquid.io/reference/openreader-schema):

* **`@entity`** - signals that this type will be translated into an ORM model that is going to be persisted in the database
* **type references** (i.e. `from: Owner`) - establishes a relation between two entities

Whenever changes are made to the schema, new TypeScript entity classes have to be generated, and to do that you'll have to run the `codegen` tool:

```bash
npx squid-typeorm-codegen
```

And TypeScript classes for the schema definition will be automatically generated. They can be found under `src/model/generated`.

## ABI Definition and Wrapper

Subsquid offers support for automatically building TypeScript type-safe interfaces for Substrate data sources (events, extrinsics, storage items). Changes are automatically detected in the runtime.

This functionality has been extended to EVM indexing, and with the with the release of the `ink-typegen` tool, it is now possible to generate TypeScript interfaces and decoding functions for WASM contract logs as well.

First of all, it is necessary to obtain the definition of the smart contract's Application Binary Interface (ABI), or its metadata. This can be obtained in the form of a JSON file, which will be imported into the project.

1. The metadata for the contract used in this tutorial can be found [here](https://raw.githubusercontent.com/subsquid/squid/42d07b0d01b02ada4b28f057ada3b05aa762a170/test/shibuya-erc20/metadata.json)
2. It is advisable to copy the JSON file in the `src/abi` subfolder.
3. To automatically generate TypeScript interfaces from an ABI definition, and decode event data, simply run this command from the project's root folder

```bash
npx squid-ink-typegen --abi src/abi/erc20.json --output src/abi/erc20.ts
```

The `abi` parameter points at the JSON file previously created, and the `output` parameter is the name of the file that will be generated by the command itself.

This command will automatically generate a TypeScript file named `erc20.ts`, under the `src/abi` subfolder, that defines data interfaces to represent output of the WASM events defined in the ABI, as well as functions necessary to decode these events (for example, see the `decodeEvent` function in the aforementione file).

## Define and Bind Event Handler(s)

The Subsquid SDK provides users with a [processor](../develop-a-squid/squid-processor.md) class, named `SubstrateProcessor` or, in this specific case [`SubstrateBatchProcessor`](../develop-a-squid/batch-processing.md). The processor connects to the [Subsquid archive](../overview/architecture.md) to get chain data. It will index from the configured starting block, until the configured end block, or until new data is added to the chain.

The `SubstrateBatchProcessor` class exploses functions to configure it to request the Archive for specific data such as Substrate events, extrinsics, storage items, EVM logs or in the case of this tutorial `ContractEmitted` events, signaling that a function on the WASM contract has been triggere. These methods can be used to specify the event or extrinsic name, the EVM log or WASM contract address, for example.

The processor will then query the Archive for this data and it then the developer must develop an asynchronous function and pass it as an argument to the `processor.run()` function call, in order to process the result of these requests.

## Configure Processor and Attach Handler

The `src/processor.ts` file is where the template project instantiates the `SubstrateBatchProcessor` class, configures it for execution, and attaches the handler functions. We need to make fundamental changes to the logic expressed in this code, starting from the configuration of the processor:

* we need to change the archive used to `shibuya`
* we need to remove the `addEvent` function call, and add `addContractsContractEmitted` instead, specifying the address of the contract we are interested in
* all of the logic defined in the `processor.run()` and below it, including the interfaces has to be replaced, as we no longer deal with Kusama balances transfers

For the purpose of this tutorial, we are considering a contract with the address `0x5207202c27b646ceeb294ce516d4334edafbd771f869215cb070ba51dd7e2c72` that our team has deployed on the `Shibuya` network (Astar network's testnet).

Look at this code snippet for the end result:

```typescript
// src/processor.ts
import { lookupArchive } from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor} from "@subsquid/substrate-processor"
import {Store, TypeormDatabase} from "@subsquid/typeorm-store"
import {In} from "typeorm"
import * as erc20 from "./erc20"
import {Owner, Transfer} from "./model"
 
 
const CONTRACT_ADDRESS = '0x5207202c27b646ceeb294ce516d4334edafbd771f869215cb070ba51dd7e2c72'
 
 
const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive("shibuya", { release: "FireSquid" })
    })
    .addContractsContractEmitted(CONTRACT_ADDRESS, {
        data: {
            event: {args: true}
        }
    } as const)
 
 
type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>
 
 
processor.run(new TypeormDatabase(), async ctx => {
    let txs = extractTransferRecords(ctx)
 
    let ownerIds = new Set<string>()
    txs.forEach(tx => {
        if (tx.from) {
            ownerIds.add(tx.from)
        }
        if (tx.to) {
            ownerIds.add(tx.to)
        }
    })
 
    let owners = await ctx.store.findBy(Owner, {
        id: In([...ownerIds])
    }).then(owners => {
        return new Map(owners.map(o => [o.id, o]))
    })
 
    let transfers = txs.map(tx => {
        let transfer = new Transfer({
            id: tx.id,
            amount: tx.amount,
            block: tx.block,
            timestamp: tx.timestamp
        })
 
        if (tx.from) {
            transfer.from = owners.get(tx.from)
            if (transfer.from == null) {
                transfer.from = new Owner({id: tx.from, balance: 0n})
                owners.set(tx.from, transfer.from)
            }
            transfer.from.balance -= tx.amount
        }
 
        if (tx.to) {
            transfer.to = owners.get(tx.to)
            if (transfer.to == null) {
                transfer.to = new Owner({id: tx.to, balance: 0n})
                owners.set(tx.to, transfer.to)
            }
            transfer.to.balance += tx.amount
        }
 
        return transfer
    })
 
    await ctx.store.save([...owners.values()])
    await ctx.store.insert(transfers)
})
 
 
interface TransferRecord {
    id: string
    from?: string
    to?: string
    amount: bigint
    block: number
    timestamp: Date
}
 
 
function extractTransferRecords(ctx: Ctx): TransferRecord[] {
    let records: TransferRecord[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name == 'Contracts.ContractEmitted' && item.event.args.contract == CONTRACT_ADDRESS) {
                let event = erc20.decodeEvent(item.event.args.data)
                if (event.__kind == 'Transfer') {
                    records.push({
                        id: item.event.id,
                        from: event.from && ss58.codec(5).encode(event.from),
                        to: event.to && ss58.codec(5).encode(event.to),
                        amount: event.value,
                        block: block.header.height,
                        timestamp: new Date(block.header.timestamp)
                    })
                }
            }
        }
    }
    return records
}


```

The `extractTransferRecords` function generates a list of `TransferRecord` interfaces, containing the data we need to fill the models we have defined with our schema. This data is extracted from the events found in the `BatchContext` and it is then used in the main body of the _arrow function_  used as an argument of the `.run()` function call to fetch or create the `Owner`s on the database and create a `Transfer` instance for every event found in the context.

All of this data is then saved on the database at the very end of the function, all in one go. This is to increase the performance, by reducing the I/O towards the databse.

:::info
As you can see in the `extractTransferRecords` function, we loop over the blocks we have been given in the `BatchContext` and loop over the items contained in them. The `if` checks that follow might look redundant, but they are used to showcase what should be done, in case of multiple types of events, multiple contracts, or how to filter for a specific function call (`Transfer` in this case).
:::

## Launch and Set Up the Database

When running the project locally, as it is the case for this guide, it is possible to use the `docker-compose.yml` file that comes with the template to launch a PostgreSQL container. To do so, run the following command in your terminal:

```bash
docker-compose up -d
```

![Launch database container](https://i.gyazo.com/907ef55371e1cdb1839d2fe7ff108ee7.gif)

!!! note The `-d` parameter is optional, it launches the container in `daemon` mode so the terminal will not be blocked and no further output will be visible.

Squid projects automatically manage the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping).

To set up the database, you can take the following steps:

1. Build the code

    ```bash
    npm run build
    ```

2. Remove the template's default migration:

    ```bash
    rm -rf db/migrations/*.js
    ```

3. Make sure the Postgres Docker container, `squid-template_db_1`, is running

    ```bash
    docker ps -a
    ```

4. Generate a new migration from our modified schema

   ```bash
   npx squid-typeorm-migration generate
   ```

5. Apply the migration so tables are created on the database

    ```bash
    npx squid-typeorm-migration apply
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
  transfersConnection(orderBy: id_ASC) {
    totalCount
  }
}
```

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
  transfers(limit: 10, orderBy: amount_DESC) {
    amount
    block
    id
    timestamp
    to {
      balance
      id
    }
    from {
      balance
      id
    }
  }
}

```

Have some fun playing around with queries, after all, it's a _playground_!
