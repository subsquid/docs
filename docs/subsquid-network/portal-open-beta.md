---
title: Portal beta info
sidebar_class_name: hidden
pagination_next: null
pagination_prev: null
---

# SQD Portal Open Beta

Welcome to the SQD Portal Open Beta! Below you’ll find easy-to-follow instructions on what to do next and what you can expect from this release.

## What is the SQD Portal?

The SQD Portal is a decentralized, streaming-based data retrieval solution designed to replace our centralized gateways. It provides faster, more reliable, and flexible access to blockchain data.

SQD Portal can supply both historical and real-time data seamlessly, eliminating the need for an RPC endpoint. Real-time capability is currently only available for Solana, with plans to add it for all EVM and Substate networks soon.

#### Key Features

- **Fully Decentralized**: Powered by 1,900+ independent worker nodes.
- **High Replication**: Redundant data storage for maximum reliability, capable of querying up to **20 million blocks per second**.
- **Improved Performance**: A new Rust-based query engine now leverages parallelized queries and incorporates numerous query execution performance optimizations, delivering an overall **10-50x performance boost** compared to the centralized gateways.
  + Note: This performance improvement is specific to data retrieval. If your application faces other bottlenecks (like database limitations), you may experience a more moderate gain in indexing speed.
- **Real-time Capability**: Portal is now capable of streaming real-time data, including unfinalized blocks.
  + _Currently only available on Solana_
  + Coming soon for EVM and Substrate networks

## What You Can Do

### 1. Explore Soldexer — Our New Brand for Solana

If you’re working with Solana, visit [soldexer.dev](https://soldexer.dev) to check out our new client architecture, powered by the updated Portal API.

### 2. Migrate to the Cloud Portal

Cloud users can now switch from centralized gateways to our dedicated Cloud Portal and benefit from enhanced performance and the latest features of our new query engine.
- **Migration guides**:
  - [For EVM and Substate users](/cloud/resources/migrate-to-portal-on-evm-or-substrate)
  - [For Solana users](/cloud/resources/migrate-to-portal-on-solana)

### 3. Set Up a Self-Hosted Portal

- Take complete control of your data infrastructure by running your own Portal.
- **Setup Guide**: [Self-Hosting Instructions](/subsquid-network/participate/portal)
- **Requirements**
  - Minimum 10,000 SQD tokens.
  - A working Docker installation.
  - Some Arbitrum ETH for gas.


### 4. Explore the Public Portal

Public Portal allows access to nearly all the datasets that were available from the centralized gateways. Use it for development and tests.

Browse EVM datasets at [portal-ui.sqd.dev](https://portal-ui.sqd.dev/). Solana [(and compatible SVM networks)](/subsquid-network/reference/networks/#solana-and-compatibles) and Substrate datasets will be available soon.

----

If you have any questions or feedback for us, please reach out to us on Telegram. We have created a special group for Portal Beta participants: [link](https://t.me/+JHrJZPz34kRjYmFk). 

— **The SQD Team**
