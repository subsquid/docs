---
sidebar_position: 20
description: >-
  Configure SubstrateBatchProcessor
---

# Configuration

## Initialization

:::info
The method documentation is also available inline and can be accessed via suggestions in most IDEs.
:::

The following setters configure the global settings. The setters return the modified instance and can be chained.

**`setBlockRange({from: number, to?: number | undefined})`**: Limits the range of blocks to be processed. When the upper bound is specified, the processor will terminate with exit code 0 once it reaches it.

**`setDataSource({archive: string, chain?: string | undefined})`**: Sets blockchain data source. Example:

```typescript
processor.setDataSource({
  chain: 'wss://rpc.polkadot.io',
  archive: 'https://polkadot.archive.subsquid.io/graphql'
})
```
Argument properties:
+ `archive`: An archive endpoint providing the data for the selected network. Use [Archive registry](/archives/overview/#archive-registry) to obtain exhaustive, up-to-date information on archives maintained by Subsquid. The registry also provides a `lookupArchive` function that maps archive aliases to endpoint URLs, like this: `archive: lookupArchive('polkadot')`.
+ `chain?`: A JSON-RPC endpoint for the network of interest. Required if the processor has to make [contract state queries](/substrate-indexing/storage-state-calls). For squids indexing only event and/or transaction data it can be omitted. HTTPS and WSS endpoints are supported.

## Events

**`addEvent(name: string, options?)`**: Subscribe to Substrate runtime events with the given name. Use `*` for the name to subscribe to each and every event. The name must follow the convention `${Pallet}.${NameWithinPallet}` with both parts usually capitalized, e.g. `Balances.Transfer`.

The `options?` argument has the following structure:
```ts
{
  // the optional block range for which the subscription is effective
  range?: {from: number, to?: number | undefined} | undefined,
  // the data selector specifying which data will be fetched and passed to the handler context
  data?: EventDataRequest | undefined
}
```
See the [Event data selector section](/substrate-indexing/configuration/#event-data-selector) for more details on the `data` field.

## Calls

**`addCall(name: string, options?)`**: Subscribe to a specific runtime call (even if wrapped into a `system.sudo` or `util.batch` extrinsic). Use `*` for the name to subscribe to each and every call. The name must follow the convention `${Pallet}.${call_name}`. The pallet name is normally capitalized, and the call name is in the snake_case format, as in `Balances.transfer_keep_alive`. By default, both successful and failed calls are fetched and passed to the [handler context](/substrate-indexing/context-interfaces). Use the `call.success` data selector and later check `item.call.success` within the batch handler, if so needed.

The `options?` argument has the following structure.
```ts
{   
  // optional block range for which the subscription is effective
  range?: {from: number, to?: number | undefined} | undefined,
  // data selector specifying which data 
  // will be fetched and passed to the handler context 
  data?: CallDataRequest | undefined
}
```

See the [Call data selector section](/substrate-indexing/configuration/#call-data-selector) for more details on the `data` field.

## Specialized setters

**`addEvmLog()`**  
**`addEthereumTransaction()`**  
Subscribe to Frontier EVM transactions and event logs. See [EVM Support](/substrate-indexing/evm-support).

**`addContractsContractEmitted()`**  
Subscribe to events emitted by a WASM contract. See [WASM Support](/substrate-indexing/wasm-support).

**`addGearMessageEnqueued()`**
**`addGearUserMessageSent()`**
Subscribe to messages emitted by a Gear program. See [Gear Support](/substrate-indexing/gear-support).

**`addAcalaEvmExecuted()`**
**`addAcalaEvmExecutedFailed()`**
Subscribe to EVM logs emitted by an Acala EVM+ contract. See [Acala Support](/substrate-indexing/acala-evm-support).

## Less common setters

**`setPrometheusPort(port: string | number)`**: Sets the port for a built-in prometheus metrics server. By default, the value of PROMETHEUS_PORT environment variable is used. When it is not set, the processor will pick up an ephemeral port.

**`includeAllBlocks(range?: Range | undefined)`**: By default, the processor will fetch only blocks which contain requested items. This method modifies such behaviour to fetch all chain blocks. Optionally a `Range` (`{from: number, to?: number | undefined}`) of blocks can be specified for which the setting should be effective.

**`setTypesBundle(bundle: string | OldTypesBundle | OldSpecsBundle | PolkadotjsTypesBundle)`**: A custom types bundle is only required for processing historical blocks which have metadata version below 14 and only if the chain is not natively supported by the Subsquid SDK. Most chains listed in the [polkadot.js app](https://polkadot.js.org/apps/#/explorer) are supported.

Types bundle can be specified in _three_ different ways:
- as a name of a known chain
- as a name of a JSON file structured as a types bundle
- as a types bundle object

#### Example

```ts
// known chain
processor.setTypesBundle('karura')

// A path to a JSON file resolved relative to `cwd`.
processor.setTypesBundle('typesBundle.json')
```

## Data selectors

### Event data selector

:::info
Most IDEs support smart suggestions to show the possible data selectors. For VS Code, press `Ctrl+Space`:
![selector auto-complete](</img/autocomplete-selectors.png>)
:::info

Methods `addEvent()`, `addEvmLog()`, `addContractsContractEmitted()`, `addGearMessageEnqueued()`, `addAcalaEvmExecuted()` accept data selectors of the following shape for `options.data`:
```ts
data?: {  
  // set to true to fetch the default data selection for the event  
  event?: boolean | {
    // the call that emitted the event
    call?: boolean | CallRequest, 
    // the extrinsic that emitted the event
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

Setting a primitive field to `true` indicates that the corresponding property will be requested from the archive and present in the corresponding [context item](/substrate-indexing/context-interfaces). Setting any of the composite fields to `true` indicates that a default full set of fields is fetched, e.g. 
``ts
{
  data: { 
    event: true 
  }
}
``
fetches a full set of `event`, `call` and `extrinsic` fields.

#### Example

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

### Call data selector

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

#### Example

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
