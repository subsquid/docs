---
sidebar_position: 21
title: Indexes and constraints
description: Annotate indexed fields for faster queries
---

# Indexes and unique constraints

It is crucial to add database indexes to the entity fields on which one expects filtering and ordering. To add an index to a column, the corresponding entity field must be decorated with `@index`. 

**Example**
```graphql
type Transfer @entity {
  id: ID!
  
  to: Account!
  amount: BigInt! @index
  fee: BigInt! 
}
```

Multi-column indices can be defined on the entity level, with the additional `unique` constraint. 

**Example**
```graphql
type Foo @entity @index(fields: ["baz", "bar"], unique: true) {
  id: ID!
  bar: Int!
  baz: [Enum!]
```
 
Similar to `@index` a field marked with `@unique` will have an additional unique constraint. 

**Example**
```graphql
type Extrinsic @entity {
  id: ID!
  hash: String! @unique
}
```
