---
sidebar_position: 30
title: Parquet support
description: >-
  Table class for writing Apache Parquet files
---

# Parquet format support

:::info
Support for the Parquet format is currently experimental. Contact us at the [SquidDevs Telegram channel](https://t.me/HydraDevs) for support.
:::

## `Table` Implementation

[Apache Parquet](https://parquet.apache.org) is an advanced format for storing tabular data in files. It divides table columns into [column chunks](https://parquet.apache.org/docs/concepts/). Each column chunk is stored contiguously, allowing efficient partial reads of column subsets. Column chunks can also be compressed with row-specific compression algorithms, further enhancing the performance. Retrieval relies on metadata appended to the end of a Parquet file. [Metadata standard](https://parquet.apache.org/docs/file-format/metadata/) of Apache Parquet is extremely powerful, enabling all sorts of [extensions](https://parquet.apache.org/docs/file-format/extensibility/). Among other things, metadata contains the schema of the data, making the format self-describing.

The `@subsquid/file-store-parquet` package provides a `Table` implementation for writing to Parquet files. Use it by [supplying one or more of its instances via the `tables` field of the `Database` constructor argument](../overview/#database-options). Constructor of the `Table` implementation accepts the following arguments:
* **`fileName: string`**: the name of the output file in every dataset partition folder.
* **`schema: {[column: string]: ColumnData}`**: a mapping from Parquet column names to [`ColumnData` objects](#columns). A mapping of the same keys to data values is the row type used by the [table writer](../overview/#table-writer-interface).
* **`options?: TableOptions`**: see [`Table` Options](#table-options).

## Columns

`ColumnData` objects define storage options for each table column. They are made with the `Column` factory function that accepts a column data type and an optional `options: ColumnOptions` object.

Column types can be obtained by making the function calls listed below from the `Types` submodule. They determine the [Parquet type](https://parquet.apache.org/docs/file-format/types/) that will be used to store the data and the type that the [table writer](../overview/#table-writer-interface) will expect to find at the corresponding field of data row objects.

| Column type                             | Logical type                   | Primitive type | Valid data row object field contents                      |
|:---------------------------------------:|:------------------------------:|:--------------:|:---------------------------------------------------------:|
| `Types.String` `(length?)`              | variable or fixed length string     | `BYTE_ARRAY` or `FIXED_LEN_` `BYTE_ARRAY` | `string` of length equal to `length` if it is set or of any length otherwise     |
| `Types.Binary` `(length?)`              | variable or fixed length byte array | `BYTE_ARRAY` or `FIXED_LEN_` `BYTE_ARRAY` | `Uint8Array` of length equal to `length` if it is set or of any length otherwise |
| `Types.Int8()`                          | 8-bit signed integer           | `INT32`        | `number` from -128 to 127                                 |
| `Types.Int16()`                         | 16-bit signed integer          | `INT32`        | `number` from -32768 to 32767                             |
| `Types.Int32()`                         | 32-bit signed integer          | `INT32`        | `number` from -2147483648 to 2147483647                   |
| `Types.Int64()`                         | 64-bit signed integer          | `INT64`        | `bigint` or `number` from -9223372036854775808 to 9223372036854775807 |
| `Types.Uint8()`                         | 8-bit unsigned integer         | `INT32`        | `number` from 0 to 255                                    |
| `Types.Uint16()`                        | 16-bit unsigned integer        | `INT32`        | `number` from 0 to 65535                                  |
| `Types.Uint32()`                        | 32-bit unsigned integer        | `INT32`        | `number` from 0 to 4294967295                             |
| `Types.Uint64()`                        | 64-bit unsigned integer        | `INT64`        | `bigint` or `number` from 0 to 18446744073709551615                   |
| `Types.Float()`                         | 32-bit floating point number   | `FLOAT`        | non-`Nan` `number`                                        |
| `Types.Double()`                        | 64-bit floating point number   | `DOUBLE`       | non-`Nan` `number`                                        |
| `Types.Boolean()`                       | boolean value                  | `BOOLEAN`      | `boolean`                                                 |
| `Types.Timestamp()`                     | UNIX timestamp in milliseconds | `INT64`        | `Date`                                                    |
| `Types.Decimal` `(precision, scale=0)`  | decimal with `precision` digits and `scale` digits to the right of the decimal point | `INT32` or `INT64` or `BYTE_ARRAY` | `number` or `bigint` or [`BigDecimal`](https://github.com/subsquid/squid-sdk/tree/master/util/big-decimal) |
| `Types.List` `(itemType, {nullable=false})`  | a list filled with optionally nullable items of `itemType` column type | - | `Array` of items satisfying `itemType` |
| `Types.JSON<T extends {[k: string]: any}>()` | JSON object of type `T`   | `BYTE_ARRAY`   | `Object` of type `T`                                      |
| `Types.BSON<T extends {[k: string]: any}>()` | BSON object of type `T`   | `BYTE_ARRAY`   | `Object` of type `T`                                      |

:::info
The widest decimals that [PyArrow](https://arrow.apache.org/docs/python/index.html) can read are `Types.Decimal(76)`.
:::

The following column options are available:
```typescript
ColumnOptions {
  nullable?: boolean
  compression?: Compression
  encoding?: Encoding
}
```
See the [Encoding and Compression](#encoding-and-compression) section for details.

## `Table` Options

As its optional final argument, the constructor of `Table` accepts an object that defines table options:
```typescript
TableOptions {
  compression?: Compression
  rowGroupSize?: number
  pageSize?: number
}
```
Here,
* **`compression`** determines the file-wide compression algorithm. Per-column settings override this. See [Encoding and Compression](#encoding-and-compression) for the list of available algorithms. Default: `Compression.UNCOMPRESSED`.
* **`rowGroupSize`** determines the approximate uncompressed size of the row group in bytes. Default: `32 * 1024 * 1024`.
* **`pageSize`** determines the approximate uncompressed page size in bytes. Default: `8 * 1024`.

When `pageSize` is less than `rowGroupSize` times the number of columns, the latter setting will be ignored. In this case each row group will contain exactly one roughly `pageSize`d page for each column.

## Encoding and Compression

[Encodings](https://parquet.apache.org/docs/file-format/data-pages/encodings/) are set at a per-column basis. At the moment the default and the only supported value is `'PLAIN'`.

[Compression](https://github.com/apache/parquet-format/blob/master/Compression.md) can be set at a per-file or a per-column basis. Available values are
- `'UNCOMPRESSED'` (default)
- `'GZIP'`
- `'LZO'`
- `'BROTLI'`
- `'LZ4'`

## Example

This saves ERC20 `Transfer` events captured by the processor to a Parquet file. All columns except for `from` are `GZIP`ped. Row groups are set to be roughly 30000 bytes in size each. Each row group contains roughly ten ~1000 bytes-long pages per column. Full squid code is available in [this repo](https://github.com/subsquid-labs/file-store-parquet-example) (link out of date).

[//]: # (!!!! Update the github URL)

```typescript
import {Database} from '@subsquid/file-store'
import {
  Column,
  Table,
  Types
} from '@subsquid/file-store-parquet'

...

const dbOptions = {
  tables: {
    TransfersTable: new Table(
      'transfers.parquet',
      {
        from: Column(
          Types.String(),
          {
            compression: 'UNCOMPRESSED'
          }
        ),
        to: Column(Types.String()),
        value: Column(Types.Uint64())
      },
      { 
        compression: 'GZIP',
        rowGroupSize: 300000,
        pageSize: 1000
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
