---
sidebar_position: 40
title: Subscriptions
description: Subscribe to updates over a websocket
---

# Query subscriptions

**Available since `@subsquid/graphql-server@2.0.0`**

:::info
This is an experimental feature. Reach out to us at [Squid Devs Chat](https://t.me/HydraDevs) for more details.
:::

OpenReader supports [GraphQL subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/) via live queries. To use these, a client opens a WebSocket Secure connection to the server and sends a `subscription` query there. The query body is then repeatedly executed (every 5 seconds by default) and the results are sent to the client whenever they change.

To enable subscriptions, add the additional `--subscriptions` flag to the `squid-graphql-server` startup command. For Aquarium deployments, update the `api` command in the [deployment manifest](/deploy-squid/deploy-manifest/#deploy):

```yaml title="squid.yaml"
# ...
deploy:
  # other services ...
  api:
    cmd: [ "npx", "squid-graphql-server", "--subscriptions" ]
```

For local development, update `commands.json` accordingly:
```json
...
    "serve": {
      "description": "Start the GraphQL API server",
      "cmd": [ "squid-graphql-server", "--subscriptions" ]
    },
...
```

The subscriptions will be available at the standard squid endpoint URL but with the `wss://` protocol.

For each entity type, the following queries are supported for subscriptions:
- `${EntityName}ById` -- query a single entity
- `${EntityName}s` -- query multiple entities with a `where` filter
Note that despite being [deprecated](/graphql-api/overview/#supported-queries) from the regular query set, `${EntityName}s` queries will continue to be available for subscriptions going forward.

**Example** 

The `squid-substrate-template` repo contains a sample [script](https://github.com/subsquid/squid-substrate-template/blob/main/scripts/sub-client.js) to demonstrate how to subscribe to the five most recent transfers on Kusama:

```typescript
const client = createClient({
  webSocketImpl: WebSocket,
  url: `wss://localhost:4350/graphql`,
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
