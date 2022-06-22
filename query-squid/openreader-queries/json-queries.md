---
description: Powerful queries leveraging JSON objects as fields in a schema
---

# JSON queries

The possibility of defining JSON objects as fields of a type in a GraphQL schema has been explained in the [dedicated Reference page](../openreader-schema/json-fields.md).

This guide is focusing on how to query such objects and how to fully leverage their potential. Let's take the example of this (non-crypto related, for once😁) schema:

{% code title="schema.graphql" %}
```graphql
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
{% endcode %}

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

Now, let's look at a more complicated query, one that tries to _take apart_ the circular relationship that exists between `Entity`, `A`, and `B` (if you look closely, `Entity`  references `A`, which references `B`, which, in turn, has an `Entity` field...).

```graphql
query {
    entities(orderBy: id_ASC) { 
        id 
        a { 
            b {
                e {
                    id
                    a {
                        b {
                            b
                            e { id }
                        }
                    }
                }
            }
        } 
    }
}
```

Here's the result:

```graphql
{
    entities: [
        {
            id: '1', 
            a: {
                b: {
                    e: {
                        id: '1', 
                        a: {
                            b: {
                                b: 'b', 
                                e: {
                                    id: '1'
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            id: '2', 
            a: {
                b: {
                    e: {
                        id: '1', 
                        a: {
                            b: {
                                b: 'b', 
                                e: {
                                    id: '1'
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            id: '3', 
            a: {
                b: null
            }
        },
        {
            id: '4', 
            a: null
        }
    ]
}
```

It is definitely a _perverse_ way to perform a query, but it only serves the purpose of showing how JSON fields can be used in queries and the capabilities of OpenReader in representing them.
