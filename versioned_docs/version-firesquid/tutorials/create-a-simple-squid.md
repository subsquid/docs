---
id: create-a-simple-squid
description: >-
  Build a starter squid for Substrate
sidebar_position: 40
---

# Simple Substrate squid

## Objective

The goal of this tutorial is to guide you through creating a simple blockchain indexer ("squid") using Squid SDK. In this example we will query the [Crust storage network](https://crust.network). Our objective will be to observe which files have been added and deleted from the network. Additionally, our squid will be able to tell us the groups joined and the storage orders placed by a given account.

We will start with the `substrate` squid template, then go on to run the project, define a schema, and generate TypeScript interfaces. From there, we will be able to interact directly with the Archive, and extract a types bundle from Crust's own library. 

We expect that experienced software developers should be able to complete this tutorial in around **10-15 minutes**. You can review the final code [here](https://github.com/subsquid/squid-crust-example).

## Pre-requisites

- Familiarity with Git 
- A properly set up [development environment](/tutorials/development-environment-set-up) consisting of Node.js and Docker
- [Squid CLI](/squid-cli/installation)

:::info
This tutorial uses custom scripts defined in `commands.json`. The scripts are automatically picked up as `sqd` sub-commands.
:::

## Scaffold with `sqd init`

Use [`sqd init`](/squid-cli/init) and come up with some unique name for your squid. This tutorial will index data on Crust, a Substrate-based network, so use the `substrate` template:

```sh
sqd init substrate-crust-tutorial --template substrate
cd substrate-crust-tutorial
```

### Run the project

Now you can follow the [quickstart](/quickstart/quickstart-substrate) guide to get the project up and running. Here is a summary:

```bash
npm ci
sqd build
sqd up
sqd process # should begin to ingest blocks

# open a separate terminal for this next command
sqd serve # should begin listening on port 4350
```
After this test, shut down both processes with Ctrl-C and proceed.

## Define the schema and generate entity classes

Next, we make changes to the data [schema](/basics/schema-file) of the squid and define [entities](/basics/schema-file/entities) that we would like to track. As stated above, we are interested in:

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
  extrinsicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type JoinGroup @entity {
  id: ID!
  member: Account!
  owner: String!
  extrinsicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type StorageOrder @entity {
  id: ID!
  account: Account!
  fileCid: String!
  extrinsicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}
```

Notice that the `Account` entity is almost completely [derived](/basics/schema-file/entity-relations/). It is there to tie the other three entities together.

:::info
Refer to [this article](/troubleshooting#how-do-i-know-which-events-and-extrinsics-i-need-for-the-handlers) if you are unsure which events and extrinsics to use for the handlers in your project.
:::

To finalize this step, run the `codegen` tool:

```bash
sqd codegen
```

This will automatically generate TypeScript entity classes for our schema. They can be found in the `src/model/generated` folder of the project.

## Generate TypeScript wrappers for events

The newest version of [Archives](/archives/overview) stores the chain metadata information. The `squid-substrate-typegen` tool is able to leverage this stored metadata. To leverage that functionality, point the `specVersion` field of the `typegen.json` configuration file to an endpoint URL of the chain Archive. You can also set this variable to a local path to a type bundle JSON/JSONL if you happen to have it.

The tool also requires listing `events` and `calls` that have to be scraped off the blockchain in order to get the squid's target data. Finding them may require some research. In our case we only need events:

* `WorksReportSuccess` from the `swork` pallet,
* `JoinGroupSuccess` from the same pallet,
* `FileSuccess` from the `market` pallet.

With these, our final `typegen.json` looks like this:

```json title="typegen.json"
{
  "outDir": "src/types",
  "specVersions": "https://crust.archive.subsquid.io/graphql",
  "events": [
    "Swork.WorksReportSuccess",
    "Swork.JoinGroupSuccess",
    "Market.FileSuccess"
  ],
  "calls": []
}
```
Finally, run the tool:

```bash
sqd typegen
```
You should see the generated Typescript wrappers at [`src/types/events.ts`](https://github.com/subsquid/squid-crust-example/blob/main/src/types/events.ts).

:::info
Full documentation of `squid-substrate-typegen` and related tools is available [here](/substrate-indexing/squid-substrate-typegen). There also a [mini-guide](/troubleshooting/#where-do-i-get-a-type-bundle-for-my-chain) on how to obtain type bundles for Substrate chains without relying on Subsquid tools.
:::

## Define and bind event handlers

After having obtained wrappers for events that account for the metadata changes across different runtime versions, it's finally time to define handlers for these events and attach them to our [Processor](/substrate-indexing). This is done in the `src/processor.ts` file of the project folder.

We will ultimately end up replacing the code in this file almost entirely, leaving only a few useful pieces. However, we are going to take a step-by-step approach, showing where essential changes have to be made. The final result will be visible at the end of this section.

First, we import the entity model classes and Crust event types we generated in previous sections:

```typescript
import {Account, WorkReport, JoinGroup, StorageOrder} from './model'
import {MarketFileSuccessEvent, SworkJoinGroupSuccessEvent, SworkWorksReportSuccessEvent} from './types/events'
```

Next, we need to [customize the processor](/substrate-indexing/configuration) by setting the correct Archive as a data source and specifying the events we would like to index:

```typescript
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("crust"),
  })
  .setBlockRange({ from: 583000 })
  .addEvent("Market.FileSuccess", {
    data: { event: { args: true , extrinsic: true, call: true} },
  } as const)
  .addEvent("Swork.JoinGroupSuccess", {
    data: { event: { args: true , extrinsic: true, call: true} },
  } as const)
  .addEvent("Swork.WorksReportSuccess");
```

:::info
Note the `addEvent` calls here. In the first two cases we requested `extrinsic` and `call` fields from the processor. In the third call to the method, we requested unfiltered information on the `Swork.WorksReportSuccess` event by omitting the [`data?` optional argument](/substrate-indexing/configuration/#event-data-selector).
:::

`Item` and `Ctx` types defined in the template are still useful, so we are going to keep them. Let's skip for now the `process.run()` call - we are going to come back to it in a second - and scroll down to the `getTransfers` function. In the template repository this function loops through the items contained in the context, extracts the events data and stores it in a list of objects.

For this project we are still going to extract events data from the context, but this time we have more than one event type so we have to sort them. We also need to handle the account information. Let's start with deleting the `TransferEvent` interface and defining this instead:

```typescript
type Tuple<T,K> = [T,K];
interface EventInfo {
  joinGroups: Tuple<JoinGroup, string>[];
  marketFiles: Tuple<StorageOrder, string>[];
  workReports: Tuple<WorkReport, string>[];
  accountIds: Set<string>;
}
```

Now, let's replace the `getTransfers` function with the below snippet. As described above, it will:

* extract event information in a different manner for each event (using the `item.name` to distinguish between them)
* store event information in an object (we are going to use entity classes for that) and extract `accountId` from it
* store all `accountId`s in a set

```typescript
function getEvents(ctx: Ctx): EventInfo {
  let events: EventInfo = {
    joinGroups: [],
    marketFiles: [],
    workReports: [],
    accountIds: new Set<string>(),
  };
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.name === "Swork.JoinGroupSuccess") {
        const e = new SworkJoinGroupSuccessEvent(ctx, item.event);
        const memberId = ss58.codec("crust").encode(e.asV1[0]);
        events.joinGroups.push([new JoinGroup({
          id: item.event.id,
          owner: ss58.codec("crust").encode(e.asV1[1]),
          blockHash: block.header.hash,
          blockNum: block.header.height,
          createdAt: new Date(block.header.timestamp),
          extrinsicId: item.event.extrinsic?.id, 
        }), memberId]);
        
        // add encountered account ID to the Set of unique accountIDs
        events.accountIds.add(memberId);
      }
      if (item.name === "Market.FileSuccess") {
        const e = new MarketFileSuccessEvent(ctx, item.event);
        const accountId = ss58.codec("crust").encode(e.asV1[0]);
        events.marketFiles.push([new StorageOrder({
          id: item.event.id,
          fileCid: toHex(e.asV1[1]),
          blockHash: block.header.hash,
          blockNum: block.header.height,
          createdAt: new Date(block.header.timestamp),
          extrinsicId: item.event.extrinsic?.id,
        }), accountId]);

        // add encountered account ID to the Set of unique accountIDs
        events.accountIds.add(accountId)
      }
      if (item.name === "Swork.WorksReportSuccess") {
        const e = new SworkWorksReportSuccessEvent(ctx, item.event);
        const accountId = ss58.codec("crust").encode(e.asV1[0]);

        const addedExtr = item.event.call?.args.addedFiles;
        const deletedExtr = item.event.call?.args.deletedFiles;

        const addedFiles = stringifyArray(addedExtr);
        const deletedFiles = stringifyArray(deletedExtr);

        if (addedFiles.length > 0 || deletedFiles.length > 0) {
          events.workReports.push([new WorkReport({
            id: item.event.id,
            addedFiles: addedFiles,
            deletedFiles: deletedFiles,
            blockHash: block.header.hash,
            blockNum: block.header.height,
            createdAt: new Date(block.header.timestamp),
            extrinsicId: item.event.extrinsic?.id,
          }), accountId]);

          // add encountered account ID to the Set of unique accountIDs
          events.accountIds.add(accountId);
        }
      }
    }
  }
  return events;
}
```
This snippet is using the `stringifyArray` and `toHex` utility functions. Please add them as well:

```typescript
import {toHex} from "@subsquid/substrate-processor"

function stringifyArray(list: any[]): any[] {
  let listStr: any[] = [];
  for (let vec of list) {
    for (let i = 0; i < vec.length; i++) {
      vec[i] = String(vec[i]);
    }
    listStr.push(vec);
  }
  return listStr;
}
```

Next, we want to create an entity (`Account`) object for every `accountId` in the set, then add the `Account` information to every event entity objext. For that we are reusing the existing `getAccount` function. Finally, we save all the created and modified entity models into the database. 

Take the code inside `processor.run()` and change it so that it looks like this:

```typescript
processor.run(new TypeormDatabase(), async (ctx) => {
  const events = getEvents(ctx);

  let accounts = await ctx.store
    .findBy(Account, { id: In([...events.accountIds]) })
    .then((accounts) => {
      return new Map(accounts.map((a) => [a.id, a]));
    });

  for (const jg of events.joinGroups) {
    const member = getAccount(accounts, jg[1]);
    // necessary to add this field to the previously created model
    // because now we have the Account created.
    jg[0].member = member;
  }

  for (const mf of events.marketFiles) {
    const account = getAccount(accounts, mf[1]);
    // necessary to add this field to the previously created model
    // because now we have the Account created.
    mf[0].account = account;
  }

  for (const wr of events.workReports) {
    const account = getAccount(accounts, wr[1]);
    // necessary to add this field to the previously created model
    // because now we have the Account created.
    wr[0].account = account;
  }

  await ctx.store.save(Array.from(accounts.values()));
  await ctx.store.insert(events.joinGroups.map(el => el[0]));
  await ctx.store.insert(events.marketFiles.map(el => el[0]));
  await ctx.store.insert(events.workReports.map(el => el[0]));
});
```
You can take a look at [the final version of `src/processor.ts`](https://github.com/subsquid/squid-crust-example/blob/main/src/processor.ts) at [the GitHub repository of this example](https://github.com/subsquid/squid-crust-example/). If you like it, please leave a :star:

## Apply changes to the database

Squid projects automatically manage the database connection and schema via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping) provided by [TypeORM](https://typeorm.io). Previously we changed the data schema at `schema.graphql` and reflected these changes in our Typescript code using `sqd codegen`. Here, we [apply the corresponding changes to the database itself](/basics/db-migrations).

We begin by making sure that the database is at blank state:
```bash
sqd down
sqd up
```
Then we replace any old migrations with the new one with
```bash
sqd migration:generate
```
The new migration will be generated from the TypeORM entity classes we previously made out of `schema.graphql` with `sqd codegen`. Optionally, we can apply the migration right away:
```bash
sqd migration:apply
```
If we skipped this step, the new migration would have been applied next time we ran `sqd processor`.

## Launch the project

It's finally time to run the project! Run
```bash
sqd process
```
in one terminal, then open another one and run
```bash
sqd serve
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

This sample project is actually a real integration, developed by our very own [Mikhail Shulgin](https://github.com/ma-shulgin). Credit for building it and helping with the guide goes to him.
