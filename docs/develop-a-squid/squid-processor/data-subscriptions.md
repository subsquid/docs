---
sidebar_position: 21
title: Data subscriptions
description: >-
  Subscribe the processor to handle events, calls, WASM and EVM logs
---

# Log items subscription

The following methods are used to subscribe `SubstrateBatchProcessor` to specific log items. The second (optional) argument specified the block range for which the subscription is effective and the data to be fetched for the log item. `SubstrateProcessor` defines subscriptions similarly using the methods `addEventHandler`, `addCallHandler`, `addEvmLogHandler` and `addContractsContractEmittedHandler` respectively.

For `SubstrateBatchProcessor`, the `addXXX` methods described below define which log items are repeatedly fetched, arranged into blocks as defined by the canonical on-chain ordering, and passed to the data handler via `BatchContext.blocks`. The details on the `BatchContext` and `BatchBlock` interfaces are available in the [Data Handlers](./data-handlers) section.

## `addEvent(name, options)`

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

## `addCall(name, options)`

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

## `addEvmLog(contract, options)`

Subscribe to EVM log data emitted by a specific EVM contract. See [EVM Support](./evm-support).

## `addContractsContractEmitted(contract, options)`

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
