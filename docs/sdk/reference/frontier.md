---
sidebar_position: 120
title: The frontier package
description: >-
  Working with EVM running on Substrate
---

# `@subsquid/frontier`

The way the Frontier EVM pallet exposes EVM logs and transaction may change due to runtime upgrades. [`@subsquid/frontier`](https://github.com/subsquid/squid-sdk/tree/master/substrate/frontier) provides helper methods that are aware of the upgrades:

#### `getEvmLog(event: Event): EvmLog` {#get-evm-log}

Extract the EVM log data from `EVM.Log` event.

#### `getTransaction(call: Call): LegacyTransaction | EIP2930Transaction | EIP1559Transaction` {#get-transaction}

Extract the transaction data from `Ethereum.transact` call with additional fields depending on the EVM transaction type.

#### `getTransactionResult(ethereumExecuted: Event): {from: string, to: string, transactionHash: string, status: 'Succeed' | 'Error' | 'Revert' | 'Fatal', statusReason: string}` {#get-transaction-result}

Extract transaction result from an `Ethereum.Executed` event.

See also the [Frontier EVM guide](/sdk/resources/substrate/frontier-evm).

#### Example

```typescript 
const processor = new SubstrateBatchProcessor()
  .setGateway('https://v2.archive.subsquid.io/network/astar-substrate')
  .setRpcEndpoint('https://astar-rpc.dwellir.com')
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
