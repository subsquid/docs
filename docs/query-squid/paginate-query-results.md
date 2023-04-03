---
sidebar_position: 50
title: Pagination
description: >-
  Dealing with large query outputs
---

# Paginate query results

There are multiple ways to obtain this behavior, let's take a look at a couple of them.

## Cursor based pagination

Cursors are used to traverse across entities of an entity set. They work by returning a pointer ("cursor") to a specific entity which can then be used to fetch the next batch. The batch will start with the entity after the one the cursor points to. For cursor-based pagination, OpenReader follows the [Relay Cursor Connections spec](https://relay.dev/graphql/connections.htm).

Currently, only forward pagination is supported. If your use case requires bidirectional pagination please let us know at our [Telegram channel](https://t.me/HydraDevs).

In Subsquid GraphQL server, cursor based pagination is implemented with `{entityName}sConnection` queries available for every entity in the input schema. These queries require an explicitly supplied [`orderBy` argument](/query-squid/sorting), and *the field that is used for ordering must also be requested by the query itself*. Check out [this section](/query-squid/paginate-query-results/#important-note-on-orderby) for a valid query template.

Example: this query fetches a list of videos where `isExplicit` is true and gets their count.

```graphql
query {
  videosConnection(orderBy: id_ASC, where: { isExplicit_eq: true }) {
    totalCount
    edges {
      node {
        id
        title
      }
    }
  }
}
```

### **Operator `first`**

The `first` operator is used to fetch a specified number of entities from the beginning of the output.

Example: Fetch the first 5 videos:

```graphql
query Query1 {
  videosConnection(orderBy: id_ASC, first: 5) {
    edges {
      node {
        id
        title
      }
    }
  }
}
```

### **PageInfo object**

`PageInfo` is a "virtual" entity that can be requested from any `{entityName}sConnection` query (see below). It returns the relevant cursors and some page information:

```graphql
pageInfo {
  startCursor
  endCursor
  hasNextPage
  hasPreviousPage
}
```

### **Operator `after`**

Example: Fetch the first 10 channels, ordered by `createdAt`. Then, in a second query, fetch the next 10 channels:

```graphql
query FirstBatchQ {
  channelsConnection(first: 10, orderBy: createdAt_ASC) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        id
        handle
        createdAt
      }
    }
  }
}

query SecondBatchQ {
  channelsConnection(after: <endCursor>, orderBy: createdAt_ASC) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        id
        handle
        createdAt
      }
    }
  }
}
```

### **Important Note on `orderBy`**

The field chosen to `orderBy` needs to be present in the query itself. For example, any `after` query must follow this template:

```graphql
query QueryName {
  <entityName>sConnection(after: <endCursor>, orderBy: <fieldNameToOrderBy>_ASC) {
    pageInfo {
      endCursor
      hasNextPage
      ...<any other page info fields>...
    }
    edges {
      node {
        <fieldNameToOrderBy>
        ...<any other fields of interest>...
      }
    }
  }
}
```
Otherwise, the returned result wouldn't be ordered correctly.

### Examples

An interactive example of using cursor-based pagination can be found in [this repo](https://github.com/subsquid-labs/cursor-pagination-client-example).

## Paginating with `{entityName}s` queries

### Arguments `limit` and `offset`

In a list of entities returned by a query, the `limit` argument specifies how many should be retained, while the `offset` argument specifies how many should be skipped first. Default values are `50` for `limit` and `0` for `offset`.

### **Limit results**

Example: Fetch the first 5 channels:

```graphql
query {
  channels(limit: 5) {
    id
    handle
  }
}
```

### **Limit results from an offset**

Example: Fetch 5 channels from the list of all channels, starting with the 6th one:

```graphql
query {
  channels(limit: 5, offset: 5) {
    id
    handle
  }
}
```

