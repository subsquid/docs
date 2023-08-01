---
sidebar_position: 112
title: Subsquid network
---

# Subsquid Network FAQ v1

### What is Subsquid Network?

Subsquid Network is a decentralized data lake focused on making blockchain data accessible, regardless of scale. It employs a state-of-the-art data compression and a lightweight querying engine that enables cost-efficient access to on-chain data. As of the current release of the testnet, the querying engine is being decentralized through a network of worker nodes that contribute storage and compute resources to the network, in order to serve the data in a peer to peer fashion to consumers.

### How can I participate in Subsquid Network?

As of the Mirovia release (June 2023), it is possible to provide infrastructure by running a worker node instance. Workers contribute storage and compute resources to the network and are rewarded with $SQD tokens.

Fill out [this form](https://app.deform.cc/form/0aca51c6-3db0-41d5-a084-8b5344ed97be/) in order to get onboarded. 

### What is a decentralized data lake?

A decentralized data lake is a distributed system that stores and organizes large amounts of raw data in its native format until it's needed. Subsquid Network is an example of a decentralized data lake, providing scalable and efficient access to blockchain data.

### What are some use cases for Subsquid’s decentralized data lake?

Subsquid's decentralized data lake can be used for indexing blockchain data, powering blockchain explorers, analytics platforms, multi-chain aggregators, APIs for real-time and historical data, dApp backends and more. 

### Is Subsquid production-ready? Can I trust it for my dApp? 

Yes! Subsquid is production-ready and reliable for your dApp. It has been effectively used in over 500 use cases across ecosystems, proving its trustworthiness and utility within the Web3 developer community.

### What are the hardware requirements to run a worker node?

To run a single worker you will need:

- 4 vCPU
- 8GB RAM
- 1TB SSD
- public IP and one port open for incoming TCP traffic (default is 12345, but can be changed)
- 100_000 tSQD tokens
- Some AGOR (Arbitrum Goerli)

There are two options to run the worker:

* using Docker
* from sources

Please refer to this [wiki](https://github.com/subsquid/subsquid-network-contracts/wiki/Mirovia-worker-instructions#requirements) for further instructions. 

A single account can register multiple workers.

### How do I deploy a simple squid indexer?

Start your first squid indexer in 5 minutes! Learn more [here](https://docs.subsquid.io/quickstart/).

### What is a Subsquid Archive?

Archive is a specialized data lake for on-chain data, optimized for batch data access. The Archive API is meant to be used as a data source for Squid SDK processors. All the Archives together, with the network of worker nodes, form the Subsquid Decentralized Data Lake.

### What chains are currently supported by Subsquid’s decentralized data lake and SDK?

Subsquid Network currently supports EVM- and Substrate-based chains, with plans to support Cosmos-based chains and Solana in the relatively near future. 

### How can I add a new chain to be indexed by Subsquid Network?

Simply reach out via [this form](https://app.deform.cc/form/3f1021b2-6b70-4850-af09-a3b610f048a4), and we’ll get back to you as soon as possible.

### I can’t code. How can I participate in Subsquid Network? 

As a non-coder, you will be able to participate in the Subsquid Network directly by delegating $SQD tokens to reliable workers to receive a percentage of the reward. 

Additionally you can drive the growth of the Subsquid Network by helping to cultivate a vibrant community, amplifying the network's reach through social media and other platforms.

### What is Subsquid’s roadmap?

You can find the up-to-date roadmap [here](https://github.com/subsquid/subsquid-network-contracts/wiki/Roadmap).

### Does Subsquid Network have an app?

Indeed, our team is hard at work developing a dedicated app for the Subsquid Network. The app will provide a more streamlined and user-friendly way to interact with the network. Stay tuned for updates as we get closer to its expected launch this September!

### Why did Subsquid choose Arbitrum Goerli for the testnet?

We have chosen Arbitrum Goerli for Arbitrum’s large community and the availability of quality tooling for smart contract deployment. We have yet to decide where we will deploy our smart contracts for the Subsquid mainnet. 

### Where is the data that Subsquid Network indexes stored? 

The data indexed by the Subsquid Network is stored in persistent storage. During the bootstrap phase, the persistent storage used by Subsquid Labs is an s3 compatible service with backups pinned to IPFS.

### What is the difference between Subsquid Network and the Graph Network?

Learn about the differences and see a full feature matrix [here](https://docs.subsquid.io/migrate/subsquid-vs-thegraph/).

### How does the Subsquid Network make blockchain data accessible for free? Are there costs involved?

Subsquid Network offers the data for free to consumers while charging fixed subscription fees to chains from which the data is provided. 

Of course, we can’t make the cost of hosting indexers or GraphQL free-of-charge. We invite you to consider the Aquarium’s simple subscription model, as well as to shop around and find the best hosting infrastructure for your project. 

### How does Subsquid ensure the security and privacy of the data accessed through the network?

Subsquid Network employs validators who listen to the logs of the executed queries and resubmit them to validate the response. There's also an arbitration process to handle any discrepancies.
