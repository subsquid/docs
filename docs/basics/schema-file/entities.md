---
sidebar_position: 11
description: >-
  Define high-level API entities
---

# Entities

Entities are defined by root-level GraphQL types decorated with `@entity`. Names and properties of entities are expected to be camelCased. They are converted into snake_case for use as the corresponding database table and column names. The primary key column is always mapped to the entity field of a special `ID` type mapped as string (`varchar`). Non-nullable fields are marked with an exclamation mark (`!`) and are nullable otherwise.

The following [scalar types](https://graphql.org/learn/schema/#scalar-types) are supported by the `schema.graphql` dialect:

- `Boolean` (mapped to `bool`)
- `BigInt` (mapped to `numeric`, ts type `bigint`)
- `BigDecimal` (mapped to `numeric`, ts type `BigDecimal` of [`@subsquid/big-decimal`](https://www.npmjs.com/package/@subsquid/big-decimal))
- `DateTime` (mapped to `timestamptz`, ts type `Date`)
- `Bytes` (mapped to `bytea`, ts type `UInt8Array`)
- `JSON` (mapped to `jsonb`, ts type `unknown`)
- `String` (mapped to `text`)
- `Int` (mapped to `int4`)
- Enums (mapped to `text`)
- User-defined scalars (non-entity types). Such properties are mapped as `jsonb` columns.

**Example** 
```graphql
type Scalar @entity {
  id: ID!
  boolean: Boolean
  string: String
  enum: Enum
  bigint: BigInt
  dateTime: DateTime
  bytes: Bytes
  json: JSON
  deep: DeepScalar
}
        
type DeepScalar {
  bigint: BigInt
  dateTime: DateTime
  bytes: Bytes
  boolean: Boolean
}
        
enum Enum {
  A B C
}
```

## Arrays

An entity field can be an array of any scalar type except `BigInt` and `BigDecimal`. It will be mapped to the corresponding Postgres array type. Array elements may be defined as nullable or non-nullable.

**Example**

```graphql
type Lists @entity {
  id: ID!
  intArray: [Int!]!
  enumArray: [Enum!]
  datetimeArray: [DateTime!]
  bytesArray: [Bytes!]
  listOfListsOfInt: [[Int]]
  listOfJsonObjects: [Foo!]
}
        
enum Enum {
  A B C D E F
}
        
type Foo {
  foo: Int
  bar: Int
}
```
