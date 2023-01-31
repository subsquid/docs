---
sidebar_position: 22
title: Entity relations
description: Define entity relations
---

# Entity relations and inverse lookups

A relation between two entities is always assumed to be unidirectional. The owning entity is mapped to a database table holding a foreign key reference to the related entity. The non-owning entity may define a property decorated `@derivedFrom` for an inverse lookup on the owning field. In particular, the "many" side of the one-to-many relations is always the owning side.

Note that defining an entity property with `@derivedFrom(field: <field_name>)` does not add a column to the entity table schema. Rather, it adds a property decorated with TypeORM `@OneToOne` or `@OneToMany` to the generated entity class. This causes the property `<field_name>` of the owning entity to be interpreted as a reference. Within the database it is implemented as an (automatically indexed) foreign key reference column `<field_name>_id`. Subsquid's built-in GraphQL server recognizes such relations in `schema.graphql`, reflects them in the API schema and uses the foreign key reference columns to process the resulting queries correctly.

The following examples illustrate this concept.

## One-to-one relations

```graphql
type Account @entity {
  "Account address"
  id: ID!
  balance: BigInt!
  user: User @derivedFrom(field: "account")
}

type User @entity {
  id: ID!
  account: Account!
  username: String!
  creation: DateTime!
}
```

The `User` entity references a single `Account` and owns the relation. This is implemented as follows:
- On the database side: the `account` property of the `User` entity maps to the `account_id` foreign key column of the `user` table referencing the `account` table.
- On the TypeORM side: the `account` property of the `User` entity gets decorated with `@OneToOne`.
- On the GraphQL side: sub-selection of the `account` property is made available in `user`-related queries. Sub-selectionf of the `user` property is made available in `account`-related queries.

## Many-to-one/One-to-many relations

```graphql
type Account @entity {
  "Account address"
  id: ID!
  transfersTo: [Transfer!] @derivedFrom(field: "to")
  transfersFrom: [Transfer!] @derivedFrom(field: "from")
}

type Transfer @entity {
  id: ID!
  to: Account!
  from: Account!
  amount: BigInt! 
}

```

Here `Tranfer` defines owns the two relations and `Account` defines the corresponding inverse lookup properties. This is implemented as follows:
- On the database side: the `from` and `to` properties of the `Transfer` entity map to `from_id` and `to_id` foreign key columns of the `transfer` table referencing the `account` table.
- On the TypeORM side: properties `transfersTo` and `transfersFrom` decorated with `@OneToMany` get added to the `Account` entity class. Properties `to` and `from` of the `Transfer` entity class get decorated with `@ManyToOne`.
- On the GraphQL side: sub-selection of all relation-defined properties is made available in the schema.

## Many-to-many relations

Many-to-many entity relations should be modelled as two one-to-many relations with an explicitly defined join table. 
Here is an example:

```graphql
# an explicit join table 
type TradeToken @entity {
  id: ID! # This is required, even if useless
  trade: Trade!
  token: Token! 
}

type Token @entity {
  id: ID!
  symbol: String!
  trades: [TradeToken!]! @derivedFrom(field: "token")    
}

type Trade @entity {
  id: ID!
  tokens: [TradeToken!]! @derivedFrom(field: "trade")
}
```
