---
sidebar_position: 51
description: >-
  Acala EVM+ support
---

# Acala EVM+ support

**Available since `@subsquid/substrate-processor@1.9.0`**

Acala and Karura networks offer [EVM+ pallet](https://wiki.acala.network/learn/acala-evm/acala-evm-composable-defi-stack), a custom implementation of EVM natively integrated into the Polkadot/Kusama parachain ecosystem. The pallet is significantly different from the Frontier EVM pallet. `SubstrateBatchProcessor` natively supports handlers for indexing EVM smart contracts deployed to Acala/Karura.

## `EVM.Executed` events

**`addAcalaEvmExecuted(contract: '*' | string | string[], options?: {logs?, data?, range?})`**: Subscribe to the `EVM.Executed` events emitted by specific contract(s) and/or matching a topic filter.
For capturing all events emitted by a specific contract:

```typescript
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("acala"),
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

For a fine-grained filtering, use `'*'` for the contract address, and specify the topic filtering with `logs` as shown in the snippet below. Note that it uses [EVM typegen](/evm-indexing/squid-evm-typegen) for a human-readable topic filter definition.

```typescript
// request all `EVM.Executed` events containing ERC721 transfers from contract `0x0000000000000000000100000000000000000080`
processor.addAcalaEvmExecuted('*', {
 logs: [{
    contract: '0x0000000000000000000100000000000000000080',
    filter: [[erc721.events.Transfer.topic]]
  }]
})
```
For details on the topic filter, check out the [EVM logs section of the EVM processor configuration page](/evm-indexing/configuration/evm-logs) and examples within.

## `EVM.ExecutedFailed` events

**`addAcalaEvmExecutedFailed(contract: '*' | string | string[], options?: {logs?, data?, range?})`**: Subscribe to EVM logs emitted by unsuccessful EVM transactions. Note that even though such logs are emitted by failed EVM transactions, the enveloping Substrate extrinsic executes successfully.

```typescript
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("acala"),
  })
  // request all `EVM.Executed` events from contract `0xae9d7fe007b3327aa64a32824aaac52c42a6e624`
  .addAcalaEvmExecutedFailed("0xae9d7fe007b3327aa64a32824aaac52c42a6e624");
```

The fine-grained filtering options are similar to `.addAcalaEvmExecuted`.
