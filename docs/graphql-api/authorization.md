---
sidebar_position: 60
title: Access control
description: Authentication and authorization
---

# Access control

GraphQL APIs served by `@subsquid/graphql-server` can be extended to support authentication and authorization. This functionality was not a part of the original design, so using it in production is generally discouraged. The feature is offered for use in early prototypes.

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
1. if the function returns `true`, the request is processed as usual;
2. if the function returns `false`, the server responds with `'{"errors":[{"message":"not allowed"}]}'`;
3. if the function returns an `errorString`, the server responds with `` `{{"errors":[{"message":"${errorString}"}]}` ``.

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
1. `http` field contains the low level HTTP info. Information on headers is stored in a `Map` from lowercase header names to values. For example, `req.http.headers.get('authorization')` is the value of the authorization header.
2. `operation` is the root [`OperationDefinitionNode`](https://graphql-js.org/api/interface/OperationDefinitionNode) of the tree describing the query. Useful if the authorization decision depends on the query contents.
3. `operationName` is the query name.
4. `schema` is a [`GraphQLSchema`](https://graphql-js.org/api/class/GraphQLSchema) object.
5. `context` holds a [`PoolOpenreaderContext`](https://github.com/subsquid/squid-sdk/blob/master/graphql/openreader/src/db.ts) at `context.openreader`. It can be used to access the database, though this is highly discouraged: the interfaces involved are considered to be internal and are subject to change without notice.
6. `model` is an Openreader data [`Model`](https://github.com/subsquid/squid-sdk/blob/master/graphql/openreader/src/model.ts).

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
A more elaborate example with two users authorized to perform different query sets is available in [this repo](https://github.com/subsquid-labs/access-control-example).
