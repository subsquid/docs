---
id: create-a-wasm-processing-squid
title: ink! contract indexing
description: >-
  Build a squid indexing an ink! smart contract
sidebar_position: 60
---
# ink! contract indexing

## Objective

This tutorial starts with the [`substrate` squid template](https://github.com/subsquid-labs/squid-wasm-template) and goes through all the necessary changes to index the events of a WASM contract developed with [ink!](https://www.parity.io/blog/ink-3-0-paritys-rust-based-language-gets-a-major-update). This approach is taken to illustrate the development process. If you want to start indexing ASAP, consider using the WASM/ink! [squid generation tool](/basics/squid-gen/) or starting with the [`ink` template](https://github.com/subsquid/squid-wasm-template) that contains the final code of this tutorial:
```bash
sqd init <your squid name here> --template ink
```

Here we will use a simple test ERC20-type token contract deployed to [Shibuya](https://shibuya.subscan.io/) at `XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w`. Our squid will track all the token holders and account balances, together with the historical token transfers.

:::info
Subsquid SDK only supports WASM contracts executed by the [Contracts pallet](https://crates.parity.io/pallet_contracts/index.html) natively. The pallet is enabled by the following network runtimes:
- `Astar` (a `Polkadot` parachain)
- `Shibuya` (`Astar` testnet)
- `Shiden` (`Kusama`-cousin of `Astar`)
- `AlephZero` (a standalone Substrate-based chain)
:::

:::info
This tutorial uses custom scripts defined in `commands.json`. The scripts are automatically picked up as `sqd` sub-commands.
:::

## Pre-requisites

- Familiarity with Git
- A properly set up [development environment](/tutorials/development-environment-set-up) consisting of Node.js and Docker
- [Squid CLI](/squid-cli/installation)

## Run the template

Retrieve the `substrate` template with `sqd init`: 
```bash
sqd init ink-tutorial --template substrate
cd ink-tutorial
```
and run it:

```bash
npm ci
sqd build
sqd up
sqd process # should begin to ingest blocks

# open a separate terminal for this next command
sqd serve # should begin listening on port 4350
```
After this test, shut down both processes with Ctrl-C and proceed.

## Define the data schema

The next step is to define the target data entities and their relations at `schema.graphql`, then use that file to autogenerate TypeORM entity classes.

We track:

* Wallet balances
* Token transfers

Our [schema definition](/basics/schema-file) for modelling this data is straightforward:

```graphql
# schema.graphql

type Owner @entity {
  id: ID!
  balance: BigInt! @index
}
 
type Transfer @entity {
  id: ID!
  from: Owner
  to: Owner
  amount: BigInt! @index
  timestamp: DateTime! @index
  block: Int!
}
 
```
Note:
* a one-to-many [relation](/basics/schema-file/entity-relations) between `Owner` and `Transfer`;
* `@index` decorators for properties that we want to be able to filter the data by.

Next, we generate `TypeORM` entity classes from the schema with the `squid-typeorm-codegen` tool. There is a handy `sqd` script for that:

```bash
sqd codegen
```
The generated entity classes can be found under `src/model/generated`.

Finally, we create [database migrations](/basics/db-migrations) to match the changed schema. We restore the database to a clean state, then replace any existing migrations with the new one:
```bash
sqd down
sqd up
sqd migrations:generate
```

## WASM ABI Tools

The `Contracts` pallet stores the contract execution logs (calls and events) in a binary format. The decoding of this data is contract-specific and is done with the help of an ABI file typically published by the contract developer. For our contract the data can be found [here](https://raw.githubusercontent.com/subsquid-labs/squid-wasm-template/master/abi/erc20.json).

Download that file to the `abi` folder and install the following two tools from Subsquid SDK:

- `@subsquid/ink-abi` -- A performant library for decoding binary ink! contract data.
- `@subsquid/ink-typegen` -- A tool for making TypeScript modules for handling contract event and call data based on ABIs of contracts.

```bash
npm i @subsquid/ink-abi && npm i @subsquid/ink-typegen --save-dev
```
Since `@subsquid/ink-typegen` is only used to generate source files, we install it as a dev dependency.

Generate the contract data handling module by running
```bash
npx squid-ink-typegen --abi abi/erc20.json --output src/abi/erc20.ts
```
The generated `src/abi/erc20.ts` module defines interfaces to represent WASM data defined in the ABI, as well as functions necessary to decode this data (e.g. the `decodeEvent` function).

## Define and Bind the Batch Handler

Subsquid SDK provides users with the [`SubstrateBatchProcessor` class](/substrate-indexing). Its instances connect to chain-specific [Subsquid archives](/archives/overview) to get chain data and apply custom transformations. The indexing begins at the starting block and keeps up with new blocks after reaching the tip.

`SubstrateBatchProcessor`s [exposes methods](/substrate-indexing/configuration) to "subscribe" them to specific data such as Substrate events, extrinsics, storage items etc. The `Contracts` pallet emits `ContractEmitted` events wrapping the logs emitted by the WASM contracts. Processor allows one to subscribe for such events emitted by a specific contract. The events can then be processed by calling the `.run()` function that starts generating requests to the Archive for [*batches*](/basics/batch-processing) of data.

Every time a batch is returned by the Archive, it will trigger the callback function, or *batch handler* (passed to `.run()` as second argument). It is in this callback function that all the mapping logic is expressed. This is where chain data decoding should be implemented, and where the code to save processed data on the database should be defined.

The processor is instantiated and configured at the `src/processor.ts`. We need to make fundamental changes to the logic expressed in this code, starting from the configuration of the processor:

* We need to change the archive used to `shibuya`.
* We need to remove the `addEvent` function call, and add `addContractsContractEmitted` instead, specifying the address of the contract we are interested in. The address should be represented as a hex string, so we need to decode our ss58 address of interest, `XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w`.
* The logic defined in the `processor.run()` and below it has to be replaced.

Here is the end result:

```typescript
// src/processor.ts
import { lookupArchive } from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import {toHex} from "@subsquid/util-internal-hex"
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor} from "@subsquid/substrate-processor"
import {Store, TypeormDatabase} from "@subsquid/typeorm-store"
import {In} from "typeorm"
import * as erc20 from "./abi/erc20"
import {Owner, Transfer} from "./model"
 
const CONTRACT_ADDRESS_SS58 = 'XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w'
const CONTRACT_ADDRESS = toHex(ss58.decode(CONTRACT_ADDRESS_SS58).bytes)
const SS58_PREFIX = ss58.decode(CONTRACT_ADDRESS_SS58).prefix

const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive("shibuya")
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
                        from: event.from && ss58.codec(SS58_PREFIX).encode(event.from),
                        to: event.to && ss58.codec(SS58_PREFIX).encode(event.to),
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

The `extractTransferRecords` function generates a list of `TransferRecord` objects that contain the data we need to fill the models we have defined with our schema. This data is extracted from the events found in the `BatchContext`. It is then used in the main body of the _batch handler_, the arrow function used as the second argument of the `.run()` function call to fetch or create the `Owner`s on the database and create a `Transfer` instance for every event found in the context.

All of this data is then saved on the database at the very end of the function, all in one go. This is done to reduce the number of database queries.

:::info
As you can see in the `extractTransferRecords` function, we loop over the blocks we have been given in the `BatchContext` and loop over the items contained in them. The `if` checks are redundant when there's only one data type to process but will be needed when the processor is subscribed to multiple ones. In that case `block.items` will contain a mix of different event and extrinsic data that will need to be sorted.
:::

## Launch the Project

To launch the processor (this will block the current terminal), you can run the following command:

```bash
sqd process
```
[comment]: # (Launch processor https://i.gyazo.com/66ab9c1fef9203d3e24b6e274bba47e3.gif)

Finally, in a separate terminal window, launch the GraphQL server:

```bash
sqd serve
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

Or this other one, looking up the largest transfers:

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

Have fun playing around with queries, after all, it's a _playground_!
