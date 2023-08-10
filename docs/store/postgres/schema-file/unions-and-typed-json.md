---
sidebar_position: 23
title: Unions and typed JSON
description: Union and JSON types
---

# Unions and typed JSON

Complex scalar types can be modelled using a typed JSON fields together with union types, making safe union types.

## Typed JSON

It is possible to define explicit types for JSON fields. The generated entity classes and the GraphQL API will respect the type definition of the field, enforcing the data integrity.

**Example**
```graphql
type Entity @entity {
  a: A
}

type A {
  a: String
  b: B
  c: JSON
}

type B {
  a: A
  b: String
  e: Entity
}
```

## Union types

One can leverage union types supported both by [Typescript](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) and [GraphQL](https://graphql.org/learn/schema/#union-types).  The union operator for `schema.graphql` supports only non-entity types, including typed JSON types described above. JSON types, however, are allowed to reference an entity type.

**Example**
```graphql
type User @entity {
  id: ID!
  login: String!
}
        
type Farmer {
  user: User!
  crop: Int
}

type Degen {
  user: User!
  bag: String
}
        
union Owner = Farmer | Degen
        
type NFT @entity {
  name: String!
  owner: Owner!
}
```
