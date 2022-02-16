---
description: How to define a schema that allows full text search across fields
---

# Full text search

On top of other Directives implemented in OpenReader defined in the previous page, there is one that might deserve a special mention.

The `@fulltext` annotation can only be applied to `String` Scalar fields and will allow queries to search some text in the entire field.

Let's take a look at a very simple schema making use of this:

{% code title="schema.graphql" %}
```graphql
" All transfers "
type Transfer @entity @index(fields: ["block", "extrinsicId"]) {
  from: Bytes! @index
  to: Bytes!
  fromAccount: Account
  toAccount: Account
  value: BigInt!
  comment: String @fulltext(query: "commentSearch")
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
{% endcode %}

There are other annotations, treated in the [related page](annotations-directives.md), what we are interested here is the `comment` field of `Transfer` type, which will automatically generate a new query, with the named specified in the `query` parameter.

To see it in action, here is an example:

```graphql
query {
    commentSearch(text: "hello") {
        item {
            ... on Transfer {
                from, 
                to,
                value,
                timestamp
            }
        }
        highlight
    }
}
```

which, imagining there is, indeed, a `Transfer` entry with a comment containing the word `hello`, it would yield this result:

```graphql
{
    commentSearch: [{
        item: {
            from: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe', 
            to: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
            value: 1000,
            timestamp: '2020-12-24T23:59:59.999Z',
        },
        highlight: 'Hey there, <b>hello</b>! Here's some money'
    }]
}
```
