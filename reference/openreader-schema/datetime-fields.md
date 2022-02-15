# DateTime fields

GraphQL objects types have names and fields, but at the end of the day, these fields will either have to be other object types, or resolve to some concrete data. This concrete data is represented by [Scalar types](https://graphql.org/learn/schema/#scalar-types). GraphQL comes with its own default set of Scalar types, but different implementations can define their own.

Datetime variables and formats are quite common across various programming languages and databases. Our custom GraphQL implementation provides it via the `DateTime` field, which is a date-time string in simplified extended ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

We can reuse the basic example of `Account` and `HistoricalBalance` entities to show the usage of this field, because `HistoricalBalance` has a `date` field, which is a `DateTime` Scalar.

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

And this will translate to this table being created for `HistoricalBalance` entity:

```sql
create table historical_balance (id text primary key, account_id text references account(id), balance numeric, date timestamp)
```

With the `date` field being a `timestamp`.
