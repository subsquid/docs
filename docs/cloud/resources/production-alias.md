---
sidebar_position: 70
title: Production alias
description: Switch between versions without downtime
---

# Alias to the production endpoint

Version aliasing is used to switch between squid versions without a downtime and updates of the downstream clients. 
Each squid has a canonical production endpoint URL of the form
```bash
https://squid.subsquid.io/<squid name>/graphql
```

To alias a squid version to the production endpoint, use [`sqd prod`](/squid-cli/prod):
```bash
sqd prod <squid name>@<version>
```

Note that after promoting to the production the version-specific endpoint URL of the form
```bash
https://squid.subsquid.io/<squid name>/v/<version>/graphql
```
remains to be available.


## Example

Run
```bash
sqd prod my-squid@v1
```

The squid endpoint will be accessible at `https://squid.subsquid.io/my-squid/graphql`.
