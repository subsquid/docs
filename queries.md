---
description: GraphQL queries are used to fetch data from the server.
---

# Graphql Queries

## Introduction

Hydra cli tooling auto-generates queries as part of the GraphQL schema from your input schema. It generates a range of possible queries and operators that also work with relationships defined in your input schema.

All entities of the input schema tracked by the cli \(re-generation is required when any change happens to the input schema\) can be queried over the GraphQL endpoint.

## Exploring queries

You can explore the entire schema and the available queries using the GraphiQL interface by running your graphql-server or looking at the graphql-server/generated/schema.graphql file.

Let’s take a look at the different queries you can run using the GraphQL server. We’ll use examples based on a typical channel/video schema for reference.

* Simple entity queries
* Relation entity queries
* Filter query results / search queries
* Sort query results
* Paginate query results

### Simple entity queries

You can fetch a single entity or multiple entities of the same type using a simple entity query.

**Fetch list of entities**

Example: Fetch a list of channels:

```graphql
query {
  channels {
    id
    handle
  }
}
```

**Fetch an entity using its unique fields**

Example: Fetch a channel using by unique id:

```graphql
query Query1 {
  channelByUniqueInput(where: { id: "1" }) {
    id
    handle
  }
}

query Query2 {
  channelByUniqueInput(where: { handle: "Joy Channel" }) {
    id
    handle
  }
}
```

### Relation entity queries

Please look at the cross-filters documantation.

### Filter query results / search queries

**The `where` argument**

You can use the `where` argument in your queries to filter results based on some field’s values. You can even use multiple filters in the same where clause using the `AND` or the `OR` operators.

For example, to fetch data for `Joy Channel`:

```graphql
query {
  channels(where: { handle_eq: "Joy Channel" }) {
    id
    handle
  }
}
```

#### Comparison operators

**Supported Scalar Types**

Hydra supports following scalar types:

* String
* Int
* Float
* BigInt
* Boolean
* Bytes
* DateTime

**Equality Operators \(`_eq`\)**

`_eq` is supported by all the scalar types

The following are examples of using this operator on different types:

1. Fetch a list of videos where `title` is "Bitcoin"
2. Fetch a list of videos where `isExplicit` is "true"
3. Fetch a list of videos `publishedOn` "2021-01-05"

```graphql
query Query1 {
  videos(where: { title_eq: "Bitcoin" }) {
    id
    title
  }
}

query Query2 {
  videos(where: { isExplicit_eq: true }) {
    id
    title
  }
}

query Query3 {
  videos(where: { publishedOn_eq: "2021-01-05" }) {
    id
    title
  }
}
```

**Greater than or less than operators \(`gt`, `lt`, `gte`, `lte`\)**

The `_gt` \(greater than\), `_lt` \(less than\), `_gte` \(greater than or equal to\), `_lte` \(less than or equal to\) operators are available on `Int, BigInt, Float, DataTime` types.

The following are examples of using these operators on different types:

1. Fetch a list of videos published before "2021-01-05"
2. Fetch a list of channels before block "999"

```graphql
query Query1 {
  videos(where: { publishedOn_gte: "2021-01-05" }) {
    id
    title
  }
}

query Query2 {
  channels(where: { block_lte: "999" }) {
    id
    handle
  }
}
```

**List based search operators \(`_in`\)**

`_in` operator is available on all scalar types except `DataTime`.

The following are examples of using this operators on different types:

1. Fetch a list of videos titled with "For Children" or "For Kids"
2. Fetch a list of channels created in block 1, 2 or 3

```graphql
query Query1 {
  videos(where: { title_in: ["For Children", "For Kids"] }) {
    id
    title
  }
}

query Query2 {
  channels(where: { block_in: [1, 2, 3] }) {
    id
    handle
  }
}
```

**Text search or pattern matching operators \(`_contains`, `_startsWith`, `_endsWith`\)**

The `_contains`, `_startsWith`, `_endsWith` operators are used for pattern matching on string fields.

Example:

```graphql
query Query1 {
  videos(where: { title_contains: "Bitcoin" }) {
    id
    title
  }
}

query Query2 {
  videos(where: { title_endsWith: "cryptocurrency" }) {
    id
    title
  }
}
```

#### Using multiple filters in the same query \(`AND`, `OR`\)

You can group multiple parameters in the same where argument using the `AND` or the `OR` operators to filter results based on more than one criteria.

Example `AND`:

Fetch a list of videos published in a specific time-frame:

```graphql
query {
  videos(
    where: {
      AND: [
        { publishedOn_gte: "2021-01-05" }
        { publishedOn_lte: "2020-01-05" }
      ]
    }
  ) {
    id
    title
    publishedOn
  }
}
```

Example `OR`:

Fetch a list of videos isExplicit "true" or published after "2021-01-05":

```graphql
query {
  videos(
    where: { OR: [{ publishedOn_gte: "2021-01-05" }, { isExplicit_eq: true }] }
  ) {
    id
    title
    isExplicit
  }
}
```

