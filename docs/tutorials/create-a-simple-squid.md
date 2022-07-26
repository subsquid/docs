---
id: create-a-simple-squid
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

![How to fork a repository on GitHub](</img/.gitbook/assets/Screenshot-2022-02-02-111440.png>)

Next, clone the created repository (be careful of changing `<account>` with your own account)

```bash
git clone git@github.com:<account>/squid-template.git
```

For reference on the complete work, you can find the entire project [here](https://github.com/subsquid/squid-crust-example).

### Run the project

Next, just follow the [Quickstart](/docs/quickstart) to get the project up and running, here's a list of commands to run in quick succession:

```bash
npm ci
npm run build
make up
make migrate
make process
# open a separate terminal for this next command
make serve
```

Bear in mind this is not strictly **necessary**, but it is always useful to check that everything is in order.

:::info
These commands are supposed to be run the first time, right after cloning the template.

Some, like `make up` or `make migrate`, may throw a warning or an error, because the container is already running and migration had already been applied.
:::

If you are not interested, you could at least get the Postgres container running with `make up`.

## Define Entity Schema

The next thing to do, in order to customize the project for our own purpose, is to make changes to the schema and define the Entities we want to keep track of.

Because we said we want to track

* files added and deleted from the chain
* groups joined by a certain account
* storage orders placed by a certain account

We are going to make these changes to our `schema.graphql`:

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

It's worth noticing that the `Account` entity is almost completely derived and it is there to tie the other three entities together, since Groups are joined by an Account, Storage Orders are placed by an Account and Work Reports, show files added and changed by, you guessed it, an Account!

This all requires some implicit knowledge of the blockchain itself ([here's a tip](/docs/support/how-do-i-know-which-events-and-extrinsics-i-need-for-the-handlers.md) on how to obtain this information).

To finalize this step, it is necessary to run the `codegen` tool:

```bash
make codegen
```

This will automatically generate TypeScript Entity classes for our schema definition, which can be found under the `src/model/generated` folder in the project.

## Generate TypeScript interfaces

The process to generate wrappers around TypeScript wrappers around Events and Extrinsics has a [dedicated page](../develop-a-squid/substrate-support/typegen/README.md) to explain it and guide you through it, so it is advised to consult them for more information.

### Chain exploration

:::info
It is advised to skip the **manual** chain exploration step, and just head over directly to the [Typegen](#events-wrappers-generation) section below, following the instructions.
:::

What matters in the context of this tutorial, is to pay attention to the `chain`, `archive` and `out` parameters, which refer to the related WebSocket address of the Crust blockchain, the Squid Archive synchronized with it (this is optional, but helps speed up the process) and the output file simply contains the chain name as a good naming convention (this is useful in case of multiple chains handled in the same project or folder).

```bash
npx squid-substrate-metadata-explorer \
    --chain wss://rpc-crust-mainnet.decoo.io \
    --archive https://crust.archive.subsquid.io/graphql \
    --out crustVersions.json
```

The output is visible in the `crustVersions.json` file, and although the `metadata` field is intelligible, it's worth noting that (at the time of creating of this tutorial) there are 13 different `versions`, meaning the Runtime has changed 13 times.

It remains to be seen if this had any impacts on the definitions of the Events we are interested in.

### Types bundle

One peculiar thing about the Crust chain and this example is that, at the moment of writing of this guide, its types have not been integrated into Squid's library.

This gives us a good opportunity to follow [this mini-guide](/docs/support/where-do-i-get-a-type-bundle-for-my-chain.md) and create an example, extracting a types bundle from crust's own library, to Subsquid required format.

:::info
**Update**: the "crust" types bundle has been added to the list of built-ins, but for learning purposes, it's still useful to see how to create and use a types bundle JSON file.
:::

<details>

<summary>Here is the end result, copy it and paste it into a file named `crustTypesBundle.json`</summary>

```json title="crustTypesBundle.json"
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

</details>

### Events wrappers generation

The **"Fire Squid"** release allows to collapse the metadata exploration and the type-safe wrappers generation steps into one, by specifying the URL of the Squid Archive dedicated to the blockchain subject of the project in the `specVersion` field in the `typegen.json` config file. In doing so, it is possible to skip launching the `metadata-explore` command from the previous section and generate type-safe interfaces with only one command, as explained below.

This is the best course of actions and the advised procedure going forward. This is because the newest version of Squid Archives store the chain's metadata information and the `typegen` command is able to leverage that.

That being said, we need to make a few changes in the `typegen.json` configuration file, to adapt it to our purposes and we do that by specifying the events that we are interested in, for this project.

Similar to what's been said in the previous chapter, this requires knowledge of the blockchain itself and some research might be required, but in the case of this example, the events are:

* `WorksReportSuccess` from the `swork` pallet
* `JoinGroupSuccess` from the same pallet
* `FileSuccess` from the `market` pallet

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

:::info
In case someone wants to still perform the `metadata exploration` step manually and produce the resulting JSON file (for example for manual inspection, debugging or simple consultation) they can do so by following the instructions in previous section, and then use the generated file by changing the `specVersions` field in `typegen.json, and finally launching the command in a console.

```json title="typegen.json"
{
  ...
  "specVersions": "crustVersions.json",
  ...
}
```

:::

And finally, run the command to generate type-safe TypeScript wrappers around the metadata

```bash
make typegen
```

<details>

<summary>The end result is in the <code>src/types/events.ts</code> file (because we only defined Events in our <code>typegen.json</code>) and should look something like this.</summary>

```typescript title="events.ts"
import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'
import * as v1 from './v1'

export class MarketFileSuccessEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Market.FileSuccess')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Place a storage order success.
   *  The first item is the account who places the storage order.
   *  The second item is the cid of the file.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Market.FileSuccess') === '15a3ff7f9477a0e9afa431990d912c8024d507c02d31c44934807bcebbbd3adf'
  }

  /**
   *  Place a storage order success.
   *  The first item is the account who places the storage order.
   *  The second item is the cid of the file.
   */
  get asV1(): [v1.AccountId, v1.MerkleRoot] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class SworkJoinGroupSuccessEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Swork.JoinGroupSuccess')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Join the group success.
   *  The first item is the member's account.
   *  The second item is the group owner's account.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Swork.JoinGroupSuccess') === 'e54ae910805a8a9413af1a7f5885a5d0ba5f4e105175cd6b0ce2a8702ddf1861'
  }

  /**
   *  Join the group success.
   *  The first item is the member's account.
   *  The second item is the group owner's account.
   */
  get asV1(): [v1.AccountId, v1.AccountId] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

export class SworkWorksReportSuccessEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Swork.WorksReportSuccess')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   *  Send the work report success.
   *  The first item is the account who send the work report
   *  The second item is the pub key of the sWorker.
   */
  get isV1(): boolean {
    return this._chain.getEventHash('Swork.WorksReportSuccess') === '15a3ff7f9477a0e9afa431990d912c8024d507c02d31c44934807bcebbbd3adf'
  }

  /**
   *  Send the work report success.
   *  The first item is the account who send the work report
   *  The second item is the pub key of the sWorker.
   */
  get asV1(): [v1.AccountId, v1.SworkerPubKey] {
    assert(this.isV1)
    return this._chain.decodeEvent(this.event)
  }
}

```

</details>

## Define and bind Event Handlers

After having obtained wrappers for Events and the metadata changes across different Runtime versions, it's finally time to define Handlers for these Events and attach them to our [Processor](/docs/develop-a-squid/squid-processor), and this is done in the `src/processor.ts` file in the project folder.

We will end up replacing the code in this file almost entirely, leaving only a few useful pieces, but we are going to take a step-by-step approach, showing where essential changes have to be made, but the final result will be visible at the end of this section.

First of all, we need to import the generated Entity model classes, in order to be able to use them in our code. And then, we need the type definitions of Crust events, so that they can be used to wrap them. Let's replace previous models and types import at the top of our file with these two lines:

```typescript
import  {Account, WorkReport, JoinGroup, StorageOrder} from './model/generated'
import { MarketFileSuccessEvent, SworkJoinGroupSuccessEvent, SworkWorksReportSuccessEvent } from './types/events'
```

Then, we need to customize the processor, by setting the right Squid Archive as a Data Source and specifying the right Events we want to index. This is done by applying the necessary changes to the first few line of code after the imports. In the end, it should look like this:

```typescript
const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setDataSource({
    archive: lookupArchive("crust", { release: "FireSquid" }),
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
Pay attention to the `addEvent` functions here. In the first two cases, with respect to the template, we have added the `extrinsic` and `call` fields to the object, signaling to the processor that we request that additional information. In the third function call, for the `Swork.WorksReportSuccess` event, we omitted the `DataSelection` object, which means we don't want to filter incoming information at all.
:::

Next, because the added and deleted files are matrices, we are going to declare a function to handle that, for our own convenience. Simply add this code to the `src/processor.ts` file, anywhere.

```typescript
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

The declared `Item` and `Ctx` types are still useful, so we are going to keep them. Let's skip for a section the `process.run()` call, we are going to come back to it in a second, and let's go ahead and scroll down to the `getTransfers` function. In the template repository, this function loops through the items contained in the context, extracts the Event's data, which is stored in an Interface and builds a list of these interfaces.

For this project, we need to do something similar, but not exactly the same: in order to process the three events we want to index, we need to extract Event data from the passed context, depending on the Event's name and store that information. But this time, we are saving the data directly to the database models, and we also need to handle the the Account information separately and we'll look at how it is dealt with in a moment.

We still need the AccountIds, though, so we are building some special interfaces to keep track of the rapport between an AccountId and the data related to it. Let's start with deleting the `TransferEvent` interface and defining this, instead:

```typescript
type Tuple<T,K> = [T,K];
interface EventInfo {
  joinGroups: Tuple<JoinGroup, string>[];
  marketFiles: Tuple<StorageOrder, string>[];
  workReports: Tuple<WorkReport, string>[];
  accountIds: Set<string>;
}
```

Now, let's take the `getTransfers` function. Remove it and replace it with this snippet. As described earlier, this will:

* extract Event information, differently for each Event (using the `item.name` to distinguish between them)
* store Event information in a database Model and map it to the `accountId`
* store the `accountId` in the set of Id we are collecting

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

:::info
Pay attention to the fact that we did not use a `Map<string, >` object, because for a single `accountId` there could be multiple entries. What we care about storing, in this case, is the relationship between the event data, stored in a model, and the accountId which is related to it. This is so that, when the `Account` model for an `accountId` is created, we can add that information to the Event model.
:::

When all of this is done, we want to treat the set of `accountId`s, create a database Model for each of them, then go back and add the `Account` information in all of the Event Models (for this we are going to re-use the existing `getAccount` function). Finally, save all the created and modified database models. Let's take the code inside `processor.run()` and change it so it looks like this:

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

<details>

<summary>Here is the end result, in case you missed something</summary>

```typescript title="processor.ts"
import { lookupArchive } from "@subsquid/archive-registry";
import * as ss58 from "@subsquid/ss58";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  toHex,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { In } from "typeorm";
import {
  Account,
  WorkReport,
  JoinGroup,
  StorageOrder,
} from "./model/generated";
import {
  MarketFileSuccessEvent,
  SworkJoinGroupSuccessEvent,
  SworkWorksReportSuccessEvent,
} from "./types/events";

const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setDataSource({
    archive: lookupArchive("crust", { release: "FireSquid" }),
  })
  .setBlockRange({ from: 583000 })
  .addEvent("Market.FileSuccess", {
    data: { event: { args: true , extrinsic: true, call: true} },
  } as const)
  .addEvent("Swork.JoinGroupSuccess", {
    data: { event: { args: true , extrinsic: true, call: true} },
  } as const)
  .addEvent("Swork.WorksReportSuccess");

type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

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

type Tuple<T,K> = [T,K];
interface EventInfo {
  joinGroups: Tuple<JoinGroup, string>[];
  marketFiles: Tuple<StorageOrder, string>[];
  workReports: Tuple<WorkReport, string>[];
  accountIds: Set<string>;
}

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

function getAccount(m: Map<string, Account>, id: string): Account {
  let acc = m.get(id);
  if (acc == null) {
    acc = new Account();
    acc.id = id;
    m.set(id, acc);
  }
  return acc;
}


```

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
npx squid-typeorm-migration generate
npx squid-typeorm-migration apply
```

These will, in order:

1. create the initial migration, by looking up the schema we defined in the previous chapter
2. apply the migration

## Launch the project

It's finally time to run the project. First of all, let's build the code

```bash
npm run build
```

And then launch the processor (this will block the current terminal)

```bash
node -r dotenv/config lib/processor.js
```

Launch the GraphQL server (in a separate command line console window)

```bash
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
