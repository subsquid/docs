---
sidebar_position: 12
title: Promote to production
---

# Promote to production endpoint

Each squid has a canonical production endpoint URL of the form
```bash
https://squid.subsquid.io/<squid name>/graphql
```

To assign a squid version to the production endpoint use 
```bash
sqd squid:prod <squid name>@<version>
```

Note that after promoting to the production the version-specific endpoint URL of the form
```bash
https://squid.subsquid.io/<squid name>/v/<version>/graphql
```
remains to be available.


## Example

Run
```bash
sqd squid:prod my-squid@v1
```

The squid endpoint will be accessible at `https://squid.subsquid.io/my-squid/graphql`.