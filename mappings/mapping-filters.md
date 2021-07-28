---
description: The manifest file allows granular and coerce filters on the mappings
---

# Mapping Filters

### Range Filter Syntax

A _range_ is __an interval of integers that may or may not be infinite and may or may not include the endpoints. The string representation follows the following convention:

* `[` or `]` means the enpoints are included in the ranges, `(` and `)` mean the endponts are excluded. Ex: `[3,5]` means `3, 4, 5` and `(3, 5)` includes only `4`
* Semi-open ranges include all integers from  an endpoint \(either inclusively or exclusively\), up to infinity: `(4, )` means all integer from `5` up to infinity. `[5, )` means all integers from `5` up to infinity. Left-sided semi-open ranges start from zero, e.g. `(, 5]` means `0, 1`, etc. up to `5` \(inclusive\).



### Global Range Filter

The whole processing pipeline can be constrained to a range of block heights, via the top-level `range` property. The following example will process mappings starting from height `100000` 

```yaml
mappings:
  mappingsModule: mappings/lib/mappings
  imports:
    - mappings/lib/mappings/generated/types
  range: '[100000, )' # process all heights from 100000 to infinity 
```

### Mapping Filter

All mappings \(event- and extrinsic handers and block hooks\) support an optional `filter` property allowing constraints for

* `height`block height ranger
* `specVersion` runtime spec version as defined in the runtime at the block header

The latter option is incredibly useful when dealing with runtime upgrades and handling different versions of the same event.  For example, the following mapping definitions will handle transfers differently depending on the `specVersion` 

```yaml
eventHandlers:
  - event: balances.Transfer 
    handler: balancesTransferV1
    filter:
      specVersion: '[0,42)' # apply balancesTransferV1 only if the specVersion < 42
  - event: balances.Transfer
    handler: balancesTransferV2
    filter:
      specVersion: '[42, )' # apply balancesTransferV2 if the specVersion >= 42
```

Setting height filters for blockHooks is convenient for one-off initializations of the database. For example

```yaml
preBlockHooks:
  - hanlder: loadGenesisData
    filter:
      height: [0,0] # will be executed only at genesis
```



