---
sidebar_position: 50
description: >-
  Indexing a dynamic set of contracts
---

# Factory contracts

It some cases the set of contracts to be indexed by the squid is not known in advance. For example, a DEX contract typically creates a new contract for each trading pair added, and each such trading contract is of interest. 

While the set of handler subscriptions is static and defined at the processor creation, one can leverage wildcard subscriptions and filter for contracts of interest at runtime. 

Let's consider how it works in a DEX example, with a contract emitting `PoolCreated` log when a new pool contract is created by the main contract. Full code is available in the [examples repo](https://github.com/subsquid-labs/factory-example).

```typescript
let processor = new EvmBatchProcessor()
    .setDataSource({
        archive: 'https://eth.archive.subsquid.io',
    })
    // subscribe to events emitted by the FACTORY address
    .addLog(FACTORY_ADDRESS, {
        filter: [[factoryAbi.events.PoolCreated.topic]],
        // we need the topic and the data
        data: {
            evmLog: {
                topics: true,
                data: true,
            },
        } as const,
    })
    // subsrcibe to all Swap events, regardless of the address
    .addLog([], {
        filter: [[poolAbi.events.Swap.topic]],
        data: {
            // request the log and the tx hash data
            // for indexing
            evmLog: {
                topics: true,
                data: true,
            },
            transaction: {
                hash: true,
            },
        } as const,
    })

processor.run(new TypeormDatabase(), async (ctx) => {
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.kind !== 'evmLog') continue

            if (item.address === FACTORY_ADDRESS) {
                // update the list of pool contracts
            } else if (factoryPools.has(item.address)) {
               //  handle the swap event for the known pool
            }
        }
    }

})
```
