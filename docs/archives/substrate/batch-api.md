---
sidebar_position: 10
title: Batch API
description: API for batch access
---

# Batch API

The Archive Batch API is a single GraphQL endpoint served by the `substrate-gateway` service. The list of public endpoints for major Substrate chains is available from the [Archive registry](/archives/overview/#archive-registry). Visit `https://graphql-console.subsquid.io/?graphql_api=<your_endpoint_url>` for a live playground and GraphQL introspection.

## Batch query

Extracts a batch of block headers, calls and events matching the requested filters and data selectors.

```graphql
query {
  batch(
    """
    Selector for the Substrate runtime calls 
    """
    calls: [CallSelectionInput!]
    """
    Selector for `Ethereum.transact` calls. Only for Frontier EVM networks
    """
    ethereumTransactions: [EthereumTransactionSelection!]
    """
    Selector for the Substrate runtime events 
    """
    events: [EventSelection!]
    """
    Selector for `EVM.Log` events. Only for Frontier EVM networks
    """
    evmLogs: [EvmLogSelection!]
    """
    Block range start
    """
    fromBlock: Int! = 0
    """
    Include headers for all blocks in the range. If set to `false` only the
    headers of the blocks with calls/events/transactions matching the
    filter are included in the result
    """
    includeAllBlocks: Boolean
    """
    DEPRECATED, has no effect
    """
    limit: Int
    """
    Max batch range. 
    The query returns a batch in the interval `[fromBlock, endBlock]` where
    `endBlock` never exceeds `toBlock` but may be smaller
    """
    toBlock: Int
  ): [Batch!]!
}

type Batch {
  """
  Headers for the blocks in the batch
  """
  header: BlockHeader!
  """
  Call data matching the selectors
  """
  calls: [JSON!]!
  """
  Extrinsic data matching the selectors
  """
  extrinsics: [JSON!]!
  """
  Event data matching the selectors
  """
  events: [JSON!]!
}

type BlockHeader {
  id: String!
  height: Int!
  hash: String!
  parentHash: String!
  stateRoot: String!
  extrinsicsRoot: String!
  timestamp: DateTime!
  specId: String!
  validator: String
}
```

### Call selectors

```graphql
type CallSelectionInput {
  """
  Filter by name
  """
  name: String!
  """
  Fetch the data from the selector
  """
  data: CallDataSelection
}

type CallDataSelection {
  """
  Call data
  """
  call: CallFields
  """
  Parent extrinsic data
  """
  extrinsic: ExtrinsicFields
}

type CallFields {
  """
  Include all fields
  """
  _all: Boolean
  error: Boolean
  origin: Boolean
  args: Boolean
  """
  Field selector for the parent call
  """
  parent: ParentCallFields
}

type ExtrinsicFields {
  _all: Boolean
  indexInBlock: Boolean
  version: Boolean
  signature: Boolean
  success: Boolean
  error: Boolean
  hash: Boolean
  call: CallFields
  fee: Boolean
  tip: Boolean
}

type ParentCallFields {
  """
  `True` to include all the fields
  """
  _all: Boolean
  args: Boolean
  error: Boolean
  origin: Boolean
  """
  `True` if the parent call data should be included
  """
  parent: Boolean
}
```

### Event selectors

```graphql
type EventSelection {
  name: String!
  data: EventDataSelection
}

type EventDataSelection {
  event: EventFields
}

type EventFields {
  """
  Include all field
  """
  _all: Boolean
  indexInBlock: Boolean
  phase: Boolean
  """
  Field selector for the extrinsic emitted the event
  """
  extrinsic: ExtrinsicFields
  """
  Field selector for the call emitted the event
  """
  call: CallFields
  args: Boolean
}

```

### Frontier-EVM selectors

The selectors apply only for Frontier-EVM networks

```graphql
type EthereumTransactionSelection {
  """
  Filter by the destination contract address
  """
  contract: String!
  """
  Filter by sighash
  """
  sighash: String
  data: CallDataSelection
}

type EvmLogSelection {
  """
  Filter by the contract address emitted the EVM log
  """
  contract: String!
  """
  Topic filter according to the EVM spec
  """
  filter: [[String!]!]
  data: EvmLogDataSelection
}

type EvmLogDataSelection {
  event: EvmLogFields
}

type EvmLogFields {
  _all: Boolean
  indexInBlock: Boolean
  phase: Boolean
  extrinsic: ExtrinsicFields
  call: CallFields
  args: Boolean
  evmTxHash: Boolean
}
```

## Metadata

```graphql
query {
  metadata: [Metadata!]!
  """
  Get metadata by metadata ID
  """
  metadataById(id: String!): Metadata
}

type Metadata {
  """
  Id in the format <specName>@<specVersion>
  """  
  id: String!
  specName: String!
  specVersion: Int!
  """
  The height of the first block with this metadata
  """  
  blockHeight: Int!
  """
  The hash of the first block with this metadata
  """
  blockHash: String!
  """
  SCALE-encoded 0x-prefixed hex bytes of the metadata
  """
  hex: String!
}
```

## Status

```graphql
query {
  status: Status!
}

type Status {
  """
  The last block indexed by the archive
  """
  head: Int! 
}
```
