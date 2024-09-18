---
sidebar_position: 12
title: Caching
description: Enable caching for faster queries
---

# Caching 

The GraphQL API server provided by `@subsquid/graphql-server` supports caching via additional flags. It is done on a per-query basis. The whole response is cached for a specified amount of time (`maxAge`).

To enable caching when deploying to SQD Cloud, add the caching flags to the `serve:prod` command definition at [`commands.json`](/squid-cli/commands-json), then use that command to run the server in the [deployment manifest](/cloud/reference/manifest/#deploy). Cloud currently supports only in-memory cache.
For example, snippets below will deploy a GraphQL API server with a `100Mb` in-memory cache and invalidation time of `5` seconds:

```json title="commands.json"
...
  "serve:prod": {
    "description": "Start the GraphQL API server with caching and limits",
    "cmd": [ "squid-graphql-server",
      "--dumb-cache", "in-memory",
      "--dumb-cache-ttl", "5000",
      "--dumb-cache-size", "100",
      "--dumb-cache-max-age", "5000" ]
  }
...
```

```yaml title="squid.yaml"
# ...
deploy:
  # other services ...
  api:
    cmd: [ "sqd", "serve:prod" ]
```

Caching flags list is available via `npx squid-graphql-server --help`. Here are some more details on them:

### `--dumb-cache <cache-type>`

Enables cache, either `in-memory` or `redis`. For `redis`, a Redis connection string must be set by a variable `REDIS_URL`. SQD Cloud deployments currently support only `in-memory` cache.

### `--dumb-cache-size <mb>`

Cache max size. Applies only to in-memory cache.

### `--dumb-cache-max-age <ms>`

A globally set max age in milliseconds. The cached queries are invalidated after that period of time.

### `--dumb-cache-ttl <ms>`

Time-to-live for in-memory cache entries. Applies only to in-memory cache. The entries are eligible for eviction from the cache if not updated for longer than the time-to-live time.
