---
sidebar_position: 60
description: >-
   Access state and storage with gRPC
title: State queries
---

# Storage calls and state queries

It is sometimes impossible to extract the required data with only event and call data without querying the runtime state.
The context exposes a lightweight gRPC client to the chain node accessible via `ctx._chain`. 
It exposes low-level methods for accessing the storage. However, the recommended way to query the storage is with type-safe wrappers generated with [Substrate typegen](../squid-substrate-typegen).

## Type-safe storage access with typegen

Substrate typegen tool exposes storage access wrappers at `src/types/storage.ts`. The wrappers follow the [general naming pattern](../squid-substrate-typegen/#typescript-wrappers) used by Substrate typegen:
```
storage.${palletName}.${storageName}
```
with all identifiers lowerCamelCased. Each wrapper exposes a generated `get()` query method and, if available, methods for multi-key queries, listing keys, key-value pairs and retrieving the default value.

Note that the generated getters **always query historical blockchain state at the height derived from their `block` argument**.

To generate the storage access wrappers with typegen:

* In `typegen.json`, set `specVersions` as described on the [typegen page](../squid-substrate-typegen).
* List storage items at `pallets.${PalletName}.storage` arrays of `typegen.json`. Alternatively, generate wrappers for all storage items in the pallet by setting `storage: true`.
* Run the typegen with

```bash
sqd typegen
```

Here's an example of `typegen.json` for generating a wrapper for `Balances.Account` on Kusama:

```json title="typegen.json"
{
  "outDir": "src/types",
  "specVersions": "https://v2.archive.subsquid.io/metadata/kusama",
  "pallets": {
    "Balances": {
      "storage": [
        "Account"
      ]
    }
  }
}
```

Inspect the generated wrapper at `src/types/balances/storage.ts`:

```typescript title="src/types/balances/storage.ts"
import {sts, Block, Bytes, Option, Result, StorageType} from '../support'
import * as v1050 from '../v1050'
import * as v9420 from '../v9420'

export const account = {
  v1050: new StorageType('Balances.Account', 'Default', [v1050.AccountId], v1050.AccountData) as AccountV1050,
  v9420: new StorageType('Balances.Account', 'Default', [v9420.AccountId32], v9420.AccountData) as AccountV9420,
}

export interface AccountV1050  {
  getDefault(block: Block): v1050.AccountData
  get(block: Block, key: v1050.AccountId): Promise<v1050.AccountData | undefined>
  getMany(block: Block, keys: v1050.AccountId[]): Promise<v1050.AccountData | undefined[]>
}

export interface AccountV9420  {
  getDefault(block: Block): v9420.AccountData
  get(block: Block, key: v9420.AccountId32): Promise<v9420.AccountData | undefined>
  getMany(block: Block, keys: v9420.AccountId32[]): Promise<v9420.AccountData | undefined[]>
  getKeys(block: Block): Promise<v9420.AccountId32[]>
  getKeys(block: Block, key: v9420.AccountId32): Promise<v9420.AccountId32[]>
  getKeysPaged(pageSize: number, block: Block): AsyncIterable<v9420.AccountId32[]>
  getKeysPaged(pageSize: number, block: Block, key: v9420.AccountId32): AsyncIterable<v9420.AccountId32[]>
  getPairs(block: Block): Promise<[k: v9420.AccountId32, v: v9420.AccountData | undefined][]>
  getPairs(block: Block, key: v9420.AccountId32): Promise<[k: v9420.AccountId32, v: v9420.AccountData | undefined][]>
  getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v9420.AccountId32, v: v9420.AccountData | undefined][]>
  getPairsPaged(pageSize: number, block: Block, key: v9420.AccountId32): AsyncIterable<[k: v9420.AccountId32, v: v9420.AccountData | undefined][]>
}
```

The generated access interface provides methods for accessing:

- the default storage value with `getDefault(block)`
- a single storage value with `get(block, key)`
- multiple values in a batch call with `getMany(block, keys[])`
- all storage keys with `getKeys(block)`
- all keys with a given prefix with `getKeys(block, keyPrefix)` (only if the storage keys are decodable)
- paginated keys via `getKeysPaged(pageSize, block)` and `getKeysPaged(pageSize, block, keyPrefix)`
- key-value pairs via `getPairs(block)` and `getPairs(block, keyPrefix)`
- paginated key-value pairs via `getPairsPaged(pageSize, block)` and `getPairsPaged(pageSize, block, keyPrefix)`

### Example

```typescript title="src/main.ts"
import {storage} from './types'

processor.run(new TypeormDatabase(), async ctx => {
  let aliceAddress = ss58.decode('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY').bytes
  for (const blockData of ctx.blocks) {
    if (storage.balances.account.v1050.is(blockData.header)) {
      let aliceBalance = (await storage.balances.account.v1050.get(blockData.header, aliceAddress))?.free
      ctx.log.info(`Alice free account balance at block ${blockData.header.height}: ${aliceBalance}`)
    }
  }
})
```
