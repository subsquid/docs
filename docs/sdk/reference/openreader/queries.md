---
sidebar_position: 10
title: Entity queries
description: >-
  Basic data retrieval
---

# Entity Queries

## Introduction

OpenReader auto-generates queries from the `schema.graphql` file. All entities defined in the schema can be queried over the GraphQL endpoint.

## Exploring queries

Let’s take a look at the different queries you can run using the GraphQL server. We’ll use examples based on a typical channel/video schema.

### Simple entity queries

#### **Fetch list of entities**

Fetch a list of channels:

```graphql
query {
  channels {
    id
    handle
  }
}
```
or, using a [newer](/graphql-api/overview/#supported-queries) and [more advanced](/query-squid/paginate-query-results) `{entityName}sConnection` query

```graphql
query {
  channelsConnection(orderBy: id_ASC) {
    edges {
      node {
        id
        handle
      }
    }
  }
}
```

#### **Fetch an entity using its unique fields**

Fetch a channel by a unique id or handle:

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

### Filter query results / search queries

#### **The `where` argument**

You can use the `where` argument in your queries to filter results based on some field’s values. You can even use multiple filters in the same `where` clause using the `AND` or the `OR` operators.

For example, to fetch data for a channel named `Joy Channel`:

```graphql
query {
  channels(where: { handle_eq: "Joy Channel" }) {
    id
    handle
  }
}
```
Note that `{entityName}sConnection` queries support exactly the same format of the `where` argument:
```graphql
query {
  channelsConnection(orderBy: id_ASC, where: { handle_eq: "Joy Channel"}) {
    edges {
      node {
        id
        handle
      }
    }
  }
}
```

#### **Supported Scalar Types**

Subsquid supports the following scalar types:

* String
* Int
* Float
* BigInt
* Boolean
* Bytes
* DateTime

#### **Equality Operators (`_eq`)**

`_eq` is supported by all the scalar types.

The following are examples of using this operator on different types:

* Fetch a list of videos where `title` is "Bitcoin"
* Fetch a list of videos where `isExplicit` is "true"
* Fetch a list of videos `publishedOn` is "2021-01-05"

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

#### **Greater than or less than operators (`gt`, `lt`, `gte`, `lte`)**

The `_gt` (greater than), `_lt` (less than), `_gte` (greater than or equal to), `_lte` (less than or equal to) operators are available on `Int, BigInt, Float, DateTime` types.

The following are examples of using these operators on different types:

* Fetch a list of videos published before "2021-01-05"
* Fetch a list of channels before block "999"

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

#### **Text search or pattern matching operators (`_contains`, `_startsWith`, `_endsWith`)**

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
