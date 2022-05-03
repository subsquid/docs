# Schema updates

Over the course of development of an API it is often the case that new things are discovered, requests for changes happen, and so it may happen that a change to the [previously defined schema](define-a-squid-schema.md) is necessary.

The best practice in this case, and strongly advised course of action, would be to follow this checklist:

1. Apply the necessary changes to the schema (add/remove fields, entities, etc.)
2. Regenerate models and build project
3. Create new database migration
4. Apply the database migration

Let's see each one of these steps in detail

## Schema changes

All changes to the schema have to be applied to the `schema.graphql` file in the project's main folder.

Let's say for example we want to take the schema from the squid template and add a `timestamp` field to the `HistoricalBalance` entity. It would be a double of `date` but it would make things easier in the frontend:

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
  timestamp: BigInt!
}

```

## Regenerate models

Now that the schema has been changed, the TypeScript classes representing these entities have to be regenerated. To do so, simply launch this command from the project's main folder:

```
sqd codegen
```

And in the case of the squid template example from previous paragraph, the result should look something like this:

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
  
  @Column_("timestamp", {nullable: false})
  timestamp!: bigint
}

```

Now, it is important to build these new files, to make sure they can be used by the processor when we run it. Simply launch this command to do so:

```bash
npm run build
```

## Create Database migration

Once previous steps are complete, this one is easy enough, simply launch this command in a terminal window from the project's main folder:

```bash
sqd db create-migration [migration-name]
```

And a new file will be added to the `db/migrations` folder.

## Apply the migration

Just as previous step, applying the migration is just a matter of running this command in a terminal window from the project's main folder:

```bash
sqd db migrate
```
