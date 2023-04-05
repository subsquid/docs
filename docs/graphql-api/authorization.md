---
sidebar_position: 60
title: Access control
description: Authentication and authorization
---

# Access control

To implement access control, define the following function in the designated `src/server-extension/check` module:
```typescript
import {
  RequestCheckContext
} from '../../node_modules/@subsquid/graphql-server/src/check'

export async function requestCheck(
  req: RequestCheckContext
): Promise<boolean | string> {
  ...
}
```
Once defined, this function will be called every time a request arrives. Then,
* if the function returns `true`, the request is processed as usual;
* if the function returns `false`, the server responds with `'{"errors":[{"message":"not allowed"}]}'`;
* if the function returns an `errorString`, the server responds with `` `{{"errors":[{"message":"${errorString}"}]}` ``.

The request information such as HTTP headers and GraphQL selections is available in the context. This makes it possible to authenticate the user that sent the query and either allow or deny access. The decision may take the query contents into account, allowing for some authorization granularity.

## `RequestCheckContext`

The context type has the following interface:
```typescript
RequestCheckContext {
  http: {uri: string, method: string, headers: HttpHeaders}
  operation: OperationDefinitionNode
  operationName: string | null
  schema: GraphQLSchema
  context: Record<string, any>
  model: Model
}
```
Here,
* `http` field contains the low level HTTP info. Information on headers is stored in a `Map` from lowercase header names to values. For example, `req.http.headers.get('authorization')` is the value of the authorization header.
* `operation` is the root [`OperationDefinitionNode`](https://graphql-js.org/api/interface/OperationDefinitionNode) of the tree describing the query. Useful if the authorization decision depends on the query contents.
* `operationName` is the query name.
* `schema` is a [`GraphQLSchema`](https://graphql-js.org/api/class/GraphQLSchema) object.
* `context` holds a [`PoolOpenreaderContext`](https://github.com/subsquid/squid-sdk/blob/master/graphql/openreader/src/db.ts) at `context.openreader`. It can be used to access the database, though this is highly discouraged: the interfaces involved are considered to be internal and are subject to change without notice.
* `model` is an Openreader data [`Model`](https://github.com/subsquid/squid-sdk/blob/master/graphql/openreader/src/model.ts).

## Sending user data to resolvers

Authentication data such as user name can be passed from `requestCheck()` to a [custom resolver](/graphql-api/custom-resolvers/) through Openreader context:
```typescript
export async function requestCheck(req: RequestCheckContext): Promise<boolean | string> {
  ...
  // obtain user name e.g. by decoding the authentication header
  let user = ...
  // save user name to Openreader context
  req.context.openreader.user = user
  ...
}
```
A custom resolver that retrieves it may look like this:
```typescript
@Resolver()
export class UserCommentResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [UserCommentCountQueryResult])
  async countUserComments(
    @Ctx() ctx: any
  ): Promise<UserCommentCountQueryResult[]> {
    let user = ctx.openreader.user
    let manager = await this.tx()
    let result: UserCommentCountQueryResult[] =
      await manager
        .getRepository(UserComment)
        .query(`
          SELECT COUNT(*) as total
          FROM user_comment
          WHERE "user" = '${user}'
        `)
    return result
  }

  @Mutation(() => Boolean)
  async addComment(
    @Arg('text') comment: string,
    @Ctx() ctx: any
  ): Promise<Boolean> {
    let user = ctx.openreader.user
    let manager = await this.tx()
    await manager.save(new UserComment({
      id: `${user}-${comment}`,
      user,
      comment
    }))
    return true
  }
}
```
See full code in [this branch](https://github.com/subsquid-labs/access-control-example/tree/interacting-with-resolver).

This approach does not work with [subscriptions](/graphql-api/subscriptions/).

## Examples

A simple strategy that authorizes anyone with a `12345` token to perform any query can be implemented with
```typescript title="src/server-extension/check.ts"
import {
  RequestCheckContext
} from '../../node_modules/@subsquid/graphql-server/src/check'

export async function requestCheck(
  req: RequestCheckContext
): Promise<boolean | string> {
  return req.http.headers.get('authorization')==='Bearer 12345'
}
```
A more elaborate example with two users authorized to perform different query sets is available in [this repo](https://github.com/subsquid-labs/access-control-example). Another great example of using `requestCheck()` for authorization can be [spotted in the wild](https://github.com/reef-defi/reef-subsquid-processor/tree/master/src/server-extension) in the code of a squid used by [Reef](https://reef.io).
