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

Next, clone the created repository (be careful of changing `<account>` with your own account)

```
git clone git@github.com:<account>/squid-template.git
```

For reference on the complete work, you can find the entire project [here](https://github.com/RaekwonIII/squid-template/tree/crust-integration-demo).

### Run the project

Next, just follow the [Quickstart](../quickstart.md) to get the project up and running, here's a list of commands to run in quick succession:

```bash
npm ci
npm run build
docker compose up -d
npx sqd db create
npx sqd db migrate
node -r dotenv/config lib/processor.js
# open a separate terminal for this next command
npx squid-graphql-server
```

Bear in mind this is not strictly **necessary**, but it is always useful to check that everything is in order. If you are not interested, you could at least get the Postgres container running with `docker compose up -d`.

## Install new dependencies

For this specific project, we will need to install a new dependency since the [type definitions](../faq/where-do-i-get-a-type-bundle-for-my-chain.md) for the Crust blockchain are implemented in the `@crustio/types-definition` package.

Navigate to the repository's root window in a command line console and install it.

```
npm i @crustio/type-definitions
```

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
{% endcode %}

It's worth noticing that the `Account` entity is almost completely derived and it is there to tie the other three entities together, since Groups are joined by an Account, Storage Orders are placed by an Account and Work Reports, show files added and changed by, you guessed it, an Account!

This all requires some implicit knowledge of the blockchain itself ([here's a tip](../faq/how-do-i-know-which-events-and-extrinsics-i-need-for-the-handlers.md) on how to obtain this information).

To finalize this step, it is necessary to run the `codegen` tool, to generate TypeScript Entity classes for our schema definition:

```bash
npx sqd codegen
```

## Generate TypeScript interfaces

The process to generate wrappers around TypeScript wrappers around Events and Extrinsics has a [dedicated page](../key-concepts/typegen.md) to explain it and a quick [Recipe](../recipes/running-a-squid/generate-typescript-definitions.md) to guide you through it, so it is advised to consult them for more information.

### Chain exploration

What matters in the context of this tutorial, is to pay attention to the `chain`, `archive` and `out` parameters, which refer to the related WebSocket address of the Crust blockchain, the Squid Archive synchronized with it (this is optional, but helps speed up the process) and the output file simply contains the chain name as a good naming convention (this is useful in case of multiple chains handled in the same project or folder).

```bash
npx squid-substrate-metadata-explorer \
		--chain wss://rpc-crust-mainnet.decoo.io \
		--archive https://crust.indexer.gc.subsquid.io/v4/graphql \
		--out crustVersions.json
```

The output is visible in the `crustVersions.json` file, and although the `metadata` field is intelligible, it's worth noting that there are 13 different `versions`, meaning the Runtime has changed 13 times.

It remains to be seen if this had any impacts on the definitions of the Events we are interested in.

### Types bundle

One peculiar thing about the Crust chain and this example is that, at the moment of writing of this guide, its types have not been integrated into Squid's library.

This gives us a good opportunity to follow [this mini-guide](../faq/where-do-i-get-a-type-bundle-for-my-chain.md) and create an example, extracting a types bundle from crust's own library, to Subsquid required format.

{% hint style="info" %}
**Update**: the "crust" types bundle has been added to the list of built-ins, but for learning purposes, it's still useful to see how to create and use a types bundle JSON file.
{% endhint %}

<details>

<summary>Here is the end result, copy it and paste it into a file named <code>crustTypesBundle.json</code></summary>

{% code title="crustTypesBundle.json" %}
```json
{
    "types": {},
    "typesAlias": {},
    "versions": [
      {
        "minmax": [
          null,
          null
        ],
        "types": {
          "MerchantLedger": { "reward": "Balance", "collateral": "Balance" },
          "FileInfoV2": {
              "file_size": "u64",
              "spower": "u64",
              "expired_at": "BlockNumber",
              "calculated_at": "BlockNumber",
              "amount": "Compact<Balance>",
              "prepaid": "Compact<Balance>",
              "reported_replica_count": "u32",
              "remaining_paid_count": "u32",
              "replicas": "BTreeMap<AccountId, Replica<AccountId>>"
          },
          "UsedInfo": {
            "used_size": "u64",
            "reported_group_count": "u32",
            "groups": "BTreeMap<SworkerAnchor, bool>"
          },
          "AccountInfo": "AccountInfoWithProviders",
          "Address": "AccountId",
          "AddressInfo": "Vec<u8>",
          "LookupSource": "AccountId",
          "EraBenefits": {
            "total_fee_reduction_quota": "Compact<Balance>",
            "total_market_active_funds": "Compact<Balance>",
            "used_fee_reduction_quota": "Compact<Balance>",
            "active_era": "Compact<EraIndex>"
          },
          "FundsType": {
            "_enum": [
              "SWORK",
              "MARKET"
            ]
          },
          "FundsUnlockChunk": {
            "value": "Compact<Balance>",
            "era": "Compact<EraIndex>"
          },
          "MarketBenefit": {
            "total_funds": "Compact<Balance>",
            "active_funds": "Compact<Balance>",
            "used_fee_reduction_quota": "Compact<Balance>",
            "file_reward": "Compact<Balance>",
            "refreshed_at": "Compact<EraIndex>",
            "unlocking_funds": "Vec<FundsUnlockChunk<Balance>>"
          },
          "SworkBenefit": {
            "total_funds": "Compact<Balance>",
            "active_funds": "Compact<Balance>",
            "total_fee_reduction_count": "u32",
            "used_fee_reduction_count": "u32",
            "refreshed_at": "Compact<EraIndex>",
            "unlocking_funds": "Vec<FundsUnlockChunk<Balance>>"
          },
          "BridgeChainId": "u8",
          "ChainId": "u8",
          "ResourceId": "H256",
          "DepositNonce": "u64",
          "ProposalStatus": {
            "_enum": [
              "Initiated",
              "Approved",
              "Rejected"
            ]
          },
          "ProposalVotes": {
            "votes_for": "Vec<AccountId>",
            "votes_against": "Vec<AccountId>",
            "status": "ProposalStatus",
            "expiry": "BlockNumber"
          },
          "Erc721Token": {
            "id": "TokenId",
            "metadata": "Vec<u8>"
          },
          "TokenId": "U256",
          "ETHAddress": "Vec<u8>",
          "EthereumTxHash": "H256",
          "Lock": {
            "total": "Compact<Balance>",
            "last_unlock_at": "BlockNumber",
            "lock_type": "LockType"
          },
          "LockType": {
            "delay": "BlockNumber",
            "lock_period": "u32"
          },
          "FileInfo": {
            "file_size": "u64",
            "spower": "u64",
            "expired_at": "BlockNumber",
            "calculated_at": "BlockNumber",
            "amount": "Compact<Balance>",
            "prepaid": "Compact<Balance>",
            "reported_replica_count": "u32",
            "replicas": "Vec<Replica<AccountId>>"
          },
          "Replica": {
            "who": "AccountId",
            "valid_at": "BlockNumber",
            "anchor": "SworkerAnchor",
            "is_reported": "bool",
            "created_at": "Option<BlockNumber>"
          },
          "Guarantee": {
            "targets": "Vec<IndividualExposure<AccountId, Balance>>",
            "total": "Compact<Balance>",
            "submitted_in": "EraIndex",
            "suppressed": "bool"
          },
          "ValidatorPrefs": {
            "guarantee_fee": "Compact<Perbill>"
          },
          "Group": {
            "members": "BTreeSet<AccountId>",
            "allowlist": "BTreeSet<AccountId>"
          },
          "IASSig": "Vec<u8>",
          "Identity": {
            "anchor": "SworkerAnchor",
            "punishment_deadline": "u64",
            "group": "Option<AccountId>"
          },
          "ISVBody": "Vec<u8>",
          "MerkleRoot": "Vec<u8>",
          "ReportSlot": "u64",
          "PKInfo": {
            "code": "SworkerCode",
            "anchor": "Option<SworkerAnchor>"
          },
          "SworkerAnchor": "Vec<u8>",
          "SworkerCert": "Vec<u8>",
          "SworkerCode": "Vec<u8>",
          "SworkerPubKey": "Vec<u8>",
          "SworkerSignature": "Vec<u8>",
          "WorkReport": {
            "report_slot": "u64",
            "spower": "u64",
            "free": "u64",
            "reported_files_size": "u64",
            "reported_srd_root": "MerkleRoot",
            "reported_files_root": "MerkleRoot"
          }
        }
      }
    ]
  }
```
{% endcode %}

</details>

### Events wrappers generation

Next, we need to make a few changes in the `typegen.json` configuration file, to adapt it to our purposes. We want to specify the same JSON file used as output in the previous command (in this case, `crustVersions.json`), then we need to specify the events that we are interested in, for this project.

Similar to what's been said in the previous chapter, this requires knowledge of the blockchain itself and some research might be required, but in the case of this example, the events are:

* `WorksReportSuccess` from the `swork` pallet
* `JoinGroupSuccess` from the same pallet
* `FileSuccess` from the market pallet

{% code title="typegen.json" %}
```json
{
  "outDir": "src/types",
  "chainVersions": "crustVersions.json",
  "typesBundle": "crustTypesBundle.json",
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

```bash
npx squid-substrate-typegen typegen.json
```

<details>

<summary>The end result is in the <code>src/types/events.ts</code> file (because we only defined Events in our <code>typegen.json</code>) and should look something like this.</summary>

{% code title="events.ts" %}
```typescript
import assert from 'assert'
import {EventContext, Result} from './support'

export class MarketFileSuccessEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'market.FileSuccess')
  }

  /**
   *  Place a storage order success.
   *  The first item is the account who places the storage order.
   *  The second item is the cid of the file.
   */
  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('market.FileSuccess') === '1a9528ba42fbec479c5a2ecdb509dab8c0ec5ddad8673e9644881405cc5b2548'
  }

  /**
   *  Place a storage order success.
   *  The first item is the account who places the storage order.
   *  The second item is the cid of the file.
   */
  get asLatest(): [Uint8Array, Uint8Array] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SworkJoinGroupSuccessEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'swork.JoinGroupSuccess')
  }

  /**
   *  Join the group success.
   *  The first item is the member's account.
   *  The second item is the group owner's account.
   */
  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('swork.JoinGroupSuccess') === '84a7eea101cadd963f8546bf8d9902de6418d1692a799fcbd8dc2b2ae2e5f947'
  }

  /**
   *  Join the group success.
   *  The first item is the member's account.
   *  The second item is the group owner's account.
   */
  get asLatest(): [Uint8Array, Uint8Array] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

export class SworkWorksReportSuccessEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'swork.WorksReportSuccess')
  }

  /**
   *  Send the work report success.
   *  The first item is the account who send the work report
   *  The second item is the pub key of the sWorker.
   */
  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('swork.WorksReportSuccess') === '15de934ea25c85a846abb0c440c91b6dd207f2f512a0529b611dcd2e796b2319'
  }

  /**
   *  Send the work report success.
   *  The first item is the account who send the work report
   *  The second item is the pub key of the sWorker.
   */
  get asLatest(): [Uint8Array, Uint8Array] {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}
```
{% endcode %}

</details>

## Define and bind Event Handlers

After having obtained wrappers for Events and the metadata changes across different Runtime versions, it's finally time to define Handlers for these Events and attach them to our [Processor](../key-concepts/processor.md), and this is done in the `src/processor.ts` file in the project folder.

First of all, we need to import the generated Entity model classes, in order to be able to use them in our code. And then, we need the type definitions of Crust events, so that they can be used to wrap them. So let's add these two lines at the top of our file:

```typescript
import  {Account, WorkReport, JoinGroup, StorageOrder} from './model/generated'
import { MarketFileSuccessEvent, SworkJoinGroupSuccessEvent, SworkWorksReportSuccessEvent } from './types/events'
```

Then, we need to customize the processor, by giving it the right name, connecting it to the right Squid Archive and setting the correct types. This is done by substituting with the following code the top part of the file, that looks similar to it.

```typescript
const processor = new SubstrateProcessor('crust_example')
processor.setDataSource({
    archive: 'https://crust.indexer.gc.subsquid.io/v4/graphql',
    chain: 'wss://rpc-crust-mainnet.decoo.io'
});
processor.setBlockRange({from: 583000}); // this is the starting block for exploring the chain, please don't mind it.
processor.setTypesBundle(crustTypes);
```

Next, because the added and deleted files are matrices, we are going to declare a function to handle that, for our own convenience. Simply add this code to the `src/processor.ts` file, anywhere.

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
async function joinGroupSuccess(ctx: EventHandlerContext): Promise<void> {
  let event = new SworkJoinGroupSuccessEvent(ctx);
  const memberId = String(event.asLatest[0]);
  const account = await getOrCreate(ctx.store, Account, memberId);
  const joinGroup = new JoinGroup();
  
  joinGroup.id = ctx.event.id;
  joinGroup.member = account;
  joinGroup.owner = String(event.asLatest[1]);
  joinGroup.blockHash = ctx.block.hash;
  joinGroup.blockNum = ctx.block.height;
  joinGroup.createdAt = new Date(ctx.block.timestamp);
  joinGroup.extrinsicId = ctx.extrinsic?.id;

  await ctx.store.save(account);
  await ctx.store.save(joinGroup);
}

async function fileSuccess(ctx: EventHandlerContext): Promise<void> {
  let event = new MarketFileSuccessEvent(ctx);
   const accountId = String(event.asLatest[0]);
   const account = await getOrCreate(ctx.store, Account, accountId);
   const storageOrder = new StorageOrder();

   storageOrder.id = ctx.event.id;
   storageOrder.account = account;
    storageOrder.fileCid =  String(event.asLatest[1]);
    storageOrder.blockHash = ctx.block.hash;
    storageOrder.blockNum = ctx.block.height;
    storageOrder.createdAt = new Date(ctx.block.timestamp);
    storageOrder.extrinsicId = ctx.extrinsic?.id;

    await ctx.store.save(account);
    await ctx.store.save(storageOrder);
  
}

async function workReportSuccess(ctx: EventHandlerContext): Promise<void> {
  let event = new SworkWorksReportSuccessEvent(ctx);
  const accountId = String(event.asLatest[0]);
  const accountPr = getOrCreate(ctx.store, Account, accountId);
  const addedFilesObjPr = ctx.extrinsic?.args.find(arg => arg.name === "addedFiles");
  const deletedFilesObjPr = ctx.extrinsic?.args.find(arg => arg.name === "deletedFiles");
  const [account,addFObj,delFObj] = await Promise.all([accountPr,addedFilesObjPr,deletedFilesObjPr]);
  
  const workReport = new WorkReport();
  
  workReport.addedFiles = stringifyArray(Array(addFObj?.value))
  workReport.deletedFiles = stringifyArray(Array(delFObj?.value))
  if ((workReport.addedFiles.length > 0) || (workReport.deletedFiles.length > 0))
  { workReport.account = account;

  workReport.id = ctx.event.id;
  workReport.blockHash = ctx.block.hash;
  workReport.blockNum = ctx.block.height;
  workReport.createdAt = new Date(ctx.block.timestamp);
  workReport.extrinsicId = ctx.extrinsic?.id;
  
  await ctx.store.save(account);
  await ctx.store.save(workReport);
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
import {
  SubstrateProcessor,
  EventHandlerContext,
  Store,
} from "@subsquid/substrate-processor";
import {
  Account,
  WorkReport,
  JoinGroup,
  StorageOrder,
} from "./model/generated";
import * as crustTypes from "@crustio/type-definitions";
import {
  MarketFileSuccessEvent,
  SworkJoinGroupSuccessEvent,
  SworkWorksReportSuccessEvent,
} from "./types/events";

const processor = new SubstrateProcessor("crust_example");
processor.setDataSource({
  archive: "https://crust.indexer.gc.subsquid.io/v4/graphql",
  chain: "wss://rpc-crust-mainnet.decoo.io",
});
processor.setBlockRange({ from: 583000 });
processor.setTypesBundle(crustTypes);
processor.addEventHandler("market.FileSuccess", fileSuccess);
processor.addEventHandler("swork.JoinGroupSuccess", joinGroupSuccess);
processor.addEventHandler("swork.WorksReportSuccess", workReportSuccess);

processor.run();

function stringifyArray(list: any[]): any[] {
  let listStr: any[] = [];
  list = list[0];
  for (let vec of list) {
    for (let i = 0; i < vec.length; i++) {
      vec[i] = String(vec[i]);
    }
    listStr.push(vec);
  }
  return listStr;
}

async function joinGroupSuccess(ctx: EventHandlerContext): Promise<void> {
  let event = new SworkJoinGroupSuccessEvent(ctx);
  const memberId = String(event.asV1[0]);
  const account = await getOrCreate(ctx.store, Account, memberId);
  const joinGroup = new JoinGroup();

  joinGroup.id = ctx.event.id;
  joinGroup.member = account;
  joinGroup.owner = String(event.asV1[1]);
  joinGroup.blockHash = ctx.block.hash;
  joinGroup.blockNum = ctx.block.height;
  joinGroup.createdAt = new Date(ctx.block.timestamp);
  joinGroup.extrinisicId = ctx.extrinsic?.id;

  //console.log(joinGroup);
  await ctx.store.save(account);
  await ctx.store.save(joinGroup);
}

async function fileSuccess(ctx: EventHandlerContext): Promise<void> {
  let event = new MarketFileSuccessEvent(ctx);
  const accountId = String(event.asV1[0]);
  const account = await getOrCreate(ctx.store, Account, accountId);
  const storageOrder = new StorageOrder();

  storageOrder.id = ctx.event.id;
  storageOrder.account = account;
  storageOrder.fileCid = String(event.asV1[1]);
  storageOrder.blockHash = ctx.block.hash;
  storageOrder.blockNum = ctx.block.height;
  storageOrder.createdAt = new Date(ctx.block.timestamp);
  storageOrder.extrinisicId = ctx.extrinsic?.id;

  //console.log(storageOrder);
  await ctx.store.save(account);
  await ctx.store.save(storageOrder);
}

async function workReportSuccess(ctx: EventHandlerContext): Promise<void> {
  let event = new SworkWorksReportSuccessEvent(ctx);
  const accountId = String(event.asV1[0]);
  const accountPr = getOrCreate(ctx.store, Account, accountId);
  const addedFilesObjPr = ctx.extrinsic?.args.find(
    (arg) => arg.name === "addedFiles"
  );
  const deletedFilesObjPr = ctx.extrinsic?.args.find(
    (arg) => arg.name === "deletedFiles"
  );
  const [account, addFObj, delFObj] = await Promise.all([
    accountPr,
    addedFilesObjPr,
    deletedFilesObjPr,
  ]);

  const workReport = new WorkReport();

  //console.log(addFObj);
  //console.log(delFObj);

  workReport.addedFiles = stringifyArray(Array(addFObj?.value));
  workReport.deletedFiles = stringifyArray(Array(delFObj?.value));
  if (workReport.addedFiles.length > 0 || workReport.deletedFiles.length > 0) {
    workReport.account = account;

    workReport.id = ctx.event.id;
    workReport.blockHash = ctx.block.hash;
    workReport.blockNum = ctx.block.height;
    workReport.createdAt = new Date(ctx.block.timestamp);
    workReport.extrinisicId = ctx.extrinsic?.id;

    await ctx.store.save(account);
    await ctx.store.save(workReport);
  }
}

async function getOrCreate<T extends { id: string }>(
  store: Store,
  entityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> {
  let e = await store.get<T>(entityConstructor, {
    where: { id },
  });

  if (e == null) {
    e = new entityConstructor();
    e.id = id;
  }

  return e;
}

type EntityConstructor<T> = {
  new (...args: any[]): T;
};

```
{% endcode %}

</details>

A repository with the entire project is also available on [GitHub](https://github.com/subsquid/squid-crust-example). If you like it, please leave a :star:

## Apply changes to the Database

Squid project automatically manages the database connection and schema, via an [ORM abstraction](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping). As such, we need to use the provided automated tools to manage the database schema and migrations.

### Remove default migration

First, we need to get rid of the template's default migration:

```bash
rm -rf db/migrations/*.js
```

Then, make sure the Postgres docker container is running, in order to have a database to connect to, and run the following commands:

```bash
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

![Drop the database, re-create it, generate a migration and apply it](https://i.gyazo.com/8a9ed2b334f6cece50dee6f6c87e18d1.gif)

## Launch the project

It's finally time to run the project. First of all, let's build the code

```
npm run build
```

And then launch the processor (this will block the current terminal)

```bash
node -r dotenv/config lib/processor.js
```

Launch the GraphQL server (in a separate command line console window)

```
npx squid-graphql-server
```

And see the results for ourselves the result of our hard work, by visiting the `localhost:4350/graphql` URL in a browser and accessing the [GraphiQl](https://github.com/graphql/graphiql) console.

From this window, we can perform queries such as this one, to find which files have been added or deleted by an account:

```graphql
query AccountFiles{
  accountById(id: <accountID>) {
    workReports {
      addedFiles
      deletedFiles
    }
  }
}
```

It is advisable to search for an Account first and grab its ID.

## Credits

This sample project is actually a real integration, developed by our very own [Mikhail Shulgin](https://github.com/ma-shulgin). Credits for building it and helping with the guide go to him.
