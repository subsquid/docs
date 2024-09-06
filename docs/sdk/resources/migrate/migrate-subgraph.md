---
sidebar_position: 2
title: Migrate from The Graph
description: Migrate a subgraph to Subsquid
---

# Migrate from The Graph

This guide walks through the steps to migrate a subgraph to Subsquid. In what follows we will convert the [Gravatar](https://github.com/graphprotocol/example-subgraph) subgraph into a squid and run it locally. Impatient readers may clone the squid from the [repo](https://github.com/subsquid-labs/gravatar-squid) and run it by following the instructions in README:

```bash
git clone https://github.com/subsquid-labs/gravatar-squid.git
```

`EvmBatchProcessor` provided by the Squid SDK defines a single handler that indexes EVM logs and transaction data in batches. It differs from the programming model of subgraph mappings that defines a separate data handler for each EVM log topic to be indexed. Due to significantly less frequent database hits (once per batch compared to once per log) the batch-based handling model shows up to a 10x increase in the indexing speed.

At the same time, concepts of the [schema file](/sdk/reference/schema-file), [code generation from the schema file](/sdk/reference/schema-file/intro/#typeorm-codegen) and [auto-generated GraphQL API](/sdk/resources/basics/serving-graphql) should be familiar to subgraph developers. In most cases the schema file of a subgraph can be imported into a squid as is. 

There are some known limitations:
- Many-to-Many entity relations should be [modeled explicitly](/sdk/reference/schema-file/entity-relations/#many-to-many-relations) as two many-to-one relations

On top of the features provided by subgraphs, Squid SDK and Subsquid Cloud offer extra flexibility in developing tailored APIs and ETLs for on-chain data:

- Full control over the target database (Postgres), including custom migrations and ad-hoc queries in the handler
- Custom target databases and data formats (e.g. CSV)
- Arbitrary code execution in the data handler
- [Extension of the GraphQL API](/sdk/reference/graphql-server/configuration/custom-resolvers) with arbitrary SQL
- [Secret environment variables](/cloud/resources/env-variables), allowing to seamlessly use private third-party JSON-RPC endpoints and integrate with external APIs
- [API versioning and aliasing](/cloud/resources/production-alias)
- [API caching](/sdk/reference/graphql-server/configuration/caching)

For a full feature set comparison, see [Subsquid vs The Graph](/sdk/subsquid-vs-thegraph).

## Squid setup 

### 1. Install Squid CLI

Instructions [here](/squid-cli/installation).

### 2. Fetch the template

Create a squid from the minimalistic [`evm` template](https://github.com/subsquid-labs/squid-evm-template):

```bash
sqd init my-new-squid -t evm
cd squid-evm-template
```

### 3. Copy the schema file and generate entities

The minimal template already contains a dummy `schema.graphql` file. We replace it with the subgraph schema as is:

```gql file=schema.graphl
type Gravatar @entity {
  id: ID!
  owner: Bytes!
  displayName: String!
  imageUrl: String!
}
```

Next, we generate the entities from the schema using the [`squid-typeorm-codegen`](/sdk/reference/schema-file/intro/#typeorm-codegen) tool of the Squid SDK, then build the squid:
```bash
npx squid-typeorm-codegen
npm run build
```
This command is equivalent to running `yarn codegen` in subgraph.

After that, start the local database and regenerate migrations based on the generated entities using the [`squid-typeorm-migration`](/sdk/resources/persisting-data/typeorm) tool:
```bash
docker compose up -d
```
```bash
rm -r db/migrations
```
```bash
npx squid-typeorm-migration generate
```
A database migration file for creating a table for `Gravatar` will appear in `db/migrations`. Apply it with
```bash
npx squid-typeorm-migration apply
```

### 4. Generate typings from ABI

Copy `./abis/Gravity.json` from the subgraph project and paste it to `./abi` folder in the subsquid project.
To generate the typings, run:
```bash
npx squid-evm-typegen ./src/abi ./abi/*.json --multicall
```
Alternatively, similar to `graph add <address> [<subgraph-manifest default: "./subgraph.yaml">]` command, to generate typings, run:
```bash
npx squid-evm-typegen src/abi 0x2E645469f354BB4F5c8a05B3b30A929361cf77eC#Gravity --clean
```
This command runs the `evm-typegen` tool that fetches the contract ABI by the address and generates type-safe access classes in `src/abi/Gravity.ts`. The generated boilerplate code will be used to decode EVM logs and directly query the contract. It also contains topic definitions used in the next step.

### 5. Subscribe to EVM logs

While in The Graph data source is defined in the manifest file `subgraph.yaml`, in Subsquid subscriptions to EVM data, including logs, are performed at the processor object definition customarily located at `src/processor.ts`. The processor is configured directly by the code, unlike subgraphs which require handlers and events to be defined in the manifest file.

```ts file=src/processor.ts
import { EvmBatchProcessor} from '@subsquid/evm-processor'

// generated by the evm-typegen tool
// the events object contains typings for all events defined in the ABI
import { events } from './abi/Gravity'

export const GRAVATAR_CONTRACT =
  '0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'.toLowerCase()

export const processor = new EvmBatchProcessor()
  // change the gateway URL to run against other EVM networks, e.g.
  // 'https://v2.archive.subsquid.io/network/polygon-mainnet'
  // 'https://v2.archive.subsquid.io/network/binance-mainnet'
  .setGateway('https://v2.archive.subsquid.io/network/ethereum-mainnet')
  .setRpcEndpoint('<my_eth_rpc_url>')
  .setBlockRange({ from: 6175243 })
  .setFinalityConfirmation(75)
  .addLog({
    address: [ GRAVATAR_CONTRACT ],
    topic0: [
      events.NewGravatar.topic,
      events.UpdatedGravatar.topic,
    ],
  })
```

In the snippet above we tell the squid processor to fetch logs emitted by the contract `0x2E645469f354BB4F5c8a05B3b30A929361cf77eC` with topic0 within a specified list. The configuration also states that indexing should start from block `6175243`, the height at which the contract was deployed.

Check out the [EVM indexing](/sdk) section for the list of supported networks and configuration details.

The above snippet is eqivalent to the following `subgraph.yaml`:

```yaml file=subgraph.yaml
specVersion: 0.0.4
description: Gravatar for Ethereum
repository: https://github.com/graphprotocol/example-subgraph
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum/contract
    name: Gravity
    network: mainnet
    source:
      address: '0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'
      abi: Gravity
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.5
      language: wasm/assemblyscript
      entities:
        - Gravatar
      abis:
        - name: Gravity
          file: ./abis/Gravity.json
      eventHandlers:
        - event: NewGravatar(uint256,address,string,string)
          handler: handleNewGravatar
        - event: UpdatedGravatar(uint256,address,string,string)
          handler: handleUpdatedGravatar
      file: ./src/mapping.ts
```

### 6. Transform and save the data

In Subgraph data is saved in the `mapping.ts` file. The mapping function will receive an `ethereum.Block` as its only argument. In Subsquid, we set up the processor in `processor.ts` and save the data in the `main.ts`.

We migrate the subgraph handlers that transform the event data into `Gravatar` objects. Instead of saving or updating gravatars one by one, `EvmBatchProcessor` receives an ordered batch of event items it is subscribed to. In our case we have only two kinds of logs -- emitted on gravatar creations and updates.

The entry point for transform code is `src/main.ts`. We start by appending an auxiliary data normalization function to the end of that file:
```ts title="src/main.ts"
function extractData(evmLog: any): { id: bigint, owner: string, displayName: string, imageUrl: string} {
  if (evmLog.topics[0] === events.NewGravatar.topic) {
    return events.NewGravatar.decode(evmLog)
  }
  if (evmLog.topics[0] === events.UpdatedGravatar.topic) {
    return events.UpdatedGravatar.decode(evmLog)
  }
  throw new Error('Unsupported topic')
}
```

Next, we make a [batch handler](/sdk/reference/processors/architecture/#processorrun) collecting the updates from a single batch of EVM logs. To convert a `0x...` string into a byte array we use the `decodeHex` utility from Subsquid SDK.

```ts title="src/main.ts"
import { TypeormDatabase } from '@subsquid/typeorm-store'
import { decodeHex } from '@subsquid/evm-processor'
import { events } from './abi/Gravity'
import { Gravatar } from './model'
import { processor, GRAVATAR_CONTRACT } from './processor'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
  const gravatars: Map<string, Gravatar> = new Map()
  for (const c of ctx.blocks) {
    for (const e of c.logs) {
      if (!(e.address === GRAVATAR_CONTRACT &&
            (e.topics[0] === events.NewGravatar.topic ||
             e.topics[0] === events.UpdatedGravatar.topic))) continue
      const { id, owner, displayName, imageUrl } = extractData(e)
      let idString = '0x' + id.toString(16)
      gravatars.set(idString, new Gravatar({
        id: idString,
        owner: decodeHex(owner),
        displayName,
        imageUrl
      }))
    }
  }
  await ctx.store.upsert([...gravatars.values()])
})
```
The implementation is straightforward -- the newly created and/or updated gravatars are tracked by an in-memory map. The values are persisted in a single batch upsert once all items are processed.

### 7. Run the processor and GraphQL API

To start the indexing, (re)build the project and run the processor:
```bash
npm run build
```
```bash
node -r dotenv/config lib/main.js
```
The processor will output the sync progress and the ETA to reach the chain head. After it reaches the head it will continue indexing new blocks until stopped.

To start an API server (at port `4350` by default) with a GraphQL schema auto-generated from the schema file, run in a new terminal window
```bash
npx squid-graphql-server
```
and inspect the auto-generated GraphQL API using an interactive playground at [http://localhost:4350/graphql](http://localhost:4350/graphql).

## What's Next?

- Compare your API to that of subgraph using the [compareGraphQL](https://github.com/subsquid-labs/compareGraphQL) script
- Have a closer look at [`EvmBatchProcessor`](/sdk)
- Learn how to [deploy a squid to Subsquid Cloud](/cloud) for free
- Learn how to [index and query the contract state](/sdk/resources/tools/typegen/state-queries)
- Inspect a more complex [Uniswap V3 squid](https://github.com/dariaag/uniswap-squid-arrow) which tracks Uniswap V3 trading data. It was migrated from the [Uniswap V3 subgraph](https://github.com/Uniswap/v3-subgraph). It takes only a few hours to sync from scratch on a local machine.
