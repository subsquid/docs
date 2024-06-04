---
title: Deploying Production Squid
description: >-
  Use Subsquid cloud to deploy a production-ready squid
sidebar_position: 30
---

# Deploying Production Squid

## Objective

Here we show how to deploy a production-ready squid to the cloud. This is useful for those who want to deploy their squid to the cloud service instead of running it locally.

## Pre-requisites

- [Subsquid CLI](/squid-cli/installation)
- Docker

## Setup

After you have created your squid and tested it locally, you can deploy it to the cloud. To do this, you need to have a Subsquid account and a project created in the Subsquid cloud.

## Registering a Subsquid account

You can register a Subsquid account by visiting the [Subsquid cloud](https://app.subsquid.io/squids). Click on the `Sign Up` button and fill in the required information, or sign in with your GitHub or Google account.

## Prepare the squid for deployment

Before deploying the squid, you need to make sure that the squid is ready for deployment. This includes:

- Making sure that the squid is working as expected locally
- Updating the `squid.yaml` file with the correct values for the cloud deployment
- Setting up secrets for the cloud deployment

## Edit the `squid.yaml` file

First, set squid name, description, and other metadata in the header section of the `squid.yaml` file.

Next, configure your `build` options.

Finally, edit the `deployment` section to specify the deployment options.

### Using addons

Subsquid provides RPC and database addons that can be used to deploy your squid. To use these addons, you need to specify the addon name in the `addons` section of the `squid.yaml` file.

For real time data, you can use the `rpc` addon. To use the `rpc` addon, first open the `RPC endpoints` tab in the Subsquid cloud sidebar and copy the choose an endpoint.

![RPC proxy tab](/img/rpc.png)

Add the chosen endpoint to the `.env` file.

```bash
RPC_ARBITRUM_ONE_HTTP=<endpoint-url>
```

Enable the RPC proxy in the `addons` section:

```yaml
deploy:
  addons:
    rpc:
      - arbitrum-one.http
```

To use this endpoint in your squid, you need to set RPC endpoint like so in `main.ts`:

```typescript
import { assertNotNull } from "@subsquid/util-internal";

export const processor = new EvmBatchProcessor().setRpcEndpoint(
  assertNotNull(
    process.env.RPC_ARBITRUM_ONE_HTTP,
    "Required env variable RPC_ARBITRUM_ONE_HTTP is missing"
  )
);
// ...the rest of the processor configuration
```

This configuration will use the Arbitrum RPC endpoint provided by Subsquid.

You can also opt in to use the `database` addon. To use the `database` addon, add the following to the `addons` section both under `deploy` and `scale`:

```yaml
scale:
  addons:
    postgres:
      storage: 100G
      profile: medium
deploy:
  addons:
    postgres:
```

### Services

Squids come with a GraphQL service out-of-the-box. You can enable or disable the service by setting the `service` option in the `deploy` section of the `squid.yaml` file. You can also set the scale and number of replicas for the service.

```yaml
api:
  profile: large
  # load-balance three replicas
  replicas: 3
```

### Processor

Next, set the scale of the indexer processor. You can set the profile to `small`, `medium`, or `large`.

```yaml
processor:
  profile: medium
```

### Dedicated deployment

By default, all squids are collocated, meaning that the squid shares resources with other collocated squids. In this case, computing resources might not be available at all times. It is strongly discouraged to use collocated squids for production purposes.

To deploy a dedicated squid, you need to set the `dedicated` option to `true` in the `scale` section of the `squid.yaml` file.

```yaml
scale:
  dedicated: true
```

### Resulting `squid.yaml`

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

For all deployment options, check out the [deployment manifest](../../reference/manifest/) page.

## Setting secrets

If your squid uses environment variables, stored in `.env` file, you need to set them up in the Subsquid cloud. You can do this by going to the `Secrets` tab in the Subsquid cloud sidebar and adding the required values.

![secrets tab](/img/secret1.png)

![secrets tab](/img/secret2.png)

## Deploy the squid

To deploy the squid to the cloud, open `Squids` in the sidebar and press the `Deploy a squid` button in the Subsquid cloud.
You will be prompted to install the Subsquid CLI if you haven't already. Follow the instructions to install the CLI.
Next, set up your auth key as shown in the Subsquid cloud.

Type the squid name to be the same as in the `squid.yaml` file.
Finally, copy and paste the command provided in the Subsquid cloud to deploy the squid:

```bash
sqd deploy --org subsquid ./{{squid-name}}
```

## Monitor the squid

After deploying the squid, you can monitor its status in the Subsquid cloud. You can see the logs, metrics, and other information about the squid in the cloud dashboard.

Open the monitoring tab in the Subsquid cloud sidebar to see the status of your squid.

Deployed quids are available in the `Squid` tab.

![deployed tab](/img/deployed.png)

You can see memory usage, CPU usage, and other metrics in the monitoring tab. Here is an example of the monitoring tab:
![monitoring tab](/img/monitor.png)
