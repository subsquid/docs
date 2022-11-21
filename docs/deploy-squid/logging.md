---
sidebar_position: 11
title: Inspect logs
---

# Logging

Aquarium automatically collects the squid logs emitted by the processor, API server and the database pods. For more details on how to use the built-in logger in the squid processor, logging namespaces and severity flags (via environment variables `SQD_DEBUG`, `SQD_TRACE`, `SQD_INFO`), see the [Logging](/develop-a-squid/logging) page. The environment variables can be passed to the squids during the deployment to the Aquarium, see [Environment Variables](/deploy-squid/env-variables/#environment-variables-1) for details.


To inspect and follow the squid logs from all the squid services, run
```bash
sqd squid logs <name>@<version> -f
```

There are additional flags to filter the logs:
- `-c` allows filtering by the container (can be `processor`, `db`, `db-migrate` and `query-node`)
- `-l` allows filtering by the severity

### Example 

```bash
sqd squid logs squid-substrate-template@v1 -f -c processor -l info
```
