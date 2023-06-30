---
sidebar_position: 21
title: Indexes and constraints
description: Annotate indexed fields for faster queries
---

# Indexes and unique constraints

:::warning
The lack of indices is the most common cause of slow API queries
:::

It is crucial to add database indexes to the entity fields on which one expects filtering and ordering. To add an index to a column, the corresponding entity field must be decorated with `@index`. The corresponding entity field will be decorated with [TypeORM `@Index()`](https://typeorm.io/indices#column-indices).

One can additionally decorate the field with `@unique` to enforce uniqueness. It corresponds to the [`@Index({ unique: true })`](https://typeorm.io/indices#unique-indices) TypeORM decorator.

### Example

```graphql
type Transfer @entity {
  id: ID!
  to: Account!
  amount: BigInt! @index
  fee: BigInt! @index @unique
}
```

## Multi-column indices

Multi-column indices are defined on the entity level, with an optional `unique` constraint. 

### Example 

```graphql
type Foo @entity @index(fields: ["foo", "bar"]) @index(fields: ["bar", "baz"]) 
  {
  id: ID!
  bar: Int!
  baz: [Enum!]
  foo: String!

type Extrinsic @entity @index(fields: ["hash", "block"], unique: true)  {
  id: ID!
  hash: String! @unique
  block: String!
}
```
