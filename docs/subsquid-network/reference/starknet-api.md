---
sidebar_position: 50
title: Starknet API
description: Access the Starknet data
---

# Starknet Subsquid Network API

:::warning
The Starknet API of Subsquid Network is currently in beta. Breaking changes may be introduced in the future releases.
:::

Subsquid Network API distributes the requests over a ([potentially decentralized](/subsquid-network/public)) network of _workers_. The main dataset URL now points at a _router_ that provides URLs of workers that do the heavy lifting. Each worker has its own range of blocks that it serves. The recommended data retrieval procedure is as follows:

1. Retrieve the dataset height from the router with `GET /height`.
2. Query the dataset endpoint for an URL of a worker that has the data for the first block of the relevant range with `GET /${firstBlock}/worker`.
3. Retrieve the data from the worker with `POST /`, making sure to set the `"fromBlock"` query field to `${firstBlock}`.
4. Exclude the received blocks from the relevant range by setting `firstBlock` to the value of `header.number` of the last received block plus one.
5. Repeat steps 2-4 until all the required data is retrieved.

The main URL of the Starknet dataset is
```
https://v2.archive.subsquid.io/network/starknet-mainnet
```

Implementation examples:

<details>

<summary>Manually with cURL</summary>

Suppose we want data on Ethereum txs to `vitalik.eth`/`0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` from block 16_000_000. We begin by finding the main URL for the Ethereum Mainnet dataset on the [Supported networks page](/subsquid-network/reference/evm-networks/#raw-urls). Then we have to:

1. Verify that the dataset has reached the required height:
   ```bash
   $ curl https://v2.archive.subsquid.io/network/ethereum-mainnet/height
   ```
   Output
   ```
   18593441
   ```

2. Get a worker URL
   ```bash
   $ curl https://v2.archive.subsquid.io/network/ethereum-mainnet/16000000/worker
   ```
   Output
   ```
   https://lm02.sqd-archive.net/worker/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0
   ```

3. Retrieve the data from the worker
   ```bash
   $ curl https://lm02.sqd-archive.net/worker/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0 \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "fromBlock":16000000,
       "toBlock":18593441,
       "fields":{"transaction":{"hash":true}},
       "transactions":[{"to":["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]}]
   }' | jq
   ```
   Note how the address in the `transactions` data request is lowercased.

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
   $ curl https://v2.archive.subsquid.io/network/ethereum-mainnet/16031420/worker
   ```
   Output:
   ```
   https://rb02.sqd-archive.net/worker/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0
   ```
   We can see that this part of the dataset is located on another host.

5. Retrieve the data from the new worker
   ```bash
   $ curl https://rb02.sqd-archive.net/worker/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0 \
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

**Example response:** `632494`.

</details>

<details>

<summary><code>GET</code> <code><b>$&#123;firstBlock&#125;/worker</b></code> <code>(get a suitable worker URL)</code></summary>

The returned worker will be capable of processing `POST /` requests in which the `"fromBlock"` field is equal to `${firstBlock}`.

**Example response:** `https://rb06.sqd-archive.net/worker/query/czM6Ly9zdGFya25ldC1tYWlubmV0`.

</details>

## Worker API

<details>

<summary><code>POST</code> <code><b>/</b></code> <code>(query logs and transactions)</code></summary>

##### Query Fields

- **type**: `starknet`.
- **fromBlock**: Block number to start from (inclusive).
- **toBlock**: (optional) Block number to end on (inclusive). If this is not given, the query will go on for a fixed amount of time or until it reaches the height of the dataset.
- **includeAllBlocks**: (optional) If true, the Network will include blocks that contain no data selected by data requests into its response.
- **fields**: (optional) A [selector](#data-fields-selector) of data fields to retrieve. Common for all data items.
- **transactions**: (optional) A list of [transaction requests](#transactions). An empty list requests no data.
- **events**: (optional) A list of [event requests](#events). An empty list requests no data.

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
Addresses in all data requests must be in lowercase. All addresses in the responses will be in lowercase, too.
:::

### Transactions

```ts
{
  contractAddress: string[],
  senderAddress: string[],
  type: string[],
  firstNonce: int,
  lastNonce: int,
  events: boolean
}
```
A transaction will be included in the response if it matches all the requests. An empty array matches no transactions; omit all requests to match all transactions.

All events emitted by the selected transactions will be included into the response if `events` is set to `true`.

See [Data field selector](#data-field-selector) for info on field selection.

### Events

```ts
{
  fromAddress: string[],
  key0: string[],
  key1: string[],
  key2: string[],
  key3: string[],
  transaction: boolean
}
```
An event will be included in the response if it matches all the requests. An empty array matches no events; omit all requests to match all events.

If `transaction` is set to `true`, all parent transactions will be included into the response.

See [Data field selector](#data-field-selector) for info on field selection.

## Data fields selector

A selector of fields for the returned data items. Its structure is as follows:

```
{
  block:               // field selector for blocks
  transaction:         // field selector for transactions
  event:               // field selector for events
}
```

### Block fields

```
{
  parentHash
  status
  newRoot
  timestamp
  sequencerAddress
}
```
A valid field selector for blocks is a JSON that has a subset of these fields as keys and `true` as values, e.g. `{"status": true, "timestamp": true}`.

### Transaction fields

```
{
  transactionHash
  contractAddress
  entryPointSelector
  calldata
  maxFee
  type
  senderAddress
  version
  signature
  nonce
  classHash
  compiledClassHash
  contractAddressSalt
  constructorCalldata
}
```
A valid field selector for transactions is a JSON that has a subset of these fields as keys and `true` as values, e.g. `{"transactionHash": true, "type": true, "calldata": true}`.

### Event fields

```ts
{
  fromAddress
  keys
  data
}
```
A valid field selector for logs is a JSON that has a subset of these fields as keys and `true` as values, e.g. `{"fromAddress": true, "data": true}`.

