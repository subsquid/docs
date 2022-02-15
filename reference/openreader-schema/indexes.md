---
description: Define indexes on fields, improving query performances
---

# Indexes

On top of other Directives implemented in OpenReader defined in the previous page, there are a couple we feel like they deserve special mentions. One of them is the `@index` directive.

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
