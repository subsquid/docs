# Annotations (Directives)

[Directives](https://graphql.org/learn/queries/#directives) are a native feature of GraphQL, whose purpose is to affect execution of the query in any way the server desires when attached to fields. They are also commonly known as Annotations in other languages such as Java.

The two directives included in the core GraphQL specification are:

* `@include(if: Boolean)` Only include this field in the result if the argument is `true`.
* `@skip(if: Boolean)` Skip this field if the argument is `true`.

Our spec-compliant GraphQL server implementation called OpenReader allows the definition of a few more, listed below:

## `@entity`

`@entity` this is attached to a `type` and it signifies it should be persisted in the database with a corresponding table. The `type`(s) defined without this directive will be considered objects, for more on this see the [JSON field reference](json-fields.md).

A sample schema using this would be the following:

{% code title="schema.graphql" %}
```graphql
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

type Account @entity {
  id: ID! #Account address
  workReports: [WorkReport] @derivedFrom(field: "account")
  joinGroups: [JoinGroup] @derivedFrom(field: "member")
  storageOrders: [StorageOrder] @derivedFrom (field: "account")
}
```
{% endcode %}

All four types defined here will have a corresponding table in the database.

The last type defined in this schema, `Account`, uses another Directive, explained in detail below.

## `@derivedFrom`

The `@derivedFrom` directive is used in a relation between two `type`s to state that a field should not be persisted in the database.

This directive should be attached to a type's field, defining a relation with another type. Furthermore, the directive accepts an argument `field`, which is used to specify the field in the related Entity to derive from.

This way, a two-way relationship between the two types is established through that specific field. Let's look at a simple schema:

{% code title="schema.graphql" %}
```graphql
type Account @entity {
  "Account address"
  id: ID!
  balance: BigInt!
  historicalBalances: [HistoricalBalance!] @derivedFrom(field: "account")
}

type HistoricalBalance @entity {
  id: ID!
  account: Account!
  balance: BigInt!
  date: DateTime!
}

```
{% endcode %}

This schema defines two entities: `Account` and `HistoricalBalance`. The `historicalBalances` field of `Account` creates a one-to-many relationship between the two Entities.

What's important to note is that because the `@derivedFrom` directive is attached to `historicalBalances`, this field is not going to be persisted in the database, rather, as the directive name suggests, it will be derived from the relationship. The table for `Account` will look something like this:

```sql
create table account (id text primary key, balance numeric)
```

On the contrary, the table for `HistoricalBalance` will have a special mention in the `account_id` field, referencing the table for `Account` entity:

```sql
create table historical_balance (id text primary key, account_id text references account(id), balance numeric)
```

## `@unique`

The `@unique` directive is attached to a field and simply enough, means that such a field should be unique for this type. A sample schema using it looks like this:

{% code title="schema.graphql" %}
```graphql
type Issue @entity {
    id: ID!
    payment: IssuePayment @derivedFrom(field: "issue")
    cancellation: IssueCancellation @derivedFrom(field: "issue")
}

type IssuePayment @entity {
    id: ID!
    issue: Issue! @unique
    amount: Int!
}

type IssueCancellation @entity {
    id: ID!
    issue: Issue! @unique
    height: Int!
}
```
{% endcode %}

This will be reflected in the automatically created tables:

```sql
create table issue (id text primary key)
create table issue_payment (id text primary key, issue_id text not null unique, amount numeric)
create table issue_cancellation (id text primary key, issue_id text not null unique, height int)
```

## `@index`

This particular annotation is responsible for the creation of indexes on specified fields when creating the database tables, and as such it is quite important to master it, in order to obtain the maximum performance out of your Squid API.

Let's take a look at a very simple schema making use of this:

```graphql
" All transfers "
type Transfer @entity @index(fields: ["block", "extrinsicId"]) {
  from: Bytes! @index
  to: Bytes!
  fromAccount: Account
  toAccount: Account
  value: BigInt!
  block: Int!
  tip: BigInt!
  timestamp: BigInt!
  insertedAt: DateTime!
  extrinsicId: String
}

type Account @entity {
  "Account address"
  id: ID!
  balance: BigInt!
  incomingTx: [Transfer!] @derivedFrom(field: "toAccount")
  outgoingTx: [Transfer!] @derivedFrom(field: "fromAccount")
}

```

You could quickly note that the `@index` directive has been used both on a single field (`from`) and on an entire entity (`Transfer`), specifying which fields will serve as indices of uniqueness for the entity itself (in this case, both `blocks` and `extrinsicId`).

As mentioned before, this will make sure that an index on the `from` field of the `Transfer` table will be created, but will also create a joint index out of the `block` and `extrinsicId` fields.

On a final note, it is worth noticing that [Foreign Keys](https://en.wikipedia.org/wiki/Foreign\_key) are indexed by default. So in this case, `fromAccount` and `toAccount` in the `Transfer` table will also be indexed.
