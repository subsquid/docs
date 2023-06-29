---
sidebar_position: 20
title: Batch API
description: API for batch access
---

# Batch API

:::warning
The EVM Archive API is currently in beta. Breaking changes may be introduced in the future releases.
:::

This page describes the API of Subsquid EVM Archives.

<details>

<summary><code>GET</code> <code><b>/height</b></code> <code>(get height of the archive)</code></summary>

##### Example Response

```json
{
  "height": 16576911
}
```

</details>

<details>

<summary><code>POST</code> <code><b>/query</b></code> <code>(query logs and transactions)</code></summary>

##### Query Fields

- **fromBlock**: Block number to start from (inclusive).
- **toBlock**: (optional) Block number to end on (inclusive). If this is not given, the query will go on for a fixed amount of time or until it reaches the height of the archive.
- **includeAllBlocks**: (optional) If true, the archive will include blocks that contain no data selected by data requests into its response.
- **fields**: (optional) A selector of data fields to retrieve.
- **logs**: (optional) A list of log requests.
- **transactions**: (optional) A list of transaction requests.
- **traces**: (optional) A list of traces requests
- **stateDiffs**: (optional) A list of state diffs requests.

<details>

<summary>

##### Example Request
</summary>

```json
{
  "logs": [
    {
      "address": [
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      ],
      "topic0": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      ],
      "transaction": true
    }
  ],
  "fields": {
    "block": {
      "gasUsed": true
    },
    "log": {
      "topics": true,
      "data": true
    }
  },
  "fromBlock": 16000000,
  "toBlock": 16000000
}
```

</details>

<details>

<summary>

##### Example Response
</summary>

```json
[
  {
    "header": {
      "number": 16000000,
      "hash": "0x3dc4ef568ae2635db1419c5fec55c4a9322c05302ae527cd40bff380c1d465dd",
      "parentHash": "0x6f377dc6bd1f3e38b9ceb8c946a88c13211fa3f084622df3ee5cfcd98cc6bb16",
      "gasUsed": "0x121cdff"
    },
    "transactions": [
      {
        "transactionIndex": 0
      },
      {
        "transactionIndex": 124
      },
      {
        "transactionIndex": 131
      },
      {
        "transactionIndex": 140
      },
      {
        "transactionIndex": 188
      },
      {
        "transactionIndex": 205
      }
    ],
    "logs": [
      {
        "logIndex": 0,
        "transactionIndex": 0,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000ffec0067f5a79cff07527f63d83dd5462ccf8ba4",
          "0x000000000000000000000000e47872c80e3af63bd237b82c065e441fa75c4dea"
        ],
        "data": "0x0000000000000000000000000000000000000000000000000000000007270e00"
      },
      {
        "logIndex": 30,
        "transactionIndex": 124,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000f42ed7184f3bdd07b0456952f67695683afd9044",
          "0x0000000000000000000000009bbcfc016adcc21d8f86b30cda5e9f100ff9f108"
        ],
        "data": "0x0000000000000000000000000000000000000000000000000000000032430d8b"
      },
      {
        "logIndex": 34,
        "transactionIndex": 131,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001d76271fb3d5a61184ba00052caa636e666d11ec",
          "0x00000000000000000000000074de5d4fcbf63e00296fd95d33236b9794016631"
        ],
        "data": "0x000000000000000000000000000000000000000000000000000000000fa56ea0"
      },
      {
        "logIndex": 35,
        "transactionIndex": 131,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x00000000000000000000000074de5d4fcbf63e00296fd95d33236b9794016631",
          "0x000000000000000000000000af0b0000f0210d0f421f0009c72406703b50506b"
        ],
        "data": "0x000000000000000000000000000000000000000000000000000000000fa56ea0"
      },
      {
        "logIndex": 58,
        "transactionIndex": 140,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x00000000000000000000000048c04ed5691981c42154c6167398f95e8f38a7ff",
          "0x000000000000000000000000f41d156a9bbc1fa6172a50002060cbc757035385"
        ],
        "data": "0x0000000000000000000000000000000000000000000000000000000026273075"
      },
      {
        "logIndex": 230,
        "transactionIndex": 188,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c8",
          "0x00000000000000000000000053222470cdcfb8081c0e3a50fd106f0d69e63f20"
        ],
        "data": "0x00000000000000000000000000000000000000000000000000000002536916b7"
      },
      {
        "logIndex": 232,
        "transactionIndex": 188,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x00000000000000000000000053222470cdcfb8081c0e3a50fd106f0d69e63f20",
          "0x00000000000000000000000088e6a0c2ddd26feeb64f039a2c41296fcb3f5640"
        ],
        "data": "0x00000000000000000000000000000000000000000000000000000002536916b7"
      },
      {
        "logIndex": 372,
        "transactionIndex": 205,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000001116898dda4015ed8ddefb84b6e8bc24528af2d8",
          "0x0000000000000000000000002796317b0ff8538f253012862c06787adfb8ceb6"
        ],
        "data": "0x0000000000000000000000000000000000000000000000000000000018307e19"
      },
      {
        "logIndex": 374,
        "transactionIndex": 205,
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000002796317b0ff8538f253012862c06787adfb8ceb6",
          "0x000000000000000000000000735b75559ebb9cd7fed7cec2372b16c3871d2031"
        ],
        "data": "0x0000000000000000000000000000000000000000000000000000000018307e19"
      }
    ]
  }
]
```
</details>

</details>

## Data requests

### Logs

```ts
{
  address: string[],
  topic0: string[],
  topic1: string[],
  topic2: string[],
  topic3: string[],
  transaction: boolean
}
```
A log will be included in the response if it matches all the requests. An empty or `null` request matches any log. See [EVM logs](/evm-indexing/configuration/evm-logs) for a detailed description of data request fields.

### Transactions

```ts
{
  from: string[],
  to: string[],
  sighash: string[],
  logs: boolean,
  traces: boolean,
  stateDiffs: boolean
}
```
A transaction will be included in the response if it matches all the requests. An empty or `null` request matches any transaction. See [EVM transactions](/evm-indexing/configuration/transactions) for a detailed description of data request fields.

### Traces

```ts
{
  type: string[],
  createFrom: string[],
  callFrom: string[],
  callTo: string[],
  callSighash: string[],
  suicideRefundAddress: string[],
  rewardAuthor: string[]
  transaction: boolean,
  subtraces: boolean
}
```
A trace will be included in the response if it matches all the requests. An empty or `null` request matches any trace. See [Traces](/evm-indexing/configuration/traces) for a detailed description of data request fields.

### State diffs

```ts
{
  address: string[],
  key: string[],
  kind: string[],
  transaction: bool
}
```
A state diff will be included in the response if it matches all the requests. An empty or `null` request matches any state diff. See [Storage state diffs](/evm-indexing/configuration/state-diffs) for a detailed description of data request fields.

## Data fields selector

A JSON selector of fields for the returned data items. Documented in the [Field selectors](/evm-indexing/configuration/data-selection/#field-selectors) section.
