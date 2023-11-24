---
sidebar_position: 10
title: Subsquid overview
description: Squid SDK, squids, Archives and Cloud
---

# Overview

[//]: # (!!!! illustrations need updating)

The Subsuid ecosystem is built around Subsquid Network -- a decentralized query engine and a horizontally-scalable data lake for batch-queries. Currently, Subsquid Network is optimized for quering raw historical on-chain data from EVM- and non-EVM using a custom REST-like API. In the future, it will additionally support general-purpose SQL queries and an ever-growing collection of structured data sets derived from on- and off- chain data.

Depending on the use-case, one should use either use Subsquid Network directly or go for one of the more specialized products leveraging it. 

## Subsquid Network

[Subsquid Network](/subsquid-network) exposes low-level REST-like API to batch-extract and filter:
- raw event logs
- transaction and transaction receipt data
- execution traces (for selected networks)
- state diffs (for selected networks)

Supports all the major [EVM] and [Substrate] networks, with more in the works. [Contact us](https://t.me/HydraDevs) if you're missing support for some other network.

It can be used in two flavours:

- A privately run cluster by Subsquid (formerly known as Subsquid Archives). Suitable for production use-cases. The data is accessed via public gateways maintained by Subsquid Labs GmbH. Supports most of the networks above.

- A decentralized permissionless network, currently a testnet. The testnet supports only a (growing) subset of networks supported by the private cluster. Experimental until the mainnet is live. Requires a local p2p gateway to access the data. 

Use cases for the Subsquid Network direct API:
- boost the performance of the existing pipelines by replacing per-block RPC requests with batch-requests to Subsquid Network
- non-Typescript (e.g. Rust) indexers, mobile SDKs
- high-performance data pipelines for raw historical data
- a high-performance data source for tools like ApeWorkX, Cryo
- ad-hoc queries over historical on-chain data

Subsquid Network is not suitable for real-time use-cases, use Squid SDK if it's a requirement

## Squid SDK

A comprehensive Typescript-based toolkit for building indexers on top of Subsquid Network. The Squid SDK libraries offer:
- Ergonomic high-level libraries for extractining, decoding and normalizing the data from Subsquid Network (sometimes called extract-transform-load pipelines). It includes specialized libraries for EVM, Substrate and other network-specific data
- Perfomant tools for type generation and batch-quering custom smart contract data 
- Expressive GraphQL server with a declarative schema-based config
- Pluggable data stores to save the transformed and decoded data into Postgres, parquet files, s3 warehouses, BigQuery or a completely custom targets
- Built-in handling of unfinalized blocks and chain reorganisations
- Seamless support for real-time data ingestion with RPC

The SDK is a go-to choice for:
- building a custom indexer and/or API for a set of smart contracts
- for building a low-cost, high-performance in-house data pipelines 
- rapid prototyping
- local data extraction of decoded data
- real-time on-chain data processing

Here is a (incomplete) list of real-world applications for which Squid SDK was a good-fit:
- DeFi dashboards, tracking addresses and internal transactions
- NFT marketplaces, with a dynamic sets of NFT contracts to watch
- Historical price feeds, tracking Uniswap trades and Chainlink oracle contracts
- Mining smart contract deployments and the bytecode
- Real-time bots (< 1sec delay) triggered by on-chain activity

## Subsquid Cloud

A Platform-as-a-Service for deploying indexers (called squids) developed with Squid SDK. Offers a wide range of add-ons for a one-stop-shop Web3 data experience:
- on-demand provisiong of Postgres and compute resources for indexers
- versioning and aliasing for indexers and GraphQL APIs
- on-demand provisioning of high-performance RPC endpoints
- CORS and caching
- intuitive deployment management through a Web application or CLI

Subsquid Cloud is a go-to choice for a managed high-uptime service with Google Cloud-level SLAs. Ideally suites for projects who don't want to run indexing in-house.

## What's next?

- Follow the [Quickstart](/sdk/squid-development) to build your first squid
- Explore [Examples](/sdk/examples)
- Learn how to [migrate from The Graph](/sdk/resources/migrate/migrate-subgraph)
- Dive deeper into [EVM Indexing](/sdk) and [Substrate Indexing](/sdk)
- Explore the [GraphQL API options](/sdk/reference/graphql-server) including custom extensions, caching and DoS protection in production
