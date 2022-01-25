---
description: >-
  Learn how to leverage Subsquid SDK automated tools to create TypeScript
  classes for Substrate Events and calls.
---

# Generate TypeScript definitions

## Overview

[Event](../key-concepts/substrate.md#events) and call data are ingested as raw untyped JSON by Processor mapping handlers. Not only it is unclear what the exact structure of a particular event or call is, but it can also rather frequently change over time.

Runtime upgrades may change the event data and even the event logic altogether, but Squid gets you covered with first-class support for runtime upgrades.

Subsquid SDK comes with a tool called **substrate metadata explorer** which makes it easy to keep track of all runtime upgrades happened so far. This can then be fed to a different tool called **typegen**, to generate type-safe, spec version-aware wrappers around events and calls.

This is why the generation of type-safe wrappers for events and calls is currently a two-step process.

### Chain exploration

First, you need to explore the chain to find blocks that introduce a new spec version and fetch corresponding metadata.

```
npx squid-substrate-metadata-explorer \
  --chain wss://kusama-rpc.polkadot.io \
  --archive https://kusama.indexer.gc.subsquid.io/v4/graphql \
  --out kusamaVersions.json
```

In the above command, the `--archive` parameter is optional, but it speeds up the process significantly. The exploration of the Kusama network from scratch, without an archive, takes 20-30 minutes.

You can pass the result of any previous exploration to the `--out` parameter. In that case, exploration will start from the last known block and thus will take much less time.

### Types generation

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

A type-safe definition for each and every version of the event will be generated. Most of the time, one should be able to infer a normalized interface together with some glue code to make it fit the runtime-specific versions. Head over to the page explaining [Typegen concepts](../key-concepts/typegen.md) for more clarity.
