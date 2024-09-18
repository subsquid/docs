---
sidebar_position: 10
title: Deployment workflow
description: >-
  Run a production-ready squid in Cloud
---

# Deployment workflow

Here we show how to deploy a production-ready indexer ("squid") to SQD Cloud. See [Development flow](/sdk/how-to-start/squid-development) and the rest of the [Indexing SDK](/sdk) section for more info on how to develop one of these.

**Pre-requisites:** Docker, [Squid CLI](/squid-cli/installation)

## 1. Prepare the squid for deployment

Make sure that the squid is ready for deployment. This includes:

- Verifying that the squid is working as expected locally.
- Ensuring that the squid is free of any major performance issues. See [Best practices](/cloud/resources/best-practices) for guidance.
- Updating the `squid.yaml` file (a.k.a. "deployment manifest") with the correct values for your use case.
- Setting up SQD Cloud secrets if necessary.

## 2. Register a SQD account

You can register a SQD account by visiting the [SQD cloud](https://app.subsquid.io). Click `Create an account` and fill in the required information, or sign in with your GitHub or Google account.

## 3. Edit the `squid.yaml` file

### 3.1. Basic configuration

First, set squid name, description, and other metadata in the [header section](/cloud/reference/manifest/#header) of the `squid.yaml` file.

If necessary, configure your [`build` options](/cloud/reference/manifest/#build) next. If the defaults - NodeJS v20 and `npm` for package manager - work for you, just create an empty `build` section.

Finally, edit the [`deploy` section](/cloud/reference/manifest/#deploy) to specify the deployment options.

The resulting configuration file may look like this:

```yaml
manifest_version: subsquid.io/v0.1
name: sample-squid

build:

deploy:
  processor:
    cmd: ["sqd", "process:prod"]
  api:
    cmd: ["sqd", "serve:prod"]
```

### 3.2. Using addons

SQD provides RPC and database addons that can be used with your squid deployment. Enable your addons in the `deploy.addons` section.


#### `rpc` addon

For real time data you can use the [`rpc` addon](/cloud/resources/rpc-proxy). First, open the `RPC endpoints` tab in the SQD cloud sidebar and copy the URL of the chosen endpoint.

![RPC addon tab](./overview-rpc-page.png)

Add it to the `.env` file:

```bash
RPC_ARBITRUM_ONE_HTTP=<endpoint-url>
```

This allows using the Cloud RPC in local runs. To make the same endpoint available in Cloud, enable the addon in the `addons` section:

```yaml
deploy:
  addons:
    rpc:
      - arbitrum-one.http
```

To use this endpoint in your squid, set the RPC endpoint like so in `src/main.ts`:

```typescript
import { assertNotNull } from '@subsquid/util-internal'

export const processor = new EvmBatchProcessor().setRpcEndpoint(
  assertNotNull(
    process.env.RPC_ARBITRUM_ONE_HTTP,
    'Required env variable RPC_ARBITRUM_ONE_HTTP is missing'
  )
);
// ...the rest of the processor configuration
```

This configuration will use the Arbitrum RPC endpoint provided by SQD.

#### `database` addon

You can also opt in to use the [`database` addon](/cloud/reference/pg). Add `postgres:` to the `deploy.addons` section:

```yaml
deploy:
  addons:
    postgres:
```
You should also configure the [`scale` section for the addon](/cloud/reference/pg/#scaling) when deploying to production, e.g.:

```yaml
scale:
  addons:
    postgres:
      storage: 100G
      profile: medium
```

### 3.3. Services

Squids come with a GraphQL service out-of-the-box. You can enable or disable the service by adding or removing the `deploy.api` section of the `squid.yaml` file. In the `scale` section you can also set the scale and number of replicas for the service.

```yaml
deploy:
  api:
    cmd: ["sqd", "serve:prod"]
scale:
  api:
    profile: large
    # load-balance three replicas
    replicas: 3
```

### 3.4. Processor scale

Next, set the scale of the indexer processor. You can set the profile to `small`, `medium`, or `large`.

```yaml
scale:
  processor:
    profile: medium
```

### 3.5. Dedicated deployment

By default, all squids are collocated, meaning that the squid shares resources with other collocated squids. In this case, computing resources might not be available at all times.

:::danger
We strongly discourage using collocated squids in production.
:::

To deploy a dedicated squid, you need to set the `dedicated` option to `true` in the `scale` section of the `squid.yaml` file.

```yaml
scale:
  dedicated: true
```

### 3.6. The resulting `squid.yaml`

Here is an example of a `squid.yaml` file with all the options set:

```yaml
manifest_version: subsquid.io/v0.1
name: sample-squid

build:

deploy:
  addons:
    postgres:
    rpc:
      - arbitrum-one.http
  processor:
    cmd: ["sqd", "process:prod"]
  api:
    cmd: ["sqd", "serve:prod"]

scale:
  # dedicated deployment
  dedicated: true
  addons:
    postgres:
      storage: 100G
      profile: medium
  processor:
    profile: medium
  api:
    profile: large
    # load-balance three replicas
    replicas: 3
```

For all deployment options, check out the [deployment manifest](/cloud/reference/manifest) page.

## 4. Set any required secrets

If your squid uses any sensitive data such as a private URL or an access key, you need to store it in a [SQD Cloud secret](/cloud/resources/env-variables/#secrets). You can do this by going to the `Secrets` tab in the SQD cloud sidebar and adding the required values.

![secrets tab](./overview-secret1.png)

![secrets tab](./overview-secret2.png)

Alternatively, use [`sqd secrets`](/squid-cli/secrets).

## 5. Deploy the squid

To deploy the squid to the cloud, open `Squids` in the sidebar and press the `Deploy a squid` button in the SQD cloud.

![deploy tab](./overview-deploy2.png)

You will be prompted to install the Squid CLI if you haven't already. Follow the instructions to install the CLI.
Next, set up your auth key as shown in the SQD cloud.
Type the squid name to be the same as in the `squid.yaml` file.

Finally, deploy the squid:

```bash
sqd deploy --org <your_organization> <path_to_squid_project_root>
```

## 6. Monitor the squid

:::tip
Take a look at [logging page](/cloud/resources/logging) for tips on emitting and reading logs.
:::

After deploying the squid, you can monitor its status in SQD Cloud. You can see the logs, metrics, and other information about the squid in the Cloud dashboard.

Open the monitoring tab in the SQD cloud sidebar to see the status of your squid.

Deployed quids are available in the `Squid` tab.

![deployed tab](./overview-deployed.png)

You can see memory usage, CPU usage, and other metrics in the monitoring tab. Here is an example of the monitoring tab:

![monitoring tab](./overview-monitor.png)

## 7. Use the squid

If your squid uses a database, you'll have direct access. Take a look at the `DB access` tab of your squid's card in SQD Cloud console.

If your squids serves a GraphQL API, you'll be able to access it via a deployment-based URL or via a permanent squid-specific URL that redirects to a particular deployment. See [Production alias](/cloud/resources/production-alias).

## What's next?

- See how to [update](/squid-cli/deploy) or [kill](/squid-cli/rm) a deployed squid version.
- Learn about [organizations](/cloud/resources/organizations) and [pricing](/cloud/pricing).
