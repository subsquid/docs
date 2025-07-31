---
sidebar_position: 30
title: FAQ
---

### What is SQD Network?

SQD Network is a decentralized data lake focused on making blockchain data accessible, regardless of scale. [Worker nodes](/subsquid-network/participate/worker) of the network store the data and run queries on their local data chunks; data access nodes (called _SQD portals_) request partial query results from multiple workers, concatenate the outputs and expose a stream-based API.

### How can I participate in SQD Network?

Here are the possibilities:

1. You can [run a worker node](/subsquid-network/participate/worker). Workers contribute storage and compute resources to the network and are rewarded with `SQD` tokens.

2. You can reward well-performing workers by [delegating your `SQD` tokens](/subsquid-network/participate/delegate) to them and get rewarded for that.

### What is a decentralized data lake?

A decentralized data lake is a distributed system that stores and organizes large amounts of raw data in its native format until it's needed. SQD Network is an example of a decentralized data lake, providing scalable and efficient access to blockchain data.

### What are some use cases for SQD’s decentralized data lake?

SQD's decentralized data lake can be used for indexing blockchain data, powering blockchain explorers, analytics platforms, multi-chain aggregators, APIs for real-time and historical data, dApp backends and more. 

### Is SQD production-ready? Can I trust it for my dApp? 

Yes! SQD is production-ready and reliable for your dApp. It has been effectively used in over 500 use cases across ecosystems, proving its trustworthiness and utility within the Web3 developer community.

### What are the hardware requirements to run a worker node?

To run a single worker you will need:

- 4 vCPU
- 16GB RAM
- 1TB SSD
- stable 24/7 Internet connection, at least 1Gbit
- public IP and two ports open for incoming traffic:
  + one UDP port for p2p communication (default 12345)
  + one TCP port for Prometheus metrics (default 9090)
- 100000 `SQD` tokens (in your wallet or in a special vesting contract)
- some Arbitrum ETH (for gas)

Please refer to [this page](/subsquid-network/participate/worker) for further instructions. 

A single account can register multiple workers.

### How do I deploy a simple squid indexer?

Start your first squid indexer in 5 minutes! Learn more [here](/sdk/how-to-start/squid-development/#templates).

### What kind of datasets are available from SQD Network?

Historical blockchain data optimized for batch access.

### What chains are currently supported by SQD’s decentralized data lake and SDK?

SQD Network currently supports EVM / Ethereum-compatible chains, Substrate-based chains, Solana, Fuel and Starknet ([full list](/subsquid-network/reference/networks)). More ecosystems will be integrated in the near future -- feel free to request in [SquidDevs](https://t.me/HydraDevs).

### How can I add a new chain to be indexed by SQD Network?

Simply reach out via [this form](https://app.deform.cc/form/3f1021b2-6b70-4850-af09-a3b610f048a4), and we’ll get back to you as soon as possible.

### I can’t code. How can I participate in SQD Network? 

As a non-coder, you will be able to participate in the SQD Network directly by [delegating SQD tokens](/subsquid-network/participate/delegate) to reliable workers to receive a percentage of the reward.

Additionally you can drive the growth of the SQD Network by helping to cultivate a vibrant community, amplifying the network's reach through social media and other platforms.

### Does participating in SQD Network require committing my tokens?

Yes. If you delegate your SQD or register a worker, your tokens will be locked for a period of 50000 Ethereum blocks, starting at the end of the current [epoch](#epoch).

### What is SQD’s roadmap?

You can find the up-to-date roadmap [here](https://www.sqd.dev/roadmap).

### Does SQD Network have an app?

Take a look at [network.subsquid.io](https://network.subsquid.io).

### Why did SQD choose Arbitrum for its contracts?

We have chosen Arbitrum for its large community and the availability of quality tooling for smart contract deployment.

### Where is the data that SQD Network indexes stored? 

The data indexed by the SQD Network is stored in persistent storage. During the bootstrap phase, the persistent storage used by Subsquid Labs is an s3 compatible service with backups pinned to IPFS.

### What is the difference between SQD Network and the Graph Network?

Learn about the differences and see a full feature matrix [here](/sdk/subsquid-vs-thegraph).

### How does the SQD Network make blockchain data accessible for free? Are there costs involved?

The [open private](/subsquid-network/overview/#open-private-network) SQD Network offers the data for free to consumers while charging fixed subscription fees to chains from which the data is provided.

The [permissioness public](/subsquid-network/overview/#permissionless-public-network) version of SQD Network requires users to lock `SQD` tokens to reserve bandwidth (i.e. requests per second). However, this limitation only applies if you're running an SQD portal yourself: SQD provides a free rate-limited portal open to everyone.

For hosting indexers, we offer our [SQD Cloud](/cloud) service. Free unlimited access to a dedicated SQD portal is included in subscription; you only pay for the computational resources you're using (such as CPUs, SSD space etc). Check out its [competitive pricing](/cloud/pricing).

Note that the fact that we have a paid hosting service does not mean that you cannot self-host your indexer(s). Feel free to shop around and find the best hosting infrastructure for your project! Here's our [self-hosting guide](/sdk/resources/self-hosting).

### How does SQD ensure the security and privacy of the data accessed through the network?

SQD Network will employ validators who listen to the logs of the executed queries and resubmit them to validate the response. There's also an arbitration process to handle any discrepancies.

### What is "an epoch" in the context of SQD Network? {#epoch}

"Epoch" is a unit of time that SQD Network uses for internal settlement. It is [defined on-chain](https://arbiscan.io/address/0x4cf58097d790b193d22ed633bf8b15c9bc4f0da7#readContract#F3) and is currently set to be 100 L1 (Ethereum) blocks, or roughly 20 minutes.

### What is Tethys? {#tethys}

Tethys is the long-running testnet of SQD Network. Its contracts run on Arbitrum Sepolia. More details are available [here](https://github.com/subsquid/subsquid-network-contracts/wiki/Tethys-testnet-announcement).
