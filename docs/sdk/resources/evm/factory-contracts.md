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

## Two-pass indexing for factory contracts

Squids built with the pattern shown above get the job done, but retrieve a lot of data that ends up discarded in the process. Complete elimination of this overhead would require dynamically changing the processor configuration, which is not currently possible. However, the configuration can be changed at a fixed block and that can be used to eliminate most of the overhead, drastically reducing the sync time.

The technique has a couple of limitations:
 - The number of newly deployed contracts should be moderate (roughly up to tens of thousands). If your factory contract deploys contracts by millions (e.g. Pancakeswap), then vanilla factory pattern will be faster.
 - You will need to periodically perform an extra action to keep the syncing overhead of your squid to a minimum.

The idea is to retrieve the list of the contracts that the factory deploys up to a certain block _before the main sync starts_. Then all data of interest up to that block can be requested only for these contracts. Once that data is retrieved, the contract can switch back to retrieving the data chain-wide and filtering it in processor. The example above can be changed to:

```typescript title=src/processor.ts
const { preloadHeight, preloadedPools } = loadPools() // e.g. from a filesystem

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
    range: {
      from: 12_369_621,
      to: preloadHeight,
    },
    address: preloadedPools,
    topic0: [poolAbi.events.Swap.topic],
    transaction: true,
  })
  .addLog({
    range: {
      from: preloadHeight + 1,
    },
    topic0: [poolAbi.events.Swap.topic],
    transaction: true,
  })
```
The list of deployments can be preloaded with a small auxiliary squid and stored e.g. in `./assets`. This squid should be re-ran every time the number of blocks for which the whole network data is retrieved (that is, `preloadedHeight+1` to current head) becomes unacceptably large.

This approach is implemented in the [squid indexing the thena.fi decentralized exchange](https://github.com/subsquid-labs/thena-squid).
