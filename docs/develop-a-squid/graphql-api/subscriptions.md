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

