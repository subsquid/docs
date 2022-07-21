---
description: >-
  Subsquid SDK's latest release, code-named: 🔥🦑 brings a lot of new features
  and powerful improvements.
---

# Migrate to Fire Squid

## Overview

This guide goes through the necessary steps to migrate v5 projects to it and provides a summary of the new features and changes:

## 1 Package version updates for FireSquid

FireSquid release requires version bumps for most of the subsquid packages. Consult [squid-template](https://github.com/subsquid/squid-template/blob/main/package.json) for a reference setup. 
 

The following versions should be updated to latest:

```bash
npm i @subsquid/cli@latest \
@subsquid/substrate-processor@latest \
@subsquid/typeorm-store@latest \
@subsquid/substrate-typegen@latest \
@subsquid/substrate-metadata-explorer@latest \
@subsquid/typeorm-migration@latest \
@subsquid/typeorm-codegen@latest 
```

The following new packages will be installed:
- `@subsquid/typeorm-migration:0.1.x`. Separate package to replace `sqd db` commands with `squid-typeorm-migration`
- `@subsquid/typeorm-codegen:0.0.x`. Separate package to replace `sqd codegen`  with `squid-typeorm-codegen`
- `@subsquid/typeorm-store:0.1.x`. Separate package for the TypeORM implementation of the processor store

**CLI commands updates**

- Use `npx squid-typeorm-migration` instead of `npx sqd db`
- Use `npx squid-typeorm-codegen` instead of `npx sqd codegen`
-  The command `npx sqd squid tail` is deprecated. Use `npx sqd squid logs`

## 2 Pluggable `ctx.store`  

The store interface provided by the the mapping context is now configured by the `SubstrateProcessor` constructor argument and the type of `ctx.store` is inferred from it.

The new package `@subsquid/typeorm-store` provides two implementations of the `Database` interface accepted by `SubstrateProcessor` :
 
- `FullTypeormDatabase`  - works exactly as in `v5` providing a plain [EntityManager](https://orkhan.gitbook.io/typeorm/docs/entity-manager-api) as a store, albeit without `.get()` method
 
   Usage:
   ```ts
   import { FullTypeormDatabase } from '@subsquid/typeorm-store'
   import { EntityManager } from 'typeorm'
   
    // in a handler:
    processor.addEventHandler('Some.Event', ctx => {  
      ctx.store.save(new FooEntity({ id: 1}))
    })

   ```
   `FullTypeormDatabase` - DB class to config the processor storage mode
 
   `EntityManager` will be passed to `ctx.store` in the handlers. 
 
- `TypeormDatabase` (recommended) provides `ctx.store`, which is
   + Lazy (no transaction is opened if no data is read or written to the store). This is useful e.g. when has to subscribe for some frequent events but is only interested in a specific subset.
   + Looks like stripped down version of `EntityManager` (no `.query()`, no cascading saves)
   + Much faster for data updates
   + Schema name and the tranasaction isolation level can be passed as an optional constructor argument
  
   Performance improvement comes from that it implements `.save()` via upsert and
   all data manipulation methods translate to a single SQL statement.
 
   Usage:
 
    ```ts
   import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

    // in a handler:
    processor.addEventHandler('Some.Event', ctx => {  
      ctx.store.save(new FooEntity({ id: 1}))
    })
   ```
 
   `TypeormDatabase` - DB class to config the processor storage mode
 
   `Store` - DB interface which will be used in contexts to work with `TypeormDatabase` mode
 
## 3 Change processor config
 
1. Initialize processor

For `SubstrateProcessor`  one __MUST__ specify a `Database` implementation (i.e. choose one of the above) and change `dataSource` to a FireSquid archive with a new version of `lookupArchive`. The config statements can now be chained. Other processor's params haven't changed.

``` ts
const processor = new SubstrateProcessor(new TypeormDatabase())
    .setBatchSize(500)
    .setDataSource({
        // Lookup archive by the network name in the Subsquid registry
        archive: lookupArchive("kusama", { release: "FireSquid" })

        // Use archive created by archive/docker-compose.yml
        // archive: 'http://localhost:8888/graphql'
    })

```
2. Rename handlers. All pallets' names start from uppercase now and follow the same naming convention as defined by the substrate metadata. As a rule of thumb, event names start with an upper case, calls start with a lower case. `ExtrinsicHandler` became `CallHandler`:
   ```ts
   processor.addEventHandler('Balances.Transfer', ... 
   processor.addCallHandler('Balances.transfer_keep_alive', ...
   ```
  
3. Change the handlers context. One now __SHOULD__ specify projection of the data exposed by the context. Only the selected data field will be fetched from the archive. If it was skipped it will return default fields.
  
   You can see all possible projection options in `node_modules/@subsquid/substrate-processor/src/interfaces/dataSelection.ts`
  
   Default values here:
   `node_modules/@subsquid/substrate-processor/src/interfaces/dataHandlers.ts`

 
   Further, one __MUST__ explicitly speficy a `Store` interface for external handler functions. Arrow-function handlers will infer it automatically.

   - Arrow-function handler example:
 
   ```ts
   processor.addEventHandler('Balances.Transfer', {
      // he we specify which data will be fetched and passed
      // to the handler context
       data: {
           event: {args: true}
       }
     }, async ctx => {
       // Handler's business logic, only ctx.event.args is available
       // The type of ctx is inferred
   })
   ```
   - External handler example:
 
    ```ts
   processor.addEventHandler('Balances.Transfer', handleTransferEvent)
   // An explicit typing for the handler context
   async function handleTransferEvent(ctx: EventHandlerContext<Store, {event: {args: true}}>){
       // Handler's business logic, only ctx.event.args is available
   }
 
## Typegen

The `chainVersions` config field has been renamed to `specVersions`. It now accepts either 
 - an [Archive](/docs/archives/) endpoint
 - a `jsonl` file generated by [`squid-substrate-metadata-explorer(1)`](https://github.com/subsquid/squid/tree/master/substrate-metadata-explorer)


With an archive:

```json title="typegen.json"
{
  "outDir": "src/types",
  "specVersions": "https://kusama.archive.subsquid.io/graphql",
  "typesBundle": "kusama",
  "events": [
    "Balances.Transfer",
    "Balances.Deposit"
  ],
  "calls": [],
  "storage: []
}
```

With `squid-substrate-metadata-explorer`, first generate the metadata versions file:

```bash
npx squid-substrate-metadata-explorer \
  --chain wss://kusama-rpc.polkadot.io \
  --out kusamaVersions.jsonl
```

and then provide in the typegen config

```json title="typegen.json"
{
  "outDir": "src/types",
  "specVersions": "kusamaVersions.jsonl",
  "typesBundle": "kusama",
  "events": [
    "Balances.Transfer",
    "Balances.Deposit"
  ],
  "calls": [],
  "storage: []
}
```

Once the config is ready, (re)generate the typings for the requested events, calls and storage items:
```bash
make typegen
```