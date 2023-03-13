---
sidebar_position: 1
title: Subsquid vs TheGraph
description: Comparison of Subsquid and TheGraph
---

# Subsquid vs TheGraph

[TheGraph](https://thegraph.com) is an indexing protocol and framework for EVM chains. In TheGraph, indexing projects are called subgraphs. A subgraph typically listens to events emitted by a smart contract and presents the indexed data with a user-defined GraphQL API. A subgraph can be compared to a squid, but with significantly less flexibility due to the design of indexing nodes used in TheGraph.


## Feature matrix

|                                 |  Subsquid                 |            TheGraph                      |  
|:-------------------------------:|:-------------------------:|:--------------------------------------- :|
|  Programming language           |     Typescript            |    AssemblyScript (complied to WASM)     |
|  Indexing speed                 |     ~1k-50k bps            |       ~100-150 bps                      |
|  ABI-based generator            |        Yes                |          Yes                             |
|  Real-time unfinalized blocks   |     Yes (*)               |          No                              |  
|  Off-chain data (via APIs)      |        Yes                |        No                                |
|  Data targets                   |     Customizable          |      Postgres-only                       |
|  Customizable DB migrations     |        Yes                |        No                                |
|  Factory contract indexing      |   Yes, via wildcards      |       Yes                                |
|  Multi-contract indexing        |        Yes                |     Limited                              | 
|  Analytic data targets          |  BigQuery, Parquet, CSV   |        No                                |
|  Local setup                    |       Easy                |       Requires an archival node          |    
|  GraphQL API                    |    Generated from `schema.graphql`      |        Generated from `schema.graphql` |
|  Custom resolvers and mutations |  Yes         |   No   | 
|  Subscriptions                  |  Yes         |  Via middleware       |
|  Hosted service                 |  Yes         |  Yes (to be sunset)  |
|  Secret env variables           |  Yes         |  No                  |
|  Payment                        |  Fiat, subscription-based (**) | GRT, pay-per-query  |
|  Decentralization               |  Opt-in via decentralized data targets (Kwil DB, Ceramic)  (***)    |  TheGraph network   |


(*) to be supported by the Squid SDK

(**) for the Aquarium Premium plan

## Architecture difference

![Subsquid vs TheGraph](</img/thegraph-vs-subsquid.png>)

By design, TheGraph indexing node is a black-box that executes subgraphs compiled into WASM. The data is sourced directly from the archival node and local IPFS, and the processed data is stored in a built-in Postgres database. The data stored in the database is considered to be "sealed", so that no external process can modify or read the data except through the GraphQL interface. 

On the contrary, Subsquid employs a radically open modular architecure with separated data extraction and filtering (Archives) and data transformation and presentation (Squid SDK). The Squid SDK offers pluggable data targets for both online and offline use-cases.
