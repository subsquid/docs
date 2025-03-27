---
title: Portal beta info
sidebar_class_name: hidden
pagination_next: null
pagination_prev: null
---

# SQD Portal Open Beta

Welcome to the SQD Portal Open Beta! We appreciate your interest. Below, you’ll find clear instructions on what to do next and what to expect.

## What is the SQD Portal?

The SQD Portal is a decentralized, streaming-based data retrieval solution designed to replace our centralized gateways. It provides faster, more reliable, and flexible access to blockchain data.

SQD Portal can supply both historical and real-time data seamlessly, eliminating the need for an RPC endpoint. Real-time capability is currently only available for Solana, with plans to add it for all EVM and Substate networks soon.

#### Key Features

- **Fully Decentralized**: Powered by 1,600+ independent worker nodes.
- **30x Replication**: Redundant data storage for maximum reliability, capable of querying up to **20 million blocks per second**.
- **Improved Performance**: A new Rust-based query engine now leverages parallelized queries and incorporates numerous query execution performance optimizations, delivering an overall **10-50x performance boost** compared to the centralized gateways.
  + Note that the performance improvement only affects data retrieval. If your application has another bottleneck (typically the database) you may only see a moderate gain in indexing speed.
- **Real-time Capability**: Portal is now capable of streaming real-time data, including unfinalized blocks.
  + _Currently only available on Solana_
  + TBA soon for EVM and Substrate

## What You Can Do

### 1. Explore the Public Portal

Public Portal allows access to nearly all the datasets that were available from the centralized gateways. Use it for development and tests.

Browse EVM and Substate datasets at [portal-ui.sqd.dev](https://portal-ui.sqd.dev/). Solana and [compatible SVM networks](/subsquid-network/reference/networks/#solana-and-compatibles) are also available. Real time data is only enabled for Solana Mainnet.

### 2. Migrate to the Cloud Portal

If you're a Cloud user, consider switching from centralized gateways to the dedicated Cloud Portal.
- Get the performance and other latest features of the new query engine.
- **Migration guides**:
  - [For EVM and Substate users](/cloud/resources/migrate-to-portal-on-evm-or-substrate)
  - [For Solana users](/cloud/resources/migrate-to-portal-on-solana)

### 3. Check out Soldexer: SQD's spinoff in the Solana world

If you are a Solana user, take a look at [soldexer.ai](https://soldexer.ai). The project features a new client architecture enabled by the updated Portal API.

### 4. Set Up a Self-Hosted Portal

- Take full control of your data infrastructure by running your own Portal.
- **Setup Guide**: [Self-Hosting Instructions](/subsquid-network/participate/portal)
- **Requirements**
  - Minimum 10,000 SQD tokens.
  - A working Docker installation.
  - Some Arbitrum ETH for gas.

----

If you have any questions or feedback for us, please reach out to us on Telegram. We have created a special group for Portal Beta participants: [https://t.me/+JHrJZPz34kRjYmFk](https://t.me/+JHrJZPz34kRjYmFk). 

Thank you for being part of the beta! 

— **The SQD Team**
