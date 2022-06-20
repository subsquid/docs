---
description: Reference page of the squid-substrate-metadata-explorer command line tool
---

# Squid Substrate metadata explorer

## Installation

The Squid substrate metadata explorer tool is part of Subsquid SDK and is used for extracting metadata information about a specific chain.

This is useful for monitoring Runtime updates for a chain and how Events and Extrinsics definitions might have changed, consequently. The result of blockchain exploration is saved in a JSON file.

{% hint style="info" %}
Note: in the context of this guide, we assume the [Development Environment has been already set up](../../../tutorial/development-environment-set-up.md) and that `npm` is used, although other options are available.
{% endhint %}

To install substrate metadata explorer tool, simply run this in a console.&#x20;

```bash
npm install @subsquid/squid-substrate-metadata-explorer
```

Once installed, check available commands by running&#x20;

```bash
npx squid-substrate-metadata-explorer --help
```

Which will print out a help.

```
Usage: squid-substrate-metadata-explorer squid-substrate-metadata-explorer --chain <ws://> --out <file> [options]

Explores chain spec versions.

It scans the chain and finds all blocks where new spec version was introduced.
The result of exploration is saved in a json file:

[
    {
        "specVersion": 1,
        "blockNumber": 10,
        "blockHash": "0x..",
        "metadata": "0x.."
    },
    ...
]

If the output file already exists, exploration will start from the last known block.
The resulting file will be updated with new data.

Options:
  --chain <ws://>  chain rpc endpoint
  --out <file>     output file
  --archive <url>  squid substrate archive (significantly speedups exploration)
  -h, --help       display help for command
```

## Chain exploration example

Here's an example to explore Kusama blockchain:

```bash
npx squid-substrate-metadata-explorer \
  --chain wss://kusama-rpc.polkadot.io \
  --archive https://kusama.indexer.gc.subsquid.io/v4/graphql \
  --out kusamaVersions.json
```

In the above command, the `--archive` parameter is optional, but it speeds up the process significantly. The exploration of the Kusama network from scratch, without an archive, it may take up to 30 minutes.

You can pass the result of any previous exploration to the `--out` parameter. In that case, exploration will start from the last known block and thus will take much less time.

### Options for `squid-substrate-metadata-explorer` command

| Argument          | Description                                                  | Required |
| ----------------- | ------------------------------------------------------------ | -------- |
| `-h` or `--help`  | display help for command                                     |          |
| `--chain`         | chain RPC endpoint                                           | yes      |
| `--out <file>`    | name of the file the output should be written to             | yes      |
| `--archive <url>` | squid substrate archive (significantly speedups exploration) | no       |

## Output file structure

The output JSON file contains a series of objects, each representing the various spec versions encountered. It typically has this structure:

```json
[
    {
        "specVersion": 1,
        "blockNumber": 10,
        "blockHash": "0x..",
        "metadata": "0x.."
    },
    ...
]
```

This is a brief description of the various fields:

| Key           | Description                                    |
| ------------- | ---------------------------------------------- |
| `specVersion` | version number of the encountered spec         |
| `blockNumber` | number of the starting block of current spec   |
| `blockHash`   | hash of the starting block of the current spec |
| `metadata`    | encoded metadata of the given spec             |
