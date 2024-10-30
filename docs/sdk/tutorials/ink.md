---
title: ink! contract indexing
description: >-
  Build a squid indexing an ink! smart contract
sidebar_position: 50
---

# ink! contract indexing

## Objective

This tutorial starts with the [`substrate` squid template](https://github.com/subsquid-labs/squid-substrate-template) and goes through all the necessary changes to index the events of a WASM contract developed with [ink!](https://www.parity.io/blog/ink-3-0-paritys-rust-based-language-gets-a-major-update). This approach is taken to illustrate the development process. If you want to start indexing ASAP, consider starting with the [`ink` template](https://github.com/subsquid/squid-wasm-template) that contains the final code of this tutorial:
```bash
sqd init <your squid name here> --template ink
```
[//]: # (!!! or using the WASM/ink! squid generation tool/basics/squid-gen/.)

Here we will use a simple test ERC20-type token contract deployed to [Shibuya](https://shibuya.subscan.io/) at `XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w`. Our squid will track all the token holders and account balances, together with the historical token transfers.

:::info
Squid SDK only supports WASM contracts executed by the [Contracts pallet](https://crates.parity.io/pallet_contracts/index.html) natively. The pallet is enabled by the following network runtimes:
- `Astar` (a `Polkadot` parachain)
- `Shibuya` (`Astar` testnet)
- `Shiden` (`Kusama`-cousin of `Astar`)
- `AlephZero` (a standalone Substrate-based chain)
:::

## Pre-requisites

- Familiarity with Git
- A properly set up [development environment](/sdk/how-to-start/development-environment-set-up) consisting of Node.js, Git and Docker
- [Squid CLI](/squid-cli/installation)

## Run the template

Retrieve the `substrate` template with `sqd init`: 
```bash
sqd init ink-tutorial --template substrate
cd ink-tutorial
```
and run it:

```bash
npm i
npm run build
docker compose up -d
npx squid-typeorm-migration apply

node -r dotenv/config lib/main.js # should begin to ingest blocks

# open a separate terminal for this next command
npx squid-graphql-server # should begin listening on port 4350
```
After this test, shut down both processes with Ctrl-C and proceed.

## Define the data schema

The next step is to define the target data entities and their relations at `schema.graphql`, then use that file to autogenerate TypeORM entity classes.

We track:

* Wallet balances
* Token transfers

Our [schema definition](/sdk/reference/schema-file) for modelling this data is straightforward:

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
* a one-to-many [relation](/sdk/reference/schema-file/entity-relations) between `Owner` and `Transfer`;
* `@index` decorators for properties that we want to be able to filter the data by.

Next, we generate `TypeORM` entity classes from the schema with the `squid-typeorm-codegen` tool:
```bash
npx squid-typeorm-codegen
```
The generated entity classes can be found under `src/model/generated`.

Finally, we create [database migrations](/sdk/resources/persisting-data/typeorm) to match the changed schema. We restore the database to a clean state, then replace any existing migrations with the new one:
```bash
docker compose down
docker compose up -d
rm -r db/migrations
npx squid-typeorm-migration generate
```
Apply the migration with
```bash
npx squid-typeorm-migration apply
```

## WASM ABI Tools

The `Contracts` pallet stores the contract execution logs (calls and events) in a binary format. The decoding of this data is contract-specific and is done with the help of an ABI file typically published by the contract developer. ABI for ERC20 contracts like the one we're indexing can be found [here](https://raw.githubusercontent.com/subsquid-labs/squid-wasm-template/master/abi/erc20.json).

Download that file to the `abi` folder and install the following two tools from Squid SDK:

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

## Define the processor object

Squid SDK provides users with the [`SubstrateBatchProcessor` class](/sdk). Its instances connect to [SQD Network](/subsquid-network/overview) gateways at chain-specific URLs to get chain data and apply custom transformations. The indexing begins at the starting block and keeps up with new blocks after reaching the tip.

`SubstrateBatchProcessor`s [exposes methods](/sdk/reference/processors/substrate-batch) to "subscribe" them to specific data such as Substrate events, extrinsics, storage items etc. The `Contracts` pallet emits `ContractEmitted` events wrapping the logs emitted by the WASM contracts. Processor [allows one](/sdk/resources/substrate/ink) to subscribe to such events emitted by a specific contract.

The processor is instantiated and configured at the `src/processor.ts`. Here are the changes we need to make there:

* Change the gateway used to `https://v2.archive.subsquid.io/network/shibuya-substrate`.
* Remove the `addEvent` function call, and add `addContractsContractEmitted` instead, specifying the address of the contract we are interested in. The address should be represented as a hex string, so we need to decode our ss58 address of interest, `XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w`.

Here is the end result:

```ts title="src/processor.ts"
import {assertNotNull} from '@subsquid/util-internal'
import {toHex} from '@subsquid/util-internal-hex'
import * as ss58 from '@subsquid/ss58'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'

export const SS58_NETWORK = 'astar' // used for the ss58 prefix, astar shares it with shibuya

const CONTRACT_ADDRESS_SS58 = 'XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w'
export const CONTRACT_ADDRESS = ss58.codec(SS58_NETWORK).decode(CONTRACT_ADDRESS_SS58)

export const processor = new SubstrateBatchProcessor()
    .setGateway('https://v2.archive.subsquid.io/network/shibuya-substrate')
    .setRpcEndpoint({
        url: assertNotNull(process.env.RPC_ENDPOINT),
        rateLimit: 10
    })
    .addContractsContractEmitted({
        contractAddress: [CONTRACT_ADDRESS],
        extrinsic: true
    })
    .setFields({
        block: {
            timestamp: true
        },
        extrinsic: {
            hash: true
        }
    })
    .setBlockRange({
        // genesis block happens to not have a timestamp, so it's easier
        // to start from 1 in cases when the deployment height is unknown
        from: 1
    })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
```

## Define the batch handler

Once requested, the events can be processed by calling the `.run()` function that starts generating requests to SQD Network for [*batches*](/sdk/resources/batch-processing) of data.

Every time a batch is returned by the Network, it will trigger the callback function, or *batch handler* (passed to `.run()` as second argument). It is in this callback function that all the mapping logic is expressed. This is where chain data decoding should be implemented, and where the code to save processed data on the database should be defined.

Batch handler is typically defined at the squid processor entry point, `src/main.ts`. Here is one that works for our task:

```ts title="src/main.ts"
import {In} from 'typeorm'
import assert from 'assert'

import * as ss58 from '@subsquid/ss58'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'

import * as erc20 from './abi/erc20'
import {Owner, Transfer} from "./model"
import {
    processor,
    SS58_NETWORK,
    CONTRACT_ADDRESS,
    ProcessorContext
} from './processor'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async ctx => {
    const txs: TransferRecord[] = getTransferRecords(ctx)

    const owners: Map<string, Owner> = await createOwners(ctx, txs)
    const transfers: Transfer[] = createTransfers(txs, owners)

    await ctx.store.upsert([...owners.values()])
    await ctx.store.insert(transfers)
})

interface TransferRecord {
    id: string
    from?: string
    to?: string
    amount: bigint
    block: number
    timestamp: Date
    extrinsicHash: string
}

function getTransferRecords(ctx: ProcessorContext<Store>): TransferRecord[] {
    const records: TransferRecord[] = []
    for (const block of ctx.blocks) {
        assert(block.header.timestamp, `Block ${block.header.height} had no timestamp`)
        for (const event of block.events) {
            if (event.name === 'Contracts.ContractEmitted' && event.args.contract === CONTRACT_ADDRESS) {
                assert(event.extrinsic, `Event ${event} arrived without a parent extrinsic`)
                const decodedEvent = erc20.decodeEvent(event.args.data)
                if (decodedEvent.__kind === 'Transfer') {
                    records.push({
                        id: event.id,
                        from: decodedEvent.from && ss58.codec(SS58_NETWORK).encode(decodedEvent.from),
                        to: decodedEvent.to && ss58.codec(SS58_NETWORK).encode(decodedEvent.to),
                        amount: decodedEvent.value,
                        block: block.header.height,
                        timestamp: new Date(block.header.timestamp),
                        extrinsicHash: event.extrinsic.hash
                    })
                }
            }
        }
    }
    return records
}

async function createOwners(ctx: ProcessorContext<Store>, txs: TransferRecord[]): Promise<Map<string, Owner>> {
    const ownerIds = new Set<string>()
    txs.forEach(tx => {
        if (tx.from) {
            ownerIds.add(tx.from)
        }
        if (tx.to) {
            ownerIds.add(tx.to)
        }
    })

    const ownersMap = await ctx.store.findBy(Owner, {
        id: In([...ownerIds])
    }).then(owners => {
        return new Map(owners.map(owner => [owner.id, owner]))
    })

    return ownersMap
}


function createTransfers(txs: TransferRecord[], owners: Map<string, Owner>): Transfer[] {
    return txs.map(tx => {
        const transfer = new Transfer({
            id: tx.id,
            amount: tx.amount,
            block: tx.block,
            timestamp: tx.timestamp,
            extrinsicHash: tx.extrinsicHash
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
}
```

The `getTransferRecords` function generates a list of `TransferRecord` objects that contain the data we need to fill the models we have defined with our schema. This data is extracted from the events found in the batch context, `ctx`. We use the in the main body of the batch handler, the arrow function used as the second argument of the `.run()` function call, to fetch or create `Owner` instance and create a `Transfer` instance for every event found in the context.

Finally, these [TypeORM entity](/sdk/reference/schema-file/entities) instances are saved to the database, all in one go. This is done to reduce the number of database queries.

:::info
In the `getTransferRecords` function we loop over the blocks and over the events contained in them, then filter the events with an `if`. The filtering is redundant when there's only one event type to process but will be needed when the processor is subscribed to multiple ones.
:::

## Launch the Project

Build, then launch the processor with
```bash
npm run build
```
```bash
node -r dotenv/config lib/main.js
```
This will block the current terminal. In a separate terminal window, launch the GraphQL server:

```bash
npx squid-graphql-server
```

Visit [`localhost:4350/graphql`](http://localhost:4350/graphql) to access the [GraphiQl](https://github.com/graphql/graphiql) console. There you can perform queries such as this one, to find out the account owners with the biggest balances:

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
