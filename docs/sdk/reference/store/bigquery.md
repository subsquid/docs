---
sidebar_position: 25
title: bigquery-store
description: >-
  @subsquid/bigquery-store reference
---

# `@subsquid/bigquery-store`

See also the [BigQuery guide](/sdk/resources/persisting-data/bigquery).

## Column types

| Column type                    | Value type                       | Dataset column type                                                                                      |
|:------------------------------:|:--------------------------------:|:--------------------------------------------------------------------------------------------------------:|
| `String()`                     | `string`                         | [STRING](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#string_type)           |
| `Numeric(precision, scale)`    | <code>number &#124 bigint</code> | [NUMERIC(P[, S])](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#parameterized_decimal_type)    |
| `BigNumeric(precision, scale)` | <code>number &#124 bigint</code> | [BIGNUMERIC(P[, S])](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#parameterized_decimal_type) |
| `Bool()`                       | `boolean`                        | [BOOL](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#boolean_type)            |
| `Timestamp()`                  | `Date`                           | [TIMESTAMP](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#timestamp_type)     |
| `Float64()`                    | `number`                         | [FLOAT64](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#floating_point_types) |
| `Int64()`                      | <code>number &#124 bigint</code> | [INT64](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#integer_types)          |
