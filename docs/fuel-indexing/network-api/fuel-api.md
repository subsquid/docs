---
sidebar_position: 30
title: Fuel Network API
description: Access the data of Fuel Network
---

# Fuel SQD Network API

:::warning
The Fuel API of SQD Network is currently in beta. Breaking changes may be introduced in the future releases.
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

See the [Fuel section of the public gateways list](/subsquid-network/reference/networks/#fuel) for URL gateways.

Implementation examples:

<details>

<summary>Manually with cURL</summary>

Suppose we want data on Fuel receipts from block `1000000`. We begin by finding the main URL for the Fuel Mainnet dataset. Then we have to:

1. Retrieve the dataset height from the router with

   ```bash
   curl https://v2.archive.subsquid.io/network/fuel-mainnet/height
   ```

   Output

   ```
   1211611
   ```

2. Save the value `1000000` to some variable, say `currentBlock`.

3. Query the router for an URL of a worker that has the data for`currentBlock`

   ```bash
   curl https://v2.archive.subsquid.io/network/fuel-mainnet/1000000/worker
   ```

   Output

   ```
   https://rb03.sqd-archive.net/worker/query/czM6Ly9mdWVsLXRlc3RuZXQ
   ```

4. Retrieve the data from the worker

   ```bash
   curl https://rb03.sqd-archive.net/worker/query/czM6Ly9mdWVsLXRlc3RuZXQ \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "type": "fuel",
       "fromBlock":1000000,
       "fields":{"receipt":{"contract":true, "receiptType": true}},
       "receipts":[ {"type": ["LOG_DATA"]} ]
   }' | jq
   ```

   Output:
   ```json
   [
     {
       "header": {
         "number": 1000000,
         "hash": "0xdc31db7fa3c1fb4f3e0910dc5abf927e64cc985eb2eb13418a9f2e00c4b7ad23"
       },
       "receipts": []
     },
     {
       "header": {
         "number": 1002527,
         "hash": "0x649f045675405f9d4ee34bb19479d0e5706ed14615e8f97da9f34dd166e37f35"
       },
       "receipts": [
         {
           "transactionIndex": 0,
           "index": 1,
           "contract": "0xe637b4c254aa07baa9845eb9f8c7ad0965fad5c5b1194cb37193f956be0ce6f3",
           "receiptType": "LOG_DATA"
         }
       ]
     },
     ...
     {
       "header": {
         "number": 1211611,
         "hash": "0x04c9ef60f2b54d32569a410477c136f11b692c1d3eadaa5b946a0295b526223e"
       },
       "receipts": []
     }
   ]
   ```

5. Parse the retrieved data to get a batch of query data plus the height of the last block available from the current worker. Take the `header.number` field of the last element of the retrieved JSON array - it is the height you want. Even if your query returns no data, you'll still get the block data for the last block in the range, so this procedure is safe.

6. Set `currentBlock` to the height from the previous step plus one.

7. Repeat steps 3-6 until all the required data is retrieved.

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

**Example response:** `https://rb03.sqd-archive.net/worker/query/czM6Ly9mdWVsLXRlc3RuZXQ`.

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
  "fromBlock": 1000000,
  "toBlock": 1100000,
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
      "number": 1000000,
      "hash": "0xdc31db7fa3c1fb4f3e0910dc5abf927e64cc985eb2eb13418a9f2e00c4b7ad23"
    },
    "receipts": [],
    "inputs": []
  },
  {
    "header": {
      "number": 1002527,
      "hash": "0x649f045675405f9d4ee34bb19479d0e5706ed14615e8f97da9f34dd166e37f35"
    },
    "receipts": [
      {
        "transactionIndex": 0,
        "index": 1,
        "contract": "0xe637b4c254aa07baa9845eb9f8c7ad0965fad5c5b1194cb37193f956be0ce6f3",
        "receiptType": "LOG_DATA"
      }
    ],
    "inputs": [
      {
        "transactionIndex": 0,
        "index": 1
      }
    ]
  },
  ...
  {
    "header": {
      "number": 1100000,
      "hash": "0x4e1420d7c2cd973842ef1ce919560f15e5461376b7533c371fb895034c85dfd3"
    },
    "receipts": [],
    "inputs": []
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
  contract?: string[]
  transaction?: boolean
}
```
Receipts will be included in the response if it matches all the requests. An empty array matches no instructions; omit all requests to match all receipts.

See [addReceipt()](/fuel-indexing/fuel-datasource/receipts) SDK data request method for details on this request; also see [Receipt fields](../../fuel-datasource/field-selection/#receipt).

### Transactions

```ts
{
  type?: TransactionType[]
  receipts?: boolean
  inputs?: boolean
  outputs?: boolean
}
```

A transaction will be included in the response if it matches all the requests. An empty array matches no transactions; omit all requests to match all transactions.

See [addTransaction()](/fuel-indexing/fuel-datasource/transactions) SDK data request method for details on this request; also see [Transaction fields](../../fuel-datasource/field-selection/#transaction).

### Inputs

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

An input will be included in the response if it matches all the requests. An empty array matches no inputs; omit all requests to match all inputs.

See [addInput()](/fuel-indexing/fuel-datasource/inputs) SDK data request method for details on this request; also see [Input fields](../../fuel-datasource/field-selection/#input).

### Outputs

```ts
{
  type?: OutputType[]
  transaction?: boolean
}
```

An output will be included in the response if it matches all the requests. An empty array matches no outputs; omit all requests to match all outputs.

See [addOutput()](/fuel-indexing/fuel-datasource/outputs) SDK data request method for details on this request; also see [Output fields](../../fuel-datasource/field-selection/#output).

## Data fields selector

A JSON selector of fields for the returned data items. Documented in the [Field selectors](../../fuel-datasource/field-selection) section.
