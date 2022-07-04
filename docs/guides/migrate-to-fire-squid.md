---
description: >-
  Subsquid SDK's latest release, code-named: 🔥🦑 brings a lot of new features
  and powerful improvements.
---

# Migrate to Fire Squid

## Overview

This guide goes through the necessary steps to migrate v5 projects to it and provides a summary of the new features and changes:

### Handling of call wrappers

The most common call wrappers (batch, proxy, sudo, etc...) are now being correctly handled and wrapped extrinsics can now be extracted and processed.

### Batch processing

A new `Processor` class has been developed, to ingest and process on-chain data in batches, significantly improving performance, when this is needed.

### Data Selection on Handler Context

This is a completely optional functionality, but this setting can be applied while attaching a Handler to the processor and will make sure the handler function will received only the specified fields.

### Multiple databases (foundational) support

New Database interfaces have been developed, that ensure support for different kind of databases.

### Lazy transactions

One of the aforementioned Database interfaces introduces lazy transactions, which reduce the resources dedicated to I/O against the DB and, as such, increase data handling speed. As a result, processing time are reduced.

### Logger interface

A `Logger` interface is injected into the new Handler Contexts. This is the new recommended way of logging as these will be tracked by our hosting service and even when used locally, they are color coded and have increased readability.

### WASM support

A complete new feature, support for `Contracts.ContractEmitted` event, which means, in fact, support for WASM contracts.

## Package update

The newest comes with the latest version of libraries and it may add a couple more packages as additional requirements. To make sure all the necessary dependencies are installed and at the latest version, launch this command:

```bash
npm i @subsquid/cli@latest \
@subsquid/graphql-server@latest \
@subsquid/ss58@latest  \
@subsquid/substrate-processor@latest \
@subsquid/typeorm-store@latest \
@subsquid/util-internal-hex@latest \
@subsquid/cli@latest\
 @subsquid/substrate-typegen@latest \
 @subsquid/substrate-metadata-explorer@latest
```

Packages can be installed one by one, but this command will make sure they are all being updated in one go.

## Database and Store changes

Historically, Subsquid SDK used a [Store interface](/docs/develop-a-squid/store-interface) as an abstraction layer over the database. As explained in the dedicated reference page, this is relies on the `typeorm` library.

In Fire Squid release, two new Database classes have been developed, that support two types of usage:

* `FullTypeormDatabase` - works exactly as in v5, but communicates through a plain `EntityManager` as a store, which does provide a `.get()` method
* `TypeormDatabase` (recommended) which communicates through the revised `Store` interface, which has these characteristics:
  * Has Lazy transactions (much faster for data updates, because `.save()` is done via `upsert`, so multiple calls translate to a single SQL statement)
  * Should be able to support unfinalized blocks
  * Is a stripped down version of EntityManager (no .query(), no cascading saves)

## Processor changes

### Instantiate with database class

The first and most notable change in this section is that the processor class now has to be initialized with a Database class. For example:

```typescript
const database = new TypeormDatabase();
const processor = new SubstrateProcessor(database);
```

### Data source

Subsquid runs FireSquid archives for major parachains. The endpoints are available via `@subsquid/archive-registry` package, which should be updated to the latest `1.x` version. The `lookupArchive` function must be uprgraded, as it now expecteds a mandatory `release` option, which at the time of writing is either `"FireSquid"` or `"v5"` (for old archives). Starting from `1.x`, `lookupArchives` returns the archive endpoint url that can be used with a processor straight away:

```typescript
const processor.setDataSource({
  archive: lookupArchive("kusama", { release: "FireSquid" }),
});
```

It also possible to additionally assert the genesis block hash in case the network name is ambigous:

```typescript
const processor.setDataSource({
  archive: lookupArchive("kusama", { 
    release: "FireSquid", 
    genesis: "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe" 
  }),
});
```


### Pallet names

When specifying an Event, an Extrinsic, or a Storage item, the processor has been changed to accept the pallet name with a capital letter. This is to respect the most common nomenclature:

```typescript
processor.addEventHandler("Balances.Transfer", processTransfers);
```

### Extrinsic Handler

The Extrinsic Handler has now been renamed to correctly reflect the ability to process call wrappers like batch, proxy, sudo, etc.

For this reason, `addExtrinsicHandler` has been renamed to `addCallHandler`

```typescript
processor.addCallHandler("Balances.transfer", processTransferCall);
```

And similarly, `ExtrinsicHandlerContext` has been renamed to `CallHandlerContext`.

### Internal handler vs External handler

When adding a Handler to the processor, one could either use an [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow\_functions) or a function defined elsewhere.

The former is what is referred to, in this context as an "Internal Handler", while the latter will be referred to as an "External Handler".

The signature of a Handler function has not fundamentally changed with the Fire Squid release, as they should still accept a Context argument. The big difference introduced with this release is that the Context definition uses [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) to specify the database interface (and potentially the data selection options) it should be using.

And the distinction between Internal Handler and External Handler is that Internal handlers will  automatically obtain the right context definition from the processor:

```typescript
processor.addEventHandler(
  'Balances.Transfer',
  async ctx => {
    // Your business logic
  }
)
```

While when defining an External Handler, the function signature has to reflect how the processor was instantiated, and use the right Database Interface in the Context type definition:

```typescript
processor.addEventHandler('Balances.Transfer', handleTransferEvent)

// This is an independently defined function and needs to specify 
// the context, and the database interface it will use
async function handleTransferEvent(ctx: EventHandlerContext<Store>){
   // Your business logic
}
```

A similar distinction applies to the data selection options. When using an Internal Handler, the data selection can be applied while adding the Handler to the processor:

```typescript
processor.addEventHandler(
    'Balances.Transfer',
    // Data selection option will make sure
    // only information about event args will be gathered
    {
        data: {
            event: {args: true}
        }
    },
    async ctx => {
        // Your business logic
    }
)
```

Whereas while using an External Handler, the Data Selection has to be specified in the Context definition:

```typescript
processor.addEventHandler('Balances.Transfer', handleTransferEvent)

// Same as the snippet above, only applied to an External Handler
async function handleTransferEvent(ctx: EventHandlerContext<Store, {event: {args: true}}>){
   // Your business logic
}
```

## Typegen

The packages responsible for exploring blockchain metadata and for generating type-safe wrappers for Events and Calls have all been updated. This update brings a breaking change and a significant upgrade to the `typegen.json` configuration file. Let's see an example first:

```json title="typegen.json"
{
  "outDir": "src/types",
  "specVersions": "https://kusama.archive.subsquid.io/graphql",
  "typesBundle": "kusama",
  "events": [
    "Balances.Transfer",
    "Balances.Deposit"
  ],
  "calls": []
}

```


The first and most important one is the fact that `chainVersion` field has been renamed to `specVersion`, this has been done to reflect to the true nature of this data: it is a list of version changes of the "specs" of a blockchain.

The second change is the fact that the metadata exploration step is now optional, meaning that instead of providing the `PATH` to a specVersion file, resulting from metadata exploration, one could simply provide the link to a new generation Subsquid Archive.

To make sure everything is in order, it is advisable to proceed as follow when migrating:

1. Delete your chain version JSON files (i.e. `kusamaVersion.json`)
2. Make sure you have update the packages to the latest version (see [here](migrate-to-fire-squid.md#package-update))
3. Launch the metadata explorer command (see [here](../develop-a-squid/substrate-support/typegen/#blockchain-metadata), or skip it and add the Archive URL in `typegen.json`)
4. Change the `typegen.json` configuration file as specified above
5. Launch the Typegen command to generate new interfaces (see [here](../develop-a-squid/substrate-support/typegen/#typescript-class-wrappers))
