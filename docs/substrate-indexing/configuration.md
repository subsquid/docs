---
sidebar_position: 20
description: >-
  Configure the squid processor by setting the data source and the block range
---

# Configuration

## Initialization options

The following setters configure the global settings. The setters return the modified instance and can be chained. Consult inline docs and the IDE assist for more details. 

- `setBlockRange(Range)`.  Limits the range of blocks to be processed
- `setDataSource(DataSource)`. Set the data source to fetch the data from.
   + `archive`: an archive endpoint. We recommend using it together with [`@subsquid/archive-registry`](/archives/archive-registry)
   + `chain`: (Optional) a node gRPC endpoint (e.g. if the processor intents do make storage queries)

### Example

```ts
const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive("kusama")
    })
    .setBlockRange({ from: 9_999_999 })
```

## `addEvent(name, options)`

Subscribe to the Substrate runtime events with the given name. Use `*` for the name to subscribe to each and every event. The name must follow the convention `${Pallet}.${NameWithinPallet}` and is usually uppercased, e.g. `Balances.Transfer`.

The `options` argument has the following structure:
```ts
{
  // the optional block range for which the subscription is effective
  range?: DataRange, 
  // the data selector specifying which data will be fetched and passed to the handler context
  data?: boolean | DataSelection 
}
```

:::info
Most IDEs support smart suggestions to show the possible data selectors for `EvmLog` and `EvmTransaction` options. For VS Code, press `Ctrl + Space`:
![selector auto-complete](</img/autocomplete-selectors.png>)
:::info

See the [Event Data Selector](/substrate-indexing/configuration#event-data-selector) for more details on the `data` field.


## `addCall(name, options)`

Subscribe to a specific runtime call (even if wrapped into a `system.sudo` or `util.batch` extrinsic). Use `*` for the name to subscribe to each and every call. The name must follow the convention `${Pallet}.${call_name}`. The pallet name is normally uppercased and the call name is in lower cased an in the snake_case format. By default, both successful and failed calls are fetched and passed to the handler context. Use the `call.successfull` data selector and later check `CallData.success` in the [handler](/substrate-indexing/context-interfaces), if so needed.

The `options` argument has the following structure.
```ts
{   
  // the optional block range for which the subscription is effective
  range?: DataRange,
  // the data selector specifying which data 
  // will be fetched and passed to the handler context 
  data?: boolean | DataSelection
}
```

See the [Call Data Selector](/substrate-indexing/configuration#call-data-selector) for more details on the `data` field.

## `addEvmLog()`

Subscribe to Frontier EVM log data emitted by a specific EVM contract. See [EVM Support](/substrate-indexing/evm-support).

## `addContractsContractEmitted()`

Subscribe to events emitted by a WASM contract. See [WASM Support](/substrate-indexing/wasm-support).

## `addGearMessageEnqueued()`

Subscribe to messages emitted by a Gear program. See [Gear Support](/substrate-indexing/gear-support).

## `addAcalaEvmExecuted()`

Subscribe to EVM logs emitted by a Acala EVM+ contract. See [Acala Support](/substrate-indexing/acala-evm-support).


## Block data

By default, the processor fetches the block data only for all blocks that contain log items it was subscribed to. It is possible to force the processor to fetch the header data for all the blocks within a given range with the `includeAllBlocks(range?: Range)` option.

### Example

```ts
const processor = new SubstrateBatchProcessor()
  .addEvent('Balances.Transfer', { data: { event: true, extrinsic: true }})
  .includeAllBlocks({ from: 9_999_999, to: 10_000_000 })
} as const)
```
 
## Event Data Selector

The methods `addEvent()`, `addEvmLog()`, `addContractsContractEmitted()`, `addGearMessageEnqueued()`, `addAcalaEvmExecuted()` configuration options accepts a data selector of the shape 
```ts
data?: {  
  // set to true to fetch the default data selection for the event  
  event?: boolean | {
    // the call emitted the event
    call?: boolean | CallRequest, 
    // the extrinsic emitted the event
    extrinsic?: boolean | ExtrinsicRequest
    // for addEvmLog(), tx hash of the corresponding EVM transaction
    evmTxHash?: boolean 
  }
} 
```

`CallRequest` and `ExtrinsicRequest` have the following fields:
```ts
interface CallRequest {
  args?: boolean
  // data selector for the parent call
  parent?: boolean | CallRequest
  origin?: boolean
  // if the call is successful
  success: boolean
  /**
   * Call error.
   *
   * Absence of error doesn't imply that call was executed successfully,
   * check {@link success} property for that.
   */
  error?: boolean
}

interface ExtrinsicRequest {
  call?: CallRequest | boolean
  /**
   * Ordinal index in the extrinsics array of the current block
   */
  indexInBlock: boolean
  version: boolean
  signature?: boolean
  fee?: boolean
  tip?: boolean
  success: boolean
  error?: boolean
  /**
   * Blake2b 128-bit hash of the raw extrinsic
   */
  hash: boolean
}
```

Setting a primitive field to `true` indicates that the corresponding property will be requested from the archive and present in the corresponding [context item](/substrate-indexing/context-interfaces).
Setting any of the composite fields to `true` indicates that a default full set of fields is fetched, e.g. 
``ts
{
  data: { 
    event: true 
  }
}
``
fetches a full set of `event`, `call` and `extrinsic` fields.

### Example

Fetch `Balances.Transfer` event data, and enrich with the extrinsic hash and fee: 
```ts
const processor = new SubstrateBatchProcessor()
  .addEvent('Balances.Transfer', {
    data: {
        event: {
            args: true,
            extrinsic: {
                hash: true,
                fee: true
            }
        }
    }
} as const)
```

## Call Data Selector

The `addCall()` similarly accepts a data selector options specifying the data to be requested from the archive. The data selector has the following shape:

```ts
data: {
  call?: boolean | CallRequest
  extrinsic?: boolean | ExtrinsicRequest
}
```
The `CallRequest` interface is defined above. `ExtrinsicRequest` has the following form.

```ts
interface ExtrinsicRequest {
  /**
   * Ordinal index in the extrinsics array of the current block
   */
  indexInBlock?: boolean
  version?: boolean
  signature?: boolean
  call?: boolean | CallRequest
  fee?: boolean
  tip?: boolean
  success?: boolean
  error?: boolean
  /**
   * Blake2b 128-bit hash of the raw extrinsic
   */
  hash?: boolean

}
```

Setting a primitive field to `true` indicates that the corresponding property will be requested from the archive and present in the corresponding [context item](/substrate-indexing/context-interfaces). Setting any of the composite fields to `true` indicates that a default full set of fields is fetched.



### Example

Fetch `Balances.transfer_keep_alive` call data, and enrich it with the top-level extrinsic data (`signature` and the success flag):
```ts
const processor = new SubstrateBatchProcessor()
  .addCall('Balances.transfer_keep_alive', {
    data: {
        call: {
          args: true,
          success: true, // fetch the success status
          parent: true, // fetch the parent call data
        },
        extrinsic: {
          signature: true,
          success: true,  // fetch the extrinsic success status
        }
    }
} as const)
```



## Custom types bundle

A custom types bundle is only required for processing historical blocks which have metadata version below 14 and only if the chain is not natively supported by the Subsquid SDK. Most chains listed in the [polkadot.js app](https://polkadot.js.org/apps/#/explorer) are supported.

Types bundle can be specified in `3` different ways:
- as a name of a known chain
- as a name of a JSON file structured as a types bundle
- as a types bundle object


### Example

```ts
// known chain
processor.setTypesBundle('karura')

// A path to a JSON file resolved relative to `cwd`.
processor.setTypesBundle('typesBundle.json')
```