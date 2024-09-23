---
sidebar_position: 30
title: EVM API
description: Access the data of EVM blockchains
---

# EVM SQD Network API

:::warning
The EVM API of SQD Network is currently in beta. Breaking changes may be introduced in the future releases.
:::

SQD Network API distributes the requests over a ([potentially decentralized](/subsquid-network/faq)) network of _workers_. The main gateway URL points at a _router_ that provides URLs of workers that do the heavy lifting. Each worker has its own range of blocks on each dataset it serves.

Suppose you want to retrieve an output of some [query](#worker-api) on a block range starting at `firstBlock` (can be the genesis block) and ending at the highest available block. Proceed as follows:

1. Retrieve the dataset height from the router with `GET /height` and make sure it's above `firstBlock`.

2. Save the value of `firstBlock` to some variable, say `currentBlock`.

3. Query the router for an URL of a worker that has the data for `currentBlock` with `GET /${currentBlock}/worker`.

4. Retrieve the data from the worker by [posting the query](#worker-api) (`POST /`), setting the `"fromBlock"` query field to `${currentBlock}`.

5. Parse the retrieved data to get a batch of query data **plus** the height of the last block available from the current worker. Take the `header.number` field of the last element of the retrieved JSON array - it is the height you want. Even if your query returns no data, you'll still get the block data for the last block in the range, so this procedure is safe.

6. Set `currentBlock` to the height from the previous step **plus one**.

7. Repeat steps 3-6 until all the required data is retrieved.

URLs of public EVM gateways are available on the [Supported networks page](/subsquid-network/reference/networks/#evm--ethereum-compatible).

Implementation examples:

<details>

<summary>Manual fetch with cURL</summary>

Suppose we want data on Ethereum txs to `vitalik.eth`/`0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` from block 16_000_000. We begin by finding the main URL for the Ethereum Mainnet gateway on the [Supported networks page](/subsquid-network/reference/networks/#evm--ethereum-compatible). Then we have to:

1. Verify that the dataset has reached the required height:

   ```bash
   curl https://v2.archive.subsquid.io/network/ethereum-mainnet/height
   ```

   Output:

   ```
   18593441
   ```

2. Remember that your current height is 16000000.

3. Get a worker URL for the current height:

   ```bash
   curl https://v2.archive.subsquid.io/network/ethereum-mainnet/16000000/worker
   ```

   Output:

   ```
   https://rb05.sqd-archive.net/worker/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0
   ```

4. Retrieve the data available from the current worker

   ```bash
   curl https://rb05.sqd-archive.net/worker/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0 \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "fromBlock":16000000,
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
         "number": 16004961,
         "hash": "0x9edecebf424558386879fe7f1b79550b6ab7d94ae9a953b2ac552c5ec99ad061",
         "parentHash": "0xffcb16149563c7ea48c398693141c2024645d83e768d37ed6cbd283a609475af"
       },
       "transactions": [
         {
           "transactionIndex": 126,
           "hash": "0xcbf7ff2e3f0cb52f436eca83ba540a526c855c1e28253ba42b3b46cc791a40ca"
         }
       ]
     },
     // ...
     {
       "header": {
         "number": 16039119,
         "hash": "0x6c7a394c01931704bc850fa82ab21fe51b086b1afcedae61885abace1bc1e7e9",
         "parentHash": "0xeef4364766af5b838ff8059de4229b7a3381746d0046e390150f31d56f1163af"
       },
       "transactions": []
     }
   ]
   ```

5. Parse the retrieved data:
   - Grab the network data you requested from the list items with non-empty data fields (`logs`, `transactions`, `stateDiffs`, `traces`). For the example above, this data will include the txn `0xcbf7...`.
   - Observe that we received the data up to and including block 16031419.

6. To get the rest of the data, update the current height to 16031420 and go to step 3.
   - Note how the worker URL you're getting while repeating step 3 points to a different host than before. This is how data storage and reads are distributed across the SQD Network.

7. Repeat steps 3 through 6 until the dataset height of 18593441 is reached.

</details>

<details>

<summary>In Python</summary>

```python
def get_text(url: str) -> str:
    res = requests.get(url)
    res.raise_for_status()
    return res.text

def dump(
    gateway_url: str,
    query: Query,
    first_block: int,
    last_block: int
) -> None:
    assert 0 <= first_block <= last_block
    query = dict(query)  # copy query to mess with it later

    dataset_height = int(get_text(f'{gateway_url}/height'))
    next_block = first_block
    last_block = min(last_block, dataset_height)

    while next_block <= last_block:
        worker_url = get_text(f'{gateway_url}/{next_block}/worker')

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

**Example response:**
```
16576911
```

</details>

<details>

<summary><code>GET</code> <code><b>$&#123;firstBlock&#125;/worker</b></code> <code>(get a suitable worker URL)</code></summary>

The returned worker is capable of processing `POST /` requests in which the `"fromBlock"` field is equal to `${firstBlock}`.

**Example response:**
```
https://rb02.sqd-archive.net/worker/query/czM6Ly9uZW9uLWRldm5ldC10cmFjZWxlc3MtMQ
```

</details>

## Worker API

<details>

<summary><code>POST</code> <code><b>/</b></code> <code>(query EVM data)</code></summary>

##### Query Fields

- **fromBlock**: Block number to start from (inclusive).
- **toBlock**: (optional) Block number to end on (inclusive). If this is not given, the query will go on for a fixed amount of time or until it reaches the height of the dataset.
- **includeAllBlocks**: (optional) If true, the Network will include blocks that contain no data selected by data requests into its response.
- **fields**: (optional) A [selector](#data-fields-selector) of data fields to retrieve. Common for all data items.
- **logs**: (optional) A list of [log requests](#logs). An empty list requests no data.
- **transactions**: (optional) A list of [transaction requests](#transactions). An empty list requests no data.
- **traces**: (optional) A list of [traces requests](#traces). An empty list requests no data.
- **stateDiffs**: (optional) A list of [state diffs requests](#state-diffs). An empty list requests no data.

The response is a JSON array of per-block data items that covers a block range starting from `fromBlock`. The last block of the range is determined by the worker. You can find it by looking at the `header.number` field of the last element in the response array.

The first and the last block in the range are returned even if all data requests return no data for the range.

In most cases the returned range will not contain all the range requested by the user (i.e. the last block of the range will not be `toBlock`). To continue, [retrieve a new worker URL](#router-api) for blocks starting at the end of the current range *plus one block* and repeat the query with an updated value of `fromBlock`.

<details>

<summary>

##### Example Request 1

</summary>

```json
{
  "logs": [
    {
      "address": ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
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

Gets all `Transfer(address,address,address)` event logs emitted by the [USDC contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) on block 16000000, plus their parent transactions. Run
```bash
curl https://v2.archive.subsquid.io/network/eth-mainnet/16000000/worker
```
to get an URL of a worker capable of processing this query.

</details>

<details>

<summary>

##### Example Response 1

</summary>

Since the request was for one block, the response contains exactly one block:

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

<details>

<summary>

##### Example Request 2

</summary>

```json
{
  "logs": [
    {
      "address": ["0xb0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]
    }
  ],
  "fields": {
    "log": {
      "topics": true,
      "data": true
    }
  },
  "fromBlock": 16000000
}
```

Attempts to gets all event logs emitted by a [nonexistent contract](https://etherscan.io/address/0xb0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) on blocks starting at 16000000. Run
```bash
curl https://v2.archive.subsquid.io/network/eth-mainnet/16000000/worker
```
to get an URL of a worker capable of processing this query.

</details>

<details>

<summary>

##### Example Response 2

</summary>

The query matches no data, so the data field `"logs"` is an empty array for all the returned block data items:

```json
[
  {
    "header": {
      "number": 16000000,
      "hash": "0x3dc4ef568ae2635db1419c5fec55c4a9322c05302ae527cd40bff380c1d465dd",
      "parentHash": "0x6f377dc6bd1f3e38b9ceb8c946a88c13211fa3f084622df3ee5cfcd98cc6bb16"
    },
    "logs": []
  },
  ... (a bunch of similar items for different block heights,
       all with "logs": []) ...
  {
    "header": {
      "number": 16039119,
      "hash": "0x6c7a394c01931704bc850fa82ab21fe51b086b1afcedae61885abace1bc1e7e9",
      "parentHash": "0xeef4364766af5b838ff8059de4229b7a3381746d0046e390150f31d56f1163af"
    },
    "logs": []
  }
]
```
16039119 is the highest block that the worker could process. For the data beyond that block [request a new worker](#router-api) from the router and repeat the request with `"fromBlock": 16039120`.

</details>

</details>

## Data requests

:::warning
Addresses in all data requests must be in lowercase. All addresses in the responses will be in lowercase, too.
:::

### Logs

```ts
{
  address: string[],
  topic0: string[],
  topic1: string[],
  topic2: string[],
  topic3: string[],
  transaction: boolean,
  transactionTraces: boolean,
  transactionLogs: boolean
}
```

A log will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ address: [] }`) matches no logs; omit all requests/pass an empty object to match all logs.

See [`addLog()` SDK function reference](/sdk/reference/processors/evm-batch/logs) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/evm-batch/field-selection).

<details>

<summary>

Get all `Transfer(address,address,uint256)` event logs emitted by the [USDC contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) on blocks starting at 16_000_000, plus their parent transactions. Get `topics` and `data` for each log item and `hash` for each transaction.

</summary>

```json
{
  "logs": [
    {
      "address": ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
      "topic0": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      ],
      "transaction": true
    }
  ],
  "fields": {
    "transaction": {
      "hash": true
    },
    "log": {
      "topics": true,
      "data": true
    }
  },
  "fromBlock": 16000000
}  
```

</details>

<details>

<summary>

Get all event logs network-wide on blocks starting from block 0. Get topics for each log.

</summary>

```json
{
  "logs": [{}],
  "fields": {
    "log": {
      "topics": true
    }
  },
  "fromBlock": 0
}  
```

</details>

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

A transaction will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ from: [] }`) matches no transactions; omit all requests/pass an empty object to match all transactions.

See [`addTransaction()` SDK function reference](/sdk/reference/processors/evm-batch/transactions) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/evm-batch/field-selection).

<details>

<summary>

Get all transactions directly calling the `transfer(address,uint256)` method of the [USDC contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) on blocks starting at 16_000_000, plus the logs they emitted. Get `hash` and `gas` for each transaction and `data` for all logs.

</summary>

```json
{
  "transactions": [
    {
      "to": ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
      "sighash": ["0xa9059cbb"],
      "logs": true
    }
  ],
  "fields": {
    "transaction": {
      "hash": true,
      "gas": true
    },
    "log": {
      "data": true
    }
  },
  "fromBlock": 16000000
}  
```

</details>

<details>

<summary>

Get all transactions on the network starting from 0. Get hash for each transaction.

</summary>

```json
{
  "transactions": [{}],
  "fields": {
    "transaction": {
      "hash": true
    }
  },
  "fromBlock": 0
}  
```

</details>

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
  transactionLogs: boolean,
  subtraces: boolean,
  parents: boolean
}
```

A trace will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ callTo: [] }`) matches no traces; omit all requests/pass an empty object to match all traces.

See [`addTrace()` SDK function reference](/sdk/reference/processors/evm-batch/traces) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/evm-batch/field-selection).

### State diffs

```ts
{
  address: string[],
  key: string[],
  kind: string[],
  transaction: bool
}
```

A state diff will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ address: [] }`) matches no state diffs; omit all requests/pass an empty object to match all state diffs.

See [`addStateDiff()` SDK function reference](/sdk/reference/processors/evm-batch/traces) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/evm-batch/field-selection).

## Data fields selector

A JSON selector of fields for the returned data items. Documented in the [Field selection](/sdk/reference/processors/evm-batch/field-selection) section.
