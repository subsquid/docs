---
description: Introducing Subsquid, a GraphQL query node for substrate chains
---

# Overview

A Substrate query node framework. Subsquid provides a way to develop powerful GraphQL queries to app developers over your Substrate blockchain state and history.

## What is Subsquid

[Subsquid ](https://subsquid.io)is a query node for Substrate-based blockchains. A query node ingests data from a substrate chain and provides rich, domain-specific, and highly customizable access to the blockchain data, far beyond the scope of direct RPC calls. For example, expired [Kusama Treasury](https://wiki.polkadot.network/docs/en/learn-treasury) spending [proposals](https://kusama.subscan.io/event?module=Treasury\&event=Proposed) are pruned from the state of the [Kusama blockchain](https://polkascan.io/kusama), so querying, say, one-year-old proposals is problematic. Indeed, one has to track the evolution of the state by sequentially applying the Treasury events and [extrinsics ](key-concepts/extrinsic-in-substrate.md)in each historical block.

That's where Subsquid gets you covered. Define your data model and the Squid Archive will get it in sync with the chain. On top of that, you get a batteries-included GraphQL server with comprehensive filtering, pagination, and even full-text search capabilities.
