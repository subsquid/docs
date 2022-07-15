# Where do I get a type bundle for my chain?

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
