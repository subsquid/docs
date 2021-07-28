---
description: 'Introducing Hydra, a GraphQL query node for substrate chains'
---

# Overview

## Bird-eye overview

[Hydra](https://subsquid.io) has two principal components: Hydra Indexer and Hydra Processor. Hydra Indexer ingests raw data from a substrate chain. Hydra Processor is responsible for transforming the raw data into domain-level entities as defined in `schema.graphl` and the event handlers, both provided by the user. `hydra-cli` provides additional scaffolding and codegen tooling for running and developing a Hydra Processor tailored for the provided schema file.

![Hydra Indexer \(top\) and Hydra Processor \(bottom\) data flows](./.gitbook/assets/hydra-diagram.png)

## What's next?

* Explore live Hydra Indexer  [playground](https://kusama.indexer.gc.subsquid.io/graphql) and query Kusama events and extrinsics
* [Install](install-hydra.md) Hydra toolkit 
* Hydra [tutorial](quick-start.md): spin a query node in under five minutes 
* Learn how to define your own data [schema](schema-spec/) and [mappings](mappings/) to run a Hydra Indexer

