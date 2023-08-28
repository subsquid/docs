---
sidebar_position: 30
title: Postgres addon
description: Provision and scale postgress for a squid
---

# Postgres addon

To provision a postgres instance, add the `addons.postgres:` section to the deployment manifest. The addon deploys a Postgres 14 instance and injects the `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_PORT` environment variables to the `api` and `processor` squid services.

## Config options

The addon supports additional PG config options:

| Name                                 | Description                                                            | Type      | Default value  | Optional   |  
|:------------------------------------:|:----------------------------------------------------------------------:|:---------:|:--------------:|:----------:|
| `config.statement_timeout`           | Max execution time after which any query is forcefully aborted, ms     |  `number` | `60000`        |   Optional     |
| `config.` `log_min_duration_statement`  | Log queries executing longer than the given threshold, ms              |  `number` |`5000`          |   Optional     |
| `config.` `max_pred_locks_per_transaction` | See [Lock Management](https://www.postgresql.org/docs/15/runtime-config-locks.html#GUC-MAX-PRED-LOCKS-PER-TRANSACTION) | `number` | `64` | Optional |
| `config.max_locks_per_transaction` | See [Lock Management](https://www.postgresql.org/docs/15/runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION) | `number` | `64` | Optional |

## Direct access

:::warning
Direct access is only avalilable for squids deployed with `squid.yaml`. For migrating from the old v0 flow, refer to the [migration page](/deploy-squid/migration).
:::

Aquarium enables direct read access to the deployed PG instances. Launch the [squid explorer](/squid-cli/explorer) with
```
sqd explorer
```
and navigate to `DB access` to inspect the PG connection string for the direct access. 


## Scaling

The `postgres` addon supports storage and compute resource scaling by extending the `scale.addons.postgres` section of the deploy manifest. The following options are supported

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `storage`           | Volume size for the postgres container  |  [memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory) | `10G`        |   Optional     |
| `profile`  | Log queries executing longer than the given threshold, ms              |  `small` \| `medium` \| `large` |`small`          |   Optional     |

The profile specifications for a `postgres` service are as follows:

| Profile | colocated vCPU (max) | colocated RAM (max) | dedicated vCPU (requested) | dedicated RAM (max) |
|:----:|:----:|:-------:|:-----:|:------:|
|`small`| 0.2 | `768Mi` | 1 | `2Gi` |
| `medium`| 0.5 | `1.5Gi` | 2 | `4Gi` |
| `large` | 1 | `3Gi`| 4 | `4Gi` |


## Examples

```yaml
manifestVersion: subsquid.io/v0.1
name: sample-squid
version: 1
description: |-
  My advanced squid 

build: 

deploy:
  addons:
    postgres: 
      config:
        statement_timeout: 100000
        log_min_duration_statement: 100000
  processor:
    cmd: [ "node", "lib/processor" ] 
  api:
    cmd: [ "npx", "squid-graphql-server"]

scale:
  addons:
    postgres:
      storage: 100G
      profile: medium
```


