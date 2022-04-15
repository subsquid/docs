# API Extensions

Squid alows to extend the GraphQL auto-generated schema with custom queries. 
To do that, one can define GraphQL [query resolvers](https://www.apollographql.com/docs/tutorial/resolvers/) in the designated module `src/server-extension/resolvers`. Note that all resolver classes must be exported.

It is convenient to import [TypeGraphQL](https://typegraphql.com/docs/resolvers.html#) and use the annotations provided by the library to define the query arguments and return types.

Custom resolvers are typically used in combination with [TypeORM EntityManager](https://orkhan.gitbook.io/typeorm/docs/entity-manager-api). It is automatically enabled by dependency injection when defined as a constructor argument. 

A custom resolver may then look as follows:

```typescript
import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { MyEntity } from '../../model/generated'

// Define custom GraphQL ObjectType of the query result
@ObjectType()
export class MyQueryResult {
  @Field(() => Number, { nullable: false })
  total!: number

  @Field(() => Number, { nullable: false })
  max!: number

  constructor(props: Partial<MyQueryResult>) {
    Object.assign(this, props);
  }
}

@Resolver()
export class MyResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [MyQueryResult])
  async myQuery(): Promise<MyQueryResult[]> {
    const manager = await this.tx()
    // execute custom SQL query
    const result: = await manager.getRepository(MyEntity).query(
      `SELECT 
        COUNT(x) as total, 
        MAX(y) as max
      FROM my_entity 
      GROUP BY month`)
    return result
  }
}
```

Some great examples of custom Squid resolvers can be spotted in the wild in the [Rubik repo](https://github.com/kodadot/rubick/tree/main/src/server-extension) by KodaDot.

For more examples of resolvers, see [TypeGraphQL repo](https://github.com/MichalLytek/type-graphql/tree/master/examples)