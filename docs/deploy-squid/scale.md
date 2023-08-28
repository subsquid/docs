---
sidebar_position: 40
title: Scale the deployment
description: Scale the squid with the deployment manifest
---

# Scale the deployment

The `scale:` section of the [deployment manifest](/deploy-squid/deploy-manifest) allows allocating additional computing resources for the squid addons and services. This option is only available for Premium Aquarium accounts. To apply for a Premium account, fill the [form](https://docs.google.com/forms/d/e/1FAIpQLSchqvWxRhlw7yfBlfiudizLJI9hEfeCEuaSlk3wOcwB1HQf6g/viewform?usp=sf_link).

The manifest supports the following scaling options:

## `dedicated:` 

Default: `dedicated: false`. 

By default, the service deployments are collocated and so the maximal allowed resource allocation is not guaranteed. With the `dedicated: true` option, the resources are reserved in advance. See the profile specifications below for details. 
We recommend setting `dedicated: true` for squids running in production.

## `addons:`

### `postgres:`

See [Postgres addon](/deploy-squid/pg-addon) for details.

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
| `profile`  | Allocated resources profile      |  `small` \| `medium` \| `large` |`small`          |   Optional     |

The profile specifications for a processor service are as follows:

| Profile | colocated vCPU (max) | colocated RAM (max) | dedicated vCPU (requested) | dedicated RAM (max) |
|:----:|:----:|:-------:|:-----:|:------:|
|`small`| 0.2 | `768Mi` | 0.5 | `768Mi` |
| `medium`| 0.5 | `1.5Gi` | 1 |  `1.5Gi` |
| `large` | 1 | `3Gi`| 2 | `3Gi` |


## Example

```yaml title="squid.yaml"
manifestVersion: subsquid.io/v0.1
name: sample-squid

build: 

deploy:
  addons:
    postgres: 
  processor:
    cmd: [ "node", "lib/processor" ] 
  api:
    cmd: [ "npx", "squid-graphql-server"]

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
