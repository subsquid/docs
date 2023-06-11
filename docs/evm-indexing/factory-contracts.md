---
sidebar_position: 50
description: >-
  Indexing a dynamic set of contracts
---

# Factory contracts

It some cases the set of contracts to be indexed by the squid is not known in advance. For example, a DEX contract typically creates a new contract for each trading pair added, and each such trading contract is of interest. 

While the set of handler subscriptions is static and defined at the processor creation, one can leverage wildcard subscriptions and filter for contracts of interest at runtime. 

Let's consider how it works in a DEX example, with a contract emitting `PoolCreated` log when a new pool contract is created by the main contract. Full code is available in the [examples repo](https://github.com/subsquid-labs/factory-example).

[//]: # (!!!! Update the archive and chain specs on release)

```typescript title=src/processor.ts
export const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
        chain: 'https://rpc.ankr.com/eth',
    })
    .setBlockRange({
        from: 12_369_621,
    })
    .setFields({
        log: {
            topics: true,
            data: true,
        },
        transaction: {
            hash: true,
        },
    })
    .addLog({
        address: [FACTORY_ADDRESS],
        topic0: [factoryAbi.events.PoolCreated.topic],
    })
    .addLog({
        topic0: [poolAbi.events.Swap.topic],
        transaction: true,
    })
```

```typescript title=src/main.ts
let factoryPools: Set<string>

processor.run(new TypeormDatabase(), async (ctx) => {
    if (!factoryPools) {
        factoryPools = await ctx.store.findBy(Pool, {}).then((q) => new Set(q.map((i) => i.id)))
    }

    let pools: PoolData[] = []
    let swaps: SwapEvent[] = []

    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            if (log.address === FACTORY_ADDRESS) {
                pools.push(getPoolData(ctx, log))
            } else if (factoryPools.has(log.address)) {
                swaps.push(getSwap(ctx, log))
            }
        }
    }

    await createPools(ctx, pools)
    await processSwaps(ctx, swaps)
})
```
