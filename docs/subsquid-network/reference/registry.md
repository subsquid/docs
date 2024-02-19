---
sidebar_position: 60
title: Registry
description: Reference for the archive-registry package
---

# `@subsquid/archive-registry`

### Listing the available datasets

Use the `squid-archive-registry` executable to list the datasets for supported networks:
```bash
$ npx squid-archive-registry --help
Usage: run [options]

Display list of available archives

Options:
  -t --type <type>       Network type (choices: "evm", "substrate")
  -r --release <string>  Release name (choices: "FireSquid", "ArrowSquid")
  -h, --help             display help for command
```
You can use it without installing the package:
```bash
npx --yes -p @subsquid/archive-registry squid-archive-registry -t evm
```

### Lookup a network gateway

`@subsquid/archive-registry` provides a function `lookupArchive(alias, opts?)` to locate main URLs of datasets stored in the [open private network](/subsquid-network/overview/#open-private-network). `alias` is a network alias (see supported network pages for [EVM](/subsquid-network/reference/evm-networks) and [Substrate](/subsquid-network/reference/substrate-networks)) and `opts` is an optional config to disambiguate:

```ts
interface LookupOptions {
  type?: 'Substrate' | 'EVM'
  genesis?: string // Network genesis hex string (must start with "0x...")
  release?: 'FireSquid' | 'ArrowSquid' // dataset API release
  // plus some extra Substrate-only fields for technical use
}
```

**Example:**

```typescript
import { lookupArchive } from '@subsquid/archive-registry'
import { EvmBatchProcessor } from '@subsquid/evm-processor'

const processor = new EvmBatchProcessor()
  .setGateway(lookupArchive('eth-mainnet'))
```
