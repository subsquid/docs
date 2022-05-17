# Interfaces

{% hint style="danger" %}
Support for Interfaces has been dropped in v5. They could be introduced if in demand by the community.

Reach out and let the Subsquid team know if and how you would need them.
{% endhint %}

Interfaces are a common pattern across type definition systems and object oriented programming languages. An [_Interface_](https://graphql.org/learn/schema/#interfaces) is commonly defined as an abstract type that includes a certain set of fields that a type must include to implement the interface.

To look at an example of Interface, the schema used in [this Tutorial](../../tutorial/create-a-simple-squid.md) can be used:

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

```
{% endcode %}

As you can see, the `WorkReport`, `JoinGroup`, and `StorageOrder` entities have a few fields in common, namely: `id`,  `extrinisicId`, `createdAt`, `blockHash`, `blockNum`.

To group the common fields we could define an Interface, named `EventInfo`, for example:

The schema itself won't change much, it might even look like there's some repetition:

{% code title="interface_schema.graphql" %}
```graphql
type Account @entity {
  id: ID! #Account address
  workReports: [WorkReport] @derivedFrom(field: "account")
  joinGroups: [JoinGroup] @derivedFrom(field: "member")
  storageOrders: [StorageOrder] @derivedFrom (field: "account")
}

interface EventInfo {
  id: ID!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type WorkReport implements EventInfo @entity {
  id: ID! #event id
  account: Account!
  addedFiles: [[String]]
  deletedFiles: [[String]]
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type JoinGroup implements EventInfo @entity {
  id: ID!
  member: Account!
  owner: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

type StorageOrder implements EventInfo @entity {
  id: ID!
  account: Account!
  fileCid: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}

```
{% endcode %}

What we gained here is that if we were to implement a custom query, for example a simple one: `EventById`, this would be able to return any and all 3 different types, depending on the specified ID. We would have to use a specific syntax to obtain the extra field that are specific to each particular type implementation:

```graphql
query EventById($id: ID!) {
  event(id: $id) {
    id
    extrinisicId
    createdAt
    blockHash
    blockNum
    ... on WorkReport {
      account
      addedFiles
      deletedFiles
    }
    ... on JoinGroup {
      member
      owner
    }
    ... on StorageOrder {
      account
      fileCid
    }
  }
}
```

This way we would reduce duplication by defining only one query to return various types in the results, rather than having three separate queries.
