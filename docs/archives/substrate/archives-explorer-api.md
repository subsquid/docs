---
sidebar_position: 30
title: Explorer API
description: Exploration GraphQL API for ad-hoc queries
---

# Explorer API

:::warning
The Explorer API endpoints exposed by public Archives for Substrate networks will be deprecated in favor of the Giant Squid APIs. Its new primary use case is network exploration by means of a local or private Archive.
:::

`substrate-explorer` provides a GraphQL API for historical blocks, events, calls and extrinsics. [Run the service locally](/archives/substrate/self-hosted) together with `substrate-ingest` and browse the API using a playground tool like [Chrome GraphiQL extension](https://github.com/PowerKiKi/graphiql-extension).

The API is derived from the [OpenReader](https://github.com/subsquid/openreader) schema below and allows filtering, pagination and nested queries for most fields. Note that not all fields are indexed and thus some queries may appear to be slow.

## Block

```graphql
type Block @entity {
    id: ID!
    height: Int!
    hash: String!
    parentHash: String!
    timestamp: BigInt!
    spec: Metadata!
    validator: String
    events: [Event!]! @derivedFrom(field: "block")
    calls: [Call!]! @derivedFrom(field: "block")
    extrinsics: [Extrinsic!]! @derivedFrom(field: "block")
}
```

## Extrinsic

```graphql
type Extrinsic @entity {
    id: ID!
    block: Block!
    indexInBlock: Int!
    version: Int!
    signature: JSON
    success: Boolean!
    error: JSON
    call: Call!
    fee: Int
    tip: Int
    hash: String!
    pos: Int!
    # all internal calls
    calls: [Call!] @derivedFrom(field: "extrinsic")
}
```

## Call

Calls are more granular than extrinsics. The extrinsics `util.batch`, `sudo` and `proxy` are unwrapped by the Archive into an array of child calls.

```graphql
type Call @entity {
    id: ID!
    parent: Call
    block: Block!
    extrinsic: Extrinsic!
    success: Boolean!
    error: JSON
    origin: JSON
    name: String!
    args: JSON
    pos: Int!
}
```

## Event

```graphql
type Event @entity {
    id: ID!
    block: Block!
    indexInBlock: Int!
    phase: String!
    extrinsic: Extrinsic
    call: Call
    name: String!
    args: JSON
    pos: Int!
}
```

## Metadata

```graphql
type Metadata @entity {
    id: ID!
    specName: String!
    specVersion: Int
    blockHeight: Int!
    blockHash: String!
    hex: String!
}
```
