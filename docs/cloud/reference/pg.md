---
sidebar_position: 30
title: addons.postgres section
description: Provision and scale postgres for a squid
---

# Postgres add-on

To provision a postgres instance, add the `addons.postgres:` section to the deployment manifest. The add-on deploys a Postgres 14 instance and [injects variables](#variable-shadowing) with database connection params into the environment of the `api` and `processor` squid services.

## Variable shadowing

Any of the following variables set globally or for `api` or `processor` squid services in the [manifest](/cloud/reference/manifest) will be overwritten with Cloud-supplied values:
 * `DB_SSL`
 * `DB_HOST`
 * `DB_PORT`
 * `DB_NAME`
 * `DB_USER`
 * `DB_PASS`
 * `DB_URL`

## Config options

The addon supports additional PG config options:

| Name                                 | Description                                                            | Type      | Default value  | Optional   |  
|:------------------------------------:|:----------------------------------------------------------------------:|:---------:|:--------------:|:----------:|
| `config.statement_timeout`           | Max execution time after which any query is forcefully aborted, ms     |  `number` | `60000`        |   Optional     |
| `config.` `log_min_duration_statement`  | Log queries executing longer than the given threshold, ms              |  `number` |`5000`          |   Optional     |
| `config.` `max_pred_locks_per_transaction` | See [Lock Management](https://www.postgresql.org/docs/15/runtime-config-locks.html#GUC-MAX-PRED-LOCKS-PER-TRANSACTION) | `number` | `64` | Optional |
| `config.max_locks_per_transaction` | See [Lock Management](https://www.postgresql.org/docs/15/runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION) | `number` | `64` | Optional |

## Direct access

SQD Cloud enables direct read access to the deployed PG instances. Go to the "DB access" tab of your squid deployment's card in the [Cloud web app](https://app.subsquid.io/squids) to get the PG connection string.

## Scaling

The `postgres` add-on supports storage and compute resource scaling by extending the `scale.addons.postgres` section of the deploy manifest. The following options are supported

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `storage`           | Volume size for the postgres container  |  [memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory) | `10G`        |   Optional     |
| `profile`  | Allocated resources profile      |  `small` \| `medium` \| `large` \| `xlarge` \| `2xlarge`  |`small`          |   Optional     |

The profile specifications for a `postgres` service are as follows:

| Profile | colocated vCPU (max) | colocated RAM (max) | dedicated vCPU (requested) | dedicated RAM (max) |
|:----:|:----:|:-------:|:-----:|:------:|
|`small`| 0.2 | `768Mi` | 1 | `2Gi` |
| `medium`| 0.5 | `1.5Gi` | 2 | `4Gi` |
| `large` | 1 | `3Gi`| 4 | `4Gi` |
| `xlarge` | - | -| 8 | `16Gi` |
| `2xlarge` | - | - | 16 | `32Gi` |


## Examples

```yaml
manifest_version: subsquid.io/v0.1
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
    cmd: [ "sqd", "process:prod" ]
  api:
    cmd: [ "sqd", "serve:prod" ]

scale:
  addons:
    postgres:
      storage: 100G
      profile: medium
```
