# Context Interfaces

As mentioned in the parent page, the Subsquid SDK defines three interfaces for the Context objects passed to each Handler function. Here is the detailed reference for each one.

## `EventHandlerContext`

Below is the definition of the interface:

```typescript
export interface EventHandlerContext {
    store: Store
    block: SubstrateBlock
    event: SubstrateEvent
    extrinsic?: SubstrateExtrinsic
    /**
     * Not yet public description of chain metadata
     * @internal
     */
    _chain: Chain
}
```

This way, when the `EventHandler` is executing, it is able to extract Event and even Extrinsic and Block information from the Context and use the [Store interface](../store-interface.md) to potentially persist processed data.

Developers can use this object in their `EventHandler` functions like this:

```typescript
async function balancesTransfer(ctx: EventHandlerContext): Promise<void> {
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
}

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

Where the `BalancesTransferEvent` is a type-safe wrapper class, automatically generated, thanks to the [`typegen` tool](../../key-concepts/typegen.md) provided by the SDK.

## `ExtrinsicHandlerContext`

The `ExtrinsicHandlerContext` is very similar to the `EventHandlerContext` interface. As a matter of fact, it is an extension of it, which only makes the `extrinsic` field mandatory.

```typescript
export interface ExtrinsicHandlerContext extends EventHandlerContext {
    extrinsic: SubstrateExtrinsic
}
```

As for how to use this, in the previous paragraph example, the line

```typescript
let tip = ctx.extrinsic?.tip || 0n
```

Already uses the `extrinsic` field.

## `BlockHandlerContext`

Here is the definition of the `BlockHandlerContext` interface:

```typescript
export interface BlockHandlerContext {
    store: Store
    block: SubstrateBlock
    events: SubstrateEvent[]
    /**
     * Not yet public description of chain metadata
     * @internal
     */
    _chain: Chain
}
```

## `EvmLogHandlerContext`

Below is the definition of the interface:

```typescript
export interface EvmLogHandlerContext {
    topics: EvmTopic[]
    data: string
    txHash: string
    contractAddress: EvmContractAddress
    substrate: {
        _chain: Chain,
        event: SubstrateEvent,
        block: SubstrateBlock,
        extrinsic?: SubstrateExtrinsic
    }
    store: Store
}
```

This way, when the `EvmLogHandler` is executing, it is able to extract EVM specific data, as well as Event and even Extrinsic and Block information from the Context and use the [Store interface](../store-interface.md) to potentially persist processed data.

Developers can use this object in their `EvmvLogHandler` functions like this (for more information about line #2, please take a look at the [EVM Processor page](../evm-processor.md#abi-interface-and-decoding)):

```typescript
async fuction evmTransfer (ctx: EvmLogHandlerContext ): Promise<void> {
    let transfer = erc721.events['Transfer(address,address,uint256)'].decode(ctx)

    let from = await ctx.store.get(Owner, transfer.from)
    if (from == null) {
        from = new Owner({id: transfer.from, balance: 0n})
        await ctx.store.save(from)
    }

    let to = await ctx.store.get(Owner, transfer.to)
    if (to == null) {
        to = new Owner({id: transfer.to, balance: 0n})
        ctx.store.save(to)
    }

    let token = await ctx.store.get(Token, transfer.tokenId.toString())
    if (token == null) {
        token = new Token({
            id: transfer.tokenId.toString(),
            uri: await contract.tokenURI(transfer.tokenId),
            contract: await getContractEntity(ctx),
            owner: to
        })
        await ctx.store.save(token)
    } else {
        token.owner = to
        await ctx.store.save(token)
    }

    await ctx.store.save(new Transfer({
        id: ctx.txHash,
        token,
        from,
        to,
        timestamp: BigInt(ctx.substrate.block.timestamp),
        block: ctx.substrate.block.height,
        transactionHash: ctx.txHash
    }))
}
```

