# Archive Registry

Subsquid publishes the list of currently active and maintained Archives in the [Archive Registry](https://github.com/subsquid/archive-registry/) repository.

The list of public archives is also exposed via the [`@subsquid/archive-registry`](https://www.npmjs.com/package/@subsquid/archive-registry) package maintained by Subsquid. 

## Lookup Archive data source

`@subsquid/archive-registry` provides a function `lookupArchive(KnownArchive, LookupOptions)` to locate an archive data source endpoint. `KnownArchive` is a network name and `LookupOptions` provides additional filtering:

* `release`: either `FireSquid` or `5`. Note that the old `5` archives are now deprecated and will be sunset in due course.
* `genesis`: (optional) hash of the genesis block. Adds extra safety to disabiguate between different networks with the same name (e.g. a solochain and a parachain).

Example:

```typescript
import { lookupArchive } from "@subsquid/archive-registry";
import { SubstrateBatchProcessor } from "@subsquid/substrate-processor";

const processor = new SubstrateProcessor();

processor.setDataSource({
    archive: lookupArchive("kusama", { 
        release: "FireSquid", 
        genesis: "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe" 
    })
})
```

## Migrating from 0.x to 1.x

Starting from `@subsquid/archive-registry` version `1.x`, `lookupArchive` takes two arguments and the `release` attribute is mandatory. It also directly returns the data source url. 

For `v5` archives, replace

```typescript
lookupArchive("kusama")[0].url
```
with

```typescript
lookupArchive("kusama", { release: "5" })
```

Keep in mind that `v5` archives are now deprecated and the support will be discontinued in the future.