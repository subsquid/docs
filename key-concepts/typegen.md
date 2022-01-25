# Typegen

Squid Typegen is a code generation tool for creating Typescript types for substrate [Events](substrate.md#events) and [Extrinsics](substrate.md#extrinsics).

This comes in very handy when expressing the business logic, mapping Events and Extrinsics with database Entities defined in the GraphQL schema, because having Class wrappers around them makes it much easier to develop Event Handlers and manage multiple metadata versions of a blockchain.

If we take the example of the Kusama blockchain, specifically, we might be interested in the `'balance.Transfer'` event. The process (described in this [Tutorial](../tutorial/generate-typescript-definitions.md)) to generate wrapper classes needs to explore the entire history of the blockchain (which can be done thanks to the command) first. The `squid-substrate-metadata-explorer` will output something like this:

```json
[
  {
    "blockNumber": 0,
    "blockHash": "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
    "specVersion": 1020,
    "metadata": "0x6d65746109701853797374656d011853797374656d34304163..."
  },
  // ...
]
```

Where the metadata field is cut for brevity, and the rest of the file is omitted. The point is that for every available [Runtime](substrate.md#runtime) version of the blockchain, some metadata is available to be decoded and explored, and this metadata contains the necessary information to process its Events and Extrinsics.

This is then used by the `typegen` command, to decode and interpret the metadata, and then use it to generate this TypeScript class:

```javascript
export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get isV1020(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === 'e1ceec345fa4674275d2608b64d810ecec8e9c26719985db4998568cfcafa72b'
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
    return this.ctx._chain.getEventHash('balances.Transfer') === '2082574713e816229f596f97b58d3debbdea4b002607df469a619e037cc11120'
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
  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '68dcb27fbf3d9279c1115ef6dd9d30a3852b23d8e91c1881acd12563a212512d'
  }

  /**
   * Transfer succeeded.
   */
  get asLatest(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}

```

Which manages different metadata versions, including the starting hash for each of them and how to process (decode) the event itself.

This is better explained in the section dedicated to the [Processor and Event mapping](processor.md), but, given the class definition for a `BalanceTransferEvent`, such a class can be used to handle events like this:

```javascript
processor.addEventHandler('balances.Transfer', async ctx => {
    let transfer = getTransferEvent(ctx)
    // ...
})

// ...

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

Where the event metadata version is checked and the metadata is extracted accordingly, making things a lot easier.
