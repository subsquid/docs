---
sidebar_position: 40
title: Subscriptions
description: Subscribe to updates over a websocket
---

# Query subscriptions

**Available since `@subsquid/graphql-server@2.0.0`**

OpenReader supports [GraphQL subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/) via live queries. To use these, a client opens a websocket connection to the server and sends a `subscription` query there. The query body is then repeatedly executed (every 5 seconds by default) and the results are sent to the client whenever they change.

To enable subscriptions, add the additional `--subscriptions` flag to the `squid-graphql-server` startup command. The poll interval is configured with the `--subscription-poll-interval` flag. For details and a full list of available options, run
```bash
npx squid-graphql-server --help
```

For each entity types, the following queries are supported for subscriptions:
- `${EntityName}ById` -- query a single entity
- `${EntityName}s` -- query multiple entities with a `where` filter
Note that despite being [deprecated](/graphql-api/overview/#supported-queries) from the regular query set, `${EntityName}s` queries will continue to be available for subscriptions going forward.

## Local runs

To enable subscriptions for local runs, add the `--subscriptions` flag to the `serve` command at `commands.json`:
```json title=commands.json
      ...
      "serve": {
        "description": "Start the GraphQL API server",
        "cmd": ["squid-graphql-server", "--subscriptions"]
      },
      ...
```
A `ws` endpoint will be available the usual `localhost:<GQL_PORT>/graphql` URL.

## Aquairum deployments

For Aquarium deployments, update the `api` command in the [deployment manifest](/deploy-squid/deploy-manifest/#deploy):

```yaml title="squid.yaml"
# ...
deploy:
  # other services ...
  api:
    cmd: [ "npx", "squid-graphql-server", "--subscriptions" ]
```
The subscription `wss` endpoint will be available at the canonical API endpoint `wss://squid.subsquid.io/{name}/v/v{version}/graphql`.

## Example

Let's take the following simple schema with account and transfer entities:

```graphql file=schema.graphql
type Account @entity {
  "Account address"
  id: ID!
  transfersTo: [Transfer!] @derivedFrom(field: "to")
  transfersFrom: [Transfer!] @derivedFrom(field: "from")
}

type Transfer @entity {
  id: ID!
  timestamp: DateTime! @index
  from: Account!
  to: Account!
  amount: BigInt! @index
}
```

After modifying `commands.json` GraphQL server with subscriptions can be started with
```bash
sqd serve
```

The following sample [script](https://github.com/subsquid/squid-substrate-template/blob/main/scripts/sub-client.js) will subscribe to the most recent transfers (by `timestamp`).

```typescript
const WebSocket = require('ws')
const { createClient } = require('graphql-ws');

const port = process.env.GQL_PORT || 4350
const host = process.env.GQL_HOST || 'localhost'
const proto = process.env.GQL_PROTO || 'ws'


const client = createClient({
  webSocketImpl: WebSocket,
  url: `${proto}://${host}:${port}/graphql`,
});

client.subscribe(
  {
    query: `
    subscription {
        transfers(limit: 5, orderBy: timestamp_DESC) {
            amount
            blockNumber
            from {
              id
            }
            to {
              id
            }
        }
    }  
    `,
  },
  {
    next: (data) => {
      console.log(`New transfers: ${JSON.stringify(data)}`);
    },
    error: (error) => {
      console.error('error', error);
    },
    complete: () => {
      console.log('done!');
    },
  }
);
```
