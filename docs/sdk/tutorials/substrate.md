---
description: >-
  Build a starter squid for Substrate
sidebar_position: 40
---

# Simple Substrate squid

## Objective

The goal of this tutorial is to guide you through creating a simple blockchain indexer ("squid") using Squid SDK. In this example we will query the [Crust storage network](https://crust.network). Our objective will be to observe which files have been added and deleted from the network. Additionally, our squid will be able to tell us the groups joined and the storage orders placed by a given account.

We will start with the `substrate` squid template, then go on to run the project, define a schema, and generate TypeScript interfaces. From there, we will be able to interact directly with SQD Network, using the and the metadata service to get a Crust types bundle.

We expect that experienced software developers should be able to complete this tutorial in around **10-15 minutes**.

[//]: # (!!!! You can review the final code here/dead.)

## Pre-requisites

- Familiarity with Git 
- A properly set up [development environment](/sdk/how-to-start/development-environment-set-up) consisting of Node.js, Git and Docker
- [Squid CLI](/squid-cli/installation)

## Scaffold with `sqd init`

Use [`sqd init`](/squid-cli/init) and come up with some unique name for your squid. This tutorial will index data on Crust, a Substrate-based network, so use the `substrate` template:

```sh
sqd init substrate-crust-tutorial --template substrate
cd substrate-crust-tutorial
```

### Run the project

Now you can follow the [quickstart](/sdk/how-to-start/squid-development) guide to get the project up and running. Here is a summary:

```bash
npm i
npm run build
docker compose up -d
npx squid-typeorm-migration apply
```
```bash
node -r dotenv/config lib/main.js # will begin ingesting blocks
```
```bash
# open a separate terminal for this next command
npx squid-graphql-server # should begin listening on port 4350
```
After this test, shut down both processes with Ctrl-C and proceed.

## Define the schema and generate entity classes

Next, we make changes to the data [schema](/sdk/reference/schema-file) of the squid and define [entities](/sdk/reference/schema-file/entities) that we would like to track. We are interested in:

* Files added to and deleted from the chain;
* Active accounts;
* Groups joined by accounts;
* Storage orders placed by accounts.

For this, we use the following `schema.graphql`:

```graphql title="schema.graphql"
type Account @entity {
  id: ID! #Account address
  workReports: [WorkReport] @derivedFrom(field: "account")
  joinGroups: [JoinGroup] @derivedFrom(field: "member")
  storageOrders: [StorageOrder] @derivedFrom (field: "account")
}

type WorkReport @entity {
  id: ID! #event id
  account: Account!
  addedFiles: [[String]]
  deletedFiles: [[String]]
  extrinsicHash: String
  createdAt: DateTime
  blockNum: Int!
}

type JoinGroup @entity {
  id: ID!
  member: Account!
  owner: String!
  extrinsicHash: String
  createdAt: DateTime
  blockNum: Int!
}

type StorageOrder @entity {
  id: ID!
  account: Account!
  fileCid: String!
  extrinsicHash: String
  createdAt: DateTime
  blockNum: Int!
}
```

Notice that the `Account` entity is almost completely [derived](/sdk/reference/schema-file/entity-relations/). It is there to tie the other three entities together.

To finalize this step, run the `codegen` tool:

```bash
npx squid-typeorm-codegen
```

This will automatically generate TypeScript entity classes for our schema. They can be found in the `src/model/generated` folder of the project.

## Generate TypeScript wrappers for events

We generate these using the [squid-substrate-typegen](/sdk/tutorials/batch-processor-in-action) tool. Its configuration file is `typegen.json`; there, we need to
1. Set the `"specVersions"` field to a valid source of Crust chain runtime metadata. We'll use an URL of SQD-maintained metadata service:
   ```json
   "specVersions": "https://v2.archive.subsquid.io/metadata/crust",
   ```
2. List all Substrate pallets we will need the data from. For each pallet we list all events, calls, storage items and constants needed.

:::info
Refer to [this note](/sdk/resources/substrate/data-sourcing-miniguide) if you are unsure what Substrate data to use in your project.
:::

Our final `typegen.json` looks like this:

```json title="typegen.json"
{
  "outDir": "src/types",
  "specVersions": "https://v2.archive.subsquid.io/metadata/crust",
  "pallets": {
    "Swork": {
      "events": [
        "WorksReportSuccess",
        "JoinGroupSuccess"
      ]
    },
    "Market": {
      "events": [
        "FileSuccess"
      ]
    }
  }
}
```
Once done with the configuration, we run the tool with

```bash
npx squid-substrate-typegen ./typegen.json
```

The generated Typescript wrappers are at `src/types`.

## Set up the processor object

The next step is to create a [`SubstrateBatchProcessor`](/sdk/reference/processors/substrate-batch) object which [subscribes](/sdk/reference/processors/substrate-batch/data-requests) to all the events we need. We do it at `src/processor.ts`:

```ts title="src/processor.ts"
import {
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  DataHandlerContext
} from '@subsquid/substrate-processor'
import {events} from './types' // the wrappers generated in previous section

const processor = new SubstrateBatchProcessor()
  .setGateway('https://v2.archive.subsquid.io/network/crust')
  .setRpcEndpoint({
    url: 'https://crust.api.onfinality.io/public',
    rateLimit: 10
  })
  .setBlockRange({ from: 583000 })
  .addEvent({
    name: [
      events.market.fileSuccess.name,
      events.swork.joinGroupSuccess.name,
      events.swork.worksReportSuccess.name
    ],
    call: true,
    extrinsic: true
  })
  .setFields({
    extrinsic: {
      hash: true
    },
    block: {
      timestamp: true
    }
  })

type Fields = SubstrateBatchProcessorFields<typeof processor>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
```
This creates a processor that
 - Uses SQD Network as its main data source and a chain RPC for [real-time updates](/sdk/resources/unfinalized-blocks). URLs of the SQD Network gateways are available on [this page](/subsquid-network/reference/networks) and via [`sqd gateways`](/squid-cli/gateways). See [this page](/sdk/reference/processors/substrate-batch/general) for the reference on data sources configuration;
 - [Subscribes](/sdk/reference/processors/substrate-batch/data-requests) to `Market.FileSuccess`, `Swork.JoinGroupSuccess` and `Swork.WorksReportSuccess` events emitted at heights starting at 583000;
 - Additionally subscribes to calls that emitted the events and the corresponding extrinsics;
 - [Requests](/sdk/reference/processors/substrate-batch/field-selection) the `hash` data field for all retrieved extrinsics and the `timestamp` field for all block headers.

We also export the `ProcessorContext` type to be able to pass the sole argument of the batch handler function around safely. 

## Define the batch handler

Squids [batch process](/sdk/resources/batch-processing) chain data from multiple blocks. Compared to the [handlers](/sdk/resources/batch-processing/#migrate-from-handlers) approach this results in a much lower database load. Batch processing is fully defined by processor's [batch handler](/sdk/reference/processors/architecture/#processorrun), the callback supplied to the `processor.run()` call at the entry point of each processor (`src/main.ts` by convention).

We begin defining our batch handler by importing the entity model classes and Crust event types that we generated in previous sections. We also import the processor and its types:

```ts title="src/main.ts"
import {Account, WorkReport, JoinGroup, StorageOrder} from './model'
import {processor, ProcessorContext} from './processor'
```

Let's skip for now the `process.run()` call - we are going to come back to it in a second - and scroll down to the `getTransferEvents` function. In the template repository this function loops through the items contained in the context, extracts the events data and stores it in a list of objects.

For this project we are still going to extract events data from the context, but this time we have more than one event type so we have to sort them. We also need to handle the account information. Let's start with deleting the `TransferEvent` interface and defining this instead:

```typescript
type Tuple<T,K> = [T,K]
interface EventsInfo {
  joinGroups: Tuple<JoinGroup, string>[]
  marketFiles: Tuple<StorageOrder, string>[]
  workReports: Tuple<WorkReport, string>[]
  accountIds: Set<string>
}
```

Now, let's replace the `getTransferEvents` function with the below snippet that

* extracts event information in a manner specific to its name (known from `e.name`);
* stores event information in an object (we are going to use entity classes for that) and extracts `accountId`s from it;
* store all `accountId`s in a set.

```typescript
import {toHex} from '@subsquid/substrate-processor'
import * as ss58 from '@subsquid/ss58'

function getEventsInfo(ctx: ProcessorContext<Store>): EventInfo {
  let eventsInfo: EventsInfo = {
    joinGroups: [],
    marketFiles: [],
    workReports: [],
    accountIds: new Set<string>()
  }
  for (let block of ctx.blocks) {
    const blockTimestamp = block.header.timestamp ? new Date(block.header.timestamp) : undefined
    for (let e of block.events) {
      if (e.name === events.swork.joinGroupSuccess.name) {
        const decoded = events.swork.joinGroupSuccess.v1.decode(e)
        const memberId = ss58.codec('crust').encode(decoded[0])
        eventsInfo.joinGroups.push([
          new JoinGroup({
            id: e.id,
            owner: ss58.codec('crust').encode(decoded[1]),
            blockNum: block.header.height,
            createdAt: blockTimestamp,
            extrinsicHash: e.extrinsic?.hash
          }),
          memberId
        ])
        // add encountered account ID to the set of unique accountIDs
        eventsInfo.accountIds.add(memberId)
      }
      if (e.name === events.market.fileSuccess.name) {
        const decoded = events.market.fileSuccess.v1.decode(e)
        const accountId = ss58.codec('crust').encode(decoded[0])
        eventsInfo.marketFiles.push([
          new StorageOrder({
            id: e.id,
            fileCid: toHex(decoded[1]),
            blockNum: block.header.height,
            createdAt: blockTimestamp,
            extrinsicHash: e.extrinsic?.hash
          }),
          accountId
        ])
        eventsInfo.accountIds.add(accountId)
      }
      if (e.name === events.swork.worksReportSuccess.name) {
        const decoded = events.swork.worksReportSucces.v1.decode(e)
        const accountId = ss58.codec('crust').encode(decoded[0])

        const addedExtr = e.call?.args.addedFiles
        const deletedExtr = e.call?.args.deletedFiles

        const addedFiles = addedExtr.map(v => v.map(ve => String(ve)))
        const deletedFiles = deletedExtr.map(v => v.map(ve => String(ve)))

        if (addedFiles.length > 0 || deletedFiles.length > 0) {
          eventsInfo.workReports.push([
            new WorkReport({
              id: e.id,
              addedFiles: addedFiles,
              deletedFiles: deletedFiles,
              blockNum: block.header.height,
              createdAt: blockTimestamp,
              extrinsicHash: e.extrinsic?.hash,
            }),
            accountId
          ])
          eventsInfo.accountIds.add(accountId)
        }
      }
    }
  }
  return eventsInfo
}
```

Next, we want to create an entity (`Account`) object for every `accountId` in the set, then add the `Account` information to every event entity object. Finally, we save all the created and modified entity models into the database.

Take the code inside `processor.run()` and change it so that it looks like this:

```typescript
processor.run(new TypeormDatabase(), async (ctx) => {
  const eventsInfo = getEventsInfo(ctx)

  let accounts = await ctx.store
    .findBy(Account, { id: In([...eventsInfo.accountIds]) })
    .then(accounts => new Map(accounts.map(a => [a.id, a]))
  for (let aid of eventsInfo.accountIds) {
    if (!accounts.has(aid)) {
      accounts.set(aid, new Account({ id: aid }))
    }
  }

  for (const jg of eventsInfo.joinGroups) {
    // necessary to add this field to the previously created model
    // because now we have the Account created.
    jg[0].member = accounts.get(jg[1])
  }
  for (const mf of eventsInfo.marketFiles) {
    mf[0].account = accounts.get(mf[1])
  }
  for (const wr of eventsInfo.workReports) {
    wr[0].account = accounts.get(wr[1])
  }

  await ctx.store.save([...accounts.values()]);
  await ctx.store.insert(eventsInfo.joinGroups.map(el => el[0]));
  await ctx.store.insert(eventsInfo.marketFiles.map(el => el[0]));
  await ctx.store.insert(eventsInfo.workReports.map(el => el[0]));
})
```

[//]: # (!!!! You can take a look at the final version of `src/main.ts` here/dead)

## Apply changes to the database

Squid projects automatically manage the database connection and schema via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping) provided by [TypeORM](https://typeorm.io). Previously we changed the data schema at `schema.graphql` and reflected these changes in our Typescript code using `npx squid-typeorm-codegen`. Here, we [apply the corresponding changes to the database itself](/sdk/resources/persisting-data/typeorm).

First, we'll need to compile our updated project code. Do this with:
```bash
npm run build
```

Next we ensure that the database is at blank state:
```bash
docker compose down
docker compose up -d
```
Then we replace any old migrations with the new one with
```bash
rm -r db/migrations
```
```bash
npx squid-typeorm-migration generate
```
The new migration will be generated from the TypeORM entity classes we previously made out of `schema.graphql`. Apply it with:
```bash
npx squid-typeorm-migration apply
```

## Launch the project

It's finally time to run the project! Run
```bash
node -r dotenv/config lib/main.js
```
in one terminal, then open another one and run
```bash
npx squid-graphql-server
```
Now you can see the results of our hard work by visiting [`localhost:4350/graphql`](http://localhost:4350/graphql) in a browser and accessing the [GraphiQL](https://github.com/graphql/graphiql) console.

From this window we can perform queries. This one displays info on ten latest work reports, including all involved files and the account id:

```graphql
query MyQuery {
  workReports(limit: 10, orderBy: blockNum_DESC) {
    account {
      id
    }
    addedFiles
    deletedFiles
  }
}
```

## Credits

This sample project is adapted from a real integration, developed by our very own [Mikhail Shulgin](https://github.com/ma-shulgin). Credit for building it and helping with the guide goes to him.
