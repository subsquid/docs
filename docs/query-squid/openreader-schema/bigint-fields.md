# BigInt fields

GraphQL objects types have names and fields, but at the end of the day, these fields will either have to be other object types, or resolve to some concrete data. This concrete data is represented by [Scalar types](https://graphql.org/learn/schema/#scalar-types). GraphQL comes with its own default set of Scalar types, but different implementations can define their own.

As part of OpenReader, we have developed the `BigInt` Scalar type. This field allows storing much larger numbers than the commonly used `Int`.

Typical `Int` fields are 4 bytes (32 bit) signed integers, which are able to represent numbers between -2147483648 and +2147483648. The `BigInt` scalar type defined in a schema will be mapped to the `numeric` field when creating the SQL table and this field is able to accommodate up to 131072 digits.

A schema defined as such:

```graphql title="schema.graphql"
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


Will result in these tables being created:

```sql
create table account (id text primary key, balance numeric)`,
create table historical_balance (id text primary key, account_id text references account(id), balance numeric, date timestamp)
```

And both `balance` fields will be able to store numbers like `2000000000000000000000000000000000000` and much larger.
