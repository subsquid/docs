---
sidebar_position: 50
title: Starknet API
description: Access the Starknet data
---

# Starknet Subsquid Network API

:::warning
The Starknet API of Subsquid Network is currently in beta. Breaking changes may be introduced in the future releases.
:::

Subsquid Network API distributes the requests over a ([potentially decentralized](/subsquid-network/public)) network of _workers_. The main gateway URL now points at a _router_ that provides URLs of workers that do the heavy lifting. Each worker has its own range of blocks that it serves. The recommended data retrieval procedure is as follows:

1. Retrieve the dataset height from the router with `GET /height`.
2. Query the router for an URL of a worker that has the data for the first block of the relevant range with `GET /${firstBlock}/worker`.
3. Retrieve the data from the worker with `POST /`, making sure to set the `"fromBlock"` query field to `${firstBlock}`.
4. Exclude the received blocks from the relevant range by setting `firstBlock` to the value of `header.number` of the last received block plus one.
5. Repeat steps 2-4 until all the required data is retrieved.

The main URL of the Starknet gateway is
```
https://v2.archive.subsquid.io/network/starknet-mainnet
```

:::warning
Unlike in [the explorer](https://starkscan.co), addresses in this API do not have leading zeros (both in valid requests and in the returned data). For example, explorer's `0x00ce6c...0552` becomes `0xce6c...0552`. This is the format that Starknet RPC nodes use.
:::

Implementation examples:

<details>

<summary>Manually with cURL</summary>

Suppose we want data on all txs sent by `Layerswap`/`0x19252b1deef483477c4d30cfcc3e5ed9c82fafea44669c182a45a01b4fdb97a` starting from block 600_000. The steps are:

1. Verify that the dataset has reached the required height:
   ```bash
   curl https://v2.archive.subsquid.io/network/starknet-mainnet/height
   ```
   Output
   ```
   632494
   ```

2. Get a worker URL
   ```bash
   curl https://v2.archive.subsquid.io/network/starknet-mainnet/600000/worker
   ```
   Output
   ```
   https://rb03.sqd-archive.net/worker/query/czM6Ly9zdGFya25ldC1tYWlubmV0
   ```

3. Retrieve the data from the worker
   ```bash
   curl https://rb03.sqd-archive.net/worker/query/czM6Ly9zdGFya25ldC1tYWlubmV0 \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "type": "starknet",
       "fromBlock":600000,
       "toBlock":632494,
       "fields":{"transaction":{"transactionHash":true}},
       "transactions":[{"senderAddress":["0x19252b1deef483477c4d30cfcc3e5ed9c82fafea44669c182a45a01b4fdb97a"]}]
   }' | jq
   ```

   Output:
   ```json
   [
     {
       "header": {
         "number": 600000,
         "hash": "0x898fe7f61f5d662199d223de496988f221d150ed054f2fe5e681b2988b9e2c"
       },
       "transactions": []
     },
     {
       "header": {
         "number": 600007,
         "hash": "0x44aa251cee1baaf3f19accefd223ce5208815686c881bf645ffb3e3348a5ddc"
       },
       "transactions": [
         {
           "transactionIndex": 24,
           "transactionHash": "0x6a88edb0713769de4ad4d450df70911c3e9a7e8253c135c9574d0b3542ced18"
         }
       ]
     },
     ...
     {
       "header": {
         "number": 617979,
         "hash": "0x7f6a8516a91eefa6a65972c47002cbe3851e3c4287f670c914850960d29ca29"
       },
       "transactions": []
     }
   ]
   ```

4. Observe that we received the transactions up to and including block 617979. To get the rest of the data, we find a worker who has blocks from 617980 on:
   ```bash
   curl https://v2.archive.subsquid.io/network/starknet-mainnet/617980/worker
   ```
   Output:
   ```
   https://lm04.sqd-archive.net/worker/query/czM6Ly9zdGFya25ldC1tYWlubmV0
   ```
   We can see that this part of the dataset is located on another host.

5. Retrieve the data from the new worker
   ```bash
   curl https://lm04.sqd-archive.net/worker/query/czM6Ly9zdGFya25ldC1tYWlubmV0 \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "type": "starknet",
       "fromBlock":617980,
       "toBlock":632494,
       "fields":{"transaction":{"transactionHash":true}},
       "transactions":[{"senderAddress":["0x19252b1deef483477c4d30cfcc3e5ed9c82fafea44669c182a45a01b4fdb97a"]}]
   }' | jq
   ```
   Output is similar to that of step 3.

6. Repeat steps 4 and 5 until the dataset height of 632494 reached.

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
  "type": "starknet",
  "fromBlock":632000,
  "toBlock":632494,
  "fields": {
    "block": {
      "timestamp": true
    },
    "event": {
      "keys": true,
      "data": true
    },
    "transaction": {
      "transactionHash":true
    }
  },
  "events": [
    {
      "fromAddress": [
        "0x19252b1deef483477c4d30cfcc3e5ed9c82fafea44669c182a45a01b4fdb97a"
      ],
      "transaction": true
    }
  ]
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
      "number": 632000,
      "hash": "0xdfebe2b6af20dfe7f27d5fe8b1b4e8ee48ad812ce9bfd9c756c9db7dbcdb22",
      "timestamp": 1712950160
    },
    "transactions": [
      {
        "transactionIndex": 110,
        "transactionHash": "0x151fa3c8633e6ed71301af4afc8f73a141ef39cca1d51d0f72d66a11911e2f3"
      },
      {
        "transactionIndex": 306,
        "transactionHash": "0x7e1c307624c5c78e311e2a08f0355dfef80e6fc6ed47c64ceda757e044f2c85"
      }
    ],
    "events": [
      {
        "transactionIndex": 110,
        "eventIndex": 1,
        "keys": [
          "0x1dcde06aabdbca2f80aa51392b345d7549d7757aa855f7e37f5d335ac8243b1",
          "0x151fa3c8633e6ed71301af4afc8f73a141ef39cca1d51d0f72d66a11911e2f3"
        ],
        "data": [
          "0x1",
          "0x1",
          "0x1"
        ]
      },
      {
        "transactionIndex": 306,
        "eventIndex": 1,
        "keys": [
          "0x1dcde06aabdbca2f80aa51392b345d7549d7757aa855f7e37f5d335ac8243b1",
          "0x7e1c307624c5c78e311e2a08f0355dfef80e6fc6ed47c64ceda757e044f2c85"
        ],
        "data": [
          "0x1",
          "0x1",
          "0x1"
        ]
      }
    ]
  },
  ...
  {
    "header": {
      "number": 632492,
      "hash": "0x440ee029f2a970b2546eb39ab23075659ec8e0246c94f62d21e21f912dfb58d",
      "timestamp": 1713049189
    },
    "transactions": [
      {
        "transactionIndex": 125,
        "transactionHash": "0x61bd3d233cfe9cb387f3b016127ffb0d66d265c2593f80a317404e2f3c334bb"
      }
    ],
    "events": [
      {
        "transactionIndex": 125,
        "eventIndex": 1,
        "keys": [
          "0x1dcde06aabdbca2f80aa51392b345d7549d7757aa855f7e37f5d335ac8243b1",
          "0x61bd3d233cfe9cb387f3b016127ffb0d66d265c2593f80a317404e2f3c334bb"
        ],
        "data": [
          "0x1",
          "0x1",
          "0x1"
        ]
      }
    ]
  },
  {
    "header": {
      "number": 632494,
      "hash": "0x2782c5ca3f1d3eb2e4c085fc17908b9b86bfe91807cd452374bcb40b2245925",
      "timestamp": 1713049569
    },
    "transactions": [],
    "events": []
  }
]
```
</details>

</details>

## Data requests

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
