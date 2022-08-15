---
sidebar_position: 2
description: >-
  Configure the squid processor and subscribe to events, calls, WASM and EVM logs
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

## Log items subscription

The following methods are used to subscribe `SubstrateBatchProcessor` to specific log items. The second (optional) argument specified the block range for which the subscription is effective and the data to be fetched for the log item. `SubstrateProcessor` defines subscriptions similarly using the methods `addEventHandler`, `addCallHandler`, `addEvmLogHandler` and `addContractsContractEmittedHandler` respectively.

**`addEvent(name, options)`** 

Subscribe to the Substrate runtime events with the given name. Use `*` for the name to subscribe to each and every event. The name must follow the convention `${Pallet}.${NameWithinPallet}` and is usually uppercased, e.g. `Balances.Transfer`.

The `options` argument has the following structure:
```ts
{
  // the optional block range for which the subscription is effective
  range?: DataRange, 
  // the data selector specifying which data will be fetched and passed to the handler context
  data?: {  
    // set to true to fetch the default data selection for the event  
    event?: boolean | {
      // specify any subset of fields of the SubstrateEvent interface
      // ...
      // The runtime call emitted the event. 
      // Set to true to fetch the default data
      call?: boolean | CallRequest, 
      // The extrsinsic emitted the event. 
      // Set to true to fetch the default data 
      extrinsic?: boolean | { 
        // specify any subset of fields of the SubstrateExtrinsic interface 
      }
      // The hash of the EVM transaction emitted the event. 
      // Only applicable for EVM.log events
      evmTxHash?: boolean 
    }
  } 
}
```

**Example**
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

**`addCall(name, options)`**

Subscribe to a specific runtime call (even if wrapped into a `system.sudo` or `util.batch` extrinsic). Use `*` for the name to subscribe to each and every call. The name must follow the convention `${Pallet}.${call_name}`. The pallet name is normally uppercased and the call name is in lower cased an in the snake_case format. 

The `options` argument has the following structure.
```ts
{   
  // the optional block range for which the subscription is effective
  range?: DataRange,
  // the data selector specifying which data 
  // will be fetched and passed to the handler context 
  data?: {  
    // set to true for the default data selection
    call?: boolean | { 
      // any selection of the SubstrateCall interface fields 
      // ...
      // custom data for the parent call or the default selection
      parent?: boolean | PlainReq<SubstrateCall>  
    }
    // the extrisic initiated the call. 
    // set to true for the default data
    extrinsic?: boolean | { 
      // any selection of the SubstrateExtrinsic interface fields
    }
  } 
}
```
**Example**
```ts
const processor = new SubstrateBatchProcessor()
  .addCall('Balances.transfer_keep_alive', {
    data: {
        call: {
          args: true,
          successfull: true, // fetch the success status
          parent: true, // fetch the parent call data
        },
        extrinsic: {
          signature: true,
          successfull: true,  // fetch the extrinsic success status
        }
    }
} as const)
```

**`addEvmLog(contract, options)`**

Subscribe to EVM log data emitted by a specific EVM contract. See [EVM Support](./evm-support).

**`addContractsContractEmitted(contract, options)`**

Subscribe to events emitted by a WASM contract deployed at the specified address. See [WASM Support](./wasm-support).

## Block data

By default, the processor fetches the block data only for all blocks that contain log items it was subscribed to. It is possible to force the processor to fetch the header data for all the blocks within a given range with the `includeAllBlocks(range?: Range)` option.

**Example**
```ts
const processor = new SubstrateBatchProcessor()
  .addEvent('Balances.Transfer', { data: { event: true, extrinsic: true }})
  .includeAllBlocks({ from: 9_999_999, to: 10_000_000 })
} as const)
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