---
sidebar_position: 30
title: Fuel Network API
description: Access the data of Fuel Network
---

# Fuel Subsquid Network API

:::warning
The Fuel API of Subsquid Network is currently in beta. Breaking changes may be introduced in the future releases.
:::

Subsquid Network API distributes the requests over a ([potentially decentralized](/subsquid-network/public)) network of _workers_. Gateway URL points at a _router_ that provides URLs of workers that do the heavy lifting. Each worker has its own range of blocks that it serves. The recommended data retrieval procedure is as follows:

1. Retrieve the dataset height from the router with `GET /height`.
2. Query the gateway for an URL of a worker that has the data for the first block of the relevant range with `GET /${firstBlock}/worker`.
3. Retrieve the data from the worker with `POST /`, making sure to set the `"fromBlock"` query field to `${firstBlock}`.
4. Exclude the received blocks from the relevant range by setting `firstBlock` to the value of `header.number` of the last received block plus one.
5. Repeat steps 2-4 until all the required data is retrieved.

The main URL of the Starknet gateway is

```
https://v2.archive.subsquid.io/network/fuel-stage-5
```

Implementation examples:

<details>

<summary>Manually with cURL</summary>

Suppose we want data on Fuel receipts from block 1000000. We begin by finding the main URL for the Fuel Network dataset. Then we have to:

1. Verify that the dataset has reached the required height:

   ```bash
   curl https://v2.archive.subsquid.io/network/fuel-stage-5/height
   ```

   Output

   ```
   13280654
   ```

2. Get a worker URL

   ```bash
   curl https://v2.archive.subsquid.io/network/fuel-stage-5/1000000/worker
   ```

   Output

   ```
   https://gr02.sqd-archive.net/worker/query/czM6Ly9mdWVsLXN0YWdlLTU
   ```

3. Retrieve the data from the worker

   ```bash
   curl https://gr02.sqd-archive.net/worker/query/czM6Ly9mdWVsLXN0YWdlLTU \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "type": "fuel",
       "fromBlock":1000000,
       "toBlock": 2000000,
       "fields":{"receipt":{"contract":true, "receiptType": true}},
       "receipts":[ {"type": ["LOG_DATA"]} ]
   }' | jq
   ```

   Output:

   ```json
   [
     {
       "header": {
         "number": 1772883,
         "hash": "0x1fb1134bf0ce3dff927ad9b4f47f6e63617f930beb9af331c704b5e7d5d55590"
       },
       "receipts": [
         {
           "transactionIndex": 0,
           "index": 3,
           "contract": "0x84233a3696f4ca759e7f07348f33efa98e1dc1fe65bc1cc5ea693a1368b0f9e9",
           "receiptType": "LOG_DATA"
         }
       ]
     },
     {
       "header": {
         "number": 1772952,
         "hash": "0xf4e7a12f2c8c16ab8da036d5870554ae527c3316d1593c5f7334222c9e57a071"
       },
       "receipts": [
         {
           "transactionIndex": 0,
           "index": 3,
           "contract": "0x84233a3696f4ca759e7f07348f33efa98e1dc1fe65bc1cc5ea693a1368b0f9e9",
           "receiptType": "LOG_DATA"
         }
       ]
     }
   ]
   ```

4. Observe that we received the transactions up to and including block 20000000. To get the rest of the data, we find a worker who has blocks from 2000000 on:

   ```bash
   curl https://v2.archive.subsquid.io/network/fuel-stage-5/2000000/worker
   ```

   Output:

   ```
   https://gr02.sqd-archive.net/worker/query/czM6Ly9mdWVsLXN0YWdlLTU
   ```

   We now can see that this part of the dataset is located on the same worker.

5. Retrieve the data from the new worker

   ```bash
   curl https://gr02.sqd-archive.net/worker/query/czM6Ly9mdWVsLXN0YWdlLTU \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "type": "fuel","fromBlock":2000000,
       "toBlock":3000000,
       "fields":{"receipt":{"contract":true, "receiptType": true}},
       "receipts":[ {"type": ["LOG_DATA"]} ]

   }' | jq
   ```

   Output is similar to that of step 3.

6. Repeat steps 4 and 5 until the desired height is reached.

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

**Example response:** `16576911`.

</details>

<details>

<summary><code>GET</code> <code><b>$&#123;firstBlock&#125;/worker</b></code> <code>(get a suitable worker URL)</code></summary>

The returned worker will be capable of processing `POST /` requests in which the `"fromBlock"` field is equal to `${firstBlock}`.

**Example response:** `https://v2.archive.subsquid.io/worker/1/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0`.

</details>

## Worker API

<details>

<summary><code>POST</code> <code><b>/</b></code> <code>(query inputs and receipts)</code></summary>

##### Query Fields

- **fromBlock**: Block number to start from (inclusive).
- **toBlock**: (optional) Block number to end on (inclusive). If this is not given, the query will go on for a fixed amount of time or until it reaches the height of the dataset.
- **includeAllBlocks**: (optional) If true, the Network will include blocks that contain no data selected by data requests into its response.
- **fields**: (optional) A [selector](#data-fields-selector) of data fields to retrieve. Common for all data items.
- **receipts**: (optional) A list of [receipts requests](#receipts). An empty list requests no data.
- **inputs**: (optional) A list of [inputs requests](#inputs). An empty list requests no data.
- **outputs**: (optional) A list of [outputs requests](#outputs). An empty list requests no data.
- **transactions**: (optional) A list of [transactions requests](#transactions). An empty list requests no data.

<details>

<summary>

##### Example Request

</summary>

```json
{
  "type": "fuel",
  "fromBlock": 2000000,
  "toBlock": 3000000,
  "fields": { "receipt": { "contract": true, "receiptType": true } },
  "receipts": [{ "type": ["LOG_DATA"] }],
  "inputs": [{ "type": ["InputCoin"] }]
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
      "number": 2974282,
      "hash": "0xf8c8d1dfc0dff5113d62bc777f23f8294af961999c87d71de107f9ea8a004788"
    },
    "receipts": [],
    "inputs": [
      {
        "transactionIndex": 0,
        "index": 0
      }
    ]
  },
  {
    "header": {
      "number": 2974527,
      "hash": "0x21e135a28489d113f0a746813e9d086a3f7f32a85b1588420ea2f8b6b07b65b5"
    },
    "receipts": [],
    "inputs": [
      {
        "transactionIndex": 0,
        "index": 0
      }
    ]
  }
]
```

</details>

</details>

## Data requests

### Receipts

```ts
{
   type?: ReceiptType[]
    logDataContract?: Bytes[]
    transaction?: boolean
}
```

Receipts will be included in the response if it matches all the requests. An empty array matches no instructions; omit all requests to match all receipts. See also [Receipt fields](../../fuel-datasource/field-selection/#receipts).

### Transactions

```ts
{
  type?: TransactionType[]
    receipts?: boolean
    inputs?: boolean
    outputs?: boolean
}
```

A transaction will be included in the response if it matches all the requests. An empty array matches no transactions; omit all requests to match all transactions. See also [Transaction fields](../../fuel-datasource/field-selection/#transaction) for a detailed description of data request fields.

### Input Request

```ts
{
  type?: InputType[]
    coinOwner?: Bytes[]
    coinAssetId?: Bytes[]
    contractContract?: Bytes[]
    messageSender?: Bytes[]
    messageRecipient?: Bytes[]
    transaction?: boolean
}
```

An input will be included in the response if it matches all the requests. An empty array matches no logs; omit all requests to match all logs. See also [Input fields](../../fuel-datasource/field-selection/#input).

### Output Request

```ts
{
 type?: OutputType[]
  transaction?: boolean
}
```

Balance update will be included in the response if it matches all the requests. An empty array matches no balance updates; omit all requests to match all balance updates. See also [Output fields](../../fuel-datasource/field-selection/#output).

## Data fields selector

A JSON selector of fields for the returned data items. Documented in the [Field selectors](../../fuel-datasource/field-selection) section.
