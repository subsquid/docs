---
sidebar_position: 50
description: >-
  Indexing EVMs running on Substrate
---

# Frontier EVM support

:::info
The method documentation is also available inline and can be accessed via suggestions in most IDEs.
:::

:::info
If contract address(es) supplied to `EvmBatchProcessor` are stored in any wide-scope variables, it is recommended to convert them to flat lower case. This precaution is necessary because same variable(s) are often reused in the [batch handler](/substrate-indexing/context-interfaces) for item filtration, and all contract addresses in the items are **always** in flat lower case.
:::

This section describes additional options available for Substrate chains with the Frontier EVM pallet like Astar. We recommend using [squid-frontier-evm-template](https://github.com/subsquid-labs/squid-frontier-evm-template) as a starting point. For a step-by-step instruction, check out the [Frontier EVM squid tutorial](/tutorials/create-an-evm-processing-squid).

This page describes the tools for handling EVM contracts and additional options available for `SubstrateBatchProcessor`.

## Squid EVM typegen

[`squid-evm-typegen`](/evm-indexing/squid-evm-typegen) tool is used to generate Typescript modules for convenient interaction with EVM contracts. Each such module is generated from a JSON ABI read from a local file or from an Etherscan-like API. When local JSON ABI files are placed at the `abi` folder, the modules can be generated with an `sqd` shortcut:
```bash
sqd typegen
```
Results will be placed at `src/abi`. For example, a JSON ABI file placed at `abi/erc721.json` will be used to generate `src/abi/erc721.ts`.

These modules provide:
* Constants such as topic0 values of event logs and function signature hashes:
  ```typescript
  import { events, functions } from "abi/erc721"

  let transferEventTopic: string = events.Transfer.topic
  let approveFunctionSighash: string = functions.approve.sighash
  ```
* Decoders for event data:
  ```typescript
  // in the batch handler
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "EVM.Log") {
        const { from, to, tokenId } = events.Transfer.decode(item.event.args)
     }
   }
  }
  ```
* Classes for querying the contract state - see the [Access contract state](/substrate-indexing/evm-support/#access-the-contract-state) section.

## Subscribe to EVM events

**`addEvmLog(contract: string | string[], options?)`**: A `SubstrateBatchProcessor` configuration setter that subscribes it to EVM log data (events) emitted by a specific EVM contract. 

```typescript
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("astar", {type: "Substrate"}),
  })
  .addEvmLog([
    "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
    "0x6a2d262d56735dba19dd70682b39f6be9a931d98"
  ],
  {
    filter: [[erc721.events.Transfer.topic]],
  });
```
The `options` argument has the same format as for [`addEvent`](/substrate-indexing/configuration/#events), supports the same [data selectors](/substrate-indexing/configuration/#event-data-selector) and additionally a topic filter:

```typescript
{
  range?: {from: number, to?: number | undefined},
  filter?: EvmTopicSet[],
  data?: {} // same as the data selector for `addEvent` 
}
```
For details on the topic filter, check out the [EVM logs section of the EVM processor configuration page](/evm-indexing/configuration/evm-logs) and examples within.

## Subscribe to EVM transactions

**`addEthereumTransaction(contractAddress: string | string[], options?: {data?, range?, sighash?})`**: A `SubstrateBatchProcessor` configuration setter that subscribes it to `Ethereum.transact()` calls. `Ethereum.Executed` event will be loaded for each `Ethereum.transact` call from the result set. 

Filtering by contract address(es), function [4-byte signature hash](https://www.4byte.directory) (`sighash`) and block range are supported. `data` selection options are similar to those of [`addCall()`](/substrate-indexing/configuration/#call-data-selector).

Note that by default both successful and failed transactions are fetched. Further, there's a difference between the success of a Substrate call and the internal EVM transaction. The transaction may fail even if the enclosing Substrate call has succeeded.

#### Examples

Request all EVM calls to two contracts:
```ts
processor.addEthereumTransaction([
  '0x6a2d262d56735dba19dd70682b39f6be9a931d98'
  '0x3795c36e7d12a8c252a20c5a7b455f7c57b60283'
])
```

Request all `transfer(address,uint256)` EVM calls on the network:
```ts
processor.addEthereumTransaction('*', {sighash: '0xa9059cbb'})
```

## Event and transaction data parsing

The way the Frontier EVM pallet exposes EVM logs and transaction may change due to runtime upgrades. The util library [`@subsquid/frontier`](https://github.com/subsquid/squid-sdk/tree/master/substrate/frontier) provides helper methods that are aware of the upgrades:

`getEvmLog(ctx: ChainContext, event: Event): EvmLog`: Extract the EVM log data from `EVM.Log` event.

`getTransaction(ctx: ChainContext, call: Call): LegacyTransaction | EIP2930Transaction | EIP1559Transaction`: Extract the transaction data from `Ethereum.transact` call with additional fields depending on the EVM transaction type.

`getTransactionResult(ctx: ChainContext, ethereumExecuted: Event): {from: string, to: string, transactionHash: string, status: 'Succeed' | 'Error' | 'Revert' | 'Fatal', statusReason: string}`: Extract transaction result from an `Ethereum.Executed` event.

#### Example

```typescript 
const processor = new SubstrateBatchProcessor()
  .setBatchSize(200)
  .setDataSource({
    archive: lookupArchive('astar', {type: 'Substrate'})
  })
  .addEthereumTransaction('*', {
    data: {
      call: true,
    }
  })
  .addEvmLog('*', {
    data: {
      event: true
    }
  })

processor.run(new TypeormDatabase(), async ctx => {
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'event' && item.name === 'EVM.Log') {
        const { address, data, topics } = getEvmLog(ctx, item.event)
        // process evm log data
      }
      if (item.kind === 'call' && item.name === 'Ethereum.transact') {
        const tx = getTransaction(ctx, item.call)
      }   
    }
  }
})
```

## Access contract state

EVM contract state is accessed using the [typegen-](/substrate-indexing/evm-support/#squid-evm-typegen)generated `Contract` class that takes the handler context and the contract address as constructor arguments. The state is always accessed at the context block height unless explicitly defined in the constructor.
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

For more information on EVM Typegen, see this [dedicated page](/evm-indexing/squid-evm-typegen).

## Factory contracts

It some cases the set of contracts to be indexed by the squid is not known in advance. For example, a DEX contract typically creates a new contract for each trading pair added, and each such trading contract is of interest.

While the set of handler subscriptions is static and defined at the processor creation, one can leverage the wildcard subscriptions and filter the contracts of interest in runtime. 

Let's consider how it works in a DEX example, with a contract emitting `'PairCreated(address,address,address,uint256)'` log when a new pair trading contract is created by the main contract. The full code (used by BeamSwap) is available in this [repo](https://github.com/subsquid/beamswap-squid/blob/master/src/processor.ts).

```typescript
const FACTORY_ADDRESS = '0x985bca32293a7a496300a48081947321177a86fd'
const PAIR_CREATE_TOPIC = abi.events[
    'PairCreated(address,address,address,uint256)'
].decode(evmLog)
// subscribe to events when a new contract is created by the parent 
// factory contract
const processor = new SubstrateBatchProcessor()
    .addEvmLog(FACTORY_ADDRESS, {
        filter: [PAIR_CREATED_TOPIC],
    })
// Subscribe to all contracts emitting the events of interest, and 
// later filter by the addresses deployed by the factory
processor.addEvmLog('*', {
    filter: [
        [
            pair.events['Transfer(address,address,uint256)'].topic,
            pair.events['Sync(uint112,uint112)'].topic,
            pair.events['Swap(address,uint256,uint256,uint256,uint256,address)'].topic,
            pair.events['Mint(address,uint256,uint256)'].topic,
            pair.events['Burn(address,uint256,uint256,address)'].topic,
        ],
    ],
})

processor.run(database, async (ctx) => {
    const mappers: BaseMapper<any>[] = []

    for (const block of ctx.blocks) {
        for (const item of block.items) {
            if (item.kind === 'event') {
                if (item.name === 'EVM.Log') {
                    await handleEvmLog(ctx, block.header, item.event)
                }
            }
        }
    }
})

async function handleEvmLog(
    ctx: BatchContext<Store, unknown>,
    block: SubstrateBlock,
    event: EvmLogEvent
) {
    const evmLog = getEvmLog(ctx, event)
    const contractAddress = evmLog.address
    if (contractAddress === FACTORY_ADDRESS &&
        evmLog.topics[0] === PAIR_CREATED_TOPIC) {
        // updated the list of contracts to whatch
    } else if (await isPairContract(ctx.store, contractAddress)) {
        // the contract has been created by the factory,
        // index the events
    }
}
```
Note: this code is using the legacy style of addressing EVM contract ABI modules. For example, `pair.events['Sync(uint112,uint112)'].topic` is equivalent to `pair.events.Sync.topic`.
