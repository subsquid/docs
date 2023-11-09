---
id: create-an-evm-processing-squid
title: Frontier EVM-indexing squid
description: >-
  Build a squid indexing NFTs on Astar
sidebar_position: 60
---

# Frontier EVM-indexing Squid

## Objective

The goal of this tutorial is to guide you through creating a simple blockchain indexer ("squid") using Squid SDK. The squid will be indexing the data from two contracts ([AstarDegens](https://blockscout.com/astar/address/0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a) and [AstarCats](https://blockscout.com/astar/address/0x8b5d62f396Ca3C6cF19803234685e693733f9779)) deployed on the [Astar network](https://astar.network/). The objective will be to track ownership and transfers of all NFTs issued by these contracts.

A somewhat outdated version of the final result can be browsed [here](https://github.com/subsquid/squid-astar-example/tree/astar-degens).

## Pre-requisites

- Familiarity with Git 
- A properly set up [development environment](/tutorials/development-environment-set-up) consisting of Node.js, Git and Docker
- [Squid CLI](/squid-cli/installation)

:::info
This tutorial uses custom scripts defined in `commands.json`. The scripts are automatically picked up as `sqd` sub-commands.
:::

## Scaffold using `sqd init`

We will start with the [`frontier-evm` squid template](https://github.com/subsquid-labs/squid-frontier-evm-template/) available through [`sqd init`](/squid-cli/init). It is built to index EVM smart contracts deployed on Astar/Shiden, but it is also capable of indexing Substrate events. To retrieve the template and install the dependencies, run

```bash
sqd init astar-evm-tutorial --template frontier-evm
cd astar-tutorial
npm ci
```

## Define Entity Schema

Next, we ensure that the data [schema](/store/postgres/schema-file) of the squid defines [entities](/store/postgres/schema-file/entities) that we would like to track. We are interested in:

* Token transfers
* Ownership of tokens
* Contracts and their minted tokens

Here is a schema that defines the exact entities we need:

```graphql title="schema.graphql"
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
  timestamp: Int!
  block: Int!
}
```

It's worth noting a couple of things in this [schema definition](/store/postgres/schema-file):

* **`@entity`**: Signals that this type will be translated into an ORM model that is going to be persisted in the database.
* **`@derivedFrom`**: Signals that the field will not be persisted in the database. Instead, it will be [derived from](/store/postgres/schema-file/entity-relations) the entity relations.
* **type references** (e.g. `from: Owner`): When used on entity types, they establish a relation between two entities.

TypeScript entity classes have to be regenerated whenever the schema is changed, and to do that we use the `squid-typeorm-codegen` tool. The pre-packaged `commands.json` already comes with a `codegen` shortcut, so we can invoke it with `sqd`:

```bash
sqd codegen
```
The (re)generated entity classes can then be browsed at `src/model/generated`.

## ABI Definition and Wrapper

Subsquid maintains [tools](/evm-indexing/squid-evm-typegen) for automated generation of TypeScript classes for handling EVM logs and transactions based on a [JSON ABI](https://docs.ethers.io/v5/api/utils/abi/) of the contract.

For our squid we will need such a module for the [ERC-721](https://eips.ethereum.org/EIPS/eip-721)-compliant part of the contracts' interfaces. Once again, the template repository already includes it, but it is still important to explain what needs to be done in case one wants to index a different type of contract.

The procedure uses an `sqd` script from the template that uses `squid-evm-typegen` to generate Typescript facades for JSON ABIs stored in the `abi` folder. Place any ABIs you requre for interfacing your contracts there and run
```bash
sqd typegen
```
The results will be stored at `src/abi`. One module will be generated for each ABI file, and it will include constants useful for filtering and functions for decoding EVM events and functions defined in the ABI.

## Processor object and the batch handler

Subsquid SDK provides users with the [`SubstrateBatchProcessor` class](/substrate-indexing). Its instances connect to chain-specific [Subsquid archives](/archives/overview) to get chain data and apply custom transformations. The indexing begins at the starting block and keeps up with new blocks after reaching the tip.

`SubstrateBatchProcessor`s [expose methods](/substrate-indexing/setup) that "subscribe" them to specific data such as Substrate events and calls. There are also [specialized methods](/substrate-indexing/specialized/evm) for subscribing to EVM logs and transactions by address. The actual data processing is then started by calling the `.run()` function. This will start generating requests to the Archive for [*batches*](/basics/batch-processing) of data specified in the configuration, and will trigger the callback function, or *batch handler* (passed to `.run()` as second argument) every time a batch is returned by the Archive.

It is in this callback function that all the mapping logic is expressed. This is where chain data decoding should be implemented, and where the code to save processed data on the database should be defined.

### Managing the EVM contract

Before we begin defining the mapping logic of the squid, we are going to write a `src/contracts.ts` utility module for managing the involved EVM contracts. It will export:

* Addresses of [astarDegens](https://blockscout.com/astar/address/0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a) and [astarCats](https://blockscout.com/astar/address/0x8b5d62f396Ca3C6cF19803234685e693733f9779) contracts.
* A `Map` from the contract addresses to hardcoded `Contract` [entity](/store/postgres/schema-file/entities) instances.

Here are the full file contents:

```ts title="src/contracts.ts"
import { Store } from '@subsquid/typeorm-store'
import { Contract } from './model'

export const astarDegensAddress = '0xd59fC6Bfd9732AB19b03664a45dC29B8421BDA9a'.toLowerCase();
export const astarCatsAddress = '0x8b5d62f396Ca3C6cF19803234685e693733f9779'.toLowerCase();

export const contractMapping: Map<string, Contract> = new Map()

contractMapping.set(astarDegensAddress, new Contract({
  id: astarDegensAddress,
  name: 'AstarDegens',
  symbol: 'DEGEN',
  totalSupply: 10000n,
  mintedTokens: []
}))

contractMapping.set(astarCatsAddress, new Contract({
  id: astarCatsAddress,
  name: 'AstarCats',
  symbol: 'CAT',
  totalSupply: 7777n,
  mintedTokens: []
})
```

## Create the processor object

The `src/processor.ts` file is where squids instantiate and configure their processor objects. We will use an instance of [`SubstrateBatchProcessor`](/substrate-indexing).

We adapt the template code to handle two contracts instead of one and point the processor data source setting to the `astar` archive URL retrieved from the [archive registry](https://github.com/subsquid/archive-registry). Here is the end result:

```ts title="src/processor.ts"
import {assertNotNull} from '@subsquid/util-internal'
import {lookupArchive} from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'
import * as erc721 from './abi/erc721'

import {astarDegensAddress, astarCatsAddress} from './contracts'

const processor = new SubstrateBatchProcessor()
  .setBlockRange({ from: 442693 })
  .setDataSource({
    archive: lookupArchive('astar', {type: 'Substrate', release: 'ArrowSquid'}),
    chain: {
      url: assertNotNull(process.env.RPC_ENDPOINT),
      rateLimit: 10,
    }
  })
  .addEvmLog({
    address: [astarDegensAddress],
    range: { from: 442693 },
    topic0: [erc721.events.Transfer.topic]
  })
  .addEvmLog({
    address: [astarCatsAddress],
    range: { from: 800854 },
    topic0: [erc721.events.Transfer.topic]
  })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
```

:::warning
This code expects to find an URL of a working Astar RPC endpoint in the `RPC_ENDPOINT` environment variable. Set it in the `.env` file and in [Subsquid Cloud secrets](/deploy-squid/env-variables) if and when you deploy your squid there. We tested the code using a public endpoint available at `wss://astar.public.blastapi.io`; for production, we recommend using private endpoints or our [RPC proxy](/deploy-squid/rpc-proxy) service.
:::

## Define the batch handler

We change the batch handler logic taking care to avoid token ID clashing:

```ts title="src/main.ts"
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { In } from 'typeorm'
import {
  astarDegensAddress,
  astarCatsAddress,
  contractMapping
} from './contracts'
import { Owner, Token, Transfer } from './model'
import * as erc721 from './abi/erc721'
import {
  processor,
  ProcessorContext,
  Event,
  Block
} from './processor'

var contractsSaved = false

processor.run(new TypeormDatabase(), async (ctx) => {
  const transfersData: TransferData[] = [];

  for (const block of ctx.blocks) {
    for (const event of block.events) {
      if (event.name === 'EVM.Log') {
        const transfer = handleTransfer(block.header, event)
        transfersData.push(transfer)
      }
    }
  }

  if (!contractsSaved) {
    await ctx.store.upsert([...contractMapping.values()])
    contractsSaved = true
  }
  await saveTransfers(ctx, transfersData)
})

type TransferData = {
  id: string
  from: string
  to: string
  token: bigint
  timestamp: number
  block: number
  contractAddress: string
}

function handleTransfer(block: Block, event: Event): TransferData {
  const { from, to, tokenId } = erc721.events.Transfer.decode(event)
  return {
    id: event.id,
    from,
    to,
    token: tokenId,
    timestamp: block.timestamp,
    block: block.height,
    contractAddress: event.args.address
  }
}

async function saveTransfers(
  ctx: ProcessorContext<Store>,
  transfersData: TransferData[]
) {
  const getTokenId = transferData => `${contractMapping.get(transferData.contractAddress)?.symbol ?? ""}-${transferData.token.toString()}`

  const tokensIds: Set<string> = new Set()
  const ownersIds: Set<string> = new Set()

  for (const transferData of transfersData) {
    tokensIds.add(getTokenId(transferData))
    ownersIds.add(transferData.from)
    ownersIds.add(transferData.to)
  }

  const tokens: Map<string, Token> = new Map(
    (await ctx.store.findBy(Token, { id: In([...tokensIds]) }))
      .map(token => [token.id, token])
  )

  const owners: Map<string, Owner> = new Map(
    (await ctx.store.findBy(Owner, { id: In([...ownersIds]) }))
      .map(owner => [owner.id, owner])
  )

  const transfers: Set<Transfer> = new Set()

  for (const transferData of transfersData) {
    const contract = new erc721.Contract(
      // temporary workaround for SDK issue 212
      // passing just the ctx as first arg may already work
      {_chain: {client: ctx._chain.rpc}},
      { height: transferData.block },
      transferData.contractAddress
    )

    let from = owners.get(transferData.from)
    if (from == null) {
      from = new Owner({ id: transferData.from, balance: 0n })
      owners.set(from.id, from)
    }

    let to = owners.get(transferData.to)
    if (to == null) {
      to = new Owner({ id: transferData.to, balance: 0n })
      owners.set(to.id, to)
    }

    const tokenId = getTokenId(transferData)
    let token = tokens.get(tokenId)
    if (token == null) {
      token = new Token({
        id: tokenId,
        uri: await contract.tokenURI(transferData.token),
        contract: contractMapping.get(transferData.contractAddress)
      })
      tokens.set(token.id, token)
    }

    token.owner = to

    const { id, block, timestamp } = transferData

    const transfer = new Transfer({
      id,
      block,
      timestamp,
      from,
      to,
      token
    })

    transfers.add(transfer)
  }

  await ctx.store.upsert([...owners.values()])
  await ctx.store.upsert([...tokens.values()])
  await ctx.store.insert([...transfers])
}
```

[//]: # (!!!! Remove the Contract ctx hack once the alias is added by SDK)

:::info
The `contract.tokenURI` call is accessing the **state** of the contract via a chain RPC endpoint. This is slowing down the indexing a little bit, but this data is only available this way. You'll find more information on accessing state in the [dedicated section of our docs](/substrate-indexing/specialized/evm#access-contract-state).
:::

## Database and the migration

Before giving your squid processor a local test, launch a PostgreSQL container with

```bash
sqd up
```

Squid projects automatically manage the database connection and schema via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping). In this approach the schema is managed through migration files. Since we've made changes to the schema, we need to remove the existing migration(s) and create a new one. This involves the following steps:

1. Build the code:

    ```bash
    sqd build
    ```

2. Make sure you start with a clean Postgres database. The following commands drop-create the Postgres instance in Docker:

    ```bash
    sqd down
    sqd up
    ```
    Skip this step if you haven't used your database since the last `sqd up`.

3. Generate the new migration (this will wipe any old migrations):

    ```bash
    sqd migration:generate
    ```

## Launch the Project

To launch the processor run the following command (this will block the current terminal):

```bash
sqd process
```
Finally, in a separate terminal window, launch the GraphQL server:

```bash
sqd serve
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
  tokens(where: {owner: {id_eq: "0x1210f3ea18ef463c162fff9084cee5b6e5ccab37"}}) {
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

Have fun playing around with queries, after all, it's a _playground_!
