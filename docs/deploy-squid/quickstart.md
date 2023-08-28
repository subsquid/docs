---
sidebar_position: 10
description: Quickstart on how to deploy a squid
---

# Quickstart

This section goes through deploying a squid to [Aquarium](https://app.subsquid.io) -- a cloud API service provided by Subsquid.
The deployment is managed by the file `squid.yaml` in the root folder of the squid and defines:

- the squid name and version
- what services should be deployed for the squid (e.g. postgres, processor, api)
- how the squid should be scaled up if it grows bigger

See the [Deploy Manifest page](/deploy-squid/deploy-manifest) for a full reference.
The scaling option is available only to the Aquairum Premium users. To apply for a Premium account, fill [this form](https://docs.google.com/forms/d/e/1FAIpQLSchqvWxRhlw7yfBlfiudizLJI9hEfeCEuaSlk3wOcwB1HQf6g/viewform?usp=sf_link).

:::warning
Yarn is not supported. Use `npm` to install Squid CLI and manage your squid's dependencies.
:::

## 0. Setup and install Squid CLI

If Squid CLI is not installed, follow [this guide](/squid-cli/installation)

:::info 
The manifest-based deployment flow below was introduced in `@subsquid/cli` version `2.x`. 
Follow the [migration guide](/deploy-squid/migration) to upgrade from older versions of `@subsquid/cli`.
:::

## 1. Inspect and deploy using the manifest

Navigate to the squid folder and make sure `squid.yaml` is present in the root. See the [Deploy Manifest page](/deploy-squid/deploy-manifest) for a full reference.

To deploy a new version or update the existing one (define in the manifest), run
```bash
sqd deploy .
```

For a full list of available deploy options, inspect [`sqd deploy` help](/squid-cli/deploy).

:::warning
By default your squid will be deployed as _collocated_. Collocated squids are intended for development and prototyping only. They share resources with each other and may have stability issues. For production we strongly recommend to [deploy your squids as dedicated](/deploy-squid/scale/#dedicated) instead.
:::

## 2. Monitor Squid logs

Once the squid is deployed, the GraphQL endpoint is available straight away. Normally one should wait until the squid has processed all historical blocks and is fully in sync.

To inspect the squid logs run

```bash
sqd logs my-new-squid@v0 -f 
```

or navigate to the squid page in Aquarium. See the [logging page](/deploy-squid/logging) for more details on how to inspect logs.

## What's next?

- Learn how to [scale](/deploy-squid/deploy-manifest/#scale) the squid by requesting more resources
- See how to [update](/squid-cli/deploy) and [kill](/squid-cli/rm) the deployed squid versions
- See [Secrets and Env variables](/deploy-squid/env-variables) to add secrets and environment variables to a squid deployment.
- See the supported options for [`squid logs`](/squid-cli/logs) such as filtering and log following.
