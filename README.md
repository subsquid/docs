---
description: Introducing Subsquid, a GraphQL query node for substrate chains.
---

# Overview

## Welcome

Welcome to Subsquid documentation. The material here is meant to introduce the general public to  Subsquid query node framework and to be an asset at the developers' disposal while building with Subsquid.

The various sections and pages cover a variety of subjects, including concepts at the base of the project, operational guides, as well as reference material.

## What is Subsquid

[Subsquid ](https://subsquid.io)is a query node framework for Substrate-based blockchains. In very simple terms, Subsquid can be thought of as an ETL tool, with a GraphQL server included.

A query node ingests data from a substrate chain and provides rich, domain-specific, and highly customizable access to the blockchain data, far beyond the scope of direct RPC calls.

For example, expired [Kusama Treasury](https://wiki.polkadot.network/docs/en/learn-treasury) spending [proposals](https://kusama.subscan.io/event?module=Treasury\&event=Proposed) are pruned from the state of the [Kusama blockchain](https://polkascan.io/kusama), so querying one-year-old proposals would be problematic. With the traditional approach, it would be necessary to track the evolution of the state by sequentially applying the Treasury [events and extrinsics](key-concepts/substrate.md) in each historical block.

Thanks to Subsquid, that's no longer the case and the complexity is vastly reduced. A Squid Archives can constantly synchronize raw data with the chain and by simply defining the custom data model in the Squid project, it is possible to perform complex queries on top of it, such as the one in the previous example.

On top of that, you get a batteries-included GraphQL server with comprehensive filtering, pagination, and even full-text search capabilities.

### Data retrieval made ~~easy~~ easier :smile:

Blockchains produce, add, and store data in a very different way to centralized sources, and therefore how we must search for it is similarly different. The beauty of blockchain is that anyone can tap into the data held within it to create their own DApp, but this has led to a morass of data spread across blockchains that has never been utilized.

Poor data leads to poor products, and before we know it, blockchain solutions are failing because the data feeds are simply not up to the job. We have barely begun to scratch the surface of what can be achieved in a decentralized world.

This is where Subsquid comes in. Subsquid has a multi-layered [architecture](key-concepts/architecture.md), composed of [Squid Archive(s)](key-concepts/architecture.md#squid-archive) and [Squid(s)](key-concepts/architecture.md#squid).

Subsquid is rapidly deploying Squid Archives to gather data from these blockchains on behalf of developers who wish to use this data to develop DApps.\
These Squid Archives are constantly ingesting and categorizing (_archiving_, hence the name... :stuck\_out\_tongue\_winking\_eye:) data from the blockchain they were built to synchronize with.

The power of Subsquid is the provided framework, which allows developers to create their APIs with technology and approach they might already be familiar with. All of this can be developed on top of blockchain data provided by Squid Archives, instead of direct gRPC node access, thus reducing the friction and inertia to start a new project.

## What's next?

Start building! Head over to our [Quickstart](quickstart.md), learn more about the project's [Key Concepts](key-concepts/), find examples in our [Recipes](recipes/) section, or follow the [Tutorial](tutorial/) for a slower pace approach.
