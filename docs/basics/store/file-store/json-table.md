---
sidebar_position: 40
title: JSON support
description: >-
  Table class for writing JSON and JSONL files
---

# JSON format support

## `Table` Implementation

The `@subsquid/file-store-json` package provides a `Table` implementation for writing to JSON and [JSONL](https://jsonlines.org) files. Use it by [supplying one or more of its instances via the `tables` field of the `Database` constructor argument](../overview/#database-options). The `Table` uses a constructor with the following signature:
```typescript
Table<S extends Record<string, any>>(fileName: string, options?: {lines?: boolean})
```
Here,
* **`S`** is a Typescript type describing the schema of the table data.
* **`fileName: string`** is the name of the output file in every dataset partition folder.
* **`options?: {lines?: boolean}`** are table options. At the moment the only available setting is whether to use JSONL instead of a plain JSON array (default: false).

## Example

This saves ERC20 `Transfer` events captured by the processor to a JSONL file where each line is a JSON serialization of a `{from: string, to: string, value: number}` object. Full squid code is available in [this repo](https://github.com/subsquid-labs/file-store-json-example) (link out of date).

[//]: # (!!!! Update the github URL)

```typescript
import {Database} from '@subsquid/file-store'
import {Table} from '@subsquid/file-store-json'

...

const dbOptions = {
  tables: {
    TransfersTable: new Table<{
      from: string,
      to: string,
      value: bigint
    }>('transfers.jsonl', { lines: true })
  },
  ...
}

processor.run(new Database(dbOptions), async (ctx) => {
  ...
  let from: string = ...
  let to: string = ...
  let value: bigint = ...
  ctx.store.TransfersTable.write({ from, to, value })
  ...
})
```
