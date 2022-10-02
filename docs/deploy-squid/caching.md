---
sidebar_position: 12
title: Caching
---

# Caching 

**Available since `@subsquid/graphql-server@3.2.0`**

The GraphQL API server supports caching via additional flags. The cache is per-query and caches the whole response for a specified amount of time (`maxAge`).

Aquarium currently supports only in-memory cache, with Redis-based cache to be supported in the near future.

To enable caching, modify the `query-node:start` script in `package.json` of the squid and to `Makefile` (for local runs). The below adds a 100Mb in-memory cache with `maxAge` of `5` seconds:

```json title=package.json
{
  ... 
 "scripts": {
    "build": "rm -rf lib && tsc",
    "db:migrate": "npx squid-typeorm-migration apply",
    "processor:start": "node lib/processor.js",
    "query-node:start": "squid-graphql-server --dumb-cache in-memory --dumb-cache-ttl 5000 --dumb-cache-size 100 --dumb-cache-max-age 5000"
  },
  ...
}
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