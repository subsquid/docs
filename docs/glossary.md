---
sidebar_position: 120
pagination_next: null
---

# Glossary

### Archives

Deprecated term used for [SQD Network](/subsquid-network) and for the data sourcing service of the deprecated FireSquid SDK version. Occasionally refers to a chain-specific endpoint available from either source (e.g. "an Ethereum archive"). The new terminology is:

 - "Archives" as an abstract collection of services for some networks is replaced by "[SQD Network](/subsquid-network)" (when referring to data location) or "SQD Network gateway" (when referring to the service)
 - "public Archives" are replaced by the [open private version](/subsquid-network/overview/#open-private-network) of SQD Network
 - "an archive" for a particular network is replaced by "a SQD Network gateway"

List of gateways for the open private SQD Network is available in [these docs](/subsquid-network/reference/networks) and via [`sqd gateways`](/squid-cli/gateways).

**Not to be confused with [archive blockchain nodes](https://ethereum.org/developers/docs/nodes-and-clients/archive-nodes)**.

### `archive-registry`

The deprecated NPM package `@subsquid/archive-registry` that was used to look up squid data sources by network aliases (with `lookupArchive()` and a small CLI). We now recommend using raw gateway URLs instead of `lookupArchive()` calls in processor configuration. The exploratory CLI is replaced by [`sqd gateways`](/squid-cli/gateways); list of available network-specific gateways is also [available in these docs](/subsquid-network/reference/networks).

### Block

An atomic state transition of a blockchain. Typically an ordered collection of transactions.

### Call

On [Substrate](#substrate), a call is a sub-routine changing the runtime state. An extrinsic consists of a root call which in turn may have sub-calls, thus calls executed by an extrinsic have parent-child relationship. For example, `util.batch` extrinsic has a single root call and multiple child calls. SQD processor is call-based rather than extrinsic based, as normally one is interested in specific calls changing the substrate state, no matter if it was part of a batch extrinsic, or it was wrapped in a sudo or proxy call. 

### Cloud (former Aquarium)

A [cloud service](/cloud) for deploying [squids](#squid) in a serverless fashion maintained by Subsquid Labs GmbH.

### Contracts pallet

[`Contracts`](https://substrate-developer-hub.github.io/substrate-how-to-guides/docs/pallet-design/add-contracts-pallet/) is a [pallet](#pallet) developed by Parity to execute WASM-based smart contracts. 

### ETL

Stands for Extract-Transform-Load. A pipeline to extract data from the source, enrich, transform, normalize and load into the target data store. 

### Event

An operation performed during a blockchain state transition that results in emission of a structured log message. Subsequently, the message can be retrieved from blockchain nodes.

### EVM

Stands for the Ethereum Virtual Machine. An instruction set and the runtime specification originally developed for the Ethereum network which was later adopted by many other chains (e.g. BSC, Polygon). 

### Extrinsic

On [Substrate](#substrate), a generalized transaction externally submitted to a Substrate runtime for execution. There are [technical nuances](https://substrate.stackexchange.com/questions/2248/is-a-transaction-an-extrinsic) differentiating transactions and extrinsics.

### FRAME pallets

A collection of standard [Substrate](#substrate) pallets maintained by Parity. Currently kept in the [Substrate Repo](https://github.com/paritytech/substrate/tree/master/frame).

### Frontier pallet

[Frontier](https://github.com/polkadot-evm/frontier) is a [Substrate](#substrate) [pallet](#pallet) implementing the [Ethereum Virtual Machine](#evm). In particular, Substrate chains with Frontier pallet support EVM-based smart contracts.

### GraphQL

A declarative query language and an API specification language developed by Facebook as an alternative to REST. See the official [GraphQL docs](https://graphql.org/) for more details.

### Hot blocks

An alternative term for [unfinalized blocks](/sdk/resources/unfinalized-blocks) that emphasizes the fact that the data extracted from these blocks is volatile. Sometimes used in Squid SDK code and comments.

### ink!

An SDK (software development kit) and a smart-contract language for developing WASM-based smart contracts, maintained by Parity. The contracts developed with ink! are compiled into a WASM blob compatible with the API exposed by the [`Contracts` pallet](#contracts-pallet). More details [here](https://use.ink).

### OpenReader

1. SQD's own open source [GraphQL server](/sdk/reference/openreader-server/overview), built in-house. No longer recommended for new projects running PostgreSQL due to its [limitations](/sdk/reference/openreader-server/overview/#limitations). See [Serving GraphQL](/sdk/resources/serving-graphql) to learn more.

2. The GraphQL [schema generation library](https://github.com/subsquid/squid-sdk/tree/master/graphql/openreader) at the heart of 1. Implements [OpenCRUD](https://www.opencrud.org/).

### Pallet

A portable module that can be added to a [Substrate](#substrate) runtime. Typically, contains a self-contained implementation of a business logic that can be re-used across multiple chains.
### Schema file

A file describing the target data schema for a squid, normally called `schema.graphql`. The file uses a GraphQL dialect to define entities, properties and relations. See [details here](/sdk/reference/schema-file).

### State

A key-value map defining the internal worldview of an EVM contract of a Substrate runtime at a specific point in time. The consensus algorithm ensures that the honest majority of the nodes agree on the runtime state.

### Storage

On [Substrate](#substrate), a persistent key-value database kept by the chain nodes. It is used to access the current and historical [state](#state). See details on the [Substrate docs page](https://docs.substrate.io/fundamentals/state-transitions-and-storage/)

### Squid

A project consisting of an [ETL](#etl) for extracting and transforming on-chain data (squid processor), and optionally an API to present the data (squid API).

### Squid processor

The [ETL](#etl) part of the squid. Extracts on-chain data from an [SQD Network](/subsquid-network) gateway and/or directly from chain RPC, then transforms and optionally enriches it with external data. Saves the result into a target [data sink](/sdk/reference/store).

### Squid API

The data presentation part of the squid. Typically, it's an [OpenReader](#openreader) GraphQL API auto-generated from a schema file.

### Substrate

[Substrate](https://substrate.io) is a framework for developing blockchain runtimes. Used to develop the Polkadot, Kusama chains and all the parachains.

### Substrate Runtime

The code that defines the state transition logic of a blockchain, and by extention its business logic. See details on the [Substrate docs page](https://docs.substrate.io/fundamentals/architecture/).

### Squid SDK

[Squid SDK](/sdk) is a collection of open-source libraries for building [squids](#squid).

### Typegen

A tool generating strongly typed data access classes from a metadata in some format. Squid SDK includes typegen tools:

- for accessing EVM smart contract data based on the contract ABI
- for accessing event, extrinsics and storage data based on [Substrate](#substrate) metadata
- for accessing [ink!](#ink) smart contract data based on the contract metadata

See [this section](/sdk/resources/tools/typegen) for documentation on these tools.

### WASM

A portable binary code format and an execution environment specification. WASM programs enjoy deterministic outputs and near-native execution speeds, which makes WASM an attractive alternative to EVM.
