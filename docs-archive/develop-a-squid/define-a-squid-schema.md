---
description: >-
  The schema will help create database entities, as well as TypeScript classes
  wrapping them, and will be exposed to API clients by the GraphQL server.
---

# Define a Squid Schema

## Overview

In order to build powerful APIs on top of blockchain data, it is very important to have the right Entities to capture and describe transformed data.

Subsquid SDK helps developers by allowing them to define their entities in a dialect of the GraphQL schema definition language enriched with the additional directives and built-in primitive types. The input schema is then passed as input to the `codegen` CLI tool to generate the entity classes for the database and the final GraphQL schema for the API server.

As far as what Entities to define and how they are tied to blockchain Events, Extrinsics, and block information, this needs affinity and knowledge of the blockchain itself, so for this guide, the [squid template](https://github.com/subsquid/squid-template) is going to be taken as an example.

## Define the schema

In this example, the entities we are interested are `Account` and `HistoricalBalance` which leads to the following schema:

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

It's worth noting that the example explores the Kusama blockchain and it is configured to process the `balance.Transfer` event, so these two entities make perfect sense.

## Generate entity classes

The process to generate entity classes from the schema is simple enough, thanks to the Squid SDK `sqd codegen` tool. Simply running the following command in a terminal window from the source folder of the project will start the process:

```bash
sqd codegen
```

The command will:

* Read the `schema.graphql` file and parse it
* Create one model file in `src/model/generated` for each entity encountered

{% hint style="info" %}
It is worth stressing that database migrations have to be executed every time a change is done to the schema, in order for the processor to work correctly).

Migration files are JavaScript files, but should not be modified or executed, the `sqd db migrate` command handles that
{% endhint %}

### Generated models

Here's a look at the generated TypeScript classes:

{% code title="account.model.ts" %}
```typescript
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {HistoricalBalance} from "./historicalBalance.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  /**
   * Account address
   */
  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balance!: bigint

  @OneToMany_(() => HistoricalBalance, e => e.account)
  historicalBalances!: HistoricalBalance[]
}
```
{% endcode %}

{% code title="historicalBalance.model.ts" %}
```typescript
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"

@Entity_()
export class HistoricalBalance {
  constructor(props?: Partial<HistoricalBalance>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  account!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balance!: bigint

  @Column_("timestamp with time zone", {nullable: false})
  date!: Date
}
```
{% endcode %}

As previously mentioned, these classes map to the tables in the database, in a classic [ORM fashion](https://en.wikipedia.org/wiki/Object%E2%80%93relational\_mapping).
