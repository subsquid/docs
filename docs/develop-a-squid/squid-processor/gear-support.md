---
sidebar_position: 61
description: >-
  Additional support for indexing Gear programs
---

# Gear support

**Available since @subsquid/substrate-processor@1.6.0**

:::info
Use `lookupArchive("gear-testnet", { release: "FireSquid" })` to connect to an Archive for Gear testnet. An Archive for the Gear mainnet will be added in due course when the network is launched.
:::

Indexing [Gear Network](https://wiki.gear-tech.io/) programs is supported with the following specialized processor handlers: 
```typescript
SubstrateBatchProcessor.addGearMessageEnqueued(programId: string, options?: BlockRangeOption & MayBeDataSelection<EventDataRequest>)
``` 
and 
```typescript
SubstrateBatchProcessor.addGearUserMessageSent(programId: string, options?: BlockRangeOption & MayBeDataSelection<EventDataRequest>)
```

The methods above subscribe to the events [`Gear.MessageEnqueued`](https://wiki.gear-tech.io/docs/api/events/#messageenqueued) and [`Gear.UserMessageSent`](https://wiki.gear-tech.io/docs/api/events/#usermessagesent) emitted by the specified Gear program. The data selections options are the same as for the [`addEvent()`](/develop-a-squid/squid-processor/data-subscriptions#addeventname-options) processor method.

The processor can as well subscribe to any other event with `addEvent()` and filter by the program ID in the handler, if so necessary. 

An example of a squid indexing a Gear program (an NFT contract) can be found in [this repo](https://github.com/subsquid/squid/tree/master/test/gear-nft)