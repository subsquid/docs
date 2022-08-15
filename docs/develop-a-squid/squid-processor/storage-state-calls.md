---
sidebar_position: 41
description: >-
   Query the storage and access the historical state with gRPC requests to the node
---

# Storage calls and state queries

It is sometimes impossible to extract the required data with only event and call data without querying the runtime state.
The storage access is done via an instance of [`Chain`](https://github.com/subsquid/squid/blob/master/substrate-processor/src/chain.ts)accessible via `ctx._chain`. It has a built-in SCALE codec and gRPC client connected to the endpoint provided with the processor `setDataSource()` config. 

The following low-level methods of the `Chain` interface are used to query the storage (or the contract state)
```ts
export class Chain  {
   // get the gRPC client handle
   get client(): ResilientRpcClient
   // query multiple storage key at the specified block and (prefix, name). 
   async queryStorage(blockHash: string, prefix: string, name: string, keyList: any[][])
   // query a single storage key at the specified block and (prefix, name)
   async getStorage(blockHash: string, prefix: string, name: string, ...keys: any[])
}
```

## Type-safe storage access with typegen

The [Substrate typegen](/develop-a-squid/typegen) generates type-safe classes in `src/types/storage.ts` which take into account the historical runtime upgrades. The generated access methods support both single key and batch queries. 

Note that the generated getters **always query the historical block height of the "current" block derived the context**. This is the recommended way to access the storage.

To generate the storage classes with typegen:

* If necessary, generate the `specVersions` file with [`squid-substrate-metadata-explorer(1)`](https://github.com/subsquid/squid/tree/master/substrate-metadata-explorer)
* List the fully qualified names of the storage items to the `storage` section of the typegen config. The format is `${PalleteName}.${KeyName}`.
* Rerun the typegen with

```ts
make typegen
```

Here's an example of the typegen config:

```json
{
  "outDir": "src/types",
  "specVersions": "kusamaVersions.jsonl", 
  "storage": [
    "Balances.FreeBalance" 
  ]
}
```

To generate all the available storage calls, set `"storage": true`.

:::info
Note: One can also consult Subscan by navigating to the [Runtime section](https://kusama.subscan.io/runtime) and inspecting `Storage Functions` of the pallet of interest.
:::

**Example of a generated storage access class**

```typescript
// the name is derived from the name
export class BalancesFreeBalanceStorage {
  // single key query
  async getAsV1020(key: v1020.AccountId): Promise<v1020.Balance> {
    assert(this.isV1020)
    return this._chain.getStorage(this.blockHash, 'Balances', 'FreeBalance', key)
  }

  // batch query for multple queries
  async getManyAsV1020(keys: v1020.AccountId[]): Promise<(v1020.Balance)[]> {
    assert(this.isV1020)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'FreeBalance', keys.map(k => [k]))
  }

}
```

## Process Storage items information in a handler

As previously mentioned, the storage items are always retrieved at the "current" block height of `StorageContext`. The usage in a handler function is straightforward:

```typescript
processor.run(new TypeormDatabase(), async ctx => {
    // some other logic
    let storage = new BalancesFreeBalanceStorage(ctx)
    let aliceAddress = ss58.decode('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY').bytes
    let aliceFreeBalance = await storage.getAsV1020(aliceAddress)
    ctx.log.info(`Free balance: ${aliceFreeBalance}`)
})
```
