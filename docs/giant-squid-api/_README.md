# Overview

:::warning
The Giant Squid API is currently under active development and this part of the documentation is largely outdated. Reach out at [SquidDevs chat](https://t.me/HydraDevs) to get support on the Giant Squid API.
:::

Giant Squid

The subject of this guide is not how to build a Squid API project, but rather how to use one particular kind of Squid API.

The Giant Squid API is a project developed by Subsquid, aimed at uniting smaller Squids into one single GraphQL endpoint.

## API schema

Each one of the smaller APIs is indexing a different chain or parachain, but they all have a common schema, or at least a subset of the same common schema.

<details>

<summary>Block</summary>

```graphql
type Block {
  id: ID!
  height: Int!
  hash: String!
  parentHash: String!
  timestamp: DateTime!
  specVersion: Int!
  validator: String
  extrinsicsCount: Int!
  callsCount: Int!
  eventsCount: Int!
  extrinsics: [Extrinsic]!
  calls: [Call]!
  events: [Event]!
}
```

</details>

<details>

<summary>Transfers schema</summary>

```graphql
enum TransferDicrection {
  FROM
  TO
}

type Transfer implements Item & CanFail @entity {
  id: ID!
  timestamp: DateTime
  blockNumber: BigInt @index
  extrinsicHash: String @index
  to: Account!
  from: Account!
  amount: BigInt
  success: Boolean @index
}

# entity for linking account and transfer
type AccountTransfer @entity {
  id: ID!
  transfer: Transfer
  account: Account!
  direction: TransferDicrection
}
```

</details>

<details>

<summary>Staking schema</summary>

See [Substrate docs about Staking](https://docs.substrate.io/rustdocs/latest/pallet_staking/index.html) for more information.

```graphql
enum StakingRole {
  Validator
  Nominator
  Idle
}

enum PayeeType {
  Staked
  Stash
  Controller
  Account
  None
}

# current information about stash, controller, payee and staking role
type StakingInfo @entity {
  id: ID! #stash Id
  stash: Account! @unique
  controller: Account!
  payee: Account
  payeeType: PayeeType!
  role: StakingRole!
  commission: Int
}

# information about era, validators and nominators
type Era @entity {
  id: ID!
  index: Int!
  timestamp: DateTime!
  startedAt: Int!
  endedAt: Int
  total: BigInt!
  validatorsCount: Int!
  nominatorsCount: Int!
  validators: [EraValidator] @derivedFrom(field: "era")
  nominators: [EraNominator] @derivedFrom(field: "era")
}

type EraStakingPair @entity {
  id: ID! #era + validatorId + nominatorId
  era: Era!
  nominator: EraNominator
  validator: EraValidator
  vote: BigInt!
}

# information about validator in era: self/total bond, nominators and their votes
type EraValidator @entity {
  id: ID! #era + stashId
  stash: Account!
  era: Era!
  selfBonded: BigInt!
  totalBonded: BigInt!
  commission: Int
  nominators: [EraStakingPair] @derivedFrom(field: "validator")
}

# information about nominator in era:
# bond, validators and votes for them in each era
type EraNominator @entity {
  id: ID! #era + stashId
  stash: Account!
  era: Era!
  bonded: BigInt!
  validators: [EraStakingPair] @derivedFrom(field: "nominator")
}

type Reward implements Item & HasTotal & HasEra @entity {
  id: ID!
  timestamp: DateTime
  blockNumber: BigInt @index
  extrinsicHash: String @index
  account: Account!
  amount: BigInt
  era: Int
  validator: String
  total: BigInt
  # only for dApps-staking
  smartConstract: String
}

type Slash implements Item & HasTotal & HasEra @entity {
  id: ID!
  timestamp: DateTime
  blockNumber: BigInt @index
  extrinsicHash: String @index
  account: Account!
  amount: BigInt
  era: Int
  total: BigInt
}

enum BondType {
  Bond
  Unbond
}

type Bond implements Item & HasTotal & CanFail @entity {
  id: ID!
  timestamp: DateTime
  blockNumber: BigInt @index
  extrinsicHash: String @index
  account: Account!
  amount: BigInt
  total: BigInt
  success: Boolean @index
  type: BondType
  # only for parachain-staking
  candidate: String
  # only for dApps-staking
  smartConstract: String
}
```

</details>

<details>

<summary>Crowdloans schema</summary>

See [Polkadot documentation on Crowdloans](https://wiki.polkadot.network/learn-crowdloans) for more information.

```graphql
# information about known parachains and their crowdloans
type Parachain @entity {
  id: ID! #paraId
  name: String
  paraId: Int
  crowdloans: [Crowdloan!] @derivedFrom(field: "parachain")
  relayChain: String
}

enum CrowdloanStatus {
  CREATED
  WON
  DISSOLVED
}

type Contributor @entity {
  id: ID!
  crowdloan: Crowdloan!
  account: Account!
  amount: BigInt!
}

# information about known crowdloans.
type Crowdloan @entity {
  id: ID!
  cap: BigInt!
  firstPeriod: BigInt!
  lastPeriod: BigInt!
  end: BigInt!
  contributors: [Contributor!] @derivedFrom(field: "crowdloan")
  raised: BigInt!
  parachain: Parachain
  blockNumber: BigInt @index
  createdAt: DateTime
}

type Contribution implements Item & CanFail @entity {
  id: ID!
  timestamp: DateTime
  blockNumber: BigInt @index
  extrinsicHash: String @index
  crowdloan: Crowdloan
  success: Boolean @index
  account: Account!
  amount: BigInt
}
```

</details>

<details>

<summary>Interfaces</summary>

```graphql
interface Item {
  timestamp: DateTime
  blockNumber: BigInt
  extrinsicHash: String
  amount: BigInt
}

interface HasTotal {
  total: BigInt
}

interface HasEra {
  era: Int
}

interface CanFail {
  success: Boolean
}
```

</details>
