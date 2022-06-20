# Cross-relation field queries

## Introduction

The previous section already showed that queries can return not just Scalars, such as a String, but also fields that refer to Objects, or entity types. What's even more interesting is that queries can leverage fields of related objects to filter results.

Let's take this sample schema, with two entity types, with a one-to-many relationship between them:

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

With the functionality offered by cross-relation field queries, we could ask for `Account`s that have at least some `historicalBalance`s  with a `balance`  smaller than a certain threshold:

```graphql
query MyQuery {
  accounts(where: {historicalBalances_some: {balance_lt: "10000000000"}}) {
    id
  }
}

```

This allows to query not just based on the entity itself, but based on related entities as well, which is intuitively a very powerful feature.

There is not just one operator, when it comes to cross-relation field queries. Following is a short description for each one.

## The `*_every` filter

For anyone with enough knowledge of Boolean algebra, this should be rather intuitive. When using this clause in a query, the results are those where all of the entities linked via the related field satisfy the condition. Let's look at an example:

```graphql title="schema.graphql"
query MyQuery {
  accounts(where: {historicalBalances_every: {balance_lt: "10000000000"}}) {
    id
  }
}

```

This query will return all `Account`s where **each and every one** of the `HistoricalBalance` entities related to them have a `balance` smaller than the threshold.

It is sufficient for a single `HistoricalBalance` to have a `balance` larger than the set value, to make sure that the related `Account` is not returned in the query.

## The `*_none`  filter

This clause is closely related to the previous one, in that it is the exact logical opposite. Where the `*_every` clause demands that all related objects satisfy the imposed condition, the `*_none` demands that none of them do. In this example:

```graphql
query MyQuery {
  accounts(where: {historicalBalances_none: {balance_lt: "10000000000"}}) {
    id
  }
}

```

The query will return all `Account`s where not a single related `HistoricalBalance` has a `balance` smaller than the set threshold.

The other way of looking at this is to ask that all related `HistoricalBalance`s should have a `balance` **larger or equal**. It is very important to be reminded that the logical opposite of "smaller than" is "larger or equal than".

## The `*_some` filter

This is the clause seen in the very first example in this page and just to expand on the subject, it allows for a less rigid and more inclusive research, because the condition expressed afterwards only needs to be satisfied by **at least** one of the related entities. In this case:

```graphql
query MyQuery {
  accounts(where: {historicalBalances_some: {balance_lt: "10000000000"}}) {
    id
  }
}

```

All `Account`s that have at least some `historicalBalance`s  with a `balance`  smaller than a certain threshold will be returned. This means that one single `HistoricalBalance` related to an `Account` is sufficient for this `Account` to be part of the results.
