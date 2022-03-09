# Handler Options Interfaces

The previous pages discussed the different types of Handlers, their Interfaces, how they can be added to the Processor. When attaching a handler to the Processor, the Subsquid SDK also allows to provide options and it defines interface for them. Here are their definitions and how they can influence the Handler execution.

## `EventHandlerOptions`

```typescript
export interface EventHandlerOptions {
    range?: Range
}
```

The `Range` object in this context is an object containing two fields: `to` and `from`. Similarly to how it is possible to restrain the execution of the Processor by [setting a block range](../substrate-processor.md#start-block-global-execution-range), the same can be done with an `EventHandler`.

The ingestion loop, responsible to divide the blockchain exploration into batches, will sieve through all the subscribed Handlers, read their options and filter out those that specified a range that does not include the current batch of blocks.

## `ExtrinsicHandlerOptions`

```typescript
export interface ExtrinsicHandlerOptions {
    range?: Range
    triggerEvents?: QualifiedName[]
}
```

The `Range` object in this context is an object containing two fields: `to` and `from`. Similarly to how it is possible to restrain the execution of the Processor by [setting a block range](../substrate-processor.md#start-block-global-execution-range), the same can be done with an `EventHandler`.

The ingestion loop, responsible to divide the blockchain exploration into batches, will sieve through all the subscribed Handlers, read their options and filter out those that specified a range that does not include the current batch of blocks.

## `BlockHookOptions`

```typescript
export interface BlockHookOptions {
    range?: Range
}

```

The `Range` object in this context is an object containing two fields: `to` and `from`. Similarly to how it is possible to restrain the execution of the Processor by [setting a block range](../substrate-processor.md#start-block-global-execution-range), the same can be done with an `EventHandler`.

The ingestion loop, responsible to divide the blockchain exploration into batches, will sieve through all the subscribed Handlers, read their options and filter out those that specified a range that does not include the current batch of blocks.

## `EvmLogHandlerOptions`

```typescript
export interface EvmLogHandlerOptions {
    range?: Range
    /**
     * EVM topic filter as defined by https://docs.ethers.io/v5/concepts/events/#events--filters
     */
    filter?: EvmTopicSet[]
}

```

The `Range` object in this context is an object containing two fields: `to` and `from`. Similarly to how it is possible to restrain the execution of the Processor by [setting a block range](../substrate-processor.md#start-block-global-execution-range), the same can be done with an `EvmLogHandler`.

The ingestion loop, responsible to divide the blockchain exploration into batches, will sieve through all the subscribed Handlers, read their options and filter out those that specified a range that does not include the current batch of blocks.

In a similar way (like the comment suggests), EVM natively offers the ability to filter by _Topic_, so that the Handler function is alerted only for a subset of Topics it is actually interested in.&#x20;
