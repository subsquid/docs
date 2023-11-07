---
sidebar_position: 80
title: Environment variables
description: |- 
  Add secrets and custom env variables
---

# Environment variables

Subsquid Cloud supports adding environment variables to the squid deployments. There are two kinds: **secrets** and **environment variables**. The crucial difference is that the secrets are injected to all squids, while environments variables are set only to a specific version deployment. Environment variables are stored in plain text so **all the sensitive input (e.g. API keys) must be set as a secret**.

Secrets are set using the special command [`sqd secrets`](/squid-cli/secrets), while environment variables are set in the [deployment manifest](/deploy-squid/deploy-manifest).

## Secrets 

Secrets are designed to store sensitive data that all the squids can access as an environment variable with the given name. A typical usage is an API key or a private URL for a chain gRPC endpoint. The secrets are defined at the Cloud [organization](../organizations) level and are exposed to all organization squids that [request them in their manifest](../deploy-manifest/#secrets).

To add a secret:
1. Create it in the Cloud:
   ```bash
   sqd secrets set MOONRIVER_GRPC_ENDPOINT wss://moonriver.my-endpoint.com/ws/my-secret-key
   ```
2. Add it to the [manifest](../deploy-manifest):
   ```yaml
   deploy:
     secrets:
       - MOONRIVER_GRPC_ENDPOINT
   ```
   Note: a deployment requesting a secret unknown to the Cloud will fail.
3. Access in the squid with `process.env`:
   ```ts
   const processor = new EvmBatchProcessor()
       .setDataSource({
           archive: lookupArchive("moonriver", { type: 'EVM' }),
           chain: {
             url: process.env.MOONRIVER_GRPC_ENDPOINT,
             rateLimit: 1000rps
           }
       })
   ```

Inspect, remove and update the secrets using the [`sqd secrets`](/squid-cli/secrets) command.

:::info
Any changes to secrets will take effect only when the squid is restarted with [`sqd deploy`](/squid-cli/deploy).
:::

## Environment variables

Squid-specific environment variables should be defined in the [deployment manifest](/deploy-squid/deploy-manifest).

**Example**

```yaml title="squid.yaml"
# ...
deploy:
  # ...
  processor:
    env:
      SQD_DEBUG: 
        sqd:mapping
    cmd: [ "sqd", "process:prod" ]
# ....
```



