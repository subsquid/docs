---
sidebar_position: 10
title: Scale the deployment
description: Scale the squid with the deployment manifest
---

# Scale the deployment

The `scale:` section of the [deployment manifest](/deploy-squid/deploy-manifest) allows allocating additional computing resources for the squid addons and services. This option is only available for Premium Aquarium accounts. To apply for a Premium account, fill the [form](https://luvp4va64ru.typeform.com/to/QrRF66q5).

The manifest supports the following scaling options:

## `dedicated:` 

Set to `true` if dedicated resources should be allocated to the squid services. Default: `dedicated: false`. 
By default, the squids share the resources which may lead to degraded performance under heavy load. We recommend setting `dedicated: true` for squids run in production.

## `addons:`

### `postgres:`

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `storage`           | Max execution time after which any query is forcefully aborted, ms     |  [memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory) | `10G`        |   Optional     |
| `profile`  | Log queries executing longer than the given threshold, ms              |  `small` \| `medium` \| `large` |`small`          |   Optional     |

The profile specifications for `postgres` are as follows:
- `small`: `1 vCPU`, `1Gi` RAM
- `medium`: `2 vCPU`, `2Gi` RAM
- `large`: `4 vCPU`, `4Gi` RAM

## `services:`

### `api:`

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `profile`  | Log queries executing longer than the given threshold, ms              |  `small` \| `medium` \| `large` |`small`          |   Optional     |
| `replicas`  | The number of gateway replicas. The API requests are distributed between the replicas in the round-robin fashion             |  `1`          |   Optional     |

The profile specifications for the API server replicas are as follows:

| Profile | vCPU | RAM |
|:----:|:----:|:-------:|
|`small`| 0.5 | `256Mi` |
| `medium`| 1 | `512Mi` |
| `large` | 2 | `1Gi`| 

### `processor:`

| Name        | Description  | Type      |Default value  | Optional   |  
|:-----------:|:------------:|:---------:|:--------------:|:----------:|
| `profile`  | Log queries executing longer than the given threshold, ms              |  `small` \| `medium` \| `large` |`small`          |   Optional     |



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
