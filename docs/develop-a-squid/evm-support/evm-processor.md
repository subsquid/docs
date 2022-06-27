# EVM Processor

Subsquid API framework was initially built with Substrate blockchains in mind. It is fully and natively compatible with all network built with such scheme.

But EVM-compatible projects, such as Moonbeam or Acala, created the demand to add support for EVM logs to our Processors. And Subsquid responded by developing the [@subsquid/substrate-evm-processor](https://www.npmjs.com/package/@subsquid/substrate-evm-processor).

The inner workings are similar in all aspects to the base Substrate Processor. As a matter of facts, the Substrate EVM Processor is an _extension_ of the aforementioned Substrate Processor.

This page will go over the most important customizations a developer would want to make, when building their API.

## Prerequisite

It is important, before even starting, to verify that the Archive our Processor will be connecting to is EVM-compatible.

To know exactly what this means, please check the related section in the [Archive guide](/docs/archives/how-to-launch-a-squid-archive#launch-archives-for-evm-compatible-blockchain).

## Importing and instantiating

The `Substrate EVM Processor` is defined in an `npm` package that needs to be installed before being able to use it:

{% hint style="info" %}
Note: the [subsquid-template](https://github.com/subsquid/squid-template) does not have this package in its dependencies.
{% endhint %}

```bash
npm install @subsquid/substrate-evm-processor
```

Then the `SubstrateEvmProcessor` class can be imported from the package

```typescript
import {SubstrateEvmProcessor} from "@subsquid/substrate-evm-processor"
```

Then, it's finally possible to declare an instance of it:

```typescript
const processor = new SubstrateEvmProcessor('moonbeam')
```

{% hint style="info" %}
Note: all of the code snippets in this page can be found in the [`processor.ts`](https://github.com/subsquid/squid/blob/master/test/moonsama-erc721/src/processor.ts) file in the test subfolder of our main project's repository.
{% endhint %}

### Handlers and interfaces

To know more about Handler functions, Handler Interfaces and Context Interface linked to this processor, take a look at the dedicated pages:

* [EvmLogHandler Interface](../handler-functions/handler-interfaces.md#evmloghandler)
* [EvmLogHandlerOptions Interface](../handler-functions/handler-options-interfaces.md#evmloghandleroptions)
* [EvmLogHandlerContext Interface](../handler-functions/context-interfaces.md#evmloghandlercontext)

## Topics decoding

The Subsquid SDK provides a command line tool (called [EVM Typegen](/docs/develop-a-squid/evm-support/squid-evm-typegen), follow the link for more details) to generate TypeScript boiler plate code to decode EVM logs, providing the contract's ABI in JSON format.

This tool will create a TypeScript file containing interfaces for the events present in the contract, and an `events` function that maps   topic names to the right function that is able to decode it.

This function can then be used in the body of an `EvmLogHandler` function, like this:

{% code title="processor.ts" %}
```typescript
async fuction evmTransfer (ctx: EvmLogHandlerContext ): Promise<void> {
    let transfer = erc721.events['Transfer(address,address,uint256)'].decode(ctx)

    // ...
    
}
```
{% endcode %}

Where `transfer` will be an object with `from`, `to`, `tokenId` fields, as defined above.
