# JSON fields

Our OpenReader implementation allows the definition of complex objects as fields. The result is that queries can retrieve these fields as JSON objects. That's why we decided to call them _JSON fields_.

Let's take a real world example of a schema (look at [this Tutorial](../../tutorial/create-a-simple-squid.md) to know where it's used):

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

Some fields are repeated throughout the 3 main entities: `extrinsicId`, `createdAt`, `blockHash`, and `blockNum`. This is by no means necessary and some will say it's counterproductive, but for the purpose of this reference, if we were to collapse these fields into one JSON field, we could change the schema this way:

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
  blockMetadata: BlockMetadata!
}

type JoinGroup @entity {
  id: ID!
  member: Account!
  owner: String!
  blockMetadata: BlockMetadata!
}

type StorageOrder @entity {
  id: ID!
  account: Account!
  fileCid: String!
  blockMetadata: BlockMetadata!
}

type BlockMetadata {
  extrinisicId: String
  createdAt: DateTime!
  blockHash: String!
  blockNum: Int!
}
```

The resulting table for `JoinGroup` will look like this:

```sql
create table join_group (id text primary key, account_id as "member" text not null, "owner" text, "block_metadata" jsonb)
```

And the following query:

```graphql
query {
    joinGroups(limit: 1) {
        id
        owner
        blockMetadata { blockNum, createdAt, blockHash } 
    }
}
```

Will yield the following result:

```graphql
{
    joinGroups: [
        {
            id: '1', 
            owner: '1040'
            blockMetadata : {
                blockNum: 0,
                createdAt: '2022-01-31T13:10:20Z',
                blockHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe'
            }
        }
    ]
}
```

This is a choice, a weapon at the developer's disposal. It might not always be needed, or the best option, but it's available nonetheless.
