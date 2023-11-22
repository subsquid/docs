---
sidebar_position: 41
description: >-
  Query entities with Object-typed fields
---

# JSON queries

The possibility of defining JSON objects as fields of a type in a GraphQL schema has been explained in the [schema reference](/store/postgres/schema-file).

This guide is focusing on how to query such objects and how to fully leverage their potential. Let's take the example of this (non-crypto related, for once😁) schema:

```graphql title="schema.graphql"
type Entity @entity {
    id: ID!
    a: A
}

type A {
    a: String
    b: B
}

type B {
    a: A
    b: String
    e: Entity
}
```

It's composed of one entity and two JSON objects definitions, used in a "nested" way.

Let's now look at a simple query:

```graphql
query {
    entities(orderBy: id_ASC) {
        id
        a { a }
    }
}
```

This will return a result such as this one (imagining this data exists in the database):

```graphql
{
  entities: [
    {id: '1', a: {a: 'a'}},
    {id: '2', a: {a: 'A'}},
    {id: '3', a: {a: null}},
    {id: '4', a: null}
  ]
}
```

Simply enough, the first two objects have an object of type `A` with some content inside, the third one has an object, but its `a` field is `null` and the fourth one simply does not have an `A` object at all.
