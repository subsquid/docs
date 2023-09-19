---
sidebar_position: 20
description: >-
  Subscribe to events and calls
---

# Data requests

:::warning
Processor data subscription methods guarantee that all data matching their data requests will be retrieved, but for technical reasons non-matching data may be added to the [batch context iterables](../../context-interfaces). As such, it is important to always filter the data within the batch handler.
:::

:::warning
The meaning of passing `[]` as a set of parameter values has been changed in the ArrowSquid release: now it _selects no data_. Some data might still arrive (see above), but that's not guaranteed. Pass `undefined` for a wildcard selection:
```typescript
.addEvent({name: []}) // selects no events
.addEvent({}) // selects all events
```
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
- with `call = true` the processor will retrieve the parent call and add it to the `calls` iterable within the [block data](../../context-interfaces);
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
- with `events = true` the processor will retrieve all the events that the call emitted and add them to the `events` iterable within the [block data](../../context-interfaces);
- with `stack = true` it will add all calls in the stack of each matching call, including itself, to the `calls` iterable;
- with `extrinsic = true` it will add the parent extrinsic to the `extrinsics` block data iterable.

Note than calls can also be requested by the `addEvent()` method as related data.

Selection of the exact data to be retrieved for each log and its optional parent transaction is done with the `setFields()` method [documented](../field-selection/#calls) on the Fields selection page.

## Specialized setters

**`addEvmLog()`**  
**`addEthereumTransaction()`**  
Subscribe to Frontier EVM transactions and event logs. See [EVM Support](../../specialized/evm).

**`addContractsContractEmitted()`**  
Subscribe to events emitted by a WASM contract. See [WASM Support](../../specialized/wasm).

**`addGearMessageEnqueued()`**
**`addGearUserMessageSent()`**
Subscribe to messages emitted by a Gear program. See [Gear Support](../../specialized/gear).
