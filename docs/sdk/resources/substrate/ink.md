---
sidebar_position: 40
description: >-
  ink! WASM smart contracts support
title: ink! contracts support
---

# ink! contracts support

This section describes additional options available for indexing [ink!-based WASM contracts](https://use.ink), supported by chains with a `Contracts` pallet. At the moment of writing, AlephZero, Shibuya (Astar testnet), Shiden (Kusama parachain) and Astar (Polkadot parachain) are the most popular chains for deploying ink! contracts.

[Generate an ink! indexing squid automatically](/sdk/resources/squid-gen), follow the [WASM squid tutorial](/sdk/tutorials/ink) for a step-by-step instruction or check out the [squid-wasm-template](https://github.com/subsquid-labs/squid-wasm-template) reference project.

## Processor options

**`addContractsContractEmitted(options)`**: subscribe to the ink! events (`Contracts.ContractEmitted`) of the WASM runtime. `options` has the following structure:

```ts
{
  // data requests
  contractAddress?: string[]
  range?: {from: number, to?: number}

  // related data retrieval
  call?: boolean
  stack?: boolean
  extrinsic?: boolean
}
```
Contract addresses must be specified as hex strings, so make sure to decode them if yours are encoded with ss58.

You can also retrieve related data:
- with `call = true` the processor will retrieve the parent call and add it to the `calls` iterable within the [block data](../../context-interfaces);
- with `stack = true` it will do that with all calls in the entire call stack;
- with `extrinsic = true` it will add the parent extrinsic to the `extrinsics` block data iterable.

Field selection for the events and their related data is done with [`setFields()`](../../setup/field-selection).

#### Example
```ts
import * as ss58 from '@subsquid/ss58'
import {toHex} from '@subsquid/util-internal-hex'

const ADDRESS = toHex(ss58.decode('XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w').bytes)

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive('shibuya'),
    chain: 'https://shibuya.public.blastapi.io'
  })
  .addContractsContractEmitted({
    contractAddress: [ADDRESS],
    extrinsic: true
  })
  .setFields({
    event: {
      phase: true
    }
  })
```

## ink! Typegen

Use [`squid-ink-typegen`](https://github.com/subsquid/squid-sdk/tree/master/substrate/ink-typegen) to generate facade classes for decoding ink! smart contract data from JSON ABI metadata.

### Usage

```bash
npx squid-ink-typegen --abi abi/erc20.json --output src/abi/erc20.ts
```

The generated source code exposes the decoding methods and some useful types, using `@subsquid/ink-abi` under the hood:

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
    for (let event of block.events) {
      if (event.name==='Contracts.ContractEmitted' &&
          event.args.contract===CONTRACT_ADDRESS) {

        let event = erc20.decodeEvent(event.args.data)
        if (event.__kind==='Transfer') {
          // event is of type `Event_Transfer`
        }
      }
    }
  }
})
```

### State queries

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
    for (let event of block.events) {
       // query the balance at the current block
       const contract = new Contract(ctx, CONTRACT_ADDRESS, block.header.hash)
       let aliceAddress = ss58.decode('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY').bytes
       let aliceBalance = await contract.balance_of(aliceAddress)
    }
  }
})
```
