---
description: Introducing Subsquid, a GraphQL query node for substrate chains.
---

# Overview

A Substrate query node framework. Subsquid provides app developers with a way to build powerful GraphQL queries over Substrate blockchain state and history.

## What is Subsquid

[Subsquid ](https://subsquid.io)is a query node framework for Substrate-based blockchains. A query node ingests data from a substrate chain and provides rich, domain-specific, and highly customizable access to the blockchain data, far beyond the scope of direct RPC calls.

For example, expired [Kusama Treasury](https://wiki.polkadot.network/docs/en/learn-treasury) spending [proposals](https://kusama.subscan.io/event?module=Treasury\&event=Proposed) are pruned from the state of the [Kusama blockchain](https://polkascan.io/kusama), so querying, say, one-year-old proposals is problematic. Indeed, one has to track the evolution of the state by sequentially applying the Treasury events and [extrinsics ](key-concepts/extrinsic-in-substrate.md)in each historical block.

That's where Subsquid gets you covered. Define your data model and the Squid will get it in sync with the chain. On top of that, you get a batteries-included GraphQL server with comprehensive filtering, pagination, and even full-text search capabilities.

### Data retrieval made ~~easy~~ easier :smile:

Blockchains produce, add, and store data in a very different way to centralized sources, and therefore the ways in which we must search for it is different too. The beauty of blockchain is that anyone can tap into the data held within it to create their own DApp, but this has led to a morass of data spread across blockchains that has never been utilized.

Poor data leads to poor products, and before we know it, blockchain solutions are failing because the data feeds are simply not up to the job. We have barely begun to scratch the surface of what can be achieved in a decentralized world.

This is where Subsquid comes in. Subsquid has a multi-layered [architecture](key-concepts/architecture.md), composed of [Squid Archive(s)](key-concepts/architecture.md#squid-archive) and [Squid(s)](key-concepts/architecture.md#squid).

Subsquid is rapidly deploying Squid Archives to gather data from these blockchains on behalf of developers who wish to use this data in order to develop DApps.\
These Squid Archives are constantly ingesting and categorizing (_archiving_, hence the name... :stuck\_out\_tongue\_winking\_eye:) data from the blockchain they were built to synchronize with.

The power of Subsquid is the provided framework, which allows developers to build their APIs with technology and approach they might already be familiar with. All of this, on top of blockchain data provided by Squid Archives, instead of direct gRPC node access, thus reducing the friction and inertia to start a new project.

So start building! Head over to our [Quickstart](quickstart.md), find examples in our [Recipes](recipes/) section or follow the [Tutorial](tutorial/) for a slower pace approach.
