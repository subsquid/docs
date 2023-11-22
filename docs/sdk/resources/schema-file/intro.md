---
sidebar_position: 10
title: Schema file and codegen
description: >-
  Intro to the schema file and the codegen tool
---

# Schema file and codegen

The schema file `schema.graphql` uses a GraphQL dialect to model the target entities and entity relations. The tooling around the schema file is then used to:
- Generate TypeORM entities (with `squid-typeorm-codegen(1)`, see below)
- Generate the database schema from the TypeORM entities (see [db migrations](/store/postgres/db-migrations))
- Present the target data with a rich API served by a built-in [GraphQL Server](/graphql-api). A full API reference is covered in the [Query a Squid](/query-squid) section.

The schema file format is loosely compatible with the [subgraph schema](https://thegraph.com/docs/en/developing/creating-a-subgraph/) file, see [Migrate from subgraph](/migrate/migrate-subgraph) section for details.


## TypeORM codegen

The [`squid-typeorm-codegen(1)`](https://github.com/subsquid/squid-sdk/tree/master/typeorm/typeorm-codegen) tool is used to generate [TypeORM entity](https://typeorm.io/) classes from the schema defined in `schema.graphql`. The most convenient way to run the tool is usually via the `sqd` wrapper:

```bash
sqd codegen
sqd build
```

By default the entity classes are generated in `src/model/generated`.

### Example

A `Foo` entity defined in the schema file:
```graphql title="schema.graphql"
type Foo @entity {
  id: ID!
  bar: String
  baz: BigInt!
}
```
The generated `Foo` entity with TypeORM decorators:
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
