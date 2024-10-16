---
sidebar_position: 60
title: Tron API
description: Access Tron data
---

# Tron SQD Network API

:::warning
The Tron API of SQD Network is currently in beta. Breaking changes may be introduced in the future releases.
:::

[Open private SQD Network](/subsquid-network/overview/#open-private-network) offers access to Tron data. The gateway is at
```
https://v2.archive.subsquid.io/network/tron-mainnet
```
SQD Network API distributes the requests over a ([potentially decentralized](/subsquid-network/faq)) network of _workers_. The main gateway URL points at a _router_ that provides URLs of workers that do the heavy lifting. Each worker has its own range of blocks.

Suppose you want to retrieve an output of some [query](#worker-api) on a block range starting at `firstBlock` (can be the genesis block) and ending at the highest available block. Proceed as follows:

1. Retrieve the dataset height from the router with `GET /height` and make sure it's above `firstBlock`.

2. Save the value of `firstBlock` to some variable, say `currentBlock`.

3. Query the router for an URL of a worker that has the data for `currentBlock` with `GET /${currentBlock}/worker`.

4. Retrieve the data from the worker by [posting the query](#worker-api) (`POST /`), setting the `"fromBlock"` query field to `${currentBlock}`.

5. Parse the retrieved data to get a batch of query data **plus** the height of the last block available from the current worker. Take the `header.number` field of the last element of the retrieved JSON array - it is the height you want. Even if your query returns no data, you'll still get the block data for the last block in the range, so this procedure is safe.

6. Set `currentBlock` to the height from the previous step **plus one**.

7. Repeat steps 3-6 until all the required data is retrieved.

Implementation examples:

<details>

<summary>Manually with cURL</summary>

Suppose we want data on [token burns](https://developers.tron.network/docs/faq#3-what-is-the-destruction-address-of-tron) from block 58_000_000. We have to:

1. Verify that the dataset has reached the required height:
   ```bash
   curl https://v2.archive.subsquid.io/network/tron-mainnet/height
   ```
   Output
   ```
   61889299
   ```

2. Remember that your current height is 58000000.

2. Get a worker URL for the current height
   ```bash
   curl https://v2.archive.subsquid.io/network/tron-mainnet/58000000/worker
   ```
   Output
   ```
   https://rb03.sqd-archive.net/worker/query/czM6Ly90cm9uLW1haW5uZXQ
   ```

3. Retrieve the data from the worker
   ```bash
   curl https://rb03.sqd-archive.net/worker/query/czM6Ly90cm9uLW1haW5uZXQ \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "fromBlock":58000000,
       "toBlock":59286799,
       "fields":{"transaction":{"hash":true}},
       "transactions":[{
         "to":[
           "0x0000000000000000000000000000000000000000"
         ]
       }]
   }' | jq
   ```
   Output:
   ```json
   [
     {
       "header": {
         "number": 16000000,
         "hash": "0x3dc4ef568ae2635db1419c5fec55c4a9322c05302ae527cd40bff380c1d465dd",
         "parentHash": "0x6f377dc6bd1f3e38b9ceb8c946a88c13211fa3f084622df3ee5cfcd98cc6bb16"
       },
       "transactions": []
     },
     // ...
     {
       "header": {
         "number": 16027977,
         "hash": "0x4b332878deb33e963b68c8bbbea60cbca72a88c297b6800eafa82baab497c166",
         "parentHash": "0x2b979d67d9b03394da336938ee0bcf5aedfdf87e1b5bd574d985aee749eb8b76"
       },
       "transactions": [
         {
           "transactionIndex": 96,
           "hash": "0xbaede248ec6fce28e9d874f69ea70359bea0107ce9144d6838898674d9d10c8c"
         }
       ]
     },
     // ...
     {
       "header": {
         "number": 16031419,
         "hash": "0x9cc48c9b4ad8dddb1de86a15e30a62ffd48cf9b72930930cfa5167c4e1685d0a",
         "parentHash": "0x4ec7b4562739032f51e70d26fe5129e571e2bf0348a744c1509f8205f4381696"
       },
       "transactions": []
     }
   ]
   ```

4. Observe that we received the transactions up to and including block 16031419. To get the rest of the data, we find a worker who has blocks from 16031420 on:
   ```bash
   curl https://v2.archive.subsquid.io/network/ethereum-mainnet/16031420/worker
   ```
   Output:
   ```
   https://rb02.sqd-archive.net/worker/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0
   ```
   We can see that this part of the dataset is located on another host.

5. Retrieve the data from the new worker
   ```bash
   curl https://rb02.sqd-archive.net/worker/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0 \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "fromBlock":16031420,
       "toBlock":18593441,
       "fields":{"transaction":{"hash":true}},
       "transactions":[{"to":["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]}]
   }' | jq
   ```
   Output is similar to that of step 3.

6. Repeat steps 4 and 5 until the dataset height of 18593441 reached.

</details>

<details>

<summary>In Python</summary>

```python
def get_text(url: str) -> str:
    res = requests.get(url)
    res.raise_for_status()
    return res.text

def dump(
    dataset_url: str,
    query: Query,
    first_block: int,
    last_block: int
) -> None:
    assert 0 <= first_block <= last_block
    query = dict(query)  # copy query to mess with it later

    dataset_height = int(get_text(f'{dataset_url}/height'))
    next_block = first_block
    last_block = min(last_block, dataset_height)

    while next_block <= last_block:
        worker_url = get_text(f'{dataset_url}/{next_block}/worker')

        query['fromBlock'] = next_block
        query['toBlock'] = last_block
        res = requests.post(worker_url, json=query)
        res.raise_for_status()
        blocks = res.json()

        last_processed_block = blocks[-1]['header']['number']
        next_block = last_processed_block + 1
        for block in blocks:
            print(json.dumps(block))
```
Full code [here](https://gist.github.com/eldargab/2e007a293ac9f82031d023f1af581a7d).

</details>

## Router API

<details>

<summary><code>GET</code> <code><b>/height</b></code> <code>(get height of the dataset)</code></summary>

**Example response:** `65900614`.

</details>

<details>

<summary><code>GET</code> <code><b>$&#123;firstBlock&#125;/worker</b></code> <code>(get a suitable worker URL)</code></summary>

The returned worker will be capable of processing `POST /` requests in which the `"fromBlock"` field is equal to `${firstBlock}`.

**Example response:** `https://rb06.sqd-archive.net/worker/query/czM6Ly90cm9uLW1haW5uZXQ`.

</details>

## Worker API

<details>

<summary><code>POST</code> <code><b>/</b></code> <code>(query logs and transactions)</code></summary>

##### Query Fields

- **fromBlock**: Block number to start from (inclusive).
- **toBlock**: (optional) Block number to end on (inclusive). If this is not given, the query will go on for a fixed amount of time or until it reaches the height of the dataset.
- **includeAllBlocks**: (optional) If true, the Network will include blocks that contain no data selected by data requests into its response.
- **fields**: (optional) A [selector](#data-fields-selector) of data fields to retrieve. Common for all data items.
- **logs**: (optional) A list of [log requests](#logs). An empty list requests no data.
- **transactions**: (optional) A list of [general transaction requests](#general-transactions). An empty list requests no data.
- **transferTransactions**: (optional) A list of ["transfer" transaction requests](#transfer-transactions). An empty list requests no data.
- **transferAssetTransactions**: (optional) A list of ["transfer asset" transaction requests](#transfer-asset-transactions). An empty list requests no data.
- **triggerSmartContractTransactions**: (optional) A list of ["trigger smart contract" transaction requests](#trigger-smart-contract-transactions). An empty list requests no data.
- **internalTransactions**: (optional) A list of [internal transaction requests](#internal-transactions). An empty list requests no data.

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

:::warning
Addresses in all data requests must be in hex without `0x` and in lowercase. Example:
```
a614f803b6fd780986a42c78ec9c7f77e6ded13c
```
All addresses in the responses will be in this format, too.
:::

### Logs

```ts
{
  // data requests
  address: string[],
  topic0: string[],
  topic1: string[],
  topic2: string[],
  topic3: string[],

  // related data retrieval
  transaction: boolean
}
```
+ `address`: the set of addresses of contracts emitting the logs. Omit to subscribe to events from all contracts in the network.
+ `topicN`: the set of values of topicN.

A log will be included in the response if it matches all the requests. An empty array matches no logs; omitted or `null` request matches any log.

With `transaction: true` all parent transactions will be included into the response.

### Transactions

#### General {#general-transactions}

```ts
{
  // data requests
  type: string[],

  // related data retrieval
  logs: boolean,
  internalTransactions: boolean
}
```
+ `type`: the set of acceptable transaction types.

A transaction will be included in the response if it matches all the requests (just the `type` request in this case). An empty array matches no transactions; omitted or `null` request matches any transaction.

With `logs: true` all logs emitted by the transactions will be included into the response. With `internalTransactions: true` all the internal transactions induced by the selected transactions will be included into the response.

#### "transfer" {#transfer-transactions}

```ts
{
  // data requests
  owner: string[],
  to: string[],

  // related data retrieval
  logs: boolean,
  internalTransactions: boolean
}
```
+ `owner`: the set of owner addresses for which the transfer transactions should be retrieved.
+ `to`: the set of destination addresses.

A transaction will be included in the response if it matches all the requests. An empty array matches no transactions; omitted or `null` request matches any transaction.

With `logs: true` all logs emitted by the transactions will be included into the response. With `internalTransactions: true` all the internal transactions induced by the selected transactions will be included into the response.

#### "transfer asset" {#transfer-asset-transactions}

```ts
{
  // data requests
  owner: string[],
  to: string[],
  asset: string[],

  // related data retrieval
  logs: boolean,
  internalTransactions: boolean
}
```
+ `owner`: the set of owner addresses for which the transfer transactions should be retrieved.
+ `to`: the set of destination addresses.
+ `asset`: the set of asset contract addresses.

A transaction will be included in the response if it matches all the requests. An empty array matches no transactions; omitted or `null` request matches any transaction.

With `logs: true` all logs emitted by the transactions will be included into the response. With `internalTransactions: true` all the internal transactions induced by the selected transactions will be included into the response.

#### "trigger smart contract" {#trigger-smart-contract-transactions}

```ts
{
  // data requests
  owner: string[],
  to: string[],

  // related data retrieval
  logs: boolean,
  internalTransactions: boolean
}
```
+ `owner`: the set of owner addresses for which the transfer transactions should be retrieved.
+ `to`: the set of destination addresses.

A transaction will be included in the response if it matches all the requests. An empty array matches no transactions; omitted or `null` request matches any transaction.

With `logs: true` all logs emitted by the transactions will be included into the response. With `internalTransactions: true` all the internal transactions induced by the selected transactions will be included into the response.

### Internal transactions {#internal-transactions}

```ts
{
  // data requests
  caller: string[],
  transferTo: string[],

  // related data retrieval
  transaction: boolean
}
```
+ `caller`: the set of addresses of caller contracts.
+ `transferTo`: the set of addresses of receivers of TRX or TRC10 tokens.

A transaction will be included in the response if it matches all the requests. An empty array matches no transactions; omitted or `null` request matches any transaction.

With `transaction: true` all parent transactions for the selected internal transactions will be included into the response.

## Data fields selector

A selector of fields for the returned data items. Its structure is as follows:

```
{
  block:               // field selector for blocks
  log:                 // field selector for logs
  transaction:         // field selector for transactions
  internalTransaction: // field selector for internal transactions
}
```
The `transaction` field selector is common for [all transaction types](#transactions) except for the internal transactions.

### Block fields

```
{
  number
  hash
  parentHash
  timestamp
  txTrieRoot
  version
  timestamp
  witness_address
  witness_signature
}
```
A valid field selector for blocks is a JSON that has a subset of these fields as keys and `true` as values, e.g. `{"hash": true, "timestamp": true}`.

### Log fields

```ts
{
  logIndex
  transactionHash
  address
  data
  topics
}
```
A valid field selector for logs is a JSON that has a subset of these fields as keys and `true` as values, e.g. `{"address": true, "transactionHash": true}`.

### Transaction fields

```
{
  hash
  ret
  signature
  type
  parameter
  permissionId
  refBlockBytes
  refBlockHash
  feeLimit
  expiration
  timestamp
  rawDataHex
  fee
  contractResult
  contractAddress
  resMessage
  withdrawAmount
  unfreezeAmount
  withdrawExpireAmount
  cancelUnfreezeV2Amount
  result
  energyFee
  energyUsage
  energyUsageTotal
  netUsage
  netFee
  originEnergyUsage
  energyPenaltyTotal
}
```
A valid field selector for transactions is a JSON that has a subset of these fields as keys and `true` as values, e.g. `{"hash": true, "type": true, "contractResult": true}`.

## Internal transaction fields

```
{
  transactionHash
  hash
  callerAddress
  transferToAddress
  callValueInfo
  note
  rejected
  extra
}
```
A valid field selector for internal transactions is a JSON that has a subset of these fields as keys and `true` as values, e.g. `{"hash": true, "callerAddress": true, "callValueInfo": true}`.
