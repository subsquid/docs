---
sidebar_position: 33
title: addons.hasura section
description: Run a Hasura instance
---

# Hasura add-on

## Running Hasura

To provision a [Hasura](https://hasura.io) instance, add an empty `deploy.addons.hasura` section to the [deployment manifest](/cloud/reference/manifest). Provide some basic configuration:
```yaml
deploy:
  env:
    HASURA_GRAPHQL_ADMIN_SECRET: "${{ secrets.HASURA_SECRET }}"
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE: user
    HASURA_GRAPHQL_STRINGIFY_NUMERIC_TYPES: "true"
  addons:
    postgres:
    hasura:
```
Note the use of a [Cloud secret](/cloud/resources/env-variables/#secrets) for storing the admin password.

## Configuring a Hasura API

### For a squid

Use the [Hasura configuration tool](/sdk/resources/tools/hasura-configuration) for squids running dedicated Hasura instances. To make Cloud initialize Hasura configuration on squid restarts, make sure that the tool runs on squid startup by adding a `deploy.init` section to the manifest, e.g. like this:
```yaml
deploy:
  init:
    env:
      HASURA_GRAPHQL_ENDPOINT: 'http://hasura:8080'
    cmd:
      - npx
      - squid-hasura-configuration
      - apply
```
See also the [Hasura section of the GraphQL guide](/sdk/resources/serving-graphql/#hasura) and the [complete squid example](https://github.com/subsquid-labs/squid-hasura-example).

### For a DipDup indexer

[DipDup](https://dipdup.io) also configures Hasura automatically. See the [DipDup section](/external-tools/#dipdup) for details.
