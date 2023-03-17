---
sidebar_position: 10
title: Overview
description: Giant Squid API overview
---

# Giant Squid API

Giant Squid is a set of open-source GraphQL APIs built with Squid SDK and maintained by Subsquid Labs. The APIs cover the most commonly used data for Pokadot, Kusama and a growing list major parachains and is used by explorers (such as [Calamar](https://calamar.app)) and wallets (e.g. SubWallet). For support and feature requests, join the [SquidDevs channel](https://t.me/HydraDevs) or [Discord](https://discord.com/invite/subsquid).

The Giant Squid currently consists of two families of endpoints outlined below. The API endpoints for each network and the current status are available at the [Status page](/giant-squid-api/statuses).

- [Explorer API](/giant-squid-api/gs-explorer). The endpoint URLs follow the convention `https://squid.subsquid.io/gs-explorer-${network}/graphql`. Support queries on:
    - Blocks
    - Events
    - Extrinsics
    - Calls

- [Statistics API](/giant-squid-api/gs-stats). The endpoint URLs follow the convention `https://squid.subsquid.io/gs-stats-${network}/graphql`. Support queries on:
   - Validator/Collator data
   - Staking statistics
   - Nomination pools statistics
   - Transfers statistics
   - Extrinsic statistics
