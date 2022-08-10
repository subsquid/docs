---
sidebar_position: 5
description: >-
  Additional support for indexing EVM smart contract data
---

# EVM support

This section describes additional options available for Substrate chains with the Frontier EVM pallet like Moonbeam or Astar. Follow the [EVM squid tutorial](/tutorials/create-an-evm-processing-squid) for a step-by-step tutorial on building an EVM-processing. We recommend using [squid-evm-template](https://github.com/subsquid/squid-evm-template) as a reference.

## Handler options

Use `addEvmLog(contract, options)` to subscribe to the EVM log data emitted by a specific EVM contract: 

```typescript
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("moonbeam", { release: "FireSquid" }),
  })
  .setTypesBundle("moonbeam")
  .addEvmLog("0xb654611f84a8dc429ba3cb4fda9fad236c505a1a", {
    filter: [erc721.events["Transfer(address,address,uint256)"].topic],
  });
```

The `option` argument supports the same selectors as for `addEvent` and additionally a set of topic filters:

```typescript
{
   range?: DataRange,
   filter?: EvmTopicSet[],
   data?: {} // same as the data selector for `addEvent` 
}
```

Note, that the topic filter follows the [Ether.js filter specification](https://docs.ethers.io/v5/concepts/events/#events--filters). For example, for a filter that accepts the ERC721 topic `Transfer(address,address,uint256)` AND `ApprovalForAll(address,address,bool)` use a double array: 
```ts
processor.addEvmLog('0xb654611f84a8dc429ba3cb4fda9fad236c505a1a', {
  filter: [[
    erc721.events["Transfer(address,address,uint256)"].topic, 
    erc721.events["ApprovalForAll(address,address,bool)"].topic
  ]]
})
```


## Typegen 

`squid-evm-typegen` is used to generate type-safe facade classes to call the contract state and decode the log events. By convention, the generated classes and the ABI file is kept in `src/abi`.
```
npx squid-evm-typegen --abi=src/abi/ERC721.json --output=src/abi/erc721.ts
```

The generated decodes the set of EVM logs topic and defines utility methods for decoding:

```typescript title="src/abi/erc721.ts"
export const events = {
  // for each topic defined in the ABI
  "Transfer(address,address,uint256)":  {
    topic: abi.getEventTopic("Transfer(address,address,uint256)"),
    decode(data: EvmEvent): Transfer0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Transfer(address,address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        from: result[0],
        to: result[1],
        tokenId: result[2],
      }
    }
  }
  //...
}
```

It can be the used in the handler in the following way:
```typescript
for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "EVM.Log") {
        const { from, to, tokenId } = erc721.events["Transfer(address,address,uint256)"].decode(item.event.args)
      }
    }
  }
```

## Access the contract state

The EVM contract state is accessed using the generated `Contract` class that takes the handler context and the contract address as constructor arguments. The state is always accessed at the context block height unless explicitly defined in the constructor.
```typescript title="src/abi/erc721.ts"
export class Contract  {
  constructor(ctx: BlockContext, address: string) { 
    //...
  }
  private async call(name: string, args: any[]) : Promise<ReadonlyArray<any>>  {
    //...
  }
  async balanceOf(account: string, id: ethers.BigNumber): Promise<ethers.BigNumber> {
    const result = await this.call("balanceOf", [owner])
    return result[0]
  }
}
```

It then can be used in a handler in a straightforward way, see [squid-evm-template](https://github.com/subsquid/squid-evm-template).

For more information on EVM Typegen, see this [dedicated page](/develop-a-squid/typegen/squid-evm-typegen).

