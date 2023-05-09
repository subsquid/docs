---
sidebar_position: 120
---

# Glossary

### Archive

A data source for squids that stores the historical block data in a normalized way. See [Archives](/archives).

### Aquarium

A cloud service to deploy and run squids in a serverless fashion maintained by Subsquid Labs GmbH. See [Deploy a Squid](/deploy-squid)

### Block

A set of external transactions and execution logs that defines an atomic state transition of the chain. The chain blocks have a well-defined structure and are partially ordered by the hash references. See more details in the [Substrate docs](https://docs.substrate.io/fundamentals/transaction-types/)

### Call

A call is a sub-routine changing the runtime state. An extrinsic consists of a root call which in turn may have sub-calls, thus calls executed by an extrinsic have parent-child relationship. For example, `util.batch` extrinsic has a single root call and multiple child calls. Subsquid processor is call-based rather than extrinsic based, as normally one is interested in specific calls changing the substrate state, no matter if it was part of a batch extrinsic, or it was wrapped in a sudo or proxy call. 

### Contracts pallet

A pallet developed by Parity to execute WASM-based smart contracts. 

### ETL

Stands for Extract-Transform-Load. A pipeline to extract data from the source, enrich, transform, normalize and load into the target data store. 

### Event

A structured log message emitted by the Substrate runtime and stored on-chain as part of the block data.

### EVM

Stands for the Ethereum Virtual Machine. An instruction set and the runtime specification originally developed for the Ethereum network which was later adopted by many other chains (e.g. BSC, Polygon). 

### Extrinsic

A generalized transaction externally submitted to a Substrate runtime for execution. There are [technical nuances](https://substrate.stackexchange.com/questions/2248/is-a-transaction-an-extrinsic) differentiating transactions and extrinsics.

### FRAME pallets

A collection of standard Substrate pallets maintained by Parity. Currently kept in the [Substrate Repo](https://github.com/paritytech/substrate/tree/master/frame)

### Frontier palette

A Substrate palette implementing the Ethereum Virtual Machine. In particular, Substrate chains with a Frontier palette support EVM-based smart contracts. See [Parity Tech Docs page](https://paritytech.github.io/frontier/frame/evm.html)

### GraphQL

A declarative query language and an API specification developed by Facebook as an alternative to REST. See the official [GraphQL docs](https://graphql.org/) for more details.

### ink!

An SDK (software development kit) and a smart-contract language for developing WASM-based smart contracts, maintained by Parity. The contracts developed with ink! are compiled into a WASM blob compatible with the API exposed by the `Contracts` pallet. More details [here](https://paritytech.github.io/ink/)

### OpenReader

An open-source GraphQL server that automatically generates an expressive API from an input schema file. See the [repo](https://github.com/subsquid/squid/tree/master/openreader) and [details](/graphql-api).

### Palette

A portable module that can be added to the Substrate runtime. Typically, contains a self-contained implementation of a business logic that can be re-used across multiple chains. 

### Schema file

A file describing the target data schema for a squid, normally called `schema.gql`. The file uses a GraphQL dialect to define entities, properties and relations. See [details here](/basics/schema-file).

### State

A key-value map defining the internal world view of the Substrate runtime in a specific point of time. The consensus algorithm ensures that the honest majority of the nodes agree on the runtime state. 

### Storage

A persistent key-value database kept by the Substrate nodes. It is used to access the current and historical state. See details on the [Substrate docs page](https://docs.substrate.io/fundamentals/state-transitions-and-storage/)

### Squid

A project consisting for an ETL for extracting and transforming on-chain data (squid processor), and an API to present the target (squid API)

### Squid processor

The ETL part of the squid. Extracts on-chain data from an Archive, transforms, optionally enriches with external data and saves into a target database.

### Squid API

The data presentation part of the squid. Typically, it's a GraphQL API auto-generated from the schema file. See details [here](/graphql-api).

### Substrate

A framework for developing blockchain runtimes. Used to develop the Polkadot, Kusama chains and all the parachains.

### Substrate Runtime

The code run by the chain nodes that defines the state transitions. The runtime defines the business logic of the chain. See details on the [Substrate docs page](https://docs.substrate.io/fundamentals/architecture/).

### Subsquid SDK

A collection of open-source libraries to build squids.

### Typegen

A tool generating strongly typed data access classes from a metadata in some format. Subsquid SDK includes typegen tools:
- for accessing event, extrinsics and storage data based on the substrate metadata. See [Substrate typegen](/substrate-indexing/squid-substrate-typegen)
- for accessing EVM smart contract data based on the contract ABI. See [EVM typegen](/evm-indexing/squid-evm-typegen)
- for accessing ink! smart contract data based on the contract metadata. See [ink! typegen](https://github.com/subsquid/squid-sdk/tree/master/substrate/ink-typegen)

### WASM

A portable binary code format and the execution environment specification. WASM programs enjoy deterministic outputs and near-native execution speeds, which makes WASM an attractive alternative to EVM.
