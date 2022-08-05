# EVM Processor

The Subsquid API framework was initially built with Substrate blockchains in mind. Therefore, Subsquid is fully and natively compatible with all networks built with Substrate. More recently, however, we haved added support for EVM logs to our processors. 

For EVM-compatible projects building on networks like Moonbeam, Astar, and Acala, we have developed the [@subsquid/substrate-evm-processor](https://www.npmjs.com/package/@subsquid/substrate-evm-processor).

This page will go over the most important customizations a developer would want to make when building their squid API.

## Prerequisite

It is important to verify that you intend to ingest data from an EVM-compatible Archive. Please refer to [this guide](/archives/archives-advanced-setup) to understand what this means.

## Importing and instantiating

The `Substrate EVM Processor` is defined in an `npm` package. This will need to be installed using the following command:

```bash
npm install @subsquid/substrate-evm-processor
```
:::info Note: the [subsquid-template](https://github.com/subsquid/squid-template) does not have this package in its
dependencies.
:::

Once installed, the `SubstrateEvmProcessor` class can be imported from the package:

```typescript
import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor"
```

Now, it has finally become possible to declare an instance:

```typescript
const processor = new SubstrateEvmProcessor('moonbeam')
```

:::info Note: all of the code snippets in this page can be found in the [`processor.ts`](https://github.com/subsquid/squid/blob/master/test/moonsama-erc721/src/processor.ts) file in the test subfolder of our main project's repository.
:::

### Handlers and interfaces

To find out more about Handler functions, Handler Interfaces and Context Interface linked to this processor, take a look at
the dedicated pages:

* [EvmLogHandler Interface](/develop-a-squid/handler-functions/handler-interfaces#evmloghandler)
* [EvmLogHandlerOptions Interface](/develop-a-squid/handler-functions/handler-options-interfaces#evmloghandleroptions)
* [EvmLogHandlerContext Interface](/develop-a-squid/handler-functions/context-interfaces#evmloghandlercontext)

## Topics decoding

The Subsquid SDK provides a command line tool ([EVM Typegen](/develop-a-squid/evm-support/squid-evm-typegen)) that generates boiler-plate TypeScript code that decodes EVM logs and provides the contract's ABI in JSON format.

This tool will create a TypeScript file that contains interfaces for the events present in the contract. It will also contain an `events` function that maps topic names to the function that is able to decode it.

This function can then be used in the body of an `EvmLogHandler` function, as in the following example:

```typescript title="processor.ts"
async fuction evmTransfer (ctx: EvmLogHandlerContext ): Promise<void> {
    let transfer = erc721.events['Transfer(address,address,uint256)'].decode(ctx)

    // ...
    
}
```

Where `transfer` will be an object with `from`, `to`, `tokenId` fields, as defined above.