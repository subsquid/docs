# Union types

[Union](https://graphql.org/learn/schema/#union-types) types may look similar to [Interfaces](interfaces.md) and in some ways they are, but there is a very important difference between them and it is that Unions cannot specify common fields between types that are part of them.

{% hint style="warning" %}
It is key to highlight that Union types are only implemented for JSON fields.
{% endhint %}

We can take a look at the same schema we used for Interfaces, the only difference is that we won't  define an Interface and implement it with the different types. It might look like a "lazier" approach (and in some ways it is, as explained later), but we are only going to define a Union of the three types, instead, as you can see in the last line of code.

```graphql
type Account {
  id: ID! #Account address
  workReports: [WorkReport] @derivedFrom(field: "account")
  joinGroups: [JoinGroup] @derivedFrom(field: "member")
  storageOrders: [StorageOrder] @derivedFrom (field: "account")
}

type WorkReport {
  id: ID! #event id
  account: Account!
  addedFiles: [[String]]
  deletedFiles: [[String]]
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type JoinGroup {
  id: ID!
  member: Account!
  owner: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type StorageOrder {
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

If a query returns a Union type, inline fragments are mandatory, in order to return any fields at all, even those who could be common. That's because, as mentioned earlier, Union cannot define common fields:

```graphql
query EventById($id: ID!) {
  event(id: $id) {
    ... on WorkReport {
      id
      extrinisicId
      createdAt
      blockHash
      blockNum
      account
      addedFiles
      deletedFiles
    }
    ... on JoinGroup {
      id
      extrinisicId
      createdAt
      blockHash
      blockNum
      member
      owner
    }
    ... on StorageOrder {
      id
      extrinisicId
      createdAt
      blockHash
      blockNum
      account
      fileCid
    }
  }
}

```

As you can see, there's a lot of duplicated fields, but that's because for this specific schema, Interfaces simply prove to be more useful. Unions tend to be more indicated when there is no common fields, or a marginal overlap.
