---
sidebar_position: 60
description: >-
  Ink! WASM smart contracts support
title: Ink! contracts support
---

# Ink! contracts support

This section describes additional options available for indexing [Ink!-based WASM contracts](https://use.ink), supported by chains with a `Contracts` pallet. At the moment of writing, Shibuya (a testnet), Shiden (Kusama parachain) and Astar (Polkadot parachain) are the most popular chains for deploying Ink! contracts. Follow the [WASM squid tutorial](/tutorials/create-a-wasm-processing-squid) for a step-by-step instruction on building a WASM-processing squid. We recommend using [squid-wasm-template](https://github.com/subsquid-labs/squid-wasm-template) as a reference project.

## Processor options

**`addContractsContractEmitted(contractAddress: string, options?: {data?, range?})`**: Subscribe to the Ink! events of the WASM runtime emitted by a contract deployed at the specified address. The `options` argument and the data selectors are similar to that of [`addEvent()`](/substrate-indexing/configuration/#events).

#### Example
```ts
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("shibuya")
  })
  .addContractsContractEmitted('0x5207202c27b646ceeb294ce516d4334edafbd771f869215cb070ba51dd7e2c72', {
    data: {
      event: {args: true}
    }
  } as const)
```

## Ink! Typegen

Use [`squid-ink-typegen`](https://github.com/subsquid/squid-sdk/tree/master/substrate/ink-typegen) to generate the boilerplate for decoding the WASM data from JSON ABI metadata.

*Usage*
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
