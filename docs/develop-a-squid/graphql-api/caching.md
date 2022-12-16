---
sidebar_position: 12
title: Caching
---

# Caching 

**Available since `@subsquid/graphql-server@3.2.0`**

The GraphQL API server provided by `@subsquid/graphql-server` supports caching via additional flags. The cache is per-query and caches the whole response for a specified amount of time (`maxAge`).


To enable caching when deploying to Aquarium, add the caching flags to `cmd` sections of the [deployment manifest](/deploy-squid/deploy-manifest). Aquarium currently supports only in-memory cache, with Redis-based cache to be supported in the near future.
For example, the snippet below will deploy the GraphQL API server with a `100Mb` in-memory cache and `5` seconds invalidation time:


```yaml title="squid.yaml"
# ...
deploy:
  # other services ...
  api:
    cmd: [ "npx", "squid-graphql-server", "--dumb-cache", "in-memory", "--dumb-cache-ttl", "5000", "--dumb-cache-size", "100", "--dumb-cache-max-age", "5000" ]
```

The following flags can be inspected with `npx squid-graphql-server --help` and are as follows:

### `--dumb-cache <cache-type>`

Enables cache, either `in-memory` or `redis`. For `redis`, a Redis connection string must be set by a variable `REDIS_URL`. Aquarium deployments currently support only `in-memory` cache.

### `--dumb-cache-size <mb>`

Cache max size. Applies only to in-memory cache.

### `--dumb-cache-max-age <ms>`

A globally set cache max age in milliseconds. The cached queries are invalidated after that period of time.

### `--dumb-cache-ttl <ms>`

Time-to-live for in-memory cache entries. Applies only to in-memory cache. The entries are eligible for eviction from the cache if not updated for longer than the time-to-live time.