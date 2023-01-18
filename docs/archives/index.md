---
sidebar_position: 90
title: Squid Archives
---


# Squid Archives

Squid Archive is a service that ingests raw on-chain data, stores it into persistent storage in a normalized way and exposes it via API for downstream data pipelines (such as Squid Processor) and ad-hoc exploration. Compared to data access using a conventional chain node RPC, an archive allows one to access data in a more granular fashion and from multiple blocks at once, thanks to its rich batching and filtering capabilities.


There are currently two major Archive releases incompatible with each other: `v5` and `FireSquid`. The current docs cover `FireSquid` as the old `v5` archives are now considered deprecated and will be sunset. 

## Public Archives

Subsquid maintains Archives for major parachains in the Polkadot ecosystem. Go to [Aquarium](https://app.subsquid.io/aquarium/archives) to browse the list of available archives. The list of public archives is also published as an npm package `@subsquid/archive-registry`. See [Archive Registry doc](/archives/archive-registry) for more details. If you are a network developer and would like to see your chain supported by Subsquid, please fill a [form](https://forms.gle/ioVNFiPjZgvUNunY9).

## Running a self-hosted archive

To run an Archive, follow the instructions in the [Archive Setup Repo](https://github.com/subsquid/squid-archive-setup).
For a full list of Archive set up options, see [Advanced Setup](/archives/archives-advanced-setup).

