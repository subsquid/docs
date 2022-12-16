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

To enable subscriptions, add the additional `--subscriptions` flag to the `squid-graphql-server` startup command. For Aquarium deployments, update the `api` command in the [deployment manifest](/deploy-squid/deploy-manifest/#deploy):

```yaml title="squid.yaml"
# ...
deploy:
  # other services ...
  api:
    cmd: [ "npx", "squid-graphql-server", "--subscriptions" ]
```

For local development, update accordingly the `Makefile` and the scripts in `package.json`:
```bash title=Makefile
...
serve:
	@npx squid-graphql-server --subscriptions
...
```

For each entity types, the following queries are supported for subscriptions:
- `${EntityName}ById` -- query a single entity
- `${EntityName}s` -- query multiple entities with a `where` filter

**Example** 

The squid-substrate-template has a sample [script](https://github.com/subsquid/squid-substrate-template/blob/main/scripts/sub-client.js) to demonstrate how to subscribe to the five most recent transfers on Kusama:

```typescript
const client = createClient({
  webSocketImpl: WebSocket,
  url: `ws://localhost:4350/graphql`,
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
