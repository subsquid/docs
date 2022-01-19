---
description: >-
  Event and call data come to mapping handlers as raw untyped json. Not only it
  is unclear what the exact structure of a particular event or call is, but it
  can also rather frequently change over time.
---

# Generate TypeScript definitions for substrate events and calls

Squid framework provides tools for generation of type-safe, spec version aware wrappers around events and calls.

The end result looks like this:

```javascript
/**
 * Normalized `balances.Transfer` event data
 */
interface TransferEvent {
    from: Uint8Array
    to: Uint8Array
    amount: bigint
}

function getTransferEvent(ctx: EventHandlerContext): TransferEvent {
    // instanciate type-safe facade around event data
    let event = new BalancesTransferEvent(ctx)
    if (event.isV1020) {
        let [from, to, amount, fee] = event.asV1020
        return {from, to, amount}
    } else if (event.isV1050) {
        let [from, to, amount] = event.asV1050
        return {from, to, amount}
    } else {
        // This cast will assert, 
        // that the type of a given event matches
        // the type of generated facade.
        return event.asLatest
    }
}
```

Generation of type-safe wrappers for events and calls is currently a two-step process.

First, you need to explore the chain to find blocks which introduce new spec version and fetch corresponding metadata.

```
npx squid-substrate-metadata-explorer \
  --chain wss://kusama-rpc.polkadot.io \
  --archive https://kusama.indexer.gc.subsquid.io/v4/graphql \
  --out kusamaVersions.json
```

In the above command `--archive` parameter is optional, but it speeds up the process significantly. From scratch exploration of Kusama network without archive takes 20-30 minutes.

You can pass the result of previous exploration to `--out` parameter. In that case exploration will start from the last known block and thus will take much less time.

After chain exploration is complete you can use `squid-substrate-typegen(1)` to generate required wrappers.

```
npx squid-substrate-typegen typegen.json
```

Where `typegen.json` config file has the following structure:

```
{
  "outDir": "src/types",
  "chainVersions": "kusamaVersions.json", // the result of chain exploration
  "typesBundle": "kusama", // see types bundle section below
  "events": [ // list of events to generate
    "balances.Transfer"
  ],
  "calls": [ // list of calls to generate
    "timestamp.set"
  ]
}
```
