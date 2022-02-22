---
description: (and how to deal with them)
---

# Runtime upgrades

One of the most useful functionalities offered by the Subsquid SDK is the ability to automatically manage changes in the Runtime, due to upgrades for example.

The [metadata explorer tool](../../key-concepts/typegen.md#blockchain-metadata) will find these changes and the [`typegen` tool](../../key-concepts/typegen.md#typescript-class-wrappers) will create wrapper classes that expose helper methods to distinguish and handle the different Runtime versions available for a given Event or Extrinsic.

Here is an example of how this all shows up as far as code goes. The `balances.Transfer` event has gone through multiple Runtime versions and the generated type-safe wrapper class looks like this:

```typescript
export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get isV1020(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '154fca303841d334782de2e871e3572f786f81f86e2a6153c2b9e8dc6fc27422'
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get asV1020(): [Uint8Array, Uint8Array, bigint, bigint] {
    assert(this.isV1020)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   *  Transfer succeeded (from, to, value).
   */
  get isV1050(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '9611bd6b933331f197e8fa73bac36184681838292120987fec97092ae037d1c8'
  }

  /**
   *  Transfer succeeded (from, to, value).
   */
  get asV1050(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1050)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Transfer succeeded.
   */
  get isV9130(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '99bc4786247456e0d4a44373efe405e598bfadfac87a7c41b0a82a91296836c1'
  }

  /**
   * Transfer succeeded.
   */
  get asV9130(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint} {
    assert(this.isV9130)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9130
  }

  get asLatest(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV9130
  }
}
```

For the `v9130` version (the latest), the type definition is made explicit in a different file and imported:

```typescript
export type AccountId32 = Uint8Array
```

This can then be used, for example, to construct a common interface to be passed around, and a helper function can leverage the various methods to verify the version and build such interface:

```typescript
interface TransferEvent {
    from: Uint8Array
    to: Uint8Array
    amount: bigint
}


function getTransferEvent(ctx: EventHandlerContext): TransferEvent {
    let event = new BalancesTransferEvent(ctx)
    if (event.isV1020) {
        let [from, to, amount] = event.asV1020
        return {from, to, amount}
    } else if (event.isV1050) {
        let [from, to, amount] = event.asV1050
        return {from, to, amount}
    } else {
        return event.asLatest
    }
}
```
