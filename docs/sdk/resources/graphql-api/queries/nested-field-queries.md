---
sidebar_position: 30
title: Nested field queries
description: >-
  Query entities related to other entities
---

# Nested field queries

With OpenReader, fields of an Entity that contain fields themselves are shown as nested fields and it is possible to filter these as well. GraphQL queries can traverse related objects and their fields, letting clients fetch lots of related data in one request, instead of making several roundtrips as one would need in a classic REST architecture.

As an example, this query searches for all `accounts` whose balance is bigger than a threshold value, fetching the `id` and `balance` simple fields, as well as the `historicalBalances` **nested field**.

```graphql
query {
  accounts(orderBy: balance_ASC, where: {balance_gte: "250000000000000000"}) {
    id
    balance
    historicalBalances {
      balance
      date
      id
    }
  }
}

```

A nested field is a list (one account can have multiple `historicalBalances`) of objects with fields of their own. These objects can be filtered, too.

In the following query the `historicalBalances` are filtered in order to only return the balances created after a certain date:

```graphql
query {
  accounts(orderBy: balance_ASC, where: {balance_gte: "250000000000000000"}) {
    id
    balance
    historicalBalances(where: {date_lte: "2020-10-31T11:59:59.000Z"}, orderBy: balance_DESC) {
      balance
      date
      id
    }
  }
}

```
Note that the [newer](/graphql-api/overview/#supported-queries) and [more advanced](/query-squid/paginate-query-results) `{entityName}sConnection` queries support exactly the same format of the `where` argument as the older `{entityName}s` queries used in the examples provided here.
