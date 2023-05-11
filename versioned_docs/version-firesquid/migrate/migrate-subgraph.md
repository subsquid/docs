---
sidebar_position: 2
title: Migrate from The Graph
description: Migrate a subgraph to Subsquid
---

# Migrate from The Graph

This guide walks through the steps to migrate a subgraph to Subsquid. In what follows we will convert the [Gravatar](https://github.com/graphprotocol/example-subgraph) subgraph into a squid and run it locally. Impatient readers may clone the squid from the [repo](https://github.com/subsquid/gravatar-squid) and run it by following the instructions in README:

```bash
git clone https://github.com/subsquid/gravatar-squid.git
```

`EvmBatchProcessor` provided by the Squid SDK defines a single handler that indexes EVM logs and transaction data in batches of heterogeneous items.  It differs from the programming model of subgraph mappings, that define a separate data handler for each EVM log topic to be indexed. Due to significantly less frequent database hits (once per batch compared to once per log) the batch-based handling model shows up to a 10x increase in the indexing speed. 

At the same time, the concepts of the [schema file](/basics/schema-file), [code generation from the schema file](https://github.com/subsquid/squid/tree/master/typeorm-codegen) and [an auto-generated GraphQL API](/graphql-api) should be familiar for subgraph developers. In most cases the schema file of a subgraph can be imported into a squid as is. 

There are some known limitations:
- Many-to-Many entity relations (should be [modelled explicitly](/basics/schema-file/entity-relations/#many-to-many-relations) as two many-to-one relations)

On top of the features provided by subgraphs, the Squid SDK and the Aquarium cloud service offers extra flexibility in developing tailored APIs and ETLs for on-chain data:

- Full control over the target database (Postgres), including custom migrations and ad-hoc queries in the handler
- Custom target databases and data formats (e.g. CSV)
- Arbitrary code execution in the data handler
- [Extension of the GraphQL API](/graphql-api/custom-resolvers) with arbitrary SQL
- [Secret environment variables](/deploy-squid/env-variables), allowing to seamlessly use private third-party JSON-RPC endpoints and integrate with external APIs
- [API versioning and aliasing](/deploy-squid/promote-to-production)
- [API Caching](/graphql-api/caching)  

For a full feature set comparison, see [Subsquid vs The Graph](/migrate/subsquid-vs-thegraph).

## Squid setup 

### 1. Clone template

To begin with, clone the "minimal" Ethereum squid template from the [squid-evm-template repo](https://github.com/subsquid/squid-evm-template):

```bash
git clone https://github.com/subsquid/squid-evm-template.git
cd squid-evm-template
```

### 2. Copy the schema file and generate entities

The minimal template already contains a dummy `schema.graphql` file. We replace it with the subgraph's schema as is:

```gql file=schema.graphl
type Gravatar @entity {
  id: ID!
  owner: Bytes!
  displayName: String!
  imageUrl: String!
}
```

Next, we generate the entities from the schema and build the squid using the [`squid-typeorm-codegen(1)`](https://github.com/subsquid/squid/tree/master/typeorm-codegen) tool of the Squid SDK:
```bash
npx squid-typeorm-codegen
make build
```

After that, start the local database and generate the migrations from the generated entities using the [`squid-typeorm-migration(1)`](https://github.com/subsquid/squid/tree/master/typeorm-migration) tool provided by the Squid SDK:
```bash
make up
npx squid-typeorm-migration generate
```
A database migration file for creating a table for `Gravatar` will appear in `db/migrations`. The migration will be automatically applied once we start the squid processor.

### Generate typings from ABI

The following command runs the `evm-typegen` tool fetches the contract ABI by the address and generates type-safe access classes in `src/abi`:
```bash
npx squid-evm-typegen src/abi 0x2E645469f354BB4F5c8a05B3b30A929361cf77eC#Gravity --clean
```

A boilerplate code for decoding EVM logs and the contract access classes will be generated in `src/abi/Gravity.ts`. In particular, the file contains the topic definitions used at the next step.  For more details about the EVM typegen tool, read a [dedicated doc page](/evm-indexing/squid-evm-typegen).

### Subscribe to EVM logs

The core of the indexing logic is implemented in `src/processor.ts`. This is where we define which EVM logs (events) our squid will process and define the batch handler for them. The squid processor is configured directly by the code, unlike subgraphs which require the handlers and events to be defined in the manifest file.

```ts file=src/processor.ts
// genereated by evm-typegen 
// the event object contains typings for all events defined in the ABI
import { events } from "./abi/Gravity";

const processor = new EvmBatchProcessor()
  .setDataSource({
    // uncomment and set RPC_ENDPOINT to enable contract state queries. 
    // Both https and wss endpoints are supported. 
    // chain: process.env.RPC_ENDPOINT,

    // Change the Archive endpoints for run the squid 
    // against the other  EVM networks:
    // Polygon: https://polygon.archive.subsquid.io
    // Goerli: https://goerli.archive.subsquid.io
    archive: 'https://eth.archive.subsquid.io',
  })
  .setBlockRange({ from: 6175243 })
  // fetch only logs emitted by the specified contract,
  // and that match the specified topic filter
  .addLog('0x2E645469f354BB4F5c8a05B3b30A929361cf77eC', {
    filter: [[
      events.NewGravatar.topic,
      events.UpdatedGravatar.topic,
   ]],
    data: {
        // define the log fields to be fetched from the archive
        evmLog: {
            topics: true,
            data: true,
        },
    } as const,
});
```

In the snippet above we tell the squid processor to fetch logs emitted by the contract `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC` that match of the specified topics. Note that the topic filter is a double array as required by the [selector specification](https://docs.ethers.io/v5/api/utils/abi/interface/#Interface--selectors). The configuration also specifies that the indexing should start from block `6175243` onwards (when the contract was deployed).

To index smart contract data deployed to other EVM chains like Polygon or Binance Smart Chain, simply change the `archive` endpoint. For the list of the supported networks and the configuration details, see [here](/evm-indexing/configuration).

### Transform and save the data

The processor currently doesn't do much and simply outputs the data it fetches from the archive.

Now we migrate the subgraph handlers that transform the event data into `Gravatar` objects. Instead of saving or updating gravatars one by one, `EvmBatchProcessor` receives an ordered batch of event items it is subscribed to (which can be inspected by the output). The batch typically consists of a mix of event and transaction data. In our case we have only two logs -- emitted when a gravatar is created and updated.

We start with an auxiliary function that extracts and normalizes the event data from the logs using the helper classes generated by `evm-codegen` from the ABI.

```ts
function extractData(evmLog: any): { id: ethers.BigNumber, owner: string, displayName: string, imageUrl: string} {
  if (evmLog.topics[0] === events.NewGravatar.topic) {
    return events.NewGravatar.decode(evmLog)
  }
  if (evmLog.topics[0] === events.UpdatedGravatar.topic) {
    return events.UpdatedGravatar.decode(evmLog)
  }
  throw new Error('Unsupported topic')
}
```

Next, we proceed with a batch handler collecting the updates from a single batch of EVM logs. Each item in `ctx.blocks` is either a `UpdateGravatar` event or a `NewGravatar` event, as was configured in the previous step. We extract the data in a unified way using `extractData` defined above. To convert a `0x...` string into a byte array we use `decodeHex` provided by the [Squid SDK](https://github.com/subsquid/squid/tree/master/util).

```ts
processor.run(new TypeormDatabase(), async (ctx) => {
    const gravatars: Map<string, Gravatar> = new Map();
    for (const c of ctx.blocks) {
      for (const e of c.items) {
        // e.kind may be 'evmLog' or 'transaction'
        if(e.kind !== "evmLog") {
          continue
        }
        const { id, owner, displayName, imageUrl } = extractData(e.evmLog)
        gravatars.set(id.toHexString(), new Gravatar({
          id: id.toHexString(),
          owner: decodeHex(owner),
          displayName,
          imageUrl
        })) 
      }
    }
    await ctx.store.save([...gravatars.values()])
});
```

The implementation is straightforward -- the newly created and/or updated gravatars are tracked by an in-memory map. The values are persisted in a single batch upsert via `cts.store.save(...)` once all items are processed.

### Run the processor and GraphQL API

To start the indexing, run
```bash
npm run build
make process
```
The processor will output the sync progress and the ETA to reach the chain head. After it reaches the head it will continue indexing new blocks until stopped.

To start an API server (at port `4350` by default) with a GraphQL schema auto-generated from the schema file, run in a new terminal window
```bash
npx squid-graphql-server
```
and inspect the auto-generated GraphQL API using an interactive playground at `http://localhost:4350/graphql` 


## What's Next?

- Have a closer look at the `EvmBatchProcessor` batch-oriented [programming model](/evm-indexing)
- Learn how to [deploy a squid to the Aquarium hosted service](/deploy-squid) for free
- Learn how to [index and query the contract state](/evm-indexing/query-state)
- Inspect a more complex [Uniswap V3 squid](https://github.com/subsquid/uniswap-squid) which tracks Uniswap V3 trading data. It was migrated from the [Uniswap V3 subgraph](https://github.com/Uniswap/v3-subgraph). It takes only a few hours to sync from scratch on a local machine.
