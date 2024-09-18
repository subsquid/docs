---
sidebar_position: 90
title: SQD vs The Graph
description: Comparison of SQD and The Graph
---

# SQD vs The Graph

[The Graph](https://thegraph.com) is an indexing protocol and framework for EVM chains. In The Graph, indexing projects are called subgraphs. A Graph indexing node is a black-box that executes subgraphs compiled into WASM. The data is sourced directly from an archival blockchain node, and the processed data is stored in a built-in Postgres database.

On the contrary, SQD employs a radically open modular architecture with: 
- a separated layer for efficient data extraction and batch queries ([SQD Network](/subsquid-network/))  
- a client-side libraries for data transformation and presentation. 

The data transformation and presentation is enabled by a growing list of tools and SDKs that consume the raw data from SQD Network:
- Typescript based [Squid SDK](/sdk/) offers pluggable data targets for both online and offline use-cases
- Python-based [DipDup SDK](https://dipdup.io/docs/quickstart-evm?ref=blog.subsquid.io)
- Subgraphs (via [SQD Firehose adapter](/subgraphs-support/))
- ApeWorx (via [ape-subsquid plugin](/apeworx))

## Feature matrix

|                                 |  SQD Network + Squid SDK     |            The Graph                     |
|:-------------------------------:|:-------------------------:|:----------------------------------------:|
|  Programming language           |     Typescript            |    AssemblyScript (compiled to WASM)     |
|  Indexing speed                 |     ~1k-50k bps           |       ~100-150 bps                       |
|  ABI-based generator            |        Yes                |          Yes                             |
|  Real-time indexing (unfinalized blocks)   |     Yes        |          No                              |  
|  Off-chain data                 |        Yes                |        No                                |
|  Data targets                   |     Customizable          |      Postgres-only                       |
|  Customizable DB migrations     |        Yes                |        No                                |
|  Factory contract indexing      |   Yes, via wildcards      |       Yes                                |
|  Multi-contract indexing        |        Yes                |     Limited                              | 
|  Analytic data targets          |  BigQuery, Parquet, CSV   |        No                                |
|  Local setup                    |       Easy                |       Requires an archival node          |    
|  GraphQL API                    | Generated from `schema.graphql` |    Generated from `schema.graphql` |
|  Custom resolvers and mutations |  Yes                      |          No                              |
|  Subscriptions                  |  Yes                      |       Via middleware                     |
|  Hosted service                 |  Yes                      |       Yes (to be sunset)                 |
|  Secret env variables           |  Yes                      |          No                              |
|  Payment                        |  [Fiat, subscription-based](/cloud/pricing) |   GRT, pay-per-query                     |
|  Decentralization               |  Decentralized data sourcing via [SQD Network](/subsquid-network), with opt-in decentralized data targets (Kwil DB, Ceramic) and processing (via Lava, in development)  |  The Graph network   |

## Architecture difference

![SQD vs The Graph](</img/thegraph-vs-subsquid.png>)

By design, The Graph indexing node is a black-box that executes subgraphs compiled into WASM. The data is sourced directly from the archival node and local IPFS, and the processed data is stored in a built-in Postgres database. The data stored in the database is considered to be "sealed", so that no external process can modify or read the data except through the GraphQL interface. 

