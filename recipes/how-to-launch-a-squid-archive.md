---
description: Quick how-to on running an Archive for a specific blockchain.
---

# How to launch an Archive

## Overview

This quick Recipe covers how to launch an Archive for a blockchain that is already covered by Subsquid and how to run one for a new blockchain.

### Requirements

In order to run an Archive, it is required to have Docker installed. For a quick installation guide, head over to [the dedicated page](../tutorial/development-environment-set-up.md#docker).

## Squid Archive repository

Launching an Archive is as easy as visiting our [dedicated Archive setup repository](https://github.com/subsquid/squid-archive-setup) and checking if the blockchain you want to synchronize is listed. Let's say Equilibrium, in the context of this example.

![Archives list in the repository](<../.gitbook/assets/archive list.png>)

If that is the case, simply clone the repository

```
git clone git@github.com:subsquid/squid-archive-setup.git
```

Navigate to the corresponding folder in a command line console window and run

```
docker-compose up
```

### Running in production environment

The provided docker compose setup is a minimal configuration best suitable for dev and testing environments. For a stable production deployment we recommend the following.

* Use a private gRPC endpoint (`WS_PROVIDER_ENDPOINT_URI` env variable in the docker file)
* Use managed Postgres database with non-root access (`DB_*` env variables in the docker file)
* Collect and monitor [Prometheus](https://prometheus.io) metrics exposed at port 9090
* Increase `WORKERS_NUMBER` environment variable to speed up the syncing. Usually somewhere between 5-50 workers is a sweet spot depending on the gRPC endpoint capacity.

To reliably run an Archive we recommend 16GB RAM and modern CPU. Database storage requirements depend on the size of the network. A rule of thumb is to reserve around 100 kb per block, so e.g. for Kusama with \~10M blocks one needs about 1Tb for Postgres storage.

## Launch an Archive for a new blockchain

If a specific blockchain is not listed in the repository, it is possible to add it by contributing to the repository itself, following these steps:

1. Fork the repository
2. Create a folder dedicated to the new blockchain
3. Copy one of the `docker-compose.yml` file from another folder&#x20;
   * Edit the `WS_PROVIDER_ENDPOINT_URI` environment variable to the correct endpoint for the given chain
   * Make sure to create a types bundle file named as the one mentioned in the `BUNDLE_TYPES` environment variable (see next point)
4. The Archive needs to know which types the blockchain Runtime is using, and to instruct it, a types bundle JSON file needs to be passed in.
   * To know how to create such a file for a given chain, head over to [our dedicated page](../faq/where-do-i-get-a-type-bundle-for-my-chain.md)
5. Create a pull-request towards the main repository
