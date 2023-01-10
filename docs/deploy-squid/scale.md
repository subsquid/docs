---
sidebar_position: 10
title: Scale the deployment
description: Scale the squid with the deployment manifest
---

# Scale the deployment

The `scale:` section of the [deployment manifest](/deploy-squid/scale) allows allocating additional computing resources for the squid addons and services. This option is only available for Premium Aquarium accounts. To apply for a Premium account, fill the [form](https://luvp4va64ru.typeform.com/to/QrRF66q5).

The manifest supports the following scaling options:

## Addons 

Each addon is optional. In particular, the `postgres` addon should be removed if the squid only writes data to external sinks.

For `postgres`:
- `storage`: the size of the allocated disk, in [memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory), e.g. `100G`.
- `profile`: `small | medium | large`. Specifies the allocated resources for the pod running the Postgres instance. The default is `small`.

The profile specifications for `postgres` are as follows:
- `small`: `1 vCPU`, `1Gi` RAM
- `medium`: `2 vCPU`, `2Gi` RAM
- `large`: `4 vCPU`, `4Gi` RAM

## Services

The `api` service is optional (e.g. if the squid only writes data to external sinks)

`processor`:
 - `profile`: `small | medium | large`. The machine specification (with extra vCPU and RAM). Default: `small`.

`api`:
 - `profile`: `small | medium | large`. The machine specification (with extra vCPU and RAM). Default: `small`.
 - `replicas`: the number of the API gateway replicas. The traffic is automatically load balanced between the replicas.

Each squid has a canonical (prod) API endpoint exposed `https://squid.subsquid.io/${name}/graphql`, see [promote to production](/deploy-squid/promote-to-production). Each version is independently served at `https://squid.subsquid.io/${name}/v/${version}/graphql`.

The profile specifications for the API server replicas are as follows:
- `small`: `0.5 vCPU`, `256Mi` RAM
- `medium`: `1 vCPU`, `512Mi` RAM
- `large`: `2 vCPU`, `1Gi` RAM

## Example

```yaml title="squid.yaml"
# ...
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