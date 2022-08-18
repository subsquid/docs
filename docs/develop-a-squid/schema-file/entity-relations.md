---
sidebar_position: 22
title: Entity relations
---

# Entity relations and inverse lookups

A relation between two entities is always assumed to be unidirectional. The owning entity is mapped to a database table holding a foreign key reference to the related entity. The non-owning entity may define a property decorated `@derivedFrom` for an inverse lookup on the owning field. In particular, the "many" side of the one-to-many relations is always the owning side.

Note that `@derivedFrom` has no effect on the corresponding table DDL but rather adds a property decorated with TypeORM `@OneToOne` or `@OneToMany` to the generated entity classes (and the GraphQL API generated from `schema.graphql`). All the foreign key reference columns are automatically indexed. 

The following examples illustrate this concept.

**One-to-one relation**

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

The `User` entity references a single `Account` and owns the relation (that is, the database schema will define the column `user.account_id` referencing to the `account` table).  

**Many-to-one/One-to-many relations**

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

Here `Tranfer` defines two foreign key references and `Account` defines the corresponding inverse lookup properties.

**Many-to-many relations**

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