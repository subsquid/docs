---
description: Reference page of the squid-substrate-typegen command line tool
---

# Squid substrate typegen

## Installation

The Squid substrate typegen tool is part of Subsquid SDK and is used for generating TypeScript interface classes for Substrate Events and calls.

{% hint style="info" %}
Note: in the context of this guide, we assume the [Development Environment has been already set up](../tutorial/development-environment-set-up.md) and that `npm` is used, although other options are available.
{% endhint %}

To install substrate typegen tool, simply run this in a console.&#x20;

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
  "chainVersions": "kusamaVersions.json", 
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

| Key             | Description                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outDir`        | output directory for generated code                                                                                                                                                                                                                                                                                                                                                                            |
| `chainVersions` | the output file of chain exploration                                                                                                                                                                                                                                                                                                                                                                           |
| `typesBundle`   | <p>external <a href="https://polkadot.js.org/docs/api/start/types.extend">type definitions</a>, required for chains having blocks with metadata versions below 14 (see <a href="../faq/where-do-i-get-a-type-bundle-for-my-chain.md">FAQ</a>), similar to polkadot.js typesbundle, but with slightly different structure.<br>It can either be a built-in typesBundle or a path to a typesBundle JSON file.</p> |
| `events`        | list of Events to generate                                                                                                                                                                                                                                                                                                                                                                                     |
| `calls`         | list of calls (or Extrinsics) to generate                                                                                                                                                                                                                                                                                                                                                                      |

For a more in-depth explanation of the subject, head over to the [dedicated page](../key-concepts/typegen.md) and for a practical guide, take a look at the [dedicated Recipe](../recipes/running-a-squid/generate-typescript-definitions.md).&#x20;
