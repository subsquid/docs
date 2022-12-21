---
sidebar_position: 30
title: Migration guide
---

# Migrate from `@subsquid/cli@0.x`

Since `@subsquid/cli@2.x` the commands `squid:deploy` and `squid:update` are deprecated in favor of the manifest-based deployments and `sqd deploy`.

To migrate:

## 0. Update Squid SDK 

```bash
npm run update
```

Make sure `@subsquid/cli` is `^2.x`:
```bash
sqd --version
```

## 1. Create a deployment manifest

Create `squid.yaml` in the squid root folder, and set the squid name, version and the description (optional)

```yml file="squid.yaml
manifestVersion: subsquid.io/v0.1
name: my-squid # set name
version: 1 # my version
description: |-  # set description
  My squid  

build: 

deploy:
  addons:
    postgres: 
  processor:
    cmd: [ "node", "lib/processor" ] 
  api:
    cmd: [ "npx", "squid-graphql-server"]

```

## 2. (Optional) Add secrets and env variables

If the squid expects additional environment variables to be set by the Aquarium via [secrets](/deploy-squid/env-variables/#secrets) or at the [deployment time](/deploy-squid/env-variables/#environment-variables-1) add them in the `deploy` section:

```yml
#...
deploy:
  secrets:
    - ETHEREUM_RPC_ENDPOINT

```

## 3. (Optional) Revise `cmd`

You may want to add additional flags to `api.cmd`, e.g. to enable [caching](/develop-a-squid/graphql-api/caching) or [enforce query limits](/develop-a-squid/graphql-api/dos-protection).

## 4. (Optional) Add `scale:` options

Aquarium Premium users may request additional storage for the Postgres database and multiple gateway replicas for the `api` by adding the `scale` section to the manifest:

```yml
scale:
  addons:
    postgres:
      storage: 100G
  api:
    replicas: 3
```

Apply for a Premium account by filling this [form](https://t.ly/Uh_S).

## 5. Deploy

Run `sqd deploy .` and inspect the deployment logs. 

