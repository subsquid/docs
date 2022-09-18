# Archives Explorer API

`substrate-explorer` provides a GraphQL API for historical blocks, events, calls and extrinsics. Subsquid maintains explorers for most parachains. To get an explorer endpoint, go to [Aquarium Archives](https://app.subsquid.io/aquarium/archives), click on the network of choice and locate the `Explorer URL` link.

The API is derived from the [OpenReader](https://github.com/subsquid/squid/tree/master/openreader) schema below and allows filtering, pagination and nested queries for most fields. Note that not all fields are indexed and thus some queries may appear to be slow.

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

Calls are more granular than extrinsics. Calls are used to unwrap `util.batch`, `sudo` and `proxy` extrinsics.

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
