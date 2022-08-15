---
<<<<<<< HEAD
sidebar_position: 11
=======
sidebar_position: 30
>>>>>>> 5dd0c2b (add secrets and env variables page)
title: Environment variables
---

# Environment variables

**Available since `@subsquid/cli@0.6.0`**

Aquarium supports adding environment variables to the squid deployments. There are two different options: via `secrets` and adding `-e` to `squid update` or `squid release`. The crucial difference is that the `secrets` are *persistent* and *global*, while environments variables set with `-e` are only set for the specific squid version. 

## Secrets 

Secrets are designed to store sensitive data that all the squids can access as an environment variable with the given name. A typical usage is an API key or a private URL for a chain gRPC endpoint. The secrets are global and are defined at the Aquarium account level, meaning that it is exposed to all the squids and the squid versions. 

To add or update a secret:
```bash
npx sqd secrets set MOONRIVER_GRPC_ENDPOINT wss://moonriver.my-endpoint.com/ws
```

Once set, it can be used in a squid:
```typescript
const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive("moonriver", {release: "FireSquid"}),
        chain: process.env.MOONRIVER_GRPC_ENDPOINT
    })
```

:::warning
Note, that any changes to the secret set take effect only when a squid is restarted or redeployed with `sqd squid:update`.
:::

Inspect, remove and update the secrets with `npx sqd secrets ls`, `npx sqd secrets rm` and `npx sqd secrets update` respectively. 

## Environment variables

Squid-specific environment variables can be passed with the `-e` flag available for `npx sqd squid:update` and `npx sqd squid:release`. A typical usage is to change the [log level](/develop-a-squid/logging) by setting the `SQD_DEBUG` or `SQD_TRACE` variable.

One can also pass a property file using `--envFile` flag.

**Example:**

Set the log level to `TRACE` in the squid mappings and set `FOO_VARIABLE=bar`:
```bash
npx sqd squid:update squid-template@v1 -e SQD_TRACE=sqd:processor:mapping -e FOO_VARIABLE=bar
```

The variables set with the `-e` flag are removed when the squid version is deleted or redeployed.