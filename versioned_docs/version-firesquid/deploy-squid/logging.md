---
sidebar_position: 50
title: Inspect logs
description: Inspect the deployment logs
---

# Logging

**Since `@subsquid/cli@2.0.0`**

Aquarium automatically collects the squid logs emitted by the processor, API server and the database pods. For more details on how to use the built-in logger in the squid processor, logging namespaces and severity flags (via environment variables `SQD_DEBUG`, `SQD_TRACE`, `SQD_INFO`), see the [Logging](/basics/logging) page. The environment variables can be passed to the squids during the deployment to the Aquarium, see [Environment Variables](/deploy-squid/env-variables/#environment-variables-1) for details.


To inspect and follow the squid logs from all the squid services, use [`sqd logs`](/squid-cli/logs):
```bash
sqd logs <name>@<version> -f
```

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

