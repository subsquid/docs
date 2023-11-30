---
sidebar_position: 61
description: >-
  Additional support for indexing Gear programs
---

# Gear support

:::info
Use `lookupArchive('gear-testnet')` to connect to an Archive for Gear testnet. An Archive for the Gear mainnet will be added in due course when the network is launched.
:::

Indexing [Gear Network](https://wiki.gear-tech.io/) programs is supported with the following specialized processor configuration setters: 

#### `SubstrateBatchProcessor.addGearMessageEnqueued(options)` {#addgearmessageenqueued}

#### `SubstrateBatchProcessor.addGearUserMessageSent(options)` {#addgearusermessagesent}

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
The methods above subscribe to the events [`Gear.MessageEnqueued`](https://wiki.gear-tech.io/docs/api/events/#messageenqueued) and [`Gear.UserMessageSent`](https://wiki.gear-tech.io/docs/api/events/#usermessagesent) emitted by the specified Gear program. 

The meaning of the related data retrieval flags is identical to those of [`addEvent()`](/sdk/reference/processors/substrate-batch/data-requests/#events). Field selection for the retrieved events is done with [`setFields()`](/sdk/reference/processors/substrate-batch/field-selection).

The processor can also subscribe to any other event with `addEvent()` and filter by program ID in the batch handler, if so necessary. 

An example of a squid indexing a Gear program (an NFT contract) can be found [here](https://github.com/subsquid/squid-sdk/tree/master/test/gear-nft).
