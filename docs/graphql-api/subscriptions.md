---
sidebar_position: 20
title: Subscriptions
---

# Query subscriptions

**Available since `@subsquid/graphql-server@2.0.0`**

:::info
This is an experimental feature. Reach out on [Squid Devs Chat](https://t.me/HydraDevs) for more details.
:::

The OpenReader supports [GraphQL subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/) via live queries. The query is repeatedly executed (every 5 seconds by default) and the clients are responsible for handling the result set updates. 

To enable subscriptions, add the additional `--subscriptions` flag to the `squid-graphql-server` startup command. The subscriptions will be available at the standard squid endpoint but with the `wss://` protocol. For a full list of available options for the graphql server, run 
```bash
npx squid-graphql-server --help
```

For each entity types, the following queries are supported for subscriptions:
- `${EntityName}ById` -- query a single entity
- `${EntityName}s` -- query multiple entities with a `where` filter

## Local runs

To enable subscriptions for local run, add the `--subsrciptions` flag to the `serve` command `commands.json`:
```json title=commands.json
      ...
      "serve": {
        "description": "Start the GraphQL API server",
        "cmd": ["squid-graphql-server", "--subscriptions"]
      },
      ...
```


## Aquairum deployments

For Aquarium deployments, update the `api` command in the [deployment manifest](/deploy-squid/deploy-manifest/#deploy):

```yaml title="squid.yaml"
# ...
deploy:
  # other services ...
  api:
    cmd: [ "npx", "squid-graphql-server", "--subscriptions" ]
```


## Example

Let's take the following simple schema reprsenting accounts and transfers:

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

Run the GraphQL server with subscriptions:
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
