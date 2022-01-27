---
description: >-
  The `SubstrateProcessor` is the main actor in transforming and loading chain
  data, according to pre-defined database model
---

# Processor

## Overview

In the [Architecture](architecture.md) explanation, the relationship between Squid Archive and Squid query node has been clarified. It has also been mentioned that raw chain data is decoded to be readily available for consumption.

The [Substrate](substrate.md) section explained what is decoded data is made of and what information does it bring.

Next, [Typegen](typegen.md) explained how the automated tools provide a way to conveniently wrap these entities with TypeScript objects.

The real Squid developer experience starts with defining their own data schema, modeling Entities they want to keep tabs on, and tracking how chain information affects them.

## Entities and Schema definition

The definition of a schema, and specifically knowing what Entities to identify in it, requires a level of domain knowledge that is beyond the scope of this page. Refer to the related [Recipe ](../recipes/define-a-squid-schema.md)for operational guidance, but in this context, we will take the [squid template](https://github.com/subsquid/squid-template) as an example.

In the template, the `Account` and `HistoricalBalance` have been defined in the `schema.graphql` and two TypeScript models have been automatically generated for them:

{% code title="account.model.ts" %}
```typescript
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {HistoricalBalance} from "./historicalBalance.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  /**
   * Account address
   */
  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balance!: bigint

  @OneToMany_(() => HistoricalBalance, e => e.account)
  historicalBalances!: HistoricalBalance[]
}

```
{% endcode %}

{% code title="historicalBalance.model.ts" %}
```typescript
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"

@Entity_()
export class HistoricalBalance {
  constructor(props?: Partial<HistoricalBalance>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  account!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balance!: bigint

  @Column_("timestamp with time zone", {nullable: false})
  date!: Date
}

```
{% endcode %}

Although not central to the description of the Processor, this is important because these Entities are the ones being impacted by the code defined in the Processor itself, and most importantly: they will be saved and persisted in the database and made available to API clients, via the GraphQL server.

## Processor customization

The Processor customization starts with the `processor.ts` file, this is where a `SubstrateProcessor` is instantiated and configured.

```typescript
import * as ss58 from "@subsquid/ss58"
import {EventHandlerContext, Store, SubstrateProcessor} from "@subsquid/substrate-processor"
import {Account, HistoricalBalance} from "./model"
import {BalancesTransferEvent} from "./types/events"


const processor = new SubstrateProcessor('kusama_balances')


processor.setTypesBundle('kusama')
processor.setBatchSize(500)


processor.setDataSource({
    archive: 'https://kusama.indexer.gc.subsquid.io/v4/graphql',
    chain: 'wss://kusama-rpc.polkadot.io'
})

```

The `SubstrateProcessor` class accomplishes a few tasks:

* setup and start a monitoring system
* connect to the database (using environment variables for connection info)
* start a loop that processes all incoming blocks from the data source in batches
  * upon processing a batch, for each block, all relevant hooks, event handlers, and extrinsic handlers are triggered

What's more, the class exposes various methods to attach custom functions as pre and post-block hooks (these can be compared to how middleware process requests in a webserver), event handlers, and extrinsic handlers, which, as mentioned, are going to be triggered, when necessary. Here's an example:

```typescript
processor.addEventHandler('balances.Transfer', async ctx => {
    let transfer = getTransferEvent(ctx)
    let tip = ctx.extrinsic?.tip || 0n
    let from = ss58.codec('kusama').encode(transfer.from)
    let to = ss58.codec('kusama').encode(transfer.to)

    let fromAcc = await getOrCreate(ctx.store, Account, from)
    fromAcc.balance = fromAcc.balance || 0n
    fromAcc.balance -= transfer.amount
    fromAcc.balance -= tip
    await ctx.store.save(fromAcc)

    const toAcc = await getOrCreate(ctx.store, Account, to)
    toAcc.balance = toAcc.balance || 0n
    toAcc.balance += transfer.amount
    await ctx.store.save(toAcc)

    await ctx.store.save(new HistoricalBalance({
        id: ctx.event.id + '-to',
        account: fromAcc,
        balance: fromAcc.balance,
        date: new Date(ctx.block.timestamp)
    }))

    await ctx.store.save(new HistoricalBalance({
        id: ctx.event.id + '-from',
        account: toAcc,
        balance: toAcc.balance,
        date: new Date(ctx.block.timestamp)
    }))
})


processor.run()


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

This code attaches an asynchronous function to the processor, that, similarly to a pub-sub system, gets triggered when the `'balances.Transfer'` event is encountered.

The business logic itself is not relevant for the scope of this page, what's worth noting is that `ctx` is the `BlockHandlerContext`, which stores not only information about the block itself, but the `Store`, which in this case is the database, so when the following line is executed, the `Account` Entity is created or updated with the relevant information.

```typescript
    await ctx.store.save(fromAcc)
```

The logic in the `getTransferEvent` and how it is tied to the `BalancesTransferEvent` wrapper for an event has been described in [the previous section](typegen.md) but has been reported here because the added context might further clarify it.
