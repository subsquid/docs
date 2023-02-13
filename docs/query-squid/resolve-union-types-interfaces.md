---
sidebar_position: 70
description: >-
  Use the __typename meta field to resolve types when querying unions or
  interfaces
---

# Union type resolution

The use cases for [Union types](/basics/schema-file/unions-and-typed-json) have been discussed in the [schema reference pages](/basics/schema-file/).

Here, we can discuss how to query union types. Let's take this modified schema from the [Substrate tutorial](/tutorials/create-a-simple-squid.md).

```graphql title="schema.graphql"
type Account @entity {
  id: ID! #Account address
  events: [Event]
}

type WorkReport {
  id: ID! #event id
  addedFiles: [[String]]
  deletedFiles: [[String]]
  extrinsicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type JoinGroup {
  id: ID!
  owner: String!
  extrinsicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type StorageOrder {
  id: ID!
  fileCid: String!
  extrinsicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

union Event = WorkReport | JoinGroup | StorageOrder

```

With this query, it's possible to show different fields, depending on the underlying type:

```graphql
query MyQuery {
  accounts {
    events {
      __typename
      ... on WorkReport {
        id
        blockHash
        blockNum
        createdAt
        extrinsicId
      }
      ... on JoinGroup {
        id
        blockHash
        blockNum
        createdAt
        extrinsicId
      }
      ... on StorageOrder {
        id
        blockHash
        blockNum
        createdAt
        extrinsicId
      }
    }
    id
  }
}

```

:::info
**Note:** the query only selects common fields for each type that is part of the union. This is on purpose, to show the usefulness of `__typename`.
:::

It would be impossible to discern a returned object type from the other, without `__typename`, because we only queried for fields that are common, or that have the same name across all object types. This is a sample result of the above query:

```graphql
{
  "data": {
    "accounts": [
      {
        "events": [
          {
            "__typename": "WorkReport",
            "id": "0000584321-000001-01cdb",
            "blockHash": "0x01cdb3cb6fa00f62fd20220104f1d740a53518b63517419da8a89325d065562b",
            "blockNum": 584321,
            "createdAt": "2021-08-19T00:52:12.000Z",
            "extrinsicId": "0000584321-000001-01cdb"
          }
        ],
        "id": "cTKmzHG3RHa1yhujyZpPnNL17p8a48Av3JFwDjpttLcxeSo26"
      },
      {
        "events": [
          {
            "__typename": "JoinGroup",
            "id": "0000584598-000010-d06ec",
            "blockHash": "0xd06ec6716e96108e24987ef03d23c857ef3b467dd057d7a32c4e123fe5a8df36",
            "blockNum": 584598,
            "createdAt": "2021-08-19T01:19:54.001Z",
            "extrinsicId": "0000584598-000004-d06ec"
          }
        ],
        "id": "cTKqevWRdvbNNAQ3hLxhsNYhQ8pf5YGkYnnVjgjLNiVr4kd7a"
      },
      {
        "events": [
          {
            "__typename": "WorkReport",
            "id": "0000584600-000007-9bc71",
            "blockHash": "0x9bc712c4cabafacf0935ed504e7f99b8e25de82b73f3eccfffc6307bb180be8c",
            "blockNum": 584600,
            "createdAt": "2021-08-19T01:20:06.000Z",
            "extrinsicId": "0000584600-000003-9bc71"
          }
        ],
        "id": "cTKbhszkP7xszAjYfDfwrpzDpQ1xFA17qjpusFL2ByYDp2n63"
      },
      {
        "events": [
          {
            "__typename": "JoinGroup",
            "id": "0000584603-000016-b190c",
            "blockHash": "0xb190cdc0b8cf343de496dfcc307a5992f0bc9f38a4428435f8ea12bc18bac608",
            "blockNum": 584603,
            "createdAt": "2021-08-19T01:20:24.000Z",
            "extrinsicId": "0000584603-000006-b190c"
          }
        ],
        "id": "cTMWiALJtq7qyLCVzQ3u6YxZkjHqR5fqR2K8dqbFrwJzz9bmH"
      },
      {
        "events": [
          {
            "__typename": "StorageOrder",
            "id": "0000584627-000013-1fa19",
            "blockHash": "0x1fa19ae98731afad853ffd491fcbc0c3dcda6b8b7f5a2d56ac6c4c1eb9e4f95e",
            "blockNum": 584627,
            "createdAt": "2021-08-19T01:22:48.000Z",
            "extrinsicId": "0000584627-000005-1fa19"
          }
        ],
        "id": "cTGYF8jvcpnRmgNopqT4nVs5rWHEviAAdRdfNrZE8NFz2Av7B"
      }
    ]
  }
}
```

Because all the returned objects have the same structure, the only way to know if one of them is a `WorkReport` or a `JoinGroup` or a `StorageOrder` is using the `__typename` meta field.
