---
sidebar_position: 5
description: >-
  Block data for Substrate
---

# Block data for Substrate

`SubstrateBatchProcessor` follows the common [squid processor architecture](/sdk/overview), in which data processing happens within the [batch handler](/sdk/reference/processors/architecture/#processorrun), a function repeatedly called on batches of on-chain data. The function takes a single argument called "batch context". Its structure follows the [common batch context layout](/sdk/reference/processors/architecture/#batch-context), with `ctx.blocks` being an array of `Block` objects containing the data to be processed, aligned at the block level.

For `SubstrateBatchProcessor` the `Block` interface is defined as follows:
```ts
export type Block<F extends FieldSelection = {}> = {
  header: BlockHeader<F>
  extrinsics: Extrinsic<F>[]
  calls: Call<F>[]
  events: Event<F>[]
}
```
`F` here is the type of the argument of the [`setFields()`](../field-selection) processor method.

`Block.header` contains the block header data. The rest of the fields are iterables containing four kinds of blockchain data. The canonical ordering within each iterable is the same as it is within the blocks.

The exact fields available in each data item type are inferred from the `setFields()` call argument. They are documented on the [Field selection](../field-selection) page:
 - [extrinsics section](../field-selection/#extrinsics);
 - [calls section](../field-selection/#calls);
 - [events section](../field-selection/#events);
 - [block header section](../field-selection/#block-headers).

## Example

The handler below simply outputs all the `Balances.transfer_all` calls on Kusama in [real time](/sdk/resources/unfinalized-blocks):

```ts
import {SubstrateBatchProcessor} from '@subsquid/substrate-processor'
import {TypeormDatabase} from '@subsquid/typeorm-store'

const processor = new SubstrateBatchProcessor()
  .setGateway('https://v2.archive.subsquid.io/network/kusama')
  .setRpcEndpoint('https://kusama-rpc.polkadot.io')
  .setBlockRange({from: 19_600_000})
  .addCall({
    name: ['Balances.transfer_all'],
  })
  .setFields({
    call: {
      origin: true,
      success: true 
    }
  }) 

processor.run(new TypeormDatabase(), async ctx => {
  for (let block of ctx.blocks) {
    for (let call of block.calls) {
      ctx.log.info(call, `Call:`)
    }
  }
})
```

One can experiment with the [`setFields()`](../field-selection) argument and see how the output changes.

[//]: # (!!!! For more elaborate examples, check examples and batch processor in action)
