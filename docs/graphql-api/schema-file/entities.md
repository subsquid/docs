---
sidebar_position: 10
description: >-
  Define high-level API entities
---

# Entities

Entities are defined by root-level GraphQL types decorated with `@entity`. The entity names and the properties are expected to be camelCased and are converted into snake_cased database tables and columns. The primary key column is always mapped to the entity field of a special `ID` type. Non-nullable fields are marked with an exclamation mark (`!`) and are nullable otherwise. 

The following [scalar types](https://graphql.org/learn/schema/#scalar-types) are supported by the `schema.graphql` dialect:

- `Boolean` (mapped to `bool`)
- `BigInt` (mapped to `numeric`)
- `DateTime` (mapped to `timestamptz`)
- `Bytes` (mapped to `bytea`)
- `JSON` (mapped to `jsonb`)
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
  json: JSON,
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

Entity fields can be an array of any scalar type and are mapped to the corresponding Postgres array types. The array elements may be defined as nullable or non-nullable.

**Example**

```graphql
type Lists @entity {
  intArray: [Int!]!
  enumArray: [Enum!]
  bigintArray: [BigInt!]
  datetimeArray: [DateTime!]
  bytesArray: [Bytes!]
  listOfListOfInt: [[Int]]
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