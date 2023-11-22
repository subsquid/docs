---
sidebar_position: 40
title: Cross-relation queries
description: >-
  Filtering by fields of nested entities
---

# Cross-relation field queries

## Introduction

The [previous section](/query-squid/nested-field-queries) has already demonstrated that queries can return not just scalars such as a String, but also fields that refer to object or entity types. What's even more interesting is that queries can leverage fields of related objects to filter results.

Let's take this sample schema with two entity types and a one-to-many relationship between them:

```graphql title="schema.graphql"
type Account @entity {
    id: ID!
    wallet: String!
    balance: Int!
    history: [HistoricalBalance!] @derivedFrom(field: "account")
}

type HistoricalBalance @entity {
    "Unique identifier"
    id: ID!
    
    "Related account"
    account: Account!
    
    "Balance"
    balance: Int!
}
```

With the functionality offered by cross-relation field queries, we could ask for `Account`s that have at least some `historicalBalance`s  with a `balance` smaller than a certain threshold:

```graphql
query MyQuery {
  accounts(where: {historicalBalances_some: {balance_lt: "10000000000"}}) {
    id
  }
}
```

This allows to query based not just on the entity itself, but on the related entities as well, which is intuitively a very powerful feature.

`*_some` is not the only operator available for making cross-relation field queries. A short description of each such operator is provided in the sections below.

## The `*_every` filter

Returns entities for which **all** of the nested entities linked via the related field satisfy the condition. Example:

```graphql title="schema.graphql"
query MyQuery {
  accounts(where: {historicalBalances_every: {balance_lt: "10000000000"}}) {
    id
  }
}
```

This query will return all `Account`s where **each and every one** of the `HistoricalBalance` entities related to them have a `balance` smaller than the threshold. It is sufficient for a single `HistoricalBalance` to have a `balance` larger than the set value to make sure that the related `Account` is not returned in the query.

## The `*_none`  filter

Returns entities for which **none** of the nested entities linked via the related field satisfy the condition. Example:

```graphql
query MyQuery {
  accounts(where: {historicalBalances_none: {balance_lt: "10000000000"}}) {
    id
  }
}
```

The query will return all `Account`s in which not a single related `HistoricalBalance` has a `balance` smaller than the set threshold.

## The `*_some` filter

Returns entities for which **at least one** of the nested entities linked via the related field satisfies the condition. Example:

```graphql
query MyQuery {
  accounts(where: {historicalBalances_some: {balance_lt: "10000000000"}}) {
    id
  }
}
```

All `Account`s that have at least some `historicalBalance`s with a `balance` smaller than `10000000000` will be returned. This means that a single `HistoricalBalance` satisfying the condition is sufficient for the related `Account` to become a part of the results.

## `{entityName}sConnection` queries

Same as always, the `where` argument works for these queries in exactly the same way as it does for `{entityName}s` queries used in examples above. For example this query
```graphql
query MyQuery {
  accountsConnection(orderBy: id_ASC, where: {historicalBalances_some: {balance_lt: "10000000000"}}) {
    edges {
      node {
        id
      }
    }
  }
}
```
will return (in an appropriately shaped response) IDs for all `Accounts` that have at least some `historicalBalance`s with a `balance` smaller than `10000000000`.
