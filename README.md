---
description: Introducing Subsquid, a GraphQL query node for substrate chains.
---

# Overview

## Welcome

Welcome to Subsquid documentation. The material here is meant to introduce the general public to the Subsquid query node framework and to be an asset at the developers' disposal while building with Subsquid.

The various sections and pages cover a variety of subjects, including concepts at the base of the project, operational guides, as well as reference material.

## What is Subsquid

[Subsquid ](https://subsquid.io)is a query node framework for Substrate-based blockchains. In very simple terms, Subsquid can be thought of as an ETL tool, with a GraphQL server included.

Subsquid's [multi-layer approach](key-concepts/architecture.md) aims to pre-process and decode raw chain data and store it for easier access by query nodes, providing increased performance over direct RPC calls.

Thanks to Subsquid, the complexity of queries is vastly reduced. On top of that, developers get a batteries-included GraphQL server with comprehensive filtering, pagination, and even full-text search capabilities.

### Data retrieval made ~~easy~~ easier :smile:

Blockchains produce, add, and store data in a very different way than do centralized sources. How we must search for information stored on blockchains is different as well. The beauty of blockchain is that anyone can tap into on-chain data in order to create their own DApps.&#x20;

However, a massive uptick in the development of decentralized applications has led to a morass of data spread across blockchains. This information has become difficult to access and utilize.&#x20;

Poor data leads to poor products, and before we know it, blockchain solutions may start to fail as a result of data feeds that are simply not up to the job. This would be a shame, as we have barely begun to scratch the surface of what could be achieved in a decentralized world!

This is where Subsquid comes in. Subsquid has a multi-layered [architecture](key-concepts/architecture.md), composed of [Squid Archive(s)](key-concepts/architecture.md#squid-archive) and [Squid(s)](key-concepts/architecture.md#squid).

Subsquid is rapidly deploying Squid Archives to gather data from available blockchains on behalf of developers who wish to use this data to develop DApps.\
These Squid Archives are constantly ingesting and decoding (archiving, hence the name... 😜 ) data from the blockchain they were built to synchronize with.

The power of Subsquid is the framework it provides. This framework allows developers to create APIs using technology and techniques with which they are already familiar. All of this can be developed on top of blockchain data provided by Squid Archives, instead of direct gRPC node access, thus reducing the friction and inertia of starting a new project.

## What's next?

Start building! Head over to our [Quickstart](quickstart.md), learn more about the project's [Key Concepts](key-concepts/), find examples in our [Recipes](recipes/) section, or follow the [Tutorial](tutorial/) for a slower pace approach.
