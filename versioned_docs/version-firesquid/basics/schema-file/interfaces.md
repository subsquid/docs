---
sidebar_position: 24
title: Interfaces
description: Queriable interfaces
---

# Interfaces

The schema file supports [GraphQL Interfaces](https://graphql.org/learn/schema/#interfaces) for modelling complex types sharing common traits. Interfaces are annotated with `@query` at the type level and do not affect the backing database schema, only enriching the [GraphQL API queries](/graphql-api) with [inline fragments](https://graphql.org/learn/queries/#inline-fragments). 

### Examples


```graphql
interface MyEntity @query {
  id: ID!
  name: String
  ref: Ref
}

type Ref @entity {
  id: ID!
  name: String
  foo: Foo! @unique
  bar: Bar! @unique
} 

type Foo implements MyEntity @entity {
  id: ID!
  name: String
  ref: Ref @derivedFrom(field: "foo")
  foo: Int
}

type Bar implements MyEntity @entity {
  id: ID!
  name: String
  ref: Ref @derivedFrom(field: "bar")
  bar: Int
}

type Baz implements MyEntity @entity {
  id: ID!
  name: String
  ref: Ref
  baz: Int
}
```

The `MyEntity` interface above enables `myEntities` and `myEntitiesConnection` [GraphQL API queries](/graphql-api) with inline fragments and the `_type`, `__typename` [meta fields](https://graphql.org/learn/queries/#meta-fields):

```graphql
query {
  myEntities(orderBy: [_type_DESC, id_ASC]) {
    id
    name
    ref {
        id
        name
    }
    __typename
    ... on Foo { foo }
    ... on Bar { bar }
    ... on Baz { baz }
  }
}
```