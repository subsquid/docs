# Storage calls

It is sometimes impossible to extract the required data with only event and extrinsic data. `StorageContext` exposes direct queries of [runtime storage](https://docs.substrate.io/v3/runtime/storage/) items via RPC.

## Generate Type-safe wrappers

Typegen generates wrappers for fully type-safe storage calls which cover all historical runtime upgrades.

To enable storage calls:

- List fully qualified names of the storage items to the `storage` section of [typegen config](./../key-concepts/typegen.md)
- Rerun typegen

Here's an example of the typegen config:

```json
{
  "outDir": "src/types",
  "chainVersions": "chainVersions.json",
  "typesBundle": "./typesBundle.json",
  "events": [
    "balances.Transfer"
  ],
  "calls": [
    "timestamp.set"
  ],
  "storage": [
    "System.Account" 
  ]
}
```

To generate all available storage calls, simply set `"storage": true`.

{% hint style="info" %}
Note: One can also consult subscan by navigating to the [Runtime section](https://kusama.subscan.io/runtime) and inspecting `Storage Functions` of the pallet of interest.
{% endhint %}

Typegen will generate the file `types/storage.ts` with something similar to

```typescript
export class SystemAccountStorage {
  constructor(private ctx: StorageContext) {}

  /**
   *  The full account information for a particular account ID.
   */
  get isV1() {
    return this.ctx._chain.getStorageItemTypeHash('System', 'Account') === 'eb40f1d91f26d72e29c60e034d53a72b9b529014c7e108f422d8ad5f03f0c902'
  }

  /**
   *  The full account information for a particular account ID.
   */
  async getAsV1(key: Uint8Array): Promise<v1.AccountInfoWithRefCount> {
    assert(this.isV1)
    return this.ctx._chain.getStorage(this.ctx.block.hash, 'System', 'Account', key)
  }
}
```

## Process Storage items information in a Handler

As previously mentioned, the storage items are always retrieved at the "current" block height of `StorageContext`. The usage in a handler function is straighforward:

```typescript
processor.addPreHook({range: {from: 0, to: 0}}, async ctx => {
    let accounts = new SystemAccountStorage(ctx)
    let aliceAddress = ss58.decode('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY').bytes
    let aliceAccount = await accounts.getAsV1(aliceAddress)
    assert(aliceAccount.data.free > 0)
})
```
