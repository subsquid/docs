---
sidebar_position: 61
description: >-
  Additional support for indexing Gear programs
---

# Gear support

**Available since @subsquid/substrate-processor@1.6.0**

Indexing [Gear Network](https://wiki.gear-tech.io/) programs is supported with specialized processor handlers: 
```typescript
SubstrateBatchProcessor.addGearMessageEnqueued(programId: string, options?: BlockRangeOption & MayBeDataSelection<EventDataRequest>)
``` 
and 
```typescript
SubstrateBatchProcessor.addGearUserMessageSent(programId: string, options?: BlockRangeOption & MayBeDataSelection<EventDataRequest>)
```

The methods above subscribe the processor to the events `Gear.MessageEnqueued` and `Gear.UserMessageSent` emitted by the specified program. The data selections options are the same as for [`addEvent()`](/develop-a-squid/squid-processor/data-subscriptions#addeventname-options)

An example of a squid indexing a Gear program (an NFT contract) can be found in [this repo](https://github.com/subsquid/squid/tree/master/test/gear-nft)