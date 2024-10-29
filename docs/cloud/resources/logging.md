---
sidebar_position: 30
title: Inspect logs
description: Inspect the deployment logs
---

# Logging

SQD Cloud automatically collects the logs emitted by the squid processor, its API server and its database. Please use the [built-in SDK logger](/sdk/reference/logger) throughout your code when developing for SQD Cloud. You can set the severity flags for squids running in the Cloud via `SQD_DEBUG`, `SQD_TRACE` or `SQD_INFO` - see [Environment Variables](/cloud/resources/env-variables).

To inspect and follow the squid logs from all the squid services, use [`sqd logs`](/squid-cli/logs):
```bash
sqd logs -n <name> -s <slot> -f
```
or
```bash
sqd logs -n <name> -t <tag> -f
```
<details>

<summary>For older version-based deployments...</summary>

...the slot string is `v${version}`, so use
```bash
sqd logs -n <name> -s v<version> -f
```
Check out the [Slots and tags guide](/cloud/resources/slots-and-tags) to learn more.

</details>

There are additional flags to filter the logs:
- `-f` to follow the logs
- `-c` allows filtering by the container (can be `processor`, `db`, `db-migrate` and `query-node`)
- `-l` allows filtering by the severity
- `-p` number of lines to fetch (default: `100`)
- `--since` cut off by the time (default: `1d`). Accepts the notation of the [`ms` library](https://www.npmjs.com/package/ms): `1d`, `10h`, `1m`.

### Example 

```bash
sqd logs squid-substrate-template@v1 -f -c processor -l info --since 1d
```

