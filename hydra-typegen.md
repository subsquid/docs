---
description: >-
  A tool for generating type-safe TypeScript classes for runtime events and
  extrinsic calls
---

# Hydra Typegen

## Motivation

Hydra Typegen is a code generation tool for creating Typescript types for substrate events and extrinsics. Its primary use-case is to provide type-safe interfaces for Hydra mappings. For example, once a typescript class for the `Balances.Transfer` event is generated, a mapping can look like

```typescript
export async function balancesTransfer({
  event
}: EventContext & StoreContext ) {
  const [from, to, value] = new Balances.TransferEvent(event).params
  const { dest, value } = new Balances.TransferCall(event).args
  ...
}
```

## Quickstart

A minimal example for generating classes for the `Balances.Transfer` and `Treasury.Deposit` events in Kusama:

```bash
hydra-typegen typegen --metadata wss://kusama-rpc.polkadot.io Balances.Transfer
```

It is also possible to run `hydra-typegen` against a YAML config file

```bash
hydra-typegen typegen typegen.yml --debug
```

## Typegen config 

Typegen config file has the following structure:

<table>
  <thead>
    <tr>
      <th style="text-align:left">Field</th>
      <th style="text-align:left">Type</th>
      <th style="text-align:left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><code>metadata.source</code>
      </td>
      <td style="text-align:left">string</td>
      <td style="text-align:left">Where typegen will source node metadata. Can either be a ws endpoint or
        a path to a static json file with the same content as the result of <code>state_getMetadata</code> RPC
        call</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>metadata.blockHash</code>
      </td>
      <td style="text-align:left">string</td>
      <td style="text-align:left">(optional) If <code>metadata.source </code>is a WS endpoint, hash of the
        block from which metadata will be sourced, in hex format</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>events</code>
      </td>
      <td style="text-align:left">[string]</td>
      <td style="text-align:left">A list of events for which TS classes will be generated, in the format <code>&lt;section&gt;.&lt;name&gt;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>calls</code>
      </td>
      <td style="text-align:left">[string]</td>
      <td style="text-align:left">A list of extrinsics (calls) for which TS classes will be generated, in
        the format <code>&lt;section&gt;.&lt;method&gt;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>outDir</code>
      </td>
      <td style="text-align:left">string</td>
      <td style="text-align:left">Root directory for the generated classes</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>strict</code>
      </td>
      <td style="text-align:left">boolean</td>
      <td style="text-align:left">
        <p>Default: <code>false</code> 
        </p>
        <p>If true, the event/extrinsic constructor throws an error if the raw data
          does not match the format in metadata (e.g. due to a runtime upgrade).</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><code>customTypes.lib</code>
      </td>
      <td style="text-align:left">string</td>
      <td style="text-align:left">(optional) Import path for custom types that will be used in the generated
        sources</td>
    </tr>
    <tr>
      <td style="text-align:left"><code>customTypes.typedefs</code>
      </td>
      <td style="text-align:left">string</td>
      <td style="text-align:left">(optional) Path to a JSON file with custom type definitions, as expected
        by polkadot.js <code>createApi</code> method</td>
    </tr>
  </tbody>
</table>

The config file `typegen.yml` can look like this:

```text
# Typegen will pull the metadata from Kusama at block with the given hash
metadata:
  source: wss://kusama-rpc.polkadot.io 
  blockHash: '0x45eb7ddd324361adadd4f8cfafadbfb7e0a26393a70a70e5bee6204fc46af62e'
# events and calls for which the typescript types will be generated
events:
  - Balances.Transfer
calls:
  - Balances.transfer
outDir: ./generated
```

## Custom types

Hydra Typegen supports custom substrate types via the `--typedefs` flag. The provided `.json` file should include type definitions for the arguments and parameters of the events and extrinsics to be generated. The type definitions file is copied to the generated sources.

In the config file, place the definition into the `customTypes` section. It assumes that all the custom runtime types are already available for import from a library, so that e.g. the generated import statement

```text
import { MyCustomRuntimeClass } from 'my/types/library'
```

is correctly resolved.

```text
...
customTypes: 
    lib: 'my/types/library',
    typedefsLoc: my-types-json,
```

Note, that when used in the mappings, the library with custom types \(here `my/types/library`\) must be added as a dependency for the mappings module in `mappings/package.json`

## Commands

* [`hydra-typegen help [COMMAND]`](hydra-typegen.md#hydra-typegen-help-command)
* [`hydra-typegen typegen [CONFIG]`](hydra-typegen.md#hydra-typegen-typegen-config)

## `hydra-typegen help [COMMAND]`

display help for hydra-typegen

```text
USAGE
  $ hydra-typegen help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code:_ [_@oclif/plugin-help_](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)

## `hydra-typegen typegen [CONFIG]`

Generate Typescript classes for the Substrate events

```text
USAGE
  $ hydra-typegen typegen [CONFIG]

ARGUMENTS
  CONFIG  Path to YML config file. Overrides the flag options

OPTIONS
  -c, --calls=calls          Comma-separated list of substrate calls in the format <module>.<name>
  -d, --debug                Output debug info
  -e, --events=events        Comma-separated list of substrate events in the formation <module>.<name>

  -h, --blockHash=blockHash  Hash of the block from which the metadata will be fetched. Only applied if metadata is
                             pulled via an RPC call

  -i, --typelib=typelib      A JavaScript module from which the custom types should be imported, e.g.
                             '@joystream/types/augment'

  -m, --metadata=metadata    [default: metadata.json] Chain metadata source. If starts with ws:// or wss:// the metadata
                             is pulled by an RPC call to the provided endpoint. Otherwise a relative path to a json file
                             matching the RPC call response is expected

  -o, --outDir=outDir        [default: generated/types] A relative path the root folder where the generated files will
                             be generated

  -s, --[no-]strict          Strict mode. If on, the generated code throws an error if the input event argument types
                             don't much the metadata definiton

  -t, --typedefs=typedefs    A relative path to a file with JSON definitions for custom types used by the chain
```

_See code:_ [_src/commands/typegen/index.ts_](https://github.com/Joystream/hydra/blob/v3.0.0-beta.8/src/commands/typegen/index.ts) 

A full sample Hydra project can be found [here](https://github.com/Joystream/hydra/tree/master/packages/sample)





