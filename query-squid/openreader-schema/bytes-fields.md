# Bytes fields

GraphQL objects types have names and fields, but at the end of the day, these fields will either have to be other object types, or resolve to some concrete data. This concrete data is represented by [Scalar types](https://graphql.org/learn/schema/#scalar-types). GraphQL comes with its own default set of Scalar types, but different implementations can define their own.

The last custom Scalar type implemented in OpenReader is the `Bytes` field, which is represents binary data encoded as a hex string always prefixed with "0x".

A good example of the usage of this field would be the schema used in [this Tutorial](../../tutorial/create-a-simple-squid.md).

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

The `blockHash` field is defined as a `String` scalar, where actually, block hashes are hexadecimal encoded strings and as such, they can be defined as `Bytes`. Let's do this, then:

{% code title="new_schema.graphql" %}
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
  blockHash: Bytes!
  blockNum: Int!
}

type JoinGroup @entity {
  id: ID!
  member: Account!
  owner: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: Bytes!
  blockNum: Int!
}

type StorageOrder @entity {
  id: ID!
  account: Account!
  fileCid: String!
  extrinisicId: String
  createdAt: DateTime!
  blockHash: Bytes!
  blockNum: Int!
}

```
{% endcode %}

Let's take the `JoinGroup` entity as an example: the above schema will result in the creation of this SQL table:

```sql
create table join_group (id text primary key, account_id as "member" text not null, "owner" text, "extrinsic_id" text, "created_at" timestamptz, "block_hash" bytea, "block_num" integer)
```
