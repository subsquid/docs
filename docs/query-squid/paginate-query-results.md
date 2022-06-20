---
description: >-
  When query results are too big, one can chose to limit them or divide them in
  "chunks"
---

# Paginate query results

There are multiple ways to obtain this behavior, let's take a look at a couple of them.

## Arguments `limit` and `offset`

The operators limit and offset are used for pagination.

`limit` specifies the number of entities to retain from the result set and `offset` determines which slice to retain from the results.

**Note:** Default value for `limit` is `50` and `offset` is `0`.

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

## Cursor based pagination

Cursors are used to traverse across entities of an entity set. They work by returning a pointer to a specific entity which can then be used to fetch the next batch of entities.

In the case of cursor based pagination, for every entity in the input schema, a query is generated with the `<entityName>Connection` pattern.

Example: this query fetches a list of videos where `isExplicit` is true and get their count. Thanks to the `videosConnection`, we can limit the number of videos to return.

```graphql
query {
  videosConnection(where: { isExplicit_eq: true }) {
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

### **Operators `first`  `last`**

The `first` operator is used to fetch specified number of entities from the beginning and `last` is vice versa.

Example: Fetch first 5 videos and last 5 videos:

```graphql
query Query1 {
  videosConnection(first: 5) {
    edges {
      node {
        id
        title
      }
    }
  }
}

query Query1 {
  videosConnection(last: 5) {
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

`PageInfo` returns the cursor, page information and object has following fields:

```graphql
pageInfo {
  startCursor
  endCursor
  hasNextPage
  hasPreviousPage
}
```

### Operators **`before` and `after`**

Example: Fetch a first 10 channels, ordered by `createdAt`. Then, in a second query, fetch the next 10 channels:

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

Example: Fetch the last 10 channels, ordered by `createdAt`. Then, in a second query, fetch the previous 10 channels:

```graphql
query FirstBatchQ {
  channelsConnection(last: 10, orderBy: createdAt_ASC) {
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
  channelsConnection(before: <endCursor>, orderBy: createdAt_ASC) {
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

When using `orderBy` in a query, the field chosen to order by, needs to be present in the query itself:

```graphql
query QueryName {
  <entity>Connection(before: <endCursor>, orderBy: <fieldNameToOrderBy>_ASC) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        <anyOtherField>
        <fieldNameToOrderBy>
      }
    }
  }
}
```

Otherwise the returned result wouldn't be ordered correctly.
