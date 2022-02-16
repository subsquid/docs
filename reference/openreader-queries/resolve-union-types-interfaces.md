---
description: >-
  Use the __typename meta field to resolve types when querying unions or
  interfaces
---

# Resolve Union types/interfaces

The use cases for [Union types](../openreader-schema/union-types.md) and [Interfaces](../openreader-schema/interfaces.md) has been discussed in the related schema reference pages.

In that context, examples also showed how to query them. What's important to know is that these might create situations where it's not possible to know what type the GraphQL service is returning. To overcome this scenario, it is important to find some way to determine how to handle that data on the client.

This is where the `__typename` meta filed comes in. To witness it in action, let's take the schema from the [Union types](../openreader-schema/union-types.md) page:

{% code title="schema.graphql" %}
```graphql
type Account @entity {
  id: ID! #Account address
  workReports: [WorkReport] @derivedFrom(field: "account")
  joinGroups: [JoinGroup] @derivedFrom(field: "member")
  storageOrders: [StorageOrder] @derivedFrom (field: "account")
}

type WorkReport @entity {
  id: ID! #event id
  account: Account!
  addedFiles: [[String]]
  deletedFiles: [[String]]
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type JoinGroup @entity {
  id: ID!
  member: Account!
  owner: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type StorageOrder @entity {
  id: ID!
  account: Account!
  fileCid: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

union Event = WorkReport | JoinGroup | StorageOrder

```
{% endcode %}

This time, if we use this query:

```graphql
query EventQuery {
  event(where: {created_at_gt: "2022-01-01T00:00:00.000Z"} {
    __typename 
    ... on WorkReport {
      id
      createdAt
      blockHash
    }
    ... on JoinGroup {
      id
      createdAt
      blockHash
    }
    ... on StorageOrder {
      id
      createdAt
      blockHash
    }
  }
}

```

It would be impossible to discern a returned object type from the other, without `__typename`, because we only queried for fields that are common, or that have the same name across all object types. This is a sample result of the above query:

```graphql
{
    event: [
      {
        "__typename": "WorkReport",
        "id": "1"
        "createdAt": "2022-01-01T00:00:00.000Z"
        "blockHash": "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe"
      },
      {
        "__typename": "WorkReport",
        "id": "2"
        "createdAt": "2022-01-01T00:00:00.000Z"
        "blockHash": "0xcd123ac567bbedf73290dfb7e61f870f17b41801197a149ca9365455de34ac3b"
      },
      {
        "__typename": "JoinGroup",
        "id": "1"
        "createdAt": "2022-01-01T00:00:00.000Z"
        "blockHash": "0xace45fe78aa367f73290dfb7e61f870f17b41801197a149ca936544fe09ae87c"
      },
      {
        "__typename": "StorageOrder",
        "id": "1000"
        "createdAt": "2022-01-01T00:00:00.000Z"
        "blockHash": "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe"
      },
      {
        "__typename": "StorageOrder",
        "id": "1001"
        "createdAt": "2022-01-01T00:00:00.000Z"
        "blockHash": "0xbfd57689facdf73290dfb7e61f870f17b41801197a149ca9365gac45cece097a"
      }
    ]
}
```

Because all the returned objects have the same structure, the only way to know if one of the is a `WorkReport` or a `JoinGroup` or a `StorageOrder` is using the `__typename` meta field.
