---
sidebar_position: 21
title: Schema file and codegen
description: >-
  The schema file defines the data model and API
---

# Schema file and codegen

The schema file `schema.graphql` uses a GraphQL dialect to model the target entities and the entity relations. The schema file also defines the GraphQL API of the squid. A full reference of the schema file dialect and the zero-config GraphQL server can be found in the [GraphQL API section](/graphql-api).

## TypeORM codegen

The [`squid-typeorm-codegen(1)`](https://github.com/subsquid/squid-sdk/tree/master/typeorm/typeorm-codegen) tool is used to generate[TypeORM entity](https://typeorm.io/) classes from the schema defined in `schema.graphql`. To generate the entity classes from the schema, run

```bash
npx squid-typeorm-codegen
npm run build
```

The entity classes are generated in `src/model/generated` by default. 

### Example

The entity defined in the schema file:
```graphql title="schema.graphql"
type Foo @entity {
  id: ID!
  bar: String
  baz: BigInt!
}
```
The generated entity with TypeORM decorators:
```ts title="src/model/generated/foo.ts"
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Foo {
    constructor(props?: Partial<Foo>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    bar!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    baz!: bigint
}
```