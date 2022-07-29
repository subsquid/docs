---
sidebar_position: 2
title: Run in production
---

# Run in production

We recommend [deploying to Aquiarium](/deploy-squid/) for a managed cloud solution. 

For self-hosted squids, we recommend using Kubernetes and the following specs:

- Processor: 1xCPU, 512GB RAM
- API Server: 2 or 3 replicas behind a load balancer. Recommended replica spec: 1xCPU 1GB RAM

The optimal processor specs highly depend on how the squid is implemented, increase the RAM if necessary.

The total number of replicas will depend on the expected load and the complexity of GraphQL queries. Increase the number of replicas and RAM if needed.

