---
sidebar_position: 10
title: Overview
description: Giant Squid API overview
---

# Giant Squid API
## Intro
Giant Squid is a set of open-source GraphQL APIs built with Squid SDK and maintained by Subsquid Labs. The APIs cover the most commonly used data for Pokadot, Kusama and a growing list major parachains and is used by explorers (such as [Calamar](https://calamar.app)) and wallets (e.g. SubWallet). For support and feature requests, join the [SquidDevs channel](https://t.me/HydraDevs) or [Discord](https://discord.com/invite/subsquid).

The Giant Squid currently consists of three families of endpoints outlined below. The API endpoints for each network and the current status are available at the [Status page](/giant-squid-api/statuses).

- [Explorer API](/giant-squid-api/gs-explorer). The endpoint URLs follow the convention `https://squid.subsquid.io/gs-explorer-${network}/graphql`. Supports queries on:
    - Blocks
    - Events
    - Extrinsics
    - Calls

- [Statistics API](/giant-squid-api/gs-stats). The endpoint URLs follow the convention `https://squid.subsquid.io/gs-stats-${network}/graphql`. Supports queries on:
   - Validator/Collator data
   - Account balances
   - Staking statistics
   - Nomination pools statistics
   - Transfers statistics
   - Extrinsic statistics

- [Main API](/giant-squid-api/gs-main). The endpoint URLs follow the convention `https://squid.subsquid.io/gs-main-${network}/graphql`. Supports queries on:
    - Accounts
    - Transfers
    - Staking rewards
    - Identities

## Roadmap
| Est. date | GS family | Features | Description 
| :-: | :-: | :-- | :-- |
Released ✅| Main | <p>Indentity</p> <p>Crowdloans</p><p>Auctions</p><p>Balances transfers</p> | The first release version of the Giant Squid Main will allow users to track all native transfers on the parachain. Additionally, users will be able to access identity data, such as main fields, verification status, and sub-accounts. |
Released ✅ | Statistics | <p>Charts optimization</p> <p>Account balances</p> | This update will change the schema and optimize endpoints to allow users to build charts based on every listed indicator with different intervals, while still providing the ability to access the latest state of these indicators. Additionally, it will provide information about the current balances of all accounts on the chain.|
July 2023 | Main | <p>Staking</p> <p>Parachain Staking</p> <p>DApp Staking</p>  | Massive staking update that will cover all popular substrate staking pallets on their respective chains. The indexing will include data about users' bonds, rewards, and slashes. Additionally, the update will track information about eras (rounds) and validators (collators) or dApps. |
July 2023 | Main | <p>Schema and stability improvement</p>  | A comprehensive update of our schema and an overall structural improvement. This will enhance the overall performance and usability of the API, as well as faciliate support and addition of new chains. |
August 2023 | Main |<p>ORML Assets</p><p>ORML Uniques</p><p>RMRK</p><p>ERC20</p><p>ERC721</p><p>ERC1155</p>| Tokens update! This update will provide detailed information about tokens, including their collections,transfers and metadata. |
August 2023 | Main | <p>ORML Tokens</p><p>ORML Currencies</p><p>XcmPallet</p><p>ORML XTokens</p> | A continuation of the previous update. New version will cover several additional tokens' pallets and will allow to track XCM transfers|
September 2023 | Main | <p>Crowdloans</p><p>Auctions</p><p>Governance</p> | New comprehensive data about all kinds of proposals and referendas as well as info about users' votes on them The first release version of the Giant Squid Main will allow users to track all native transfers on the parachain. Another feature is detailed information about crowdloans and auction campaigns, including users' contributions to them. |
TBA | <p>Main</p><p>Statistics</p><p>Explorer</p>|<p>BigQuery</p><p>S3</p> | This update will provide new ways to access indexed data from Giant Squid. The data will be available as raw tables, and users will be able to build custom aggregations with it. |
TBA| Main | <p>Unifying endpoint</p> | A new endpoint that will provide resolvers to access the same data in the different chains by a single query. For example, all transfers of user's account accross all the chains in a single ordered list|
