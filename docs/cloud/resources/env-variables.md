---
sidebar_position: 20
title: Environment variables
description: |- 
  Variables, contexts, secrets
---

:::info
Store all your sensitive inputs (API keys, passwords etc) as [secrets](#secrets).
:::

SQD Cloud supports adding environment variables to squid deployments. The variables can be defined as key-value pairs at any of the `env:` sections of the [manifest](/cloud/reference/manifest).

For example, here is how to add a variable that will be visible only to the [squid processor](/cloud/reference/manifest/#processor):
```yaml title="squid.yaml"
deploy:
  processor:
    env:
      MY_PROCESSOR_VAR: string_value
```
You can also add variables visible only to the [GraphQL server](/cloud/reference/manifest/#api) or to the [migration script](/cloud/reference/manifest/#migrate).

There is also an option to add variables [for all services](/cloud/reference/manifest/#env):
```yaml title="squid.yaml"
deploy:
  env:
    MY_SQUIDWIDE_VAR: string_value
```

Variables can be assigned either to strings, or to member variables of [contexts](#contexts) provided by the service. For example, to make a processor-scoped `API_KEY` variable and populate it with the value of `secrets.API_KEY`, do this:
```yaml title="squid.yaml"
deploy:
  processor:
    env:
      RPC_ENDPOINT: ${{ secrets.API_KEY }}
```

## Variable shadowing

There is one special case in which the variables defined in the manifest will get overwritten by the Cloud: [database connection settings](/sdk/reference/store/typeorm/#database-connection-parameters) are shadowed by the system-defined values whenever the [`postgres` addon](/cloud/reference/pg) is enabled (see the [Variable shadowing](/cloud/reference/pg/#variable-shadowing) section of the addon page). For example, in the snippet below all the `DB_*` variable definitions will be ignored:
```yaml title="squid.yaml"
deploy:
  addons:
    postgres:
  env:
    DB_HOST: mypostgreshost.xyz
    DB_PORT: 5432
    DB_NAME: squid-tests
    DB_USER: me
    DB_PASS: ${{ secrets.DATABASE_PASSWORD }}
    DB_SSL: true
```

## Contexts

The Cloud exposes some useful variables via a mechanism identical to [GitHub Actions contexts](https://docs.github.com/en/actions/learn-github-actions/contexts). Namely, any string
```
${{ <context> }}
```
added to the [manifest](/cloud/reference/manifest) at any environment variable definition gets replaced by the value supplied by the Cloud.

### Secrets

Secrets are designed to store sensitive data, such as API keys or private URLs for chain RPC endpoints. They are defined at the [organization](/cloud/resources/organizations) level and are exposed to all organization squids that request them in their environment variable definitions.

To add a secret:

1. Create it in the Cloud. You can do it at the [secrets page](https://app.subsquid.io/secrets) or with [`sqd secrets`](/squid-cli/secrets):
   ```bash
   sqd secrets set MOONRIVER_GRPC_ENDPOINT wss://moonriver.my-endpoint.com/ws/my-secret-key
   ```
   If you do not specify the value, `sqd` will attempt to read it from standard input. This is useful when setting a value to the contents of some file:
   ```bash
   sqd secrets set MY_JSON_CREDENTIALS < creds.json
   ```
2. At your squid's [manifest](/cloud/reference/manifest), add an environment variable and assign it to the secret:
   ```yaml
   deploy:
     env:
       RPC_ENDPOINT: ${{ secrets.MOONRIVER_GRPC_ENDPOINT }}
   ```
   Note: **a deployment requesting a secret unknown to the Cloud will fail**.
3. Access the value in the squid with `process.env`, e.g.
   ```ts
   const processor = new EvmBatchProcessor()
     .setRpcEndpoint({
       url: process.env.RPC_ENDPOINT,
       rateLimit: 1000rps
     })
   ```
Inspect, remove and update the secrets using the [`sqd secrets`](/squid-cli/secrets) command.

:::info
Any changes to secrets will take effect only when the squid is restarted, e.g. with
```bash
sqd deploy .
```
:::
