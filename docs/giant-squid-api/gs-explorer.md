---
sidebar_position: 11
title: Explorer API
description: >-
  Search raw on-chain data
---

# Giant Squid Explorer

:::info
Giant Squid Explorer is an open-source project. You can find source code [here](https://github.com/subsquid-labs/giant-squid-explorer)
:::

Explorer part of the Giant Squid API provides tooling for searching and filtering raw on-chain items such as Blocks, Events, Calls, and Extrinsics.

:::info
Full list of supported chains you can find on statuses [page](/giant-squid-api/statuses).
:::

## API schema

### Basic Substrate chains items

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

<summary>Extrinsic</summary>

```graphql
type Extrinsic {
  id: ID!
  block: Block
  mainCall: Call
  calls: [Call]!
  events: [Event]!
  blockNumber: Int
  timestamp: DateTime
  extrinsicHash: String
  "Internal index among all items"
  indexInBlock: Int
  version: Int
  signerPublicKey: String
  success: Boolean
  error: String
  tip: BigInt
  fee: BigInt
}
```

:::info
Full signature is not stored in the extrinsic entity. To find out how to get it look at [Example 2](#example-2-get-callsextrinsics-sent-by-account-and-then-fetch-additional-data-from-archive)
:::

</details>

<details>

<summary>Event</summary>

```graphql
type Event {
  id: ID!
  block: Block!
  blockNumber: Int!
  timestamp: DateTime!
  extrinsicHash: String
  extrinsic: Extrinsic
  call: Call
  indexInBlock: Int
  eventName: String!
  palletName: String!
  "Optimised arguments values to allow fast search by it"
  argsStr: [String]
}
```

:::info
Full event args is not stored in the event entity. To find out how to get it look at [Example 2](#example-2-get-callsextrinsics-sent-by-account-and-then-fetch-additional-data-from-archive)
:::

</details>

<details>

<summary>Call</summary>

```graphql
type Call {
  id: ID!
  "If call was wrapped in another call like proxy, batch, etc."
  parentId: String
  block: Block!
  extrinsic: Extrinsic
  extrinsicHash: String
  blockNumber: Int!
  timestamp: DateTime!
  callName: String!
  palletName: String!
  success: Boolean!
  callerPublicKey: String
  "Optimised arguments values to allow fast search by it"
  argsStr: [String]
}
```

:::info
Full call args is not stored in the call entity. To find out how to get it look at [Example 2](#example-2-get-callsextrinsics-sent-by-account-and-then-fetch-additional-data-from-archive)
:::

</details>

### Custom helper entities

<details>

<summary>ItemCounter</summary>

It helps to count chain items of different types. That was implemented because built-in `count` count inside `{item}Connection` is very slow on huge amount of entities.

```graphql
type ItemsCounter {
  id: ID!
  type: ItemType!
  level: CounterLevel!
  total: Int!
}

enum CounterLevel {
  Global
  Pallet
  Item
}

enum ItemType {
  Extrinsics
  Calls
  Events
}
```

</details>

:::tip
All entities are optimised to use with `Сonnection` and `orderBy:` (`id_ASC` or `id_DESC`). `id` order the same as time one. Therefore, we advise you to build queries using only this option.
:::

## Examples

Let's review some examples to better understand some aspects of Giant Squid Explorer API

:::info
All example queries are executed on GS Explorer of [kusama](https://squid.subsquid.io/gs-explorer-kusama/graphql) chain
:::

### Exmaple 1: Filtering by pallet and call/event name

For the beginning let's do a simple request that gets last 10 `Balances.Transfer` events

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  eventsConnection(
    orderBy: id_DESC
    first: 10
    where: { eventName_eq: "Transfer", palletName_eq: "Balances" }
  ) {
    edges {
      node {
        id
        blockNumber
        extrinsicHash
        palletName
        eventName
        timestamp
      }
    }
  }
}
```

</details>

<details>

<summary>Response sample</summary>

```json
{
  "data": {
    "eventsConnection": {
      "edges": [
        {
          "node": {
            "id": "0017071517-000040-89ecd",
            "blockNumber": 17071517,
            "extrinsicHash": "0xa33388b92a4883b2c7dc8e41b0fa23bf52ba813fe781ef46ee63394b9d5fd595",
            "palletName": "Balances",
            "eventName": "Transfer",
            "timestamp": "2023-03-17T02:52:06.000000Z"
          }
        },
        {
          "node": {
            "id": "0017071457-000038-f9d60",
            "blockNumber": 17071457,
            "extrinsicHash": "0xf2f40153811ae0d356fb307961d6a500272becf801e66a5ee47268b186ae0ca4",
            "palletName": "Balances",
            "eventName": "Transfer",
            "timestamp": "2023-03-17T02:46:06.000000Z"
          }
        }
      ]
    }
  }
}
```

</details>

### Example 2: Get calls/extrinsics sent by account and then fetch additional data from archive

To get the extrinsics sent by account you can use either signerPublicKey fields. You can convert any chain’s address to account’s public key using our ss58 lib - https://github.com/subsquid/squid-sdk/tree/master/substrate/ss58. So it is basically address.bytes from the example converted to hex string.

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  extrinsicsConnection(
    orderBy: id_DESC
    where: {
      signerPublicKey_eq: "0xa629f0015595000eb7e0d03faa86543883f6ce4d4b8bd3c002227414b92db342"
    }
    first: 10
  ) {
    edges {
      node {
        id
        blockNumber
        signerPublicKey
        extrinsicHash
        success
        timestamp
      }
    }
  }
}
```

</details>

<details>

<summary>Response sample</summary>

```json
{
  "data": {
    "extrinsicsConnection": {
      "edges": [
        {
          "node": {
            "id": "0009994700-000002-ecb13",
            "blockNumber": 9994700,
            "signerPublicKey": "0xa629f0015595000eb7e0d03faa86543883f6ce4d4b8bd3c002227414b92db342",
            "extrinsicHash": "0x5e3959f499156aa36f56e75c904fff47855ec580bb41b92a4fa251f47f4071f8",
            "success": true,
            "timestamp": "2021-11-07T18:28:00.013000Z"
          }
        },
        {
          "node": {
            "id": "0009991028-000002-72c7f",
            "blockNumber": 9991028,
            "signerPublicKey": "0xa629f0015595000eb7e0d03faa86543883f6ce4d4b8bd3c002227414b92db342",
            "extrinsicHash": "0x027f4080079eb1a5f92e0d4c4ddd917b3cf0ef7a1b6f7e1dd37c978ff0bc5031",
            "success": true,
            "timestamp": "2021-11-07T12:10:24.008000Z"
          }
        }
      ]
    }
  }
}
```

</details>

If you need then to get full signature of some extrinsic you can get it from chain's archive in this way:

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  extrinsicById(id: "0009994700-000002-ecb13") {
    signature
  }
}
```

</details>

<details>

<summary>Response</summary>

```json
{
  "data": {
    "extrinsicById": {
      "signature": {
        "address": {
          "__kind": "Id",
          "value": "0xa629f0015595000eb7e0d03faa86543883f6ce4d4b8bd3c002227414b92db342"
        },
        "signature": {
          "__kind": "Sr25519",
          "value": "0xeadc0b18556a25599f3d2ba798edea4cbfa0e181586e00106986c0adafd05467eb1f6396e9e80a118a7379fc41899e879a2390ac9698724e001982fb18931888"
        },
        "signedExtensions": {
          "ChargeTransactionPayment": "0",
          "CheckMortality": {
            "__kind": "Mortal101",
            "value": 0
          },
          "CheckNonce": 222
        }
      }
    }
  }
}
```

</details>

:::tip
You can follow the same way if you need to get full args of specific call or event
:::

### Example 3: Filer by call/event args

You can see account activity not only by sent extrinsics/calls , but also by calls/events where it was involved, e.g. received transfers. To do this, you can filter by `argsStr` field:

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  eventsConnection(
    orderBy: id_DESC
    where: {
      argsStr_containsAny: "0xa629f0015595000eb7e0d03faa86543883f6ce4d4b8bd3c002227414b92db342"
    }
    first: 10
  ) {
    edges {
      node {
        id
        blockNumber
        palletName
        eventName
        extrinsicHash
        timestamp
      }
    }
  }
}
```

</details>

<details>

<summary>Response sample</summary>

```json
{
  "data": {
    "eventsConnection": {
      "edges": [
        {
          "node": {
            "id": "0013910640-000353-f3c00",
            "blockNumber": 13910640,
            "palletName": "Balances",
            "eventName": "Transfer",
            "extrinsicHash": "0x7afffe22d93bf83ab0b4f0b074935a2d1ee5e713f6a14a4b30c8ac354f8187b0",
            "timestamp": "2022-08-08T02:30:06.040000Z"
          }
        },
        {
          "node": {
            "id": "0013117375-000030-18b21",
            "blockNumber": 13117375,
            "palletName": "Balances",
            "eventName": "Transfer",
            "extrinsicHash": "0x7ca9550ecf72bffcc435c2b8ad397fd494df368b31a31d248a562526227c81b7",
            "timestamp": "2022-06-13T22:33:48.018000Z"
          }
        }
      ]
    }
  }
}
```

</details>

:::tip
You can use this approach not only to search account activities. You can apply it to any value that can be in args.
:::

For instance, let's find events where specific crowdloan was involed:

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  eventsConnection(
    orderBy: id_ASC
    where: { argsStr_containsAny: "2078", palletName_eq: "Crowdloan" }
    first: 100
  ) {
    edges {
      node {
        id
        blockNumber
        palletName
        eventName
        extrinsicHash
        timestamp
      }
    }
  }
}
```

</details>

<details>

<summary>Response sample</summary>

```json
{
  "data": {
    "eventsConnection": {
      "edges": [
        {
          "node": {
            "id": "0008206907-000010-526c9",
            "blockNumber": 8206907,
            "palletName": "Crowdloan",
            "eventName": "Created",
            "extrinsicHash": "0xca10794c8a5c4db24e320fa842abdcb63acaa6a10d0ff00dce89e8bdb02a8b9f",
            "timestamp": "2021-07-05T04:41:42.009000Z"
          }
        },
        {
          "node": {
            "id": "0008212507-000010-090ac",
            "blockNumber": 8212507,
            "palletName": "Crowdloan",
            "eventName": "Contributed",
            "extrinsicHash": "0xd43c5b1b4e79c6333ad2d468a60fea3f424cdf99f2e55f381d03ac657f19065f",
            "timestamp": "2021-07-05T14:05:36.300000Z"
          }
        }
      ]
    }
  }
}
```

</details>

### Example 4\*: Find extrinics by main call fields:

A main call in an extrinsic is a call that does not have a parent call that wraps child calls (such as batch, proxy, multisig, etc.). Therefore, the best approach to finding a list of extrinsics by some value of their main call is as follows:

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  callsConnection(
    orderBy: id_DESC
    where: {
      parentId_isNull: true
      palletName_eq: "Balances"
      callName_eq: "transfer"
    }
    first: 10
  ) {
    edges {
      node {
        extrinsic {
          id
          fee
          success
          timestamp
        }
      }
    }
  }
}
```

</details>

<details>

<summary>Response sample</summary>

```json
{
  "data": {
    "eventsConnection": {
      "edges": [
        {
          "node": {
            "id": "0013910640-000353-f3c00",
            "blockNumber": 13910640,
            "palletName": "Balances",
            "eventName": "Transfer",
            "extrinsicHash": "0x7afffe22d93bf83ab0b4f0b074935a2d1ee5e713f6a14a4b30c8ac354f8187b0",
            "timestamp": "2022-08-08T02:30:06.040000Z"
          }
        },
        {
          "node": {
            "id": "0013117375-000030-18b21",
            "blockNumber": 13117375,
            "palletName": "Balances",
            "eventName": "Transfer",
            "extrinsicHash": "0x7ca9550ecf72bffcc435c2b8ad397fd494df368b31a31d248a562526227c81b7",
            "timestamp": "2022-06-13T22:33:48.018000Z"
          }
        }
      ]
    }
  }
}
```

</details>

:::info
API was specially optimised to process such filtering for extrinsics
:::

### Example 5: Counters

There are several type of counter in GS Explorer that can be usefull for you:

#### Block counters - now you can see how much items were in each block:


<details>

<summary>Query</summary>

```graphql
query MyQuery {
  blocksConnection(orderBy: id_DESC, first: 10) {
    edges {
      node {
        extrinsicsCount
        eventsCount
        callsCount
      }
    }
  }
}

```

</details>

<details>

<summary>Response sample</summary>

```json
{
  "data": {
    "blocksConnection": {
      "edges": [
        {
          "node": {
            "height": 17072225,
            "extrinsicsCount": 6,
            "eventsCount": 46,
            "callsCount": 6
          }
        },
        {
          "node": {
            "height": 17072224,
            "extrinsicsCount": 7,
            "eventsCount": 60,
            "callsCount": 7
          }
        },
        {
          "node": {
            "height": 17072223,
            "extrinsicsCount": 7,
            "eventsCount": 49,
            "callsCount": 7
          }
        
        }
      ]
    }
  }
}
    
```

</details>

#### `ItemCounter`- counts amount of items of specific type/pallet/name.
It counts all items of each `type` (`Extrinsics`,`Calls`,`Events`) . There are 3 `level`s of the Item :
- `Global` - counts all items of specified `type`:

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  itemsCounterById(id: "Events") {
    total
  }
}
```

</details>

- `Pallet`- counts items of specified `type`and pallet :

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  itemsCounterById(id: "Extrinsics.Balances") {
    total
  }
}
    
```

</details>

- `Item`- counts items of specified `type`, pallet and name:

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  itemsCounterById(id: "Calls.Balances.transfer") {
    total
  }
}
    
```

</details>

Response to such calls:

<details>

<summary>Response</summary>

```json
{
  "data": {
    "itemsCounterById": {
      "total": 3194785
    }
  }
}
    
```

</details>



So there is no need to call `totalCount` field while filtering by pallet and name.

Also you can sort them in different conditions - e.g. top 10 pallets by amount of calls:

<details>

<summary>Query</summary>

```graphql
query MyQuery {
  itemsCounters(where: {level_eq: Pallet, type_eq: Calls}, orderBy: total_DESC, limit: 10) {
    id
    total
  }
}
    
```

</details>

<details>

<summary>Response sample</summary>

```json
{
  "data": {
    "itemsCounters": [
      {
        "id": "Calls.Timestamp",
        "total": 17072294
      },
      {
        "id": "Calls.ImOnline",
        "total": 16001734
      },
      {
        "id": "Calls.ParaInherent",
        "total": 8127045
      },
      {
        "id": "Calls.System",
        "total": 6552304
      },
      {
        "id": "Calls.Staking",
        "total": 4120221
      },
      {
        "id": "Calls.Parachains",
        "total": 3860281
      },
      {
        "id": "Calls.Balances",
        "total": 3652060
      },
      {
        "id": "Calls.FinalityTracker",
        "total": 3418614
      },
      {
        "id": "Calls.Utility",
        "total": 1534012
      },
      {
        "id": "Calls.ParasInherent",
        "total": 1476453
      }
    ]
  }
}
    
```

</details>
