---
sidebar_position: 30
title: Batch API
description: API for batch access
---

# Batch API

The `substrate-gateway` services exposes a single `graphql` endpoint.
The list of Substrate archives is available at the [Aquarium page](https://app.subsquid.io/archives), under `Data Source URL`
Use [GraphQL Console](https://graphql-console.subsquid.io/) for a live playground and the GraphQL introspection.

## Metadata

```gql
query {
  metadata: [Metadata!]!
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

```gql
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


