---
sidebar_position: 110
---

# Troubleshooting

Common gotchas developing in deploying squids. 

### My squid is stuck in "Building", "Deploying" or "Starting" state
- Run with `API_DEBUG=true` as explained in the [Squid deploy page](/deploy-squid/#option-2-explicitly-set-the-source-url)
- Update the squid CLI to the latest version with
```bash
npm update -g @subsquid/cli
```
- Update the Squid SDK dependencies:
```bash
npm run update
```
- Check that the squid adheres to the expected [structure](/basics/squid-structure)
- Make sure you can [build and run Docker images locally](/deploy-squid/self-hosting)
- Make sure the squid source URL follows the format `https://github.com/my-account/my-squid-repo.git#my-branch`
- If the squid is deployed from a private repository, make sure you provide an [access key](/deploy-squid/#option-2-explicitly-set-the-source-url)

### `Validation error` when releasing a squid

Make sure the squid name contains only alphanumeric characters, underscores and hyphens. The squid version must be also alphanumeric. 
Since both the squid and version name become part of the squid API endpoint URL, slashes and dots are not accepted. 

### `driverError: error: relation "..." does not exist` in the processor logs

It is likely that the generated migrations in the `db/migrations` folder are outdated and do not match the schema file.
Recreate the migrations from scratch as detailed in [this page](/basics/db-migrations/#updating-after-schema-changes)

### `Query runner already released. Cannot run queries anymore` in the processor logs

All operations with `ctx.store` are asynchronous. Make sure you `await` on all `store` operations like `save`, `update`, `find` etc.

### `RpcError: Client error: UnknownBlock: State already discarded for BlockId::Hash` when running an Archive

This error indicates that the node to which the Archive is connected prunes the state. Make sure you are connected to a full archival node


### `QueryFailedError: invalid byte sequence for encoding "UTF8": 0x00`

PostgreSQL doesn't support storing `NULL (\0x00)` characters in text fields. Usually the error occurs when a raw bytes string (like `UIntArray` or `Bytes`) is inserted into a `String` field. If this is the case, use hex encoding, e.g. using [`util-internal-hex`](https://github.com/subsquid/squid/tree/master/util/util-internal-hex) library. For addresses, use [`ss58` encoding library](https://github.com/subsquid/squid/tree/master/ss58)

### API queries are too slow

- Make sure all the necessary fields are [indexed](/basics/schema-file/indexes-and-constraints/)
- Annotate the schema and [set reasonable limits](/graphql-api/dos-protection/) for the incoming queries to protect against DoS attacks

### `response might exceed the size limit`

Make sure the input query has limits set or the entities are decorated with `@cardinality`. We recommend using `XXXConnection` queries for pagination. For configuring limits and max response sizes, see [DoS protection](/graphql-api/dos-protection/).

### My squid run out of disk space

Get in contact with the [Squid Squad](https://t.me/SquidDevs) and request extra resources. 

### I have exceeded the limit of squid versions

Get in contact with the [Squid Squad](https://t.me/SquidDevs) to get a Premium tier.

### How do I know which events and extrinsics I need for the handlers?

This part depends on the runtime business logic of the chain. The primary and the most reliable source of information is thus the Rust sources for the pallets used by the chain.

For a quick lookup of the documentation and the data format, it is often useful to check `Runtime` section of Subscan (e.g. [Statemine](https://statemine.subscan.io/runtime)). One can see the deployed pallets and drill down to events and extrinsics from there. One can also choose the spec version on the drop down.

### How to add a `preBlockHook` and `postBlockHook` executing before or after each block?

A batch processor receives a list of items grouped into blocks. In order to add custom logic to be executed before/after a block, simply use the iterator over `ctx.blocks`:

```ts
processor.run(new TypeormDatabase(), async (ctx) => {
  for (let c of ctx.blocks) {
    // pre-block hook logic here
    for (let i of c.items) {
    }
    // post-block logic here
  }
})
```

### Where do I get a type bundle for my chain?

Most chains publish their type bundles as an npm package (for example: [Edgeware](https://www.npmjs.com/package/@edgeware/node-types)). One of the best places to check for the latest version is the [polkadot-js/app](https://github.com/polkadot-js/apps/tree/master/packages/apps-config/src/api/spec) and [polkadot-js/api](https://github.com/polkadot-js/api/tree/master/packages/types-known/src/spec) repositories. It's worth noting, however, that a types bundle is only needed for pre-Metadata v14 blocks, so for recently deployed chains it may be not needed.

:::info
**Note:** the type bundle format for typegen is slightly different from `OverrideBundleDefinition` of `polkadot.js`. The structure is as follows, all the fields are optional.
:::

```javascript
{
  types: {}, // top-level type definitions, as `.types` option of `ApiPromise`
  typesAlias: {}, // top-level type alieases, as `.typesAlias` option of `ApiPromise`
  versions: [ // spec version specific overrides, same as `OverrideBundleDefinition.types` of `polkadot.js`
    {
       minmax: [0, 1010] // spec range
       types: {}, // type overrides for the spec range
       typesAlias: {}, // type alias overrides for the spec range
    }
  ]
}
```
