---
sidebar_position: 20
description: >-
  Subscribe to events and calls
---

# Data requests

:::warning
Setting a data request field to `[]` _selects no data_. Pass `undefined` for a wildcard selection:
```typescript
.addEvent({name: []}) // selects no events
.addEvent({}) // selects all events
```
:::

:::tip
All array-valued data request fields (e.g. `name?: string[]` of `addEvent()` are _arrays_ of acceptable values. That means that you can request e.g. multiple events with a single `addEvent()` call. Requesting data that way is more efficient than requesting data with many individual calls.
:::

## Events

**`addEvent(options)`**: Subscribe to Substrate runtime events. `options` has the following structure:
```ts
{
  // data requests
  name?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  call?: boolean
  stack?: boolean
  extrinsic?: boolean
}
```
`name`s must follow the convention `${Pallet}.${NameWithinPallet}` with both parts usually capitalized, e.g. `Balances.Transfer`.

You may also request the data related to the events:
- with `call = true` the processor will retrieve the parent call and add it to the `calls` iterable within the [block data](../context-interfaces);
- with `stack = true` it will do that with all calls in the entire call stack;
- with `extrinsic = true` it will add the parent extrinsic to the `extrinsics` block data iterable.

Note than events can also be requested by the `addCall()` method as related data.

Selection of the exact data to be retrieved for each log and its optional parent transaction is done with the `setFields()` method [documented](../field-selection/#events) on the Fields selection page.

## Calls

**`addCall(options)`**: Subscribe to runtime calls (even if wrapped into a `system.sudo` or `util.batch` extrinsic). `options` has the following structure:
```ts
{   
  // data requests
  name?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  events?: boolean
  stack?: boolean
  extrinsic?: boolean
}
```

The name must follow the convention `${Pallet}.${call_name}`. The pallet name is normally capitalized, and the call name is in the snake_case format, as in `Balances.transfer_keep_alive`.

By default, both successful and failed calls are fetched. Select the `call.success` field and later check it within the batch handler if you need to disambiguate.

You may also request the data related to the calls:
- with `events = true` the processor will retrieve all the events that the call emitted and add them to the `events` iterable within the [block data](../context-interfaces);
- with `stack = true` it will add all calls in the stack of each matching call, including itself, to the `calls` iterable;
- with `extrinsic = true` it will add the parent extrinsic to the `extrinsics` block data iterable.

Note than calls can also be requested by the `addEvent()` method as related data.

Selection of the exact data to be retrieved for each log and its optional parent transaction is done with the `setFields()` method [documented](../field-selection/#calls) on the Fields selection page.

## Specialized setters

#### **`addEvmLog(options)`** {#addevmlog}

A `SubstrateBatchProcessor` configuration setter that subscribes it to `EVM.Log` events by contract address(es) and/or EVM log topics. `options` have the following structure:
```ts
{
  // data requests
  address?: string[]
  topic0?: string[]
  topic1?: string[]
  topic2?: string[]
  topic3?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  call?: boolean
  stack?: boolean
  extrinsic?: true
} 
```

Related data retrieval and field selection are identical to [`addEvent()`](#events).

#### **`addEthereumTransaction(options)`** {#addethereumtransaction}

A `SubstrateBatchProcessor` configuration setter that subscribes it to `Ethereum.transact` calls by contract address(es) and/or function [sighashes](https://www.4byte.directory). `options` have the following structure:
```ts
{
  // data requests
  to?: string[] // contract addresses
  sighash?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  events: boolean
  stack: boolean
  extrinsic: boolean
}
```

Related data retrieval and field selection are identical to that [`addCall()`](#calls).

The processor with fetch both successful and failed transactions. Further, there's a difference between the success of a Substrate call and the internal EVM transaction. The transaction may fail even if the enclosing Substrate call has succeeded. Use `events = true` to retrieve `Ethereum.Executed` events that can be used to figure out the EVM transaction status (see [`getTransactionResult()`](/sdk/reference/frontier/#get-transaction-result)).


#### **`addContractsContractEmitted(options)`** {#addcontractscontractemitted}

Subscribe to the ink! events (`Contracts.ContractEmitted`) of the WASM runtime. `options` has the following structure:

```ts
{
  // data requests
  contractAddress?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  call?: boolean
  stack?: boolean
  extrinsic?: boolean
}
```
Contract addresses must be specified as hex strings, so make sure to decode them if yours are encoded with ss58.

Related data retrieval and field selection are identical to [`addEvent()`](#events).

#### **`addGearMessageQueued(options)`** {#addgearmessagequeued}
#### **`addGearUserMessageSent(options)`** {#addgearusermessagesent}

Structure of `options` is identical for both methods:
```ts
{
  // data requests
  programId?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  call?: boolean
  stack?: boolean
  extrinsic?: boolean
}
```
The methods above subscribe to the events [`Gear.MessageQueued`](https://wiki.gear-tech.io/docs/api/events/#messagequeued) and [`Gear.UserMessageSent`](https://wiki.gear-tech.io/docs/api/events/#usermessagesent) emitted by the specified Gear program.

Related data retrieval and field selection are identical to [`addEvent()`](#events).
