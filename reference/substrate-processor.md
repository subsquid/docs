# Substrate Processor

The main explanation and overview for the Processor component of a Squid has been treated in the [Key Concepts](../key-concepts/processor.md) section. This page will go over the most important customizations a developer would want to make, when building their API.

## Importing and instantiating

The `Substrate Processor` is defined in an `npm` package that needs to be installed before being able to use it:

{% hint style="info" %}
Note: the [subsquid-template](https://github.com/subsquid/squid-template) already has this package in its dependencies
{% endhint %}

```bash
npm install @subsquid/substrate-processor
```

Then the `SubstrateProcessor` class can be imported from the package

```typescript
import {SubstrateProcessor} from "@subsquid/substrate-processor"
```

Then, it's finally possible to declare an instance of it:

```typescript
const processor = new SubstrateProcessor('kusama_balances')
```

{% hint style="info" %}
Note: all of the code snippets in this page can be found in the [`processor.ts`](https://github.com/subsquid/squid-template/blob/main/src/processor.ts) file in the subsquid-template project
{% endhint %}

## Setting data sources

The `SubstrateProcessor` class exposes a method to customize its data source, by specifying a blockchain RPC WebSocked URL and an Archive endpoint URL:

```typescript
processor.setDataSource({
    archive: 'https://kusama.indexer.gc.subsquid.io/v4/graphql',
    chain: 'wss://kusama-rpc.polkadot.io'
})
```

The argument of the function is an interface defined in the [processor's source](https://github.com/subsquid/squid/blob/master/substrate-processor/src/processor.ts#L34), intuitively called `DataSource`:

{% code title="processor.ts" %}
```typescript
export interface DataSource {
    /**
     * Archive endpoint URL
     */
    archive: string
    /**
     * Chain node RPC websocket URL
     */
    chain: string
}

// ...

export class SubstrateProcessor {

    // ...
    setDataSource(src: DataSource): void {
        this.assertNotRunning()
        this.src = src
    }
}
```
{% endcode %}

## Batch sizes

Subsquids leaves to the developer the choice to set the amount of blocks to process in a single batch, which can be tweaked for performance reasons, for example.

Similarly to setting a data source, the `SubstrateProcessor` exposes a method for this:

```typescript
processor.setBatchSize(500)
```

Easily enough, the function is defined to accept a number as an argument:

{% code title="processor.ts" %}
```typescript
export class SubstrateProcessor {

    // ...
    setBatchSize(size: number): void {
        this.assertNotRunning()
        assert(size > 0)
        this.batchSize = size
    }
}
```
{% endcode %}

## Start block/Global execution range

Subsquid also gives developers the power to reduce the scope of their blockchain exploration, if they want to. It is in fact possible to configure the `SubstrateProcessor` to handle a range of block. The starting block is mandatory, when invoking this method, but the end block can be omitted, which means the Squid will continue to process new blocks as they are written to the blockchain.

```typescript
processor.setBlockRange({from: 583000});
```

The argument of the function is an interface, defined in the [processor's source code](https://github.com/subsquid/squid/blob/master/substrate-processor/src/util/range.ts#L4), and once again intuitively called `Range`.

{% code title="range.ts" %}
```typescript
export interface Range {
    /**
     * Start of segment (inclusive)
     */
    from: number
    /**
     * End of segment (inclusive). Defaults to infinity.
     */
    to?: number
}
```
{% endcode %}

And used in the function definition.

{% code title="processor.ts" %}
```typescript
export class SubstrateProcessor {

    // ...
    setBlockRange(range: Range): void {
        this.assertNotRunning()
        this.blockRange = range
    }
}
```
{% endcode %}
