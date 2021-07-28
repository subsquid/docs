# Query Node Manifest

## Overview

| Field | Type | Description |
| :--- | :--- | :--- |
| **version** | _String_ | A Semver version indicating which version of this API is being used. |
| **description** | _String_ | An optional description of the substrate chain. |
| **hydraVersion** | String | SemVer range of Hydra Processor used by the mappings. |
| **indexerVersionRange** | String | Semver version range of supported Hydra Indexers. If not set, same as `hydraVersion` |
| **repository** | _String_ | An optional link to where the subgraph lives. |
| **dataSources** | Data Source Spec | Each data source spec defines the data that will be ingested |
| **entities** | _String_ | Glob path to schema model files \(with typeorm metadata\) |
| **typegen** | TypeGen Spec | Specification for Typegen tool |

## Data Source

| Field | Type | Description |
| :--- | :--- | :--- |
| **kind** | _String_ | The type of data source. Possible values: _substrate_. |
| **node** | _String_ | Chain name |

### Typegen

| Field | Type | Description |
| :--- | :--- | :--- |
| **metadata** | _String_ | The type of data source. Possible values: _substrate_. |
| **metadata.source** | _String_ | Chain name |
| **metadata.blockHash** | String | block hash to from where the metadata is fetched |
| **events** | List | A list of event names for which the typescript classes will be generated |
| **calls** | List | A list of extrinsics to be generated |
| **outDir** | String | The root directory of the generated classes |
| **customTypes.typedefsLoc** | String | Location of the type definitions json |

### Mapping

The `mapping` field may be one of the following supported mapping manifests:

| Field | Type | Description |
| :--- | :--- | :--- |
| **mappingsModule** | _String_ | A JS module to be loaded by the processor \(should have all the handler functions exported\) |
| **imports** | _List_ | A list of modules that should be additionally loaded by the processor \(e.g. generated event and extrinsic classes\) |
| **range** | _String_ | A string representation of the block height range for the run \(see Range rep for details\) |
| **eventHandlers** | List of Handler Spec | Specification of event handlers |
| **extrinsicHandlers** | List of Handler Spec | Specification of extrinsic handlers |
| **preBlockHooks** | List of Handler Spec | Specification of hooks run before all the events in the block |
| **postBlockHooks** | List of Handler Spec | Specification of hooks run after all the events in the block |

#### Handler

| Field | Type | Description |
| :--- | :--- | :--- |
| **handler** | String | Handler name |
| **event** | _String_ | \(For eventHandlers only\) An identifier for an event that will be handled in the mapping script. |
| **extrinsic** | _String_ | \(For extrinsicHandlers only\) An identifier for an extrinsic that will be handled in the mapping script. |
| **triggerEvents** | String | \(For extrinsicHandlers only\) A list of event identifier that triggers the extrinsic handlers. Default: `system.ExtrinsicSuccess` |
| **filter** | _Filter Spec_ | Additional filter specifying the condition for the handler to be triggered |
| **filter.height** | _String_ | String representation of the block height range |
| **filter.specVersion** | _String_ | Range of `RuntimeVersion.specVersion`. Useful when dealing with runtime upgrades |

**Range**

`Range` is an open, semi-open, or closed interval. An interval can either be finite or infinite. It is represented by a string as below

From X to Y, inclusive: `[X, Y]`

From X to Y, exclusive: `(X, Y)`

From X \(excl\) to Y, incl: `(X, Y]`

From X \(excl\) to infinity: `(X, )`

