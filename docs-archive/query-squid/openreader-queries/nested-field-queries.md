# Nested field queries

## Overview

With OpenReader, fields of an Entity that contain fields themselves are shown as nested fields and it is possible to filter these as well. GraphQL queries can traverse related objects and their fields, letting clients fetch lots of related data in one request, instead of making several roundtrips as one would need in a classic REST architecture.

As an example, this query searches for all `accounts` whose balance is bigger than a threshold value, fetching the `id`, `balance` simple fields, and the `historicalBalances` **nested field**.

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

The nested field is a list (one account can have multiple `historicalBalances`) of objects with fields of their own and these results are filtered, in turn.

In this query, the `historicalBalances` are filtered, so that only results created after a certain date are returned

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

