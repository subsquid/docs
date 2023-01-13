---
sidebar_position: 51
description: >-
  Acala EVM+ support
---

# Acala EVM+ support

**Available since `@subsquid/substrate-processor@1.9.0`**

Acala and Karura networks offer [EVM+ palette](https://wiki.acala.network/learn/acala-evm/acala-evm-composable-defi-stack), a custom implementation of EVM natively integrated into the Polkadot/Kusama parachain ecosystem. The palette is significantly different from the Frontier EVM palette. Since `@subsquid/substrate-processor@1.9.0` Subsquid processor SDK natively supports handlers for indexing EVM smart contracts deployed to Acala/Karura. 

## `EVM.Executed` events

Use `addAcalaEvmExecuted(contract: '*' | string | string[], options?: AcalaEvmExecutedOptions & NoDataSelection)` to subscribe to the `EVM.Executed` events emitted by a specific contract(s) and/or matching a topic filter.

For capturing all events emitted by a specific contract(s):

```typescript
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("acala", { release: "FireSquid" }),
  })
  // request all `EVM.Executed` events from contract `0xae9d7fe007b3327aa64a32824aaac52c42a6e624`
  .addAcalaEvmExecuted("0xae9d7fe007b3327aa64a32824aaac52c42a6e624");
```

To capture logs from multiple contracts, simply pass an array:
```typescript
  // ...
  .addAcalaEvmExecuted([
    '0xae9d7fe007b3327aa64a32824aaac52c42a6e624',
    '0x1aafb0d5aab9ffbe09d4d30c9fd90d695c4f0881',
  ]);
```

For a fine-grained filtering, use `'*'` for the contract address, and specify the topic filtering with `logs` as shown in the snippet below. Note that it uses [EVM typegen](/basics/typegen/squid-evm-typegen) for a human-readable topic filter definition.

```typescript
// request all `EVM.Executed` events containing ERC721 transfers from contract `0x0000000000000000000100000000000000000080`
processor.addAcalaEvmExecuted('*', {
 logs: [{
    contract: '0x0000000000000000000100000000000000000080',
    filter: [erc721.events["Transfer(address,address,uint256)"].topic]
  }]
})
```

Note, that the topic filter follows the [Ether.js filter specification](https://docs.ethers.io/v5/concepts/events/#events--filters). For example, for a filter that accepts the ERC721 topic `Transfer(address,address,uint256)` AND `ApprovalForAll(address,address,bool)` use a double array: 
```ts
  //...
  filter: [[
    erc721.events["Transfer(address,address,uint256)"].topic, 
    erc721.events["ApprovalForAll(address,address,bool)"].topic
  ]]
```

## `EVM.ExecutedFailed` events

Similarly, one can subscribe to EVM logs emitted by unsuccessful EVM transactions with `addAcalaEvmExecuted(contract: '*' | string | string[], options?: AcalaEvmExecutedOptions & NoDataSelection)`. Note that even though such logs are emitted by failed EVM transactions, the enveloping Substrate extrinsic executes successfully.

```typescript
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("acala", { release: "FireSquid" }),
  })
  // request all `EVM.Executed` events from contract `0xae9d7fe007b3327aa64a32824aaac52c42a6e624`
  .addAcalaEvmExecutedFailed("0xae9d7fe007b3327aa64a32824aaac52c42a6e624");
```

The fine-grained filtering options are similar to `.addAcalaEvmExecuted`