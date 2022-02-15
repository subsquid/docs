---
description: Introducing Subsquid, a GraphQL query node for substrate chains.
cover: .gitbook/assets/discord-1584x200.png
coverY: 0
---

# Overview

## Welcome

Welcome to the Subsquid Gitbook! This documentation is intended to introduce the general public to Subsquid, as well as to serve as a guide for anyone who may be developing software using the Subsquid query node framework.

The various sections and pages of this material cover a variety of subjects. The documentation includes an overview of all the project's key concepts. Also included are operational guides, as well as plenty of reference material.

## What is Subsquid

[Subsquid ](https://subsquid.io)is a query node framework for Substrate-based blockchains. In very simple terms, Subsquid can be thought of as an ETL tool, with a GraphQL server included.

Subsquid's [multi-layer approach](key-concepts/architecture.md) aims to pre-process and decode raw chain data and store it for easier access by query nodes, providing increased performance over direct RPC calls.

Thanks to Subsquid, the complexity of fetching and transforming blockchain data can be vastly reduced. On top of that, developers get a batteries-included GraphQL server with comprehensive filtering, pagination, and even full-text search capabilities.

### Data retrieval made ~~easy~~ easier :smile:

Blockchains produce, add, and store data in a very different way than do centralized sources. As a result, how one must search for information stored on blockchains is different as well.\
\
The beauty of blockchain is that anyone can tap into on-chain data in order to create their own DApps. However, a massive uptick in the development of decentralized applications has led to a morass of data spread across blockchains. This information has become difficult to access and utilize.

Furthermore, in this ever-evolving environment, updates and changes upstream can have breaking consequences to data processing pipelines.

Poor data leads to poor products, and before we know it, blockchain solutions may start to fail as a result of data feeds that are simply not up to the job. This would be a shame, as we have barely begun to scratch the surface of what could be achieved in a decentralized world!

This is where Subsquid comes in. Subsquid has a multi-layered [architecture](key-concepts/architecture.md), composed of [Archive(s)](key-concepts/architecture.md#squid-archive) and [Squid(s)](key-concepts/architecture.md#squid).

Subsquid is rapidly deploying Archives to gather data from available blockchains on behalf of developers who wish to use this data to develop DApps. These Archives are constantly ingesting and decoding data from the blockchains that they were built to synchronize with and storing (archiving, hence the name... 😜 ) it for a much easier access by developers.

The power of Subsquid is the framework it provides. This framework allows developers to create APIs using the technology and techniques with which they are already familiar. All of this can be developed on top of blockchain data provided by Archives, instead of direct gRPC node access, thus reducing the friction and inertia of starting a new project.

## What's next?

Start building! Head over to our [Quickstart](quickstart.md) section, learn more about the project's [Key Concepts](key-concepts/), find implementional examples in our [Recipes](recipes/) section, or check out our easy-to-follow [Tutorial](tutorial/) for a slower pace approach.
