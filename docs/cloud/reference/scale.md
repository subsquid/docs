---
sidebar_position: 20
title: scale section
description: Scale the squid with the deployment manifest
---

# Scale the deployment

The `scale:` section of the [deployment manifest](/cloud/reference/manifest) allows allocating additional computing resources for the squid add-ons and services. This option is only available for paid squids deployed in [professional organizations](/cloud/resources/organizations/#professional-organizations).

:::info
Visit the [Pricing page](/cloud/pricing) and/or our [costs calculator](https://subsquid.io/subsquid-cloud#calculator) if you're looking for an estimate.
:::

The manifest supports the following scaling options:

## `dedicated:` 

Default: `dedicated: false`. 

By default, the service deployments are _collocated_ - that is, share resources with other deployments - and so the allocation of full resources is not guaranteed. With `dedicated: true`, the resources are reserved in advance.

We recommend setting `dedicated: true` for all squids running in production.

Squid deployment must be dedicated to be a subject of [SQD Cloud SLA](/cloud/pricing).

## `addons:`

### `postgres:`

See [Postgres add-on](/cloud/reference/pg) for details.

## `services:`

### `api:`

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `profile`  | Allocated resources profile              |  `small` \| `medium` \| `large` |`small`          |   Optional     |
| `replicas`  | The number of gateway replicas. The API requests are distributed between the replicas in the round-robin fashion        | Number    |  `1`          |   Optional     |

The profile specifications for API service replicas are as follows:

| Profile | colocated vCPU (max) | colocated RAM (max) | dedicated vCPU (requested) | dedicated RAM (max) |
|:----:|:----:|:-------:|:-----:|:------:|
|`small`| 0.2 | `768Mi` | 0.5 | `768Mi` |
| `medium`| 0.5 | `1.5Gi` | 1 |  `1.5Gi` |
| `large` | 1 | `3Gi`| 2 | `3Gi` |

### `processor:`

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `profile`  | Allocated resources profile      |  `small` \| `medium` \| `large` \| `xlarge` \| `2xlarge`  |`small`          |   Optional     |

The profile specifications for a processor service are as follows:

| Profile | colocated vCPU (max) | colocated RAM (max) | dedicated vCPU (requested) | dedicated RAM (max) |
|:----:|:----:|:-------:|:-----:|:------:|
|`small`| 0.2 | `768Mi` | 1 | `2Gi` |
| `medium`| 0.5 | `1.5Gi` | 2 | `4Gi` |
| `large` | 1 | `3Gi`| 4 | `4Gi` |
| `xlarge` | - | -| 8 | `16Gi` |
| `2xlarge` | - | - | 16 | `32Gi` |


## Example

```yaml title="squid.yaml"
manifest_version: subsquid.io/v0.1
name: sample-squid

build: 

deploy:
  addons:
    postgres: 
  processor:
    cmd: [ "sqd", "process:prod" ]
  api:
    cmd: [ "sqd", "serve:prod" ]

scale:
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
