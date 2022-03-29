---
description: One-to-One/One-to-Many/Many-to-One/Many-to-Many entity relations
---

# Entity Relations

The OpenReader implementation of GraphQL server recognizes relationships based on the fields in the GraphQL schema.

The relationship is recognized by looking at every field for all entity types. If a field of a source entity type points to a different entity (the target), the logic tries to find if a field of the target entity type points back to the source. The resulting relationship cardinality depends on the presence, absence, or cardinality of matching fields found.

## One-to-One

A one-to-one relationship between two types is characterized by the low cardinality constraint on both ends of the relationship. It is represented in a GraphQL schema by two types where each one of them has a field that points to each other.

{% code title="schema.graphql" %}
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
{% endcode %}

In this simple example, the `Account` and `User` entities are linked and one `User` can only have one `Account` and one `Account` can only be linked to one `User`. This might not be a real-world scenario, but it is what the schema is defining.

It's worth noticing that the `user` field of `Account` refers back to `User`, but since it has the `@derivedFrom` directive, it will not be persisted in the database (see the [appropriate Reference page](annotations-directives.md#derivedfrom) for more information).

## One-to-Many

A one-to-many relationship between two types has high cardinality on only one side of the relationship. It is represented in the GraphQL schema by two entity types where the source has an array field pointing at the target entity, while the target entity has a simple field pointing back to the source type entity. Let's look at a sample schema we already used in previous pages:

{% code title="schema.graphql" %}
```graphql
type Account @entity {
  "Account address"
  id: ID!
  balance: BigInt!
  historicalBalances: [HistoricalBalance!] @derivedFrom(field: "account")
}

type HistoricalBalance @entity {
  id: ID!
  account: Account!
  balance: BigInt!
  date: DateTime!
}

```
{% endcode %}

The above schema defines a `HistoricalBalance` to be tied to one and only one `Account`, while one `Account` can have multiple `HistoricalBalances`.

Same as for previous relationship, please note the use of the `@derivedFrom` directive.

## Many-to-One

A many-to-one relationship is essentially mirroring the one-to-many, as they are technically the same and work the same way, it is only evaluated from the opposite side. The only peculiar difference is that in this case, the array field can be omitted.

This is because the relationship will be established by one side, with a non-array field and since it will remain implicit from the point of view of the target entity type, the cardinality will be considered high by default.

{% code title="schema.graphql" %}
```graphql
type Account @entity {
  "Account address"
  id: ID!
  balance: BigInt!
}

type HistoricalBalance @entity {
  id: ID!
  account: Account!
  balance: BigInt!
  date: DateTime!
}

```
{% endcode %}

## Many-to-Many

We have some technical decisions to make, in order to implement many-to-many relationship in the way that we think works best for our users. For this reasons this is not implemented yet.

This chapter will be updated as soon as a new version implementing it will be released.
