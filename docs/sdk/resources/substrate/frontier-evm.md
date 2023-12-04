---
sidebar_position: 50
description: >-
  Indexing EVMs running on Substrate
---

# Frontier EVM support

:::tip
Method documentation is also available inline and can be accessed via suggestions in most IDEs.
:::

:::info
Check out the [Caveats](#caveats) section of this page to avoid common issues.
:::

This section describes additional options available for Substrate chains with the Frontier EVM pallet like Astar. On ArrowSquid, use the [astar-erc20 SDK test](https://github.com/subsquid/squid-sdk/tree/master/test/astar-erc20) as the starting point.

[//]: # (!!!! Improve this as better templates become available)

This page describes the tools for handling EVM contracts and additional options available for `SubstrateBatchProcessor`.

## Squid EVM typegen

[`squid-evm-typegen`[(/sdk/reference/typegen/state-queries) tool is used to generate Typescript modules for convenient interaction with EVM contracts. Each such module is generated from a JSON ABI read from a local file or from an Etherscan-like API:
```bash
npx squid-evm-typegen src/abi erc20.json
```
Results will be placed at `src/abi`. For example, a JSON ABI file placed at `abi/erc721.json` will be used to generate `src/abi/erc721.ts`.

These modules provide:
* Constants such as topic0 values of event logs and function signature hashes:
  ```typescript
  import * as erc721abi from 'abi/erc721'

  let transferEventTopic: string = erc721abi.events.Transfer.topic
  let approveFunctionSighash: string = erc721abi.functions.approve.sighash
  ```
* Decoders for event data:
  ```typescript
  // in the batch handler
  for (const block of ctx.blocks) {
    for (const event of block.event) {
      if (event.name === 'EVM.Log') {
        const evmEvent = getEvmLog(event)
        const {from, to, tokenId} = erc721abi.events.Transfer.decode(evmEvent)
     }
   }
  }
  ```
* Classes for querying the contract state - see the [Access contract state](#access-the-contract-state) section.

## Subscribe to EVM events

**`addEvmLog(options)`**: A `SubstrateBatchProcessor` configuration setter that subscribes it to `EVM.Log` events by contract address(es) and/or EVM log topics. `options` have the following structure:
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
On related data:
- with `call = true` the processor will retrieve the parent call and add it to the `calls` iterable within the [block data](/sdk/reference/processors/substrate-batch/context-interfaces);
- with `stack = true` it will do that with all calls in the entire call stack;
- with `extrinsic = true` it will add the parent extrinsic to the `extrinsics` block data iterable.

Field selection for the events and their related data is done with [`setFields()`](/sdk/reference/processors/substrate-batch/field-selection).

#### Example

```typescript
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive('astar', {type: 'Substrate', release: 'ArrowSquid'}),
    chain: 'https://astar-rpc.dwellir.com'
  })
  .addEvmLog({
    address: [
      '0xb654611f84a8dc429ba3cb4fda9fad236c505a1a',
      '0x6a2d262d56735dba19dd70682b39f6be9a931d98'
    ],
    topic0: [erc721.events.Transfer.topic],
    extrinsic: true
  })
  .setFields({
    event: {
      phase: true
    },
    extrinsics: {
      hash: true
    }
  })
```

## Subscribe to EVM transactions

**`addEthereumTransaction(options)`**: A `SubstrateBatchProcessor` configuration setter that subscribes it to `Ethereum.transact` calls by contract address(es) and/or function [sighashes](https://www.4byte.directory). `options` have the following structure:
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
On related data:
- With `events = true` the processor will retrieve all the events that the call emitted and add them to the `events` iterable within the [block data](/sdk/reference/processors/substrate-batch/context-interfaces). These will include `Ethereum.Executed` that can be used to figure out the EVM transaction status (see [`getTransactionResult()`](#get-transaction-result)).
- With `stack = true` it will add all calls in the stack of each matching call, including itself, to the `calls` iterable.
- With `extrinsic = true` it will add the parent extrinsic to the `extrinsics` block data iterable.

Field selection for the calls and their related data is done with [`setFields()`](/sdk/reference/processors/substrate-batch/field-selection).

Note that by default both successful and failed transactions are fetched. Further, there's a difference between the success of a Substrate call and the internal EVM transaction. The transaction may fail even if the enclosing Substrate call has succeeded. Use the [`getTransactionResult()` utility function](#get-transaction-result) to extract the EVM transaction status.

#### Examples

Request all EVM calls to two contracts:
```ts
processor.addEthereumTransaction({
  to: [
    '0x6a2d262d56735dba19dd70682b39f6be9a931d98'
    '0x3795c36e7d12a8c252a20c5a7b455f7c57b60283'
  ]
})
```

Request all `transfer(address,uint256)` EVM calls on the network:
```ts
processor.addEthereumTransaction({sighash: ['0xa9059cbb']})
```

## Event and transaction data parsing

The way the Frontier EVM pallet exposes EVM logs and transaction may change due to runtime upgrades. [`@subsquid/frontier`](https://github.com/subsquid/squid-sdk/tree/master/substrate/frontier) provides helper methods that are aware of the upgrades:

#### `getEvmLog(event: Event): EvmLog` {#get-evm-log}

Extract the EVM log data from `EVM.Log` event.

#### `getTransaction(call: Call): LegacyTransaction | EIP2930Transaction | EIP1559Transaction` {#get-transaction}

Extract the transaction data from `Ethereum.transact` call with additional fields depending on the EVM transaction type.

#### `getTransactionResult(ethereumExecuted: Event): {from: string, to: string, transactionHash: string, status: 'Succeed' | 'Error' | 'Revert' | 'Fatal', statusReason: string}` {#get-transaction-result}

Extract transaction result from an `Ethereum.Executed` event.

#### Example

```typescript 
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive('astar', {type: 'Substrate'}),
    chain: 'https://astar-rpc.dwellir.com'
  })
  .addEthereumTransaction({})
  .addEvmLog({})

processor.run(new TypeormDatabase(), async ctx => {
  for (const block of ctx.blocks) {
    for (const event of block.events) {
      if (event.name === 'EVM.Log') {
        // no need to supply any extra data to determine
        // the runtime version: event has all necessary references
        const {address, data, topics} = getEvmLog(event)

        // process evm log data
      }
    }
    for (const call of block.calls) {
      if (call.name==='Ethereum.transact') {
        const txn = getTransaction(call)
        // process evm txn data
      }   
    }
  }
})
```

## Access contract state

:::warning
This section is out of date. It will be updated once the API of typegen-generated classes stabilizes
:::

EVM contract state is accessed using the [typegen-](#squid-evm-typegen)generated `Contract` class that takes the handler context and the contract address as constructor arguments. The state is always accessed at the context block height unless explicitly defined in the constructor.
```typescript title="src/abi/erc721.ts"
export class Contract extends ContractBase {
  //...
  balanceOf(owner: string): Promise<ethers.BigNumber> {
    return this.call("balanceOf", [owner])
  }
  //...
}
```

It then can be constructed using the context variable and queried in a straightforward way (see [squid-frontier-evm-template](https://github.com/subsquid/squid-frontier-evm-template) for a full example):

```ts
// ...
const CONTRACT_ADDRESS= "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a"

processor.run(new TypeormDatabase(), async ctx => {
  for (const block of ctx.blocks) { 
    for (const item of block.items) {
      if (item.name === "EVM.Log") {
        const contract = new erc721.Contract(ctx, block, CONTRACT_ADDRESS);
        // query the contract state
        const uri = await contract.tokenURI(1137)
      }
    }
  }
})
```

For more information on EVM Typegen, see this [dedicated page[(/sdk/reference/typegen/state-queries).

## Factory contracts

It some cases the set of contracts to be indexed by the squid is not known in advance. For example, a DEX contract typically creates a new contract for each trading pair added, and each such trading contract is of interest.

While the set of handler subscriptions is static and defined at the processor creation, one can leverage the wildcard subscriptions and filter the contracts of interest in runtime. This pattern is [described extensively](/sdk/resources/evm/factory-contracts) in EVM documentation, but it can be used with EVM methods of `SubstrateBatchProcessor` as well. A (somewhat outdated) example is available in [this archive repo](https://github.com/subsquid/beamswap-squid/blob/master/src/processor.ts).

## Caveats

* If your use case does not require any Substrate-specific data (e.g. extrinsic hashes), use [`EvmBatchProcessor`](/sdk) instead. EVM-only Archives are [available](/subsquid-network/reference/evm-networks) for all major EVM-on-Substrate chains.

* Processor data subscription methods guarantee that all data matching their data requests will be retrieved, but for technical reasons non-matching data may be added to the [batch context iterables](/sdk/reference/processors/substrate-batch/context-interfaces). As such, it is important to always filter the data within the batch handler: match e.g.
  ```ts title="src/processor.ts"
  .addEvmLog({
    address: ['0xb654611f84a8dc429ba3cb4fda9fad236c505a1a'],
    topic0: [erc721.events.Transfer.topic],
  })
  ```
  with
  ```ts title="src/main.ts"
  processor.run(new TypeormDatabase(), async ctx => {
    for (const block of ctx.blocks) {
      for (const event of block.events) {
        // ----- the filter begins -----
        if (event.name==='EVM.Log') {
          const {address, data, topics} = getEvmLog(ctx, item.event)
          if (address==='0xb654611f84a8dc429ba3cb4fda9fad236c505a1a' &&
              topics[0]===erc721.events.Transfer.topic) {
            // ----- the filter ends -----

            // process the requested event
          }
        }
      }
    }
  })
  
  ```

* The meaning of passing `[]` as a set of parameter values has been changed in the ArrowSquid release: now it _selects no data_. Some data might still arrive (see above), but that's not guaranteed. Pass `undefined` for a wildcard selection:
  ```typescript 
  .addEvmLog({address: []}) // selects no events
  .addEvmLog({}) // selects all events
  ```

* If contract address(es) supplied to the processor configuration methods are stored in any wide-scope variables, it is recommended to convert them to flat lower case. This precaution is necessary because same variable(s) are often reused in the [batch handler](/sdk/overview/#processorrun) for item filtration, and all contract addresses in the items are **always** in flat lower case.
