---
sidebar_position: 10
description: Quickstart on how to deploy a squid
---

# Quickstart

This section goes through serverless deployment of an indexing project (*squid*) to [Subsquid Cloud](https://app.subsquid.io).
The deployment is managed by the file `squid.yaml` in the root folder of the squid and defines:

- [squid name and version](/cloud/reference/manifest/#header)
- [which services should be deployed](/cloud/reference/manifest/#deploy) for the squid (e.g. postgres, processor, api, RPC proxy)
- [what resources should be allocated](/cloud/reference/scale) by Cloud for each squid service (only configurable if you deploy to a [Professional organization](/cloud/resources/organizations/#professional-organizations))

:::tip
Make sure to check our [best practices guide](/cloud/resources/best-practices) before deploying to production!
:::

:::tip
Consider our [RPC proxy service](/cloud/resources/rpc-proxy) if your squid requires an endpoint.
:::

## 0. Install Squid CLI

Follow [this guide](/squid-cli/installation), including the optional authentication steps.

:::info 
The manifest-based deployment flow below was introduced in `@subsquid/cli` version `2.x`. 
Follow the [migration guide](/cloud/resources/migration) to upgrade from older versions of `@subsquid/cli`.
:::

## 1. Inspect and deploy using the manifest

Navigate to the squid folder and make sure `squid.yaml` is present in the root. See the [Deploy Manifest page](/cloud/reference/manifest) for a full reference.

To deploy a new version or update the existing one (define in the manifest), run
```bash
sqd deploy .
```

For a full list of available deploy options, inspect [`sqd deploy` help](/squid-cli/deploy).

:::warning
By default your squid will be deployed as _collocated_. Collocated squids are intended for development and prototyping only. They share resources with each other and may have stability issues. For production we strongly recommend to [deploy your squids as dedicated](/cloud/reference/scale/#dedicated) instead.
:::

## 2. Monitor Squid logs

Once the squid is deployed, the GraphQL endpoint is available straight away. Normally one should wait until the squid has processed all historical blocks and is fully in sync.

To inspect the squid logs run

```bash
sqd logs my-new-squid@v0 -f 
```
See the [logging page](/cloud/resources/logging) for more details on how to inspect logs with `sqd`.

You can also read logs on the squid page in [Cloud](https://app.subsquid.io/squids). The page also has credentials for direct database access and some metrics visualizations.

## What's next?

- See how to [update](/squid-cli/deploy) and [kill](/squid-cli/rm) the deployed squid versions.
- See [environment variables](/cloud/resources/env-variables) to add secrets to a squid deployment.
- See the supported options for [`sqd logs`](/squid-cli/logs) such as filtering and log following.
- Learn about [organizations](/cloud/resources/organizations) and [billing](/cloud/pricing).
- Learn how to [scale](/cloud/reference/scale) squids by requesting more resources.
