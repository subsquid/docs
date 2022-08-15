---
sidebar_position: 20
description: >-
  Configure the squid processor by setting the data source and the block range
---

# Configuration

## Initialization options

The following setters configure the global settings. The setters return the modified instance and can be chained. Consult inline docs and the IDE assist for more details. 

- `setBlockRange(Range)`.  Limits the range of blocks to be processed
- `setBatchSize(number)`. Set the maximal number of blocks fetched from the data source in a single request
- `setDataSource(DataSource)`. Set the data source to fetch the data from.
   + `archive`: an archive endpoint. We recommend using it together with [`@subsquid/archive-registry`](/archives/archive-registry)
   + `chain`: (Optional) a node gRPC endpoint (e.g. if the processor intents do make storage queries)

**Example**
```ts
const processor = new SubstrateBatchProcessor()
    .setBatchSize(500)
    .setDataSource({
        archive: lookupArchive("kusama", {release: "FireSquid"})
    })
    .setBlockRange({ from: 9_999_999 })
```

## Custom types bundle

A custom types bundle is only required for processing historical blocks which have metadata version below 14 and only if the chain is not natively supported by the Subsquid SDK. Most chains listed in the [polkadot.js app](https://polkadot.js.org/apps/#/explorer) are supported.

Types bundle can be specified in `3` different ways:
- as a name of a known chain
- as a name of a JSON file structured as a types bundle
- as a types bundle object


**Example**

```ts
// known chain
processor.setTypesBundle('karura')

// A path to a JSON file resolved relative to `cwd`.
processor.setTypesBundle('typesBundle.json')
```