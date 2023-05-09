---
sidebar_position: 60
description: >-
  ink! WASM smart contracts support
title: ink! contracts support
---

# ink! contracts support

This section describes additional options available for indexing [ink!-based WASM contracts](https://use.ink), supported by chains with a `Contracts` pallet. At the moment of writing, AlephZero, Shibuya (Astar testnet), Shiden (Kusama parachain) and Astar (Polkadot parachain) are the most popular chains for deploying ink! contracts.

[Generate an ink! indexing squid automatically](/basics/squid-gen/), follow the [WASM squid tutorial](/tutorials/create-a-wasm-processing-squid) for a step-by-step instruction or check out the [squid-wasm-template](https://github.com/subsquid-labs/squid-wasm-template) reference project.

## Processor options

**`addContractsContractEmitted(contractAddress: string, options?: {data?, range?})`**: Subscribe to the ink! events of the WASM runtime emitted by a contract deployed at the specified address. The address must be specified as a hex string, so make sure to decode it if you have an ss58 encoded one. The `options` argument and the data selectors are similar to that of [`addEvent()`](/substrate-indexing/configuration/#events).

#### Example
```ts
import * as ss58 from "@subsquid/ss58"
import {toHex} from "@subsquid/util-internal-hex"

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("shibuya")
  })
  .addContractsContractEmitted(
    toHex(ss58.decode('XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w').bytes),
    {
      data: {
        event: {args: true}
      }
    } as const
  )
```

## ink! Typegen

Use [`squid-ink-typegen`](https://github.com/subsquid/squid-sdk/tree/master/substrate/ink-typegen) to generate facade classes for decoding ink! smart contract data from JSON ABI metadata.

### Usage

```bash
npx squid-ink-typegen --abi abi/erc20.json --output src/abi/erc20.ts
```

The generated sources expose the decoding methods and some useful types, using `@subsquid/ink-abi` under the hood:

```typescript title="src/abi/erc20.ts"
const _abi = new Abi(metadata)

export function decodeEvent(hex: string): Event {
  return _abi.decodeEvent(hex)
}

export function decodeMessage(hex: string): Message {
  return _abi.decodeMessage(hex)
}

export function decodeConstructor(hex: string): Constructor {
  return _abi.decodeConstructor(hex)
}
```

#### Example

The usage in a batch handler is straightforward:
```ts
processor.run(new TypeormDatabase(), async ctx => {
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.name == 'Contracts.ContractEmitted' && item.event.args.contract == CONTRACT_ADDRESS) {
        let event = erc20.decodeEvent(item.event.args.data)
        if (event.__kind === 'Transfer') {
          //  event is of type `Event_Transfer`
        }
      }
    }
  }
})
```

### State queries

**Available since `@subsquid/ink-typegen@0.2.0`**

The generated `Contract` class provides facades for all state calls that don't mutate the contract state. The info about the state mutability is taken from the contract metadata.
```ts
// Generated code:
export class Contract {
    // optional blockHash indicates the block at which the state is queried
    constructor(private ctx: ChainContext, private address: string, private blockHash?: string) { }

    total_supply(): Promise<Balance> {
        return this.stateCall('0xdb6375a8', [])
    }

    balance_of(owner: Uint8Array): Promise<bigint> {
        return this.stateCall('0x6568382f', [owner])
    }
}
```

#### Example

```ts
processor.run(new TypeormDatabase(), async ctx => {
  for (let block of ctx.blocks) {
    for (let item of block.items) {
       // query the balance at the current block
       conts contract = new Contract(ctx, CONTRACT_ADDRESS, block.header.hash)
       let aliceAddress = ss58.decode('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY').bytes
       await contract.balance_of(aliceAddress)
    }
  }
})
```
