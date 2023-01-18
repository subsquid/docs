---
sidebar_position: 44
description: >-
  The squid typegen tools generate type-safe typescript classes for accessing and decoding the on-chain data
---

# Typegen tools

By design, [Archives](/archives) store the on-chain data in the "raw" format close to how the data is actually stored internally in the blocks.  For example, the event and the call the data is 
[SCALE-decoded](https://docs.substrate.io/reference/scale-codec/), and EVM and WASM logs are binary encoded. 
The data is expected to be decoded by the squid processor once fetched from the Archive. 

To be more precise, `BatchContext` (`CommonHandlerContext` for `SubstrateProcessor`) provides a low-level `Chain` interface which exposes:

- a lightweight and fast SCALE codec implementation
- a resilient gRPC client
- a metadata registry for on-chain data types.

The typegen CLI tools generate a boilerplate typescript classes on top of `ctx._chain` to

- type-safe decode and track the runtime upgrades for the historical versions of the event, calls and storage items of interest [`squid-substrate-typegen`](/basics/typegen/squid-substrate-typegen)
- type-safe decode EVM logs and provide a type-safe interface for the contract state queries: [`squid-evm-typegen`](/basics/typegen/squid-evm-typegen)
- type-safe decode WASM logs: [`squid-wasm-typegen`](/basics/typegen/squid-wasm-typegen)

