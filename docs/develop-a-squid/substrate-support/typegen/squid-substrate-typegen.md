# Squid substrate typegen

## Installation

The Squid substrate typegen tool is part of Subsquid SDK and is used for generating TypeScript interface classes for Substrate Events and calls.

:::info
Note: in the context of this guide, we assume the [Development Environment has been already set up](../../../tutorials/development-environment-set-up.md) and that `npm` is used, although other options are available.
:::

Our template repository already lists this package as a dependency, but to manually install substrate typegen tool, simply run this in a console.&#x20;

```bash
npm install @subsquid/substrate-typegen
```

Once installed, check available commands by running&#x20;

```bash
npx squid-substrate-typegen --help
```

Which will print out a help.

### Options for `squid-substrate-typegen` command

| Argument         | Description              | Required |
| ---------------- | ------------------------ | -------- |
| `-h` or `--help` | display help for command |          |
| `config`         | JSON file with options   | yes      |

## Config file structure

The `config` parameter is the path to a JSON file containing configuration directives for how to perform the code generation. It typically has this structure:

```json
{
  "outDir": "src/types", 
  "specVersions": "kusamaVersions.json", 
  "typesBundle": "kusama",
  "events": [ 
    "balances.Transfer"
  ],
  "calls": [ 
    "timestamp.set"
  ]
}
```

This is a brief description of the various fields:

| Key            | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outDir`       | output directory for generated code                                                                                                                                                                                                                                                                                                                                                                                  |
| `specVersions` | the output file of chain exploration OR the URL of the chain's Archive. In this case, the typegen command will automatically perform the exploration.                                                                                                                                                                                                                                                                |
| `typesBundle`  | external [type definitions](https://polkadot.js.org/docs/api/start/types.extend), required for chains having blocks with metadata versions below 14 (see [FAQ](/docs/support/where-do-i-get-a-type-bundle-for-my-chain.md)), similar to polkadot.js typesbundle, but with slightly different structure.
It can either be a built-in typesBundle or a path to a typesBundle JSON file. |
| `events`       | list of Events to generate                                                                                                                                                                                                                                                                                                                                                                                           |
| `calls`        | list of calls (or Extrinsics) to generate                                                                                                                                                                                                                                                                                                                                                                            |

:::warning
It is important to notice that in previous releases of Subsquid's SDK, the  `specVersion` was called`chainVersion` so be careful if you are migrating a project from an older version.&#x20;
:::

For a more in-depth explanation of the subject, head over to the [dedicated page](./).

## Types generation example

Here is an example of how to use the `squid-substrate-typegen` to generate required wrappers.

```bash
npx squid-substrate-typegen typegen.json
```

Where `typegen.json` config file has the following structure:

```json
{
  "outDir": "src/types",
  "specVersions": "kusamaVersions.json", // the result of chain exploration
  "typesBundle": "kusama", // see types bundle section below
  "events": [ // list of events to generate
    "Balances.Transfer"
  ],
  "calls": [ // list of calls to generate
    "timestamp.set"
  ],
  "storage": [
    "System.Account" // <-- Qualified storage item name: "${Prefix}.${item}"
  ]
}
```

A type-safe definition for each and every version of the event will be generated. Most of the time, one should be able to infer a normalized interface together with some glue code to make it fit the runtime-specific versions.

:::info
**Note**: the Storage prefix is equal to the pallet name in most cases, but it this should not be followed as a rule. You always need to verify the Storage prefix.
:::

The `"specVersion"` field can be:



The `typesBundle` key in the `typegen.json` configuration file can either be:

* a chain name, all lower-case (e.g. `kusama`, `polkadot`, `statemint`, a full list can be found [here](https://github.com/subsquid/squid/tree/master/substrate-metadata/src/old/definitions))
* a path to a JSON file with the structure specified [here](../../../faq/where-do-i-get-a-type-bundle-for-my-chain.md)

## TypeScript class wrappers

The result of the typegen command can be found under the `src/types` folder. In the case of the squid template repository, since it only cares about the `Balances.Transfer` Event, the typegen command generated an `events.ts` file that contains a class, named `BalancesTransferEvent` and here it is:

```typescript
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

This manages different runtime versions, including the starting hash for each and instructions for how to process (decode) the event itself.

All of this is better explained in the section dedicated to the [Processor and Event mapping](/docs/develop-a-squid/squid-processor), but, given the class definition for a `BalanceTransferEvent`, such a class can be used to handle events such as this:

```typescript
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

Where, upon processing an event, its metadata version is checked, and the metadata is extracted accordingly, making things a lot easier.
