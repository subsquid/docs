---
sidebar_position: 20
title: AND/OR filters
description: >-
  Basic logic operators for use in filters
---

# AND/OR filters

## Overview

Our GraphQL implementation offers a vast selection of tools to filter and section results. One of these is the `where` clause, very common in most database query languages and [explained here](/query-squid/queries/#filter-query-results--search-queries) in detail.

In our GraphQL server implementation, we included logical operators to be used in the `where` clause, allowing to group multiple parameters in the same `where` argument using the `AND` and `OR` operators to filter results based on more than one criteria.

Note that the [newer](/graphql-api/overview/#supported-queries) and [more advanced](/query-squid/paginate-query-results) `{entityName}sConnection` queries support exactly the same format of the `where` argument as the older `{entityName}s` queries used in the examples provided here.

### Example of an `OR` clause:

Fetch a list of `accounts` that either have a balance bigger than a certain amount, or have a specific id.

```graphql
query {
  accounts(
    orderBy: balance_DESC, 
    where: {
      OR: [
        {balance_gte: "240000000000000000"}
        {id_eq: "CksmaBx9rKUG9a7eXwc5c965cJ3QiiC8ELFsLtJMYZYuRWs"}
      ]
    }
  ) {
    balance
    id
  }
}

```

### Example of `AND` clause:

Fetch a list of `accounts` that have a balance between two specific amounts:

```graphql
query {
  accounts(
    orderBy: balance_DESC, 
    where: {
      AND: [
        {balance_lte: "240000000000000000"}
        {balance_gte: "100000000000000"}
      ]
    }
  ) {
    balance
    id
  }
}

```
