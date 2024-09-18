---
sidebar_position: 70
description: >-
  Sourcing Substrate metadata
title: Substrate types bundles
---

### Where do I get a types bundle for my chain?

Types bundle is only needed for pre-Metadata v14 blocks and only if SQD does not offer a built-in support for the chain in question.

Most chains publish their type bundles as an npm package (for example: [Edgeware](https://www.npmjs.com/package/@edgeware/node-types)). One of the best places to check for the latest version is the [polkadot-js/app](https://github.com/polkadot-js/apps/tree/master/packages/apps-config/src/api/spec) and [polkadot-js/api](https://github.com/polkadot-js/api/tree/master/packages/types-known/src/spec) repositories.

:::info
**Note:** the type bundle format for typegen is slightly different from `OverrideBundleDefinition` of `polkadot.js`. The structure is as follows, all the fields are optional.
:::

```javascript
{
  types: {}, // top-level type definitions, as `.types` option of `ApiPromise`
  typesAlias: {}, // top-level type aliases, as `.typesAlias` option of `ApiPromise`
  versions: [ // spec version specific overrides, same as `OverrideBundleDefinition.types` of `polkadot.js`
    {
       minmax: [0, 1010] // spec range
       types: {}, // type overrides for the spec range
       typesAlias: {}, // type alias overrides for the spec range
    }
  ]
}
```
