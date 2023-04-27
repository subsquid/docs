---
title: "Step 1: Transfer events"
description: >-
  Indexing events emitted by the BAYC contract
sidebar_position: 10
---

# Step 1: Indexing Transfer events

In this step-by-step tutorial we will build a squid that gets data about [Bored Ape Yacht Club](https://boredapeyachtclub.com) NFTs, their transfers and owners from the [Ethereum blockchain](https://ethereum.org), indexes the NFT metadata from [IPFS](https://ipfs.tech/) and regular HTTP URLs, stores it in a database and serves it over a GraphQL API. Here we do the first step: build a squid that indexes only the `Transfer` events emitted by the [BAYC token contract](https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d).

Pre-requisites: Node.js, [Subsquid CLI](/squid-cli/installation), Docker.

## Starting with a template

Begin by retrieving the `evm` template and installing the dependencies:
```bash
sqd init bayc-squid -t evm
cd bayc-squid
npm i
```
The resulting code can be found at [this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/4dc090bad00618dec3309baf90bd1a9f864f32cd).

## Interfacing with the contract ABI

First, we inspect which data is available for indexing. For EVM contracts, the metadata descrbing the shape of the smart contract logs, transactions and contract state methods is distributed as [Application Binary Interfaces](https://www.alchemy.com/overviews/what-is-an-abi-of-a-smart-contract-examples-and-usage) (ABIs) files. For many popular contracts the ABI files are published on Etherscan (as in the case of the BAYC NFT contracts). Subsquid provides a [tool](/evm-indexing/squid-evm-typegen/) for retrieving contract ABIs from Etherscan-like APIs and generating the boilerplate for retrieving and decoding the data. For the contract of interest, this can be done with
```bash
npx squid-evm-typegen src/abi 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d#bayc
```
Here, `src/abi` is the destination folder and the `bayc` suffix sets the base name for the generated file.

Checking out the generated `src/abi/bayc.ts` file we see all events and contract functions listed in the ABI. Among them there is the `Transfer` event:
```typescript
export const events = {
    ...
    Transfer: new LogEvent<([from: string, to: string, tokenId: ethers.BigNumber] & {from: string, to: string, tokenId: ethers.BigNumber})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}
```
Reading about [elsewhere](https://eips.ethereum.org/EIPS/eip-721) we learn that it is emitted every time an NFT changes hand and that its [logs](https://docs.alchemy.com/docs/deep-dive-into-eth_getlogs) contain the addresses of both involved parties, as well the unique ID of the token. This is the data we need, so we proceed to configure our squid to retrieve it.

## Configuring the data filters

A "squid processor" is the Node.js process and the [object that powers it](/evm-indexing/evm-processor/) that are responsible for retrieving filtered blockchain data from a specialized data lake (an [archive](/archives)), transforming it and saving the result to a destination of choice. To configure the processor (object) to retrieve the `Transfer` events of the BAYC token contract, we initialize it like this:
```typescript
import * as bayc from './abi/bayc'

const CONTRACT_ADDRESS = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'

let processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('eth-mainnet'),
    })
    .setBlockRange({
        from: 12_287_507,
    })
    .addLog(CONTRACT_ADDRESS, {
        filter: [[bayc.events.Transfer.topic]],
        data: {
            evmLog: {
                topics: true,
                data: true,
            },
            transaction: {
                hash: true,
            },
        },
    })
```
Here,
* `'eth-mainnet'` is the alias for the public archive that Subsquid maintains for Ethereum mainnet. Check out `npx squid-archive-registry` for a list of public archives for all supported networks or explore the [archives documentation](/archives/) to find out how to host your own archive.
* `12_287_507` is the block at which the BAYC token contract was deployed. Can be found on the [contract's Etherscan page](https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d).
* `[[bayc.events.Transfer.topic]]` is a filter that tells the processor to retrieve all event logs with [topic[0]](https://docs.soliditylang.org/en/v0.8.19/abi-spec.html#abi-events) matching the hash of the full signature of the `Transfer` event. The hash is taken from the previously generated Typescript ABI.
* The `data` field of the [`addLog`](/evm-indexing/configuration/evm-logs/) options object specifies the exact data we need on every event to be retrieved. We are requesting topics and data for the event logs. Event log data is always supplemented by function call data on their parent transactions; we are requesting transaction hashes for that part.

See the [Configuration](/evm-indexing/configuration/) for more options.

## Decoding the event data

The other part of processor configuration is the callback function used to process batches of the filtered data, the [batch handler](/basics/squid-processor/#processorrun). It is typically defined at the `processor.run()` call at `src/processor.ts`, like this:
```typescript
processor.run(db, async (ctx) => {
    // data transformation and persistence code here
});
```
Here,
* `db` is a [`Database` implementation](/basics/store/store-interface/) specific to the target data sink. We want to store the data in a PostgreSQL database and present with a GraphQL API, so we provide a [`TypeormDatabase`](/basics/store/typeorm-store/) object here.
* `ctx` is a [batch context](/evm-indexing/context-interfaces/) object that exposes a batch of data retrieved from the archive (at `ctx.blocks`) and any data persistence facilities derived from `db` (at `ctx.store`).

Batch handler is where the raw on-chain data from the archive is decoded, transformed and persisted to the to target store. This is the part we'll be concerned with for the rest of the tutorial.

We begin by defining a batch handler decoding the `Transfer` event:
```typescript
processor.run(new TypeormDatabase(), async (ctx) => {
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.kind !== 'evmLog') continue
            let {from, to, tokenId} = bayc.events.Transfer.decode(item.evmLog)
            ctx.log.info(`Parsed a Transfer of token ${tokenId} from ${from} to ${to}`)
        }
    }
})
```
This goes through all the data items retrieved from the archive, decodes the data of each log item and logs the results into the terminal. It also discards the items that are not EVM logs, which is necessary because every log item is always followed by an item of its parent transaction. The decoding is done with the `bayc.events.Transfer.decode()` function from the Typescript ABI we previously generated.

At this point the squid is ready for its first test run. Execute
```bash
sqd up
sqd process
```
and you should see lots of lines like these in the output:
```
03:56:02 INFO  sqd:processor Parsed a Transfer of token 6325 from 0x0000000000000000000000000000000000000000 to 0xb136c6A1Eb83d0b4B8e4574F28e622A57F8EF01A
03:56:02 INFO  sqd:processor Parsed a Transfer of token 6326 from 0x0000000000000000000000000000000000000000 to 0xb136c6A1Eb83d0b4B8e4574F28e622A57F8EF01A
03:56:02 INFO  sqd:processor Parsed a Transfer of token 4407 from 0x082C99d47E020a00C95460D50a83338d509A0e3a to 0x5cf0E6da6Ec2bd7165edcD52D3d31f2528dCf007
```
The full code can be found at [this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/be0ebfadff4be69f4d2f6a68418274b87adb707e).

## Extending and persisting the data

`TypeormDatabase` requires us to define a TypeORM data model to actually send the data to the database. In Subsquid, the same data model is also used by the GraphQL server to generate the API schema. To avoid any potential discrepancies, processor and GraphQL server rely on a shared data model description defined at `schema.graphql` in a GraphQL schema dialect fully documented [here](/schema-file/).

TypeORM code is generated from `schema.graphql` with the [`squid-typeorm-codegen`](/basics/schema-file/#typeorm-codegen) tool and must be regenerated every time the schema is changed. This is usually accompanied by regenerating the [database migrations](/basics/db-migrations/) and recreating the database itself. The migrations are applied before every run of the processor, ensuring that whenever any TypeORM code within the processor attempts to access the database, the database is in a state that allows it to succeed.

The main unit of data in `schema.graphql` is [entity](/basics/schema-file/entities/). These map onto [TypeORM entites](https://typeorm.io/entities) that in turn map onto database tables. We define one for `Transfer` events by replacing the file contents with
```graphql title=schema.graphql
type Transfer @entity {
    id: ID!
    tokenId: Int! @index
    from: String! @index
    to: String! @index
    timestamp: DateTime!
    blockNumber: Int!
    txHash: String! @index
}
```
Here,
* The `id` is a required field and the `ID` type is an alias for `String`. Entity IDs must be unique.
* `@index` decorators tell the codegen tool that the corresponding database columns should be indexed.
* Extra fields `timestamp` and `blockNumber` are added to make the resulting GraphQL API more convenient. We will fill them using the block metadata available in `ctx`.

Once we're done editing the schema, we regenerate the TypeORM code, recreate the database and regenerate the migrations. We use [`sqd`](/squid-cli/) commands for convenience:
```bash
sqd codegen
sqd down
sqd up
sqd migration:generate
```
The generated code is in `src/model`. We can now import a `Transfer` entity class from there and use it to perform [various operations](/basics/store/typeorm-store/) on the corresponding database table. Let us rewrite our batch handler to save the parsed `Transfer` events data to the database:
```typescript
processor.run(new TypeormDatabase(), async (ctx) => {
    let transfers: Transfer[] = []

    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.kind !== 'evmLog') continue
            let {from, to, tokenId} = bayc.events.Transfer.decode(item.evmLog)
            transfers.push(new Transfer({
                id: item.evmLog.id,
                tokenId: tokenId.toNumber(),
                from,
                to,    
                timestamp: new Date(block.header.timestamp),
                blockNumber: block.header.height,
                txHash: item.transaction.hash,
            }))
        }
    }

    await ctx.store.insert(transfers)
})
```
Note a few things here:
* A unique event log ID is available at `item.evmLog.id` - no need to generate your own!
* `tokenId` returned from the decoder is an `ethers.BigNumber`, so it has to be explicitly converted to `number`. The conversion is valid only because we know that BAYC NFT IDs run from 0 to 9999; in most cases we would use `BigInt` for the entity field type and convert with `tokenId.toBigInt()`.
* `block.header` contains block metadata that we use to fill the extra fields.
* Accumulating the `Transfer` entity instances before using `ctx.store.insert()` on the whole array of them in the end allows us to get away with just one database transaction per batch. This is [crucial for achieving a good syncing performance](/basics/batch-processing/).

At this point we have a squid that indexes the data on BAYC token transfers and is capable of serving it over a GraphQL API. Full code is available at [this commit](https://github.com/abernatskiy/tmp-bayc-squid-2/tree/d99cd9b3f6921c7f591e5817d54025a388925a08). Test it by running
```bash
sqd process
```
then
```bash
sqd serve
```
in a separate terminal. If all is well, a GraphiQL playground should become available at [localhost:4350/graphql](http://localhost:4350/graphql):

![BAYC GraphiQL at step one](</img/bayc-playground-step-one.png>)
