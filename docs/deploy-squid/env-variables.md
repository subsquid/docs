---
sidebar_position: 80
title: Environment variables
description: |- 
  Add secrets and custom env variables
---

# Environment variables

**Available since `@subsquid/cli@0.6.0`**

Aquarium supports adding environment variables to the squid deployments. There are two kinds: **secrets** and **environment variables**. The crucial difference is that the secrets are injected to all squids, while environments variables are set only to a specific version deployment. Environment variables are stored in plain text so **all the sensitive input (e.g. API keys) must be set as a secret**.

Secrets are set using the special command [`sqd secrets`](/squid-cli/secrets), while environment variables are set in the [deployment manifest](/deploy-squid/deploy-manifest).

## Secrets 

Secrets are designed to store sensitive data that all the squids can access as an environment variable with the given name. A typical usage is an API key or a private URL for a chain gRPC endpoint. The secrets are global and are defined at the Aquarium account level, meaning that it is exposed to all the squids and the squid versions. 

To add or update a secret:
```bash
sqd secrets set MOONRIVER_GRPC_ENDPOINT wss://moonriver.my-endpoint.com/ws/my-secret-key
```

Once set, it can be accessed in a squid with `process.env`:
```typescript
const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive("moonriver", { type: 'EVM' }),
        chain: process.env.MOONRIVER_GRPC_ENDPOINT
    })
```

The secrets required by the squid must be defined in the [deployment manifest](/deploy-squid/deploy-manifest) in the 
`deploy.secrets:` section. If any of the requested secrets is not set, the deployment will fail.

**Example**

```yaml title="squid.yaml"
#...
deploy:
  # the set of secrets that must be set and provided by Aquarium
  # the secrets are exposed to all the deployed services
  secrets:
    - MOONRIVER_GRPC_ENDPOINT
    - COINGECKO_API_KEY
  processor:
    # processor service deployment
  api:
    # api service deployment
```

:::warning
Note, that any changes take effect only when the squid is restarted or redeployed with `sqd deploy .`.
:::

Inspect, remove and update the secrets using the [`sqd secrets`](/squid-cli/secrets) command.

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
    cmd: [ "node", "lib/processor" ]
# ....
```



