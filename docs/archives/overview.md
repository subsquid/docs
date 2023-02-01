---
sidebar_position: 10
title: Overview
description: Basics, public Archives, Archive registry
---

# Squid Archives

Archive is a specialized data lake for on-chain data, optimized for batch data access. The Archive API is meant to be used as a data source for Squid SDK [processors](/basics/squid-processor). 

Compared to data access using a conventional chain node RPC, an Archive allows one to access data at near zero cost, in a more granular fashion and from multiple blocks at once, thanks to its rich batching and filtering capabilities.

Subsquid Labs GmbH maintains public Archives for most [EVM](/evm-indexing/configuration) and [Substrate](https://app.subsquid.io/archive) chains. Until the Archive services are replaced by the decentralized and permissionless Subsquid Network, the Archive access if free of charge.  

If you are a network developer and would like to see your chain supported by Subsquid, please fill a [form](https://forms.gle/ioVNFiPjZgvUNunY9) or contact us in [SquidDevs Telegram chat](https://t.me/HydraDevs).

## Archive Registry

Subsquid publishes the list of public Archives in the [Archive Registry repository](https://github.com/subsquid/archive-registry/). The registry is available as a [npm package `@subsquid/archive-registry`](https://www.npmjs.com/package/@subsquid/archive-registry). It can be used to conveniently access registry files and e.g. lookup a Squid Archive or EVM Squid Archive by network name.

### Listing the available networks

Use the included `squid-archive-registry` executable to list aliases for the supported networks:

```bash
$ squid-archive-registry --help
Usage: run [options]

Display list of available archives

Options:
  -t --type <type>  Network type (choices: "evm", "substrate")
  -h, --help        display help for command
```

### Lookup Archive

`@subsquid/archive-registry` provides a function 
`lookupArchive(alias: KnownArchive, opts?: LookupOptionsEVM | LookupOptionsSubstrate )` to locate an Archive data source endpoint. `KnownArchive` is a network alias and `opts` is an optional config to disambiguate.

**Example:**

```typescript
import { lookupArchive } from "@subsquid/archive-registry";
import { EVMBatchProcessor } from "@subsquid/evm-processor";

const processor = new SubstrateBatchProcessor()
  .setDataSource({
     archive: lookupArchive("eth-mainnet")
})
```

## Running a self-hosted Archive

To run an self-hosted Archive, follow the instructions:
- [EVM Archives](/archives/evm/self-hosted)
- [Substrate Archives](/archives/substrate/self-hosted)


