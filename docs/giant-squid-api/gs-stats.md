---
sidebar_position: 20
title: Statistics API
description: >-
  Receive analytics-ready statistics of the chain
---

# Giant Squid Stats

:::caution
Please be aware that this part of the Giant Squid API is currently in beta version. This means that it is still undergoing testing and development, and as such, there may be bugs and changes to its functionality and structure before it is finalized.
:::

:::info
Giant Squid Stats is an open-source project. You can find source code [here](https://github.com/subsquid-labs/giant-squid-stats)
:::

**Stats** part of The Giant Squid API provides developers and data analysts with useful and relevant statistics of a blockchain. The Stats API provides access to a wide range of statistics, including the number of extrinsics, tranfers, staking stats, issuances, holders and much more. This data is available both in real-time and historical formats, allowing users to monitor trends and track performance over time.

:::info
Full list of supported chains you can find on statuses [page](/giant-squid-api/statuses).
:::

## API schema

:::info
Some fields in entities are not used in all chains. However, to maintain overall consistency of the schemas, we do not remove them. Such fields are noted with 'Only for...' comments.
:::

<details>

<summary>Total</summary>

```graphql
"""
Latest global stats of the chain
"""
type Total {
  id: ID!
  finalizedBlocks: BigInt!
  totalIssuance: BigInt!
  signedExtrinsics: BigInt!
  "Total amount of native transfers"
  transfersCount: BigInt!
  "Total amount of accounts in chain"
  holders: Int!
  "Only for parachain staking"
  collatorsIdealCount: Int
  collatorsCount: Int
  "Only for simple staking"
  validatorsIdealCount: Int
  validatorsCount: Int
  "Staking era"
  currentEra: Int
  "Parachain Staking round"
  currentRound: Int
  "Amount of total available balances of all account"
  circulatingAssetsTotal: BigInt
  stakedValueTotal: BigInt
  "Only for relay chains"
  stakedValueValidator: BigInt
  "Only for parachain staking"
  stakedValueCollator: BigInt
  "Only for parachain staking"
  stakedValueNominator: BigInt
  "Only for relay chains"
  nominationPoolsCountMembers: Int
  "Only for relay chains"
  nominationPoolsCountPools: Int
  "Only for relay chains"
  nominationPoolsTotalStake: BigInt
}
```

</details>

<details>

<summary>Account</summary>

```graphql
"""
Current native balance of an account
"""
type Account {
  "Public key"
  id: ID!
  free: BigInt!
  reserved: BigInt!
  total: BigInt!
  "Latest block when balance changed"
  updatedAtBlock: Int
}
```

</details>

<details>

<summary>Issuance</summary>

```graphql
"""
Total Issuance historical data
"""
type Issuance {
  "Block number"
  id: ID!
  volume: BigInt!
  timestamp: DateTime!
  blockHash: String!
}
```

</details>

<details>

<summary>NominationPool</summary>

```graphql
"""
Staking Nomination pools historical data
"""
type NominationPool {
  "Block number"
  id: ID!
  totalPoolsCount: Int!
  totalPoolsMembers: Int!
  totalPoolsStake: BigInt!
  timestamp: DateTime!
  blockHash: String!
}
```

</details>

<details>

<summary>ValidatorCollator</summary>

```graphql
"""
Historical amount of validators (for chains with staking) and collators (for parachain staking)
"""
type ValidatorCollator {
  "Block number"
  id: ID!
  timestamp: DateTime!
  idealCount: Int!
  count: Int!
  blockHash: String!
}
```

</details>

<details>

<summary>StakedValue</summary>

```graphql
"""
Historical stats about Staking or ParachainStaking pallets of chain
"""
type StakedValue {
  "Block number"
  id: ID!
  "Staking era"
  currentEra: Int
  "ParachainStakingRound"
  currentRound: Int
  "ParachainStaking"
  collatorsCount: Int
  "Staking validators of current era"
  activeValidators: Int
  "Total amount of Staking validators for all time"
  totalValidators: Int
  "Total nominators of Staking validators for all time"
  totalNominators: Int
  "Staking inflation based on https://research.web3.foundation/en/latest/polkadot/overview/2-token-economics.html#inflation-model"
  inflationRatio: Float
  "Staking APR based on https://research.web3.foundation/en/latest/polkadot/overview/2-token-economics.html#inflation-model"
  rewardsRatio: Float
  timestamp: DateTime!
  "Total stake by validators stake + nominators stake"
  totalStake: BigInt!
  "ParachainStorage total stake by storage"
  totalStakeStorage: BigInt
  "Only for relay chains"
  validatorStake: BigInt
  "Only for parachain staking"
  collatorStake: BigInt
  nominatorStake: BigInt!
  "Only for relay chains"
  blockHash: String!
}
```

</details>

<details>

<summary>Transfer</summary>

```graphql
"""
Historical amount of transfers
"""
type Transfer {
  "Block number"
  id: ID!
  timestamp: DateTime!
  blockHash: String!
  "Volume of all transfers"
  totalVolume: BigInt!
  "Amount of transfers"
  totalCount: Int!
}
```

</details>

<details>

<summary>Extrinsic</summary>

```graphql
"""
Historical amount of signed extrinsics
"""
type Extrinsic {
  "Block number"
  id: ID!
  timestamp: DateTime!
  blockHash: String!
  totalCount: Int!
}
```

</details>

## Examples
:::info
All historical values have a strict update interval of 1 hour. With this approach, you can fetch historical entities in a time range that you need and build custom aggregations with your desired interval.
:::

### Example 1: Get historical stats

Let's see how total was changing during some day

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  issuances(where: {timestamp_gte: "2023-01-11T00:00:00.000000Z", timestamp_lt: "2023-01-12T00:00:00.000000Z"}, orderBy: id_ASC) {
    volume
    timestamp
  }
}    
```

</details>

<details>

<summary>Response sample</summary>

```json
{
  "data": {
    "issuances": [
      {
        "volume": "12708122725048402550",
        "timestamp": "2023-01-11T00:53:18.017000Z"
      },
      {
        "volume": "12708130906573496178",
        "timestamp": "2023-01-11T01:53:24.015000Z"
      },
      {
        "volume": "12708130905788243098",
        "timestamp": "2023-01-11T02:53:24.017000Z"
      }
    ]
  }
}
    
```

</details>

### Example 2: Get current stats

Let's see current nomination pool stats

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  totals {
    nominationPoolsCountPools
    nominationPoolsCountMembers
    nominationPoolsTotalStake
  }
}
```

</details>

<details>

<summary>Response</summary>

```json
{
  "data": {
    "totals": [
      {
        "nominationPoolsCountPools": 104,
        "nominationPoolsCountMembers": 7384,
        "nominationPoolsTotalStake": "26809302571237243"
      }
    ]
  }
}
    
```

</details>
