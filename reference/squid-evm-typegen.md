---
description: Reference page of the squid-evm-typegen command line tool
---

# Squid EVM typegen

## Installation

The Squid evm typegen tool is part of Subsquid SDK and is used for generating TypeScript interface classes for EVM Application Binary Interfaces.

{% hint style="info" %}
Note: in the context of this guide, we assume the [Development Environment has been already set up](../tutorial/development-environment-set-up.md) and that `npm` is used, although other options are available.
{% endhint %}

To install EVM typegen tool, simply run this in a console.&#x20;

```bash
npm install @subsquid/substrate-evm-typegen
```

Once installed, check available commands by running&#x20;

```bash
npx squid-evm-typegen --help
```

Which will print out a help.

### Options for `squid-substrate-typegen` command

| Argument         | Description                     | Required |
| ---------------- | ------------------------------- | -------- |
| `-h` or `--help` | display help for command        |          |
| `--abi`          | path to a JSON abi file         | yes      |
| `--output`       | path for output typescript file | yes      |

## Example:

```bash
npx squid-evm-typegen --abi=src/abi/ERC721.json --output=src/abi/erc721.ts
```

For a more in-depth explanation of the subject, head over to the [dedicated page](../key-concepts/typegen.md) and for a practical guide, take a look at the [dedicated Recipe](../recipes/running-a-squid/generate-typescript-definitions.md).&#x20;
