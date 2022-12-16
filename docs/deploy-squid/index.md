---
sidebar_position: 70
title: Deploy a Squid
---


# Deploy a squid

This section goes through deploying a squid to [Aquarium](https://app.subsquid.io) -- a cloud API service provided by Subsquid.
The deployment is managed by the file `squid.yaml` in the root folder of the squid and defines:

- the squid name and version
- what services should be deployed for the squid (e.g. postgres, processor, api)
- how the squid should be scaled up if it grows bigger

See the [Deploy Manifest page](/deploy-squid/deploy-manifest) for a full reference.

# 0. Setup and install Squid CLI

If Squid CLI is not installed, see the [Squid CLI doc](/squid-cli)

:::info 
The manifest-based deployment flow below was introduced in `@subsquid/cli` version `1.x`. 
Follow the [migration guide](/deploy-squid/migration) to upgrade from `@subsquid/cli` version `0.x`.
:::



## 1. Inspect and deploy using the manifest

Navigate to the squid folder and make sure `squid.yaml` is present in the root. See the [Deploy Manifest page](/deploy-squid/deploy-manifest) for a full reference.

To deploy a new version or update the existing one (define in the manifest), run
```bash
sqd deploy .
```

For a full list of availbale deploy options, inspect `sqd deploy --help`.

## 2. Monitor Squid logs

Once the squid is deployed, the GraphQL endpoint is available straight away. Normally one should wait until the squid has processed all historical blocks and is fully in sync.

To inspect the squid logs run

```bash
sqd squid logs my-new-squid@v0 -f 
```

or navigate to the squid page in Aquarium.

## What's next?

- Learn how to [scale](/deploy-squid/deploy-squid/deploy-manifest/#scale) the squid by requesting more resources
- See how to [update](/squid-cli/deploy) and [kill][update](/squid-cli/rm) the deployed squid versions
- See [Secrets and Env variables](/deploy-squid/env-variables) to add secrets and environment variables to a squid deployment.
- See the supported options for [`squid logs`](/squid-cli/logs) such as filtering and log following.
