---
sidebar_position: 31
description: >-
  Indexig a dynamic set of contracts
---

## Factory contracts

It some cases the set of contracts to be indexed by the squid is not known in advance. For example, a DEX contract typically
creates a new contract for each trading pair added, and each such trading contract is of interest. 

While the set of handler subscriptions is static and defined at the processor creation, one can leverage the wildcard subscriptions and filter the contract of interest in runtime. 

Let's consider how it works in a DEX example, with a contract emitting `'PairCreated(address,address,address,uint256)'` log when a new pair trading contract is created by the main contract. The full code is available in the [examples repo](https://github.com/belopash/factory-example).

```typescript
const FACTORY_ADDRESS = '0x985bca32293a7a496300a48081947321177a86fd'
const PAIR_CREATE_TOPIC = events.PairCreated.decode(evmLog)
// subscribe to events when a new contract is created by the parent 
// factory contract
const processor = new EvmBatchProcessor()
    .addEvmLog(FACTORY_ADDRESS, {
        filter: [PAIR_CREATED_TOPIC],
    })
// Subscribe to all contracts emitting the events of interest, and 
// later filter by the addresses deployed by the factoryg
processor.addEvmLog('*', {
    filter: [
        [
            pair.events.Transfer.topic,
            pair.events.Sync.topic,
            pair.events.Swap.topic,
            pair.events.Mint.topic,
            pair.events.Burn.topic,
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

async function handleEvmLog(ctx: BatchContext<Store, unknown>, block: SubstrateBlock, event: EvmLogEvent) {
    const evmLog = getEvmLog(ctx, event)
    const contractAddress = evmLog.address
    if (contractAddress === FACTORY_ADDRESS && evmLog.topics[0] === PAIR_CREATED_TOPIC) {
        // updated the list of contracts to whatch
    } else if (await isPairContract(ctx.store, contractAddress)) {
        // the contract has been created by the factory,
        // index the events
    }
}
```
