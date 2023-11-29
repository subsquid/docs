---
sidebar_position: 30
title: Main API
description: >-
  Identities, transfers and staking
---

# Overview

:::info
Giant Squid Main is an open-source project. You can find the source code [here](https://github.com/subsquid-labs/giant-squid-main/)
:::

"Main" part of the Giant Squid API handles accounts, identities, transfers and staking.

## API schema

<details>

<summary>Account</summary>

```graphql
type Account @entity {
    id: ID!
    publicKey: ID! @index
    transfers: [Transfer!] @derivedFrom(field: "account")
    rewards: [StakingReward!] @derivedFrom(field: "account")
    identity: Identity @derivedFrom(field: "account")
    sub: IdentitySub @derivedFrom(field: "account")
}
```

</details>

<details>

<summary>Transfer</summary>

```graphql
enum TransferDirection {
    From
    To
}

# entity for linking account and transfer
type Transfer @entity {
    id: ID!
    transfer: NativeTransfer
    account: Account!
    direction: TransferDirection
}

type NativeTransfer @entity {
    id: ID!
    blockNumber: Int! @index
    timestamp: DateTime! @index
    extrinsicHash: String @index
    from: Account!
    to: Account!
    amount: BigInt! @index
    success: Boolean!
}
```

</details>

<details>

<summary>StakingReward</summary>

See [Substrate docs about Staking](https://docs.substrate.io/rustdocs/latest/pallet\_staking/index.html) for more information.

```graphql
type StakingReward @entity {
    id: ID!
    timestamp: DateTime!
    blockNumber: Int! @index
    extrinsicHash: String @index
    account: Account!
    amount: BigInt!
    era: Int
    validatorId: ID
}
```

</details>

<details>

<summary>Identity and IdentitySub</summary>

```graphql
type IdentityAdditionalField {
    name: String
    value: String
}

enum Judgement {
    Unknown
    FeePaid
    Reasonable
    KnownGood
    OutOfDate
    LowQuality
    Erroneous
}

type Identity @entity {
    id: ID!
    account: Account! @unique
    judgement: Judgement!
    subs: [IdentitySub!] @derivedFrom(field: "super")
    additional: [IdentityAdditionalField!]
    display: String
    legal: String
    web: String
    riot: String
    email: String
    pgpFingerprint: String
    image: String
    twitter: String
    isKilled: Boolean!
}

type IdentitySub @entity {
    id: ID!
    super: Identity
    account: Account! @unique
    name: String
}
```

</details>


## Examples

Tested on the [Kusama GS-main endpoint](https://squid.subsquid.io/gs-main-kusama/graphql).

### Find three accounts that received staking rewards

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  accounts(limit: 3, where: {rewards_some: {amount_gt: "0"}}) {
    id
    identity {
      email
      isKilled
      id
      pgpFingerprint
    }
  }
}
```

</details>

<details>

<summary>Response sample</summary>

```graphql
{
  "data": {
    "accounts": [
      {
        "id": "Fgqjkry96qFLpRqPZstNzgaqKXiVyrpzTqD55neMdW8PK6g",
        "identity": {
          "email": null,
          "isKilled": false,
          "id": "Fgqjkry96qFLpRqPZstNzgaqKXiVyrpzTqD55neMdW8PK6g",
          "pgpFingerprint": null
        }
      },
      {
        "id": "DcNNc4LAwFLZwRpejQyQNZfLqggkJPLF8H37Ariwe2s3dXE",
        "identity": null
      },
      {
        "id": "F8PTaGuZQo5fgRBFuhNnhd5euFiR3KLQNMVhYD5BduPKpHr",
        "identity": {
          "email": null,
          "isKilled": false,
          "id": "F8PTaGuZQo5fgRBFuhNnhd5euFiR3KLQNMVhYD5BduPKpHr",
          "pgpFingerprint": null
        }
      }
    ]
  }
}
```

</details>
