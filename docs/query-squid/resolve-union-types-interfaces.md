---
sidebar_position: 70
description: >-
  Use the __typename field to resolve types
---

# Union type resolution

Use cases for [Union types](/store/postgres/schema-file/unions-and-typed-json) have been discussed in the [schema reference](/store/postgres/schema-file). Here, we discuss how to query union types.

Let's take this modified schema from the [Substrate tutorial](/tutorials/create-a-simple-squid):

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
  blockHash: String!
}

type JoinGroup {
  id: ID!
  owner: String!
  extrinsicId: String
  blockHash: String!
}

type StorageOrder {
  id: ID!
  fileCid: String!
  extrinsicId: String
  blockHash: String!
}

union Event = WorkReport | JoinGroup | StorageOrder
```
Here, an `Event` will have different fields depending on the underlying type. This query demonstrates how to request different fields for each of these types:

```graphql
query MyQuery {
  accounts {
    events {
      __typename
      ... on WorkReport {
        id
        blockHash
        extrinsicId
        deletedFiles
      }
      ... on JoinGroup {
        id
        blockHash
        extrinsicId
      }
      ... on StorageOrder {
        id
        blockHash
        extrinsicId
      }
    }
    id
  }
}
```

The special `__typename` field allows users to discern the returned object type without relying on comparing the sets of regular fields. For example, in the output of the query above `JoinGroup` and `StorageOrder` events can only be distingushed by looking at the `__typename` field. Here is a possible output to illustrate:

```json
{
  "data": {
    "accounts": [
      {
        "events": [
          {
            "__typename": "WorkReport",
            "id": "0000584321-000001-01cdb",
            "blockHash": "0x01cdb3cb6fa00f62fd20220104f1d740a53518b63517419da8a89325d065562b",
            "extrinsicId": "0000584321-000001-01cdb",
            "deletedFiles": []
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
            "extrinsicId": "0000584598-000004-d06ec"
          }
        ],
        "id": "cTKqevWRdvbNNAQ3hLxhsNYhQ8pf5YGkYnnVjgjLNiVr4kd7a"
      },
      {
        "events": [
          {
            "__typename": "StorageOrder",
            "id": "0000584627-000013-1fa19",
            "blockHash": "0x1fa19ae98731afad853ffd491fcbc0c3dcda6b8b7f5a2d56ac6c4c1eb9e4f95e",
            "extrinsicId": "0000584627-000005-1fa19"
          }
        ],
        "id": "cTGYF8jvcpnRmgNopqT4nVs5rWHEviAAdRdfNrZE8NFz2Av7B"
      }
    ]
  }
}
```
