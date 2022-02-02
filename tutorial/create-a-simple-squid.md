---
description: >-
  This page is about taking the Squid template and customizing it to create a
  simple project
---

# Create a simple Squid

## Objective

This tutorial will take the Squid template and go through all the necessary steps to customize the project, in order to interact with a different Squid Archive, synchronized with a different blockchain, and process data from Events different from the ones in the template.

The business logic to process such Events is very basic, and that is on purpose since the purpose of the Tutorial is to show a simple case, highlighting the changes a developer would typically apply to the template, removing unnecessary complexity.

The blockchain used in this example will be the [Crust storage network](https://crust.network) and the final objective will be to observe which files have been added and deleted from the chain, as well as groups joined and storage orders placed by a determined account.

## Pre-requisites

The minimum requirements to follow this tutorial are the basic knowledge of software development, such as handling a Git repository, a correctly set up [Development Environment](development-environment-set-up.md), basic command line knowledge and the concepts explained in this documentation.

## Fork the template

The first thing to do, although it might sound trivial to GitHub experts, is to fork the repository into your own GitHub account, by visiting the [repository page](https://github.com/subsquid/squid-template) and clicking the Fork button:

![How to fork a repository on GitHub](<../.gitbook/assets/Screenshot 2022-02-02 111440.png>)

Next, clone the created repository (be careful of changing `<account>` with your own account

```
git clone git@github.com:<account>/squid-template.git
```

### Run the project

Next, just follow the [Quickstart](../quickstart.md) to get the project up and running, here's a list of commands to run in quick succession:

```
npm ci
npm run build
docker compose up -d
npx sqd db migrate
node -r dotenv/config lib/processor.js
# open a separate terminal for this next command
npx squid-graphql-server
```

Bear in mind this is not strictly **necessary**, but it is always useful to check that everything is in order. If you are not interested, you could at least get the Postgres container running with `docker compose up -d`.

## Install new dependencies

For this specific project, we will need to install a new dependency since the [type definitions](../faq/where-do-i-get-a-type-bundle-for-my-chain.md) for the Crust blockchain are implemented in the `@crustio/types-definition` package.

Navigate to the repository's root window in a command line console and install it.

![Install Crust type definition](https://i.gyazo.com/e135e7aa19b6217d1b701df8f51a91d2.gif)

## Define Entity Schema

The next thing to do, in order to customize the project for our own purpose, is to make changes to the schema and define the Entities we want to keep track of.

Because we said we want to track

* files added and deleted from the chain
* groups joined by a certain account
* storage orders placed by a certain account

We are going to make these changes to our `schema.graphql`:

{% code title="schema.graphql" %}
```graphql
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
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type JoinGroup @entity {
  id: ID!
  member: Account!
  owner: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type StorageOrder @entity {
  id: ID!
  account: Account!
  fileCid: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}
```
{% endcode %}

It's worth noticing that the `Account` entity is almost completely derived and it is there to tie the other three entities together, since Groups are joined by an Account, Storage Orders are placed by an Account and Work Reports, show files added and changed by, you guessed it, an Account!

This all requires some implicit knowledge of the blockchain itself ([here's a tip](../faq/how-do-i-know-which-events-and-extrinsics-i-need-for-the-handlers.md) on how to obtain this information).

To finalize this step, it is necessary to run the `codegen` tool, to generate TypeScript Entity classes for our schema definition:

```
npx sqd codegen
```

## Generate TypeScript types

The process to generate wrappers around TypeScript wrappers around Events and Extrinsics has a [dedicated page](../key-concepts/typegen.md) to explain it and a quick [Recipe](../recipes/generate-typescript-definitions.md) to guide you through it, so it is advised to consult them for more information.

What matters in the context of this tutorial, is to pay attention to the `chain`, `archive` and `out` parameters, which refer to the related WebSocket address of the Crust blockchain, the Squid Archive synchronized with it (this is optional, but helps speed up the process) and the output file simply contains the chain name as a good naming convention (this is useful in case of multiple chains handled in the same project or folder).

```
npx squid-substrate-metadata-explorer \
		--chain wss://rpc-crust-mainnet.decoo.io \
		--archive https://crust.indexer.gc.subsquid.io/v4/graphql \
		--out crustVersions.json
```

Next, we need to make a few changes in the typegen.json configuration file, to adapt it to our purposes. We want to specify the same JSON file used as output in the previous command (in this case, `crustVersions.json`), then we need to specify the events that we are interested in, for this project.

Similar to what's been said in the previous chapter, this requires knowledge of the blockchain itself and some research might be required, but in the case of this example, the events are:

* `WorksReportSuccess` from the `swork` pallet
* `JoinGroupSuccess` from the same pallet
* `FileSuccess` from the market pallet

{% code title="typegen.json" %}
```json
{
  "outDir": "src/types",
  "chainVersions": "crustVersions.json",
  "typesBundle": "kusama",
  "events": [
    "swork.WorksReportSuccess",
    "swork.JoinGroupSuccess",
    "market.FileSuccess"
  ],
  "calls": []
}

```
{% endcode %}

And finally, run the command to generate type-safe TypeScript wrappers around the metadata

```
npx squid-substrate-typegen typegen.json
```

## Define and bind Event Handlers

After having obtained wrappers for Events and the metadata changes across different Runtime versions, it's finally time to define Handlers for these Events and attach them to our [Processor](../key-concepts/processor.md), and this is done in the `src/processor.ts` file in the project folder.

First of all, we need to import the generated Entity model classes, in order to be able to use them in our code. And then, we need the type definitions from Crust, so that they can be set as configuration for the Processor itself. So let's add these two lines at the top of our file:

```typescript
import  {Account, WorkReport, JoinGroup, StorageOrder} from './model/generated'
import * as crustTypes from '@crustio/type-definitions'
```

Then, we need to customize the processor, by giving it the right name, connecting it to the right Squid Archive and setting the correct types. This is done by substituting with the following code the top part of the file, that looks similar to it.

```typescript
const processor = new SubstrateProcessor('crust_example')
processor.setDataSource({
    archive: 'https://crust.indexer.gc.subsquid.io/v4/graphql',
    chain: 'wss://rpc-crust-mainnet.decoo.io'
});
processor.setBlockRange({from: 583000}); // this is the starting block for exploring the change, please don't mind it.
processor.setTypesBundle(crustTypes);
```

Next,  because the added and deleted files are matrices, we are going to declare a function to handle that, for our own convenience. Simply add this code to the `src/processor.ts` file, anywhere.

```typescript
function stringifyArray(list: any[]): any[] {
  let listStr : any[] = [];
  list = list[0]
  for (let vec of list){
    for (let i = 0; i < vec.length; i++){
      vec[i] = String(vec[i]);
    }
    listStr.push(vec);
  }
  return listStr
}
```

Now, we are going to take a different approach from the template and define event handlers as functions, and then add bind them to the processor via the `processor.addEventHandler()` function call.

Here are the declarations for the Event handler functions, same as above, add this code somewhere in the file.

```typescript
async function joinGroupSuccess({
  store,
  event,
  block,
  extrinsic,
}: EventHandlerContext): Promise<void> {
  const memberId = String(event.params[0].value);
  const account = await getOrCreate(store, Account, memberId);
  
  const joinGroup = new JoinGroup();
  
  joinGroup.id = event.id;
  joinGroup.member = account;
  joinGroup.owner = String(event.params[1].value);

  joinGroup.blockHash = block.hash;
  joinGroup.blockNum = block.height;
  joinGroup.createdAt = new Date(block.timestamp);
  joinGroup.extrinisicId = extrinsic?.id;
  await store.save(account);
  await store.save(joinGroup);
}

async function fileSuccess({
  store,
  event,
  block,
  extrinsic,
}: EventHandlerContext): Promise<void> {
    const accountId = String(event.params[0].value);
    const account = await getOrCreate(store, Account, accountId);

    const storageOrder = new StorageOrder();
    storageOrder.id = event.id;
    storageOrder.account = account;
    storageOrder.fileCid =  String(event.params[1].value);
    storageOrder.blockHash = block.hash;
    storageOrder.blockNum = block.height;
    storageOrder.createdAt = new Date(block.timestamp);
    storageOrder.extrinisicId = extrinsic?.id;
    await store.save(account);
    await store.save(storageOrder);
  
}

async function workReportSuccess({
  store,
  event,
  block,
  extrinsic,
}: EventHandlerContext): Promise<void> {
  const accountId = String(event.params[0].value);
  const accountPr = getOrCreate(store, Account, accountId);
  const addedFilesObjPr = extrinsic?.args.find(arg => arg.name === "addedFiles");
  const deletedFilesObjPr = extrinsic?.args.find(arg => arg.name === "deletedFiles");

  const [account,addFObj,delFObj] = await Promise.all([accountPr,addedFilesObjPr,deletedFilesObjPr]);
  
  const workReport = new WorkReport();
  
  workReport.addedFiles = stringifyArray(Array(addFObj?.value))
  workReport.deletedFiles = stringifyArray(Array(delFObj?.value))
  if ((workReport.addedFiles.length > 0) || (workReport.deletedFiles.length > 0))
  { workReport.account = account;

  workReport.id = event.id;
  workReport.blockHash = block.hash;
  workReport.blockNum = block.height;
  workReport.createdAt = new Date(block.timestamp);
  workReport.extrinisicId = extrinsic?.id;
  
  await store.save(account);
  await store.save(workReport);
  }
}
```

Lastly, as mentioned earlier, we are going to get rid of the previous event handler, by replacing the code responsible for tying an anonymous function to the processor, with our own:

```typescript
processor.addEventHandler('market.FileSuccess', fileSuccess);
processor.addEventHandler('swork.JoinGroupSuccess', joinGroupSuccess);
processor.addEventHandler('swork.WorksReportSuccess', workReportSuccess);
```

<details>

<summary>Here is the end result, in case you missed something</summary>

{% code title="processor.ts" %}
```typescript
import {SubstrateProcessor, EventHandlerContext} from '@subsquid/substrate-processor'
import  {Account, WorkReport, JoinGroup, StorageOrder} from './model/generated'
import * as crustTypes from '@crustio/type-definitions'

const processor = new SubstrateProcessor('crust_example')
processor.setDataSource({
    archive: 'https://crust.indexer.gc.subsquid.io/v4/graphql',
    chain: 'wss://rpc-crust-mainnet.decoo.io'
});
processor.setBlockRange({from: 583000});
processor.setTypesBundle(crustTypes);
processor.addEventHandler('market.FileSuccess', fileSuccess);
processor.addEventHandler('swork.JoinGroupSuccess', joinGroupSuccess);
processor.addEventHandler('swork.WorksReportSuccess', workReportSuccess);

processor.run();

function stringifyArray(list: any[]): any[] {
  let listStr : any[] = [];
  list = list[0]
  for (let vec of list){
    for (let i = 0; i < vec.length; i++){
      vec[i] = String(vec[i]);
    }
    listStr.push(vec);
  }
  return listStr
}

async function joinGroupSuccess({
  store,
  event,
  block,
  extrinsic,
}: EventHandlerContext): Promise<void> {
  const memberId = String(event.params[0].value);
  const account = await getOrCreate(store, Account, memberId);
  
  const joinGroup = new JoinGroup();
  
  joinGroup.id = event.id;
  joinGroup.member = account;
  joinGroup.owner = String(event.params[1].value);

  joinGroup.blockHash = block.hash;
  joinGroup.blockNum = block.height;
  joinGroup.createdAt = new Date(block.timestamp);
  joinGroup.extrinisicId = extrinsic?.id;
  await store.save(account);
  await store.save(joinGroup);
}

async function fileSuccess({
  store,
  event,
  block,
  extrinsic,
}: EventHandlerContext): Promise<void> {
    const accountId = String(event.params[0].value);
    const account = await getOrCreate(store, Account, accountId);

    const storageOrder = new StorageOrder();
    storageOrder.id = event.id;
    storageOrder.account = account;
    storageOrder.fileCid =  String(event.params[1].value);
    storageOrder.blockHash = block.hash;
    storageOrder.blockNum = block.height;
    storageOrder.createdAt = new Date(block.timestamp);
    storageOrder.extrinisicId = extrinsic?.id;
    await store.save(account);
    await store.save(storageOrder);
  
}

async function workReportSuccess({
  store,
  event,
  block,
  extrinsic,
}: EventHandlerContext): Promise<void> {
  const accountId = String(event.params[0].value);
  const accountPr = getOrCreate(store, Account, accountId);
  const addedFilesObjPr = extrinsic?.args.find(arg => arg.name === "addedFiles");
  const deletedFilesObjPr = extrinsic?.args.find(arg => arg.name === "deletedFiles");

  const [account,addFObj,delFObj] = await Promise.all([accountPr,addedFilesObjPr,deletedFilesObjPr]);
  
  const workReport = new WorkReport();
  
  workReport.addedFiles = stringifyArray(Array(addFObj?.value))
  workReport.deletedFiles = stringifyArray(Array(delFObj?.value))
  if ((workReport.addedFiles.length > 0) || (workReport.deletedFiles.length > 0))
  { workReport.account = account;

  workReport.id = event.id;
  workReport.blockHash = block.hash;
  workReport.blockNum = block.height;
  workReport.createdAt = new Date(block.timestamp);
  workReport.extrinisicId = extrinsic?.id;
  
  await store.save(account);
  await store.save(workReport);
  }
}

async function getOrCreate<T extends {id: string}>(
    store: Store,
    entityConstructor: EntityConstructor<T>,
    id: string
): Promise<T> {

    let e = await store.get<T>(entityConstructor, {
        where: { id },
    })

    if (e == null) {
        e = new entityConstructor()
        e.id = id
    }

    return e
}


type EntityConstructor<T> = {
    new (...args: any[]): T
}

```
{% endcode %}

</details>

## Apply changes to the Database

Squid project automatically manages the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping). As such, we need to use the provided automated tools to manage the database schema and migrations.

### Remove default migration

First, we need to get rid of the template's default migration:

```
rm -rf db/migrations/*.js
```

Then, make sure the Postgres docker container is running, in order to have a database to connect to, and run the following commands:

```
npx sqd db drop
npx sqd db create
npx sqd db create-migration Init
npx sqd db migrate
```

These will, in order:

1. drop the current database
   * If you did not [Run the project](create-a-simple-squid.md#undefined), this is not necessary
2. create a new database
3. create the initial migration, by looking up the schema we defined in the previous chapter
4. apply the migration

![A migration has been applied to the database](https://i.gyazo.com/ee22b66e2f876a09d34a12c341d4cd65.gif)

