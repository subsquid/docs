---
sidebar_position: 20
title: CSV support
description: >-
  Table class for writing CSV files
---

# CSV format support

## `Table` Implementation

The `@subsquid/file-store-csv` package provides a `Table` implementation for writing to CSV files. Use it by [supplying one or more of its instances via the `tables` field of the `Database` constructor argument](../overview/#database-options). Constructor of the `Table` implementation accepts the following arguments:
* **`fileName: string`**: the name of the output file in every dataset partition folder.
* **`schema: {[column: string]: ColumnData}`**: a mapping from CSV column names to [`ColumnData` objects](#columns). A mapping of the same keys to data values is the row type used by the [table writer](../overview/#table-writer-interface).
* **`options?: TableOptions`**: see [`Table` Options](#table-options).

## Columns

`ColumnData` objects determine how the in-memory data representation of each table column should be serialized. They are made with the `Column` factory function that accepts a column data type and an optional `{nullable?: boolean}` `options` object as arguments.

Column types can be obtained by making the function calls listed below from the `Types` submodule. They determine the type that the [table writer](../overview/#table-writer-interface) will expect to find at the corresponding field of data row objects.

| Column type                       | Type of the data row field |
|:---------------------------------:|:--------------------------:|
| `Types.String()`                  | `string`                   |
| `Types.Numeric()`                 | `number` or `bigint`       |
| `Types.Boolean()`                 | `boolean`                  |
| `Types.DateTime(format?: string)` | `Date`                     |
| `Types.JSON<T>()`                 | `T`                        |

`Types.DateTime` accepts an optional [strftime](https://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html)-compatible format string. If it is omitted, the dates will be serialized to [ISO strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).

The type `T` supplied to the `Types.JSON()` generic function must be an object with string keys (extend `{[k: string]: any}`).

## `Table` Options

As its optional final argument, the constructor of `Table` accepts an object that defines table options:
```typescript
TableOptions {
  extension?: string
  dialect?: Dialect
  header?: boolean
}
```
Here,
* **`extension`** determines the file extension (default: `'csv'`)
* **`dialect`** determines the details of the CSV formatting (see the details below, default: `dialects.excel`)
* **`header`** determines whether a CSV header should be added (default: `true`)

`Dialect` type is defined as follows:
```typescript
Dialect {
  delimiter: string
  escapeChar?: string
  quoteChar: string
  quoting: Quote
  lineterminator: string
}
```
where
```typescript
enum Quote {
  ALL,        // Put all values in quotes.
  MINIMAL,    // Only quote strings with special characters.
              // A special character is one of the following:
              // delimiter, lineterminator, quoteChar.
  NONNUMERIC, // Quote strings, booleans, DateTimes and JSONs.
  NONE        // Do not quote values.
}
```
is the enum determining how the formatted values should be quoted. The quote character is escaped for all values of `quoting`; `Quote.NONE` additionally escapes the rest of the special characters and the escape character.

Two dialect presets are available via the `dialects` object exported by `@subsquid/file-store-csv`:
```typescript
export let dialects = {
  excel: {
    delimiter: ',',
    quoteChar: '"',
    quoting: Quote.MINIMAL,
    lineterminator: '\r\n'
  },
  excelTab: {
    delimiter: '\t',
    quoteChar: '"',
    quoting: Quote.MINIMAL,
    lineterminator: '\r\n'
  }
}
```

## Example

This saves ERC20 `Transfer` events captured by the processor to TSV (tab-separated values) files. Full squid code is available in [this repo](https://github.com/subsquid-labs/file-store-csv-example) (link out of date).

[//]: # (!!!! Update the github URL)

```typescript
import {Database} from '@subsquid/file-store'
import {
  Column,
  Table,
  Types,
  dialects
} from '@subsquid/file-store-csv'

...

const dbOptions = {
  tables: {
    TransfersTable: new Table(
      'transfers.tsv',
      {
        from: Column(Types.String()),
        to: Column(Types.String()),
        value: Column(Types.Numeric())
      },
      {
        extension: 'tsv',
        dialect: dialects.excelTab,
      }
    )
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
