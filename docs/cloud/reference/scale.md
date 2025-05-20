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

Default: `dedicated: true`.

When a dedicated profile is used, the resources that the squid requests are reserved in advance. **This is the new/current default** and is the recommended profile for production squids. Squid deployment must be dedicated to be a subject of [SQD Cloud SLA](/cloud/pricing).

By setting `dedicated: false` you can request for your deployment to be _collocated_ - that is, share resources with other deployments. The allocation of full resources is not guaranteed for collocated squids.

All playground squids must use the collocated profile, that is, explicitly specify `dedicated: false`.

## `addons:`

### `postgres:`

See [Postgres add-on](/cloud/reference/pg) for details.

## `services:`

### `api:`

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `profile`  | Allocated resources profile              |  `small` \| `medium` \| `large` \| `xlarge` \| `2xlarge` | `small`         |   Optional     |
| `replicas`  | The number of gateway replicas. The API requests are distributed between the replicas in the round-robin fashion        | Number    |  `1`          |   Optional     |

The profile specifications for API service replicas are as follows:

| Profile | colocated vCPU (max) | colocated RAM (max) | dedicated vCPU (requested) | dedicated RAM (max) |
|:----:|:----:|:-------:|:-----:|:------:|
|`small`| 0.2 | `768Mi` | 0.5 | `768Mi` |
| `medium`| 0.5 | `1.5Gi` | 1 |  `1.5Gi` |
| `large` | 1 | `3Gi`| 2 | `3Gi` |
| `xlarge` | - | - | 4 | `6Gi` |
| `2xlarge` | - | - | 8 | `12Gi` |

### `processor:`

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `profile`  | Allocated resources profile      |  `small` \| `medium` \| `large` \| `xlarge` \| `2xlarge` | `small`         |   Optional     |

The profile specifications for a processor service are as follows:

| Profile | colocated vCPU (max) | colocated RAM (max) | dedicated vCPU (requested) | dedicated RAM (max) |
|:----:|:----:|:-------:|:-----:|:------:|
|`small`| 0.2 | `768Mi` | 0.5 | `768Mi` |
| `medium`| 0.5 | `1.5Gi` | 1 |  `1.5Gi` |
| `large` | 1 | `3Gi`| 2 | `3Gi` |
| `xlarge` | - | - | 4 | `6Gi` |
| `2xlarge` | - | - | 8 | `12Gi` |


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
