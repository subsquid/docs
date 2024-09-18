---
sidebar_position: 30
title: Solana API
description: Access the data of Solana blockchain
---

# Solana SQD Network API

:::warning
The Solana API of SQD Network is currently in beta. Breaking changes may be introduced in the future releases.
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

The main URL of the Solana gateway is
```
https://v2.archive.subsquid.io/network/solana-mainnet
```
We also serve a dataset for Eclipse Testnet at
```
https://v2.archive.subsquid.io/network/eclipse-testnet
```

Implementation examples:

<details>

<summary>Manually with cURL</summary>

Suppose we want data on all successful Solana instructions starting block 241974500. We begin by finding the main URL for the Solana Mainnet dataset. Then we have to:

1. Verify that the dataset has reached the required height:

   ```bash
   curl https://v2.archive.subsquid.io/network/solana-mainnet/height
   ```

   Output

   ```
   243004249
   ```

2. Remember that our current height is 241974500.

3. Get a worker URL for the current height:

   ```bash
   curl https://v2.archive.subsquid.io/network/solana-mainnet/241974500/worker
   ```

   Output

   ```
   https://lm02.sqd-archive.net/worker/query/czM6Ly9zb2xhbmEtbWFpbm5ldC0w
   ```

4. Retrieve the data from the current worker

   ```bash
   curl https://rb04.sqd-archive.net/worker/query/czM6Ly9zb2xhbmEtbWFpbm5ldC1kZW1v \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "type": "solana",
       "fromBlock":241974500,
       "toBlock": 243004249,
       "fields":{"instruction":{"programId":true, "data": true}},
       "instructions":[ {"isCommitted": true} ]
   }' | jq
   ```

   Output:

   ```json
   [
     {
       "header": {
         "number": 241974500,
         "hash": "3pnS5TEVvbG7gnhnfNWkppm2ufgxhqB8z6jsdjNPhgQi"
       },
       "instructions": [
         {
           "transactionIndex": 24,
           "instructionAddress": [
             0
           ],
           "programId": "ComputeBudget111111111111111111111111111111",
           "data": "GtQyqR"
         },
         ...
         {
           "transactionIndex": 1577,
           "instructionAddress": [
             2
           ],
           "programId": "mineJKQoyEbSiyjooEVMGSbHMaDdv7Cnf8rhkKLgyVb",
           "data": "SSX8YzgXGaUDonrMFeCc1SJXnE2PpHo6Ak41asTZA4MRLaKTLyauDdy"
         }
       ]
     },
     ...
     {
       "header": {
         "number": 241974599,
         "hash": "BUeG7rcpfTd8oo5vjnVfgdWTm72fycz7YoozqD1y13XQ"
       },
       "instructions": [
         ...
       ]
     }
   ]
   ```

5. Parse the retrieved data:
   - Grab the network data you requested from the list items with non-empty data fields (`instructions`, `transactions`, `logs`, `balances`, `tokenBalances`, `rewards`).
   - Observe that we received the data up to and including block 241974599. **Note:** the last block of the batch will be returned even if it has no matching data.

6. To get the rest of the data, update the current height to 241974600 and go to step 3.
   - Note how the worker URL you're getting while repeating step 3 occasionally points to a different host than before. This is how data storage and reads are distributed across the SQD Network.

7. Repeat steps 3 through 6 until the dataset height of 243004249 reached.

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

**Example response:** `243004249`.

</details>

<details>

<summary><code>GET</code> <code><b>$&#123;firstBlock&#125;/worker</b></code> <code>(get a suitable worker URL)</code></summary>

The returned worker is capable of processing `POST /` requests in which the `"fromBlock"` field is equal to `${firstBlock}`.

**Example response:** `https://v2.archive.subsquid.io/worker/1/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0`.

</details>

## Worker API

<details>

<summary><code>POST</code> <code><b>/</b></code> <code>(query Solana data)</code></summary>

##### Query Fields

- **type**: `"solana"`
- **fromBlock**: Block number to start from (inclusive).
- **toBlock**: (optional) Block number to end on (inclusive). If this is not given, the query will go on for a fixed amount of time or until it reaches the height of the dataset.
- **includeAllBlocks**: (optional) If true, the Network will include blocks that contain no data selected by data requests into its response.
- **fields**: (optional) A [selector](#data-fields-selector) of data fields to retrieve. Common for all data items.
- **instructions**: (optional) A list of [intructions requests](#instructions). An empty list requests no data.
- **transactions**: (optional) A list of [transaction requests](#transactions). An empty list requests no data.
- **logs**: (optional) A list of [log requests](#log-messages). An empty list requests no data.
- **balances**: (optional) A list of [balances requests](#balances). An empty list requests no data.
- **tokenBalances**: (optional) A list of [token balances requests](#token-balances). An empty list requests no data.
- **rewards**: (optional) A list of [rewards requests](#rewards). An empty list requests no data.

The response is a JSON array of per-block data items that covers a block range starting from `fromBlock`. The last block of the range is determined by the worker. You can find it by looking at the `header.number` field of the last element in the response array.

The first and the last block in the range are returned even if all data requests return no data for the range.

In most cases the returned range will not contain all the range requested by the user (i.e. the last block of the range will not be `toBlock`). To continue, [retrieve a new worker URL](#router-api) for blocks starting at the end of the current range *plus one block* and repeat the query with an updated value of `fromBlock`.

<details>

<summary>

##### Example Request

</summary>

```json
{
  "type": "solana",
  "fromBlock":241974500,
  "toBlock": 243004249,
  "fields": {
    "instruction": { "programId":true, "data": true }
  },
  "instructions":[ {"isCommitted": true} ]
}
```

</details>

<details>

<summary>

##### Example Response

</summary>

Note: the first and the last block in the range are included even if they have no matching data.

```json
[
  {
    "header": {
      "number": 241974500,
      "hash": "3pnS5TEVvbG7gnhnfNWkppm2ufgxhqB8z6jsdjNPhgQi"
    },
    "instructions": [
      {
        "transactionIndex": 24,
        "instructionAddress": [
          0
        ],
        "programId": "ComputeBudget111111111111111111111111111111",
        "data": "GtQyqR"
      },
      ...
      {
        "transactionIndex": 1577,
        "instructionAddress": [
          2
        ],
        "programId": "mineJKQoyEbSiyjooEVMGSbHMaDdv7Cnf8rhkKLgyVb",
        "data": "SSX8YzgXGaUDonrMFeCc1SJXnE2PpHo6Ak41asTZA4MRLaKTLyauDdy"
      }
    ]
  },
  ...
  {
    "header": {
      "number": 241974599,
      "hash": "BUeG7rcpfTd8oo5vjnVfgdWTm72fycz7YoozqD1y13XQ"
    },
    "instructions": [
      ...
    ]
  }
]
```

</details>

</details>

## Data requests

### Instructions

```ts
{
  programId?: string[]
  d1?: string[]
  d2?: string[]
  d3?: string[]
  d4?: string[]
  d8?: string[]
  a0?: string[]
  a1?: string[]
  a2?: string[]
  a3?: string[]
  a4?: string[]
  a5?: string[]
  a6?: string[]
  a7?: string[]
  a8?: string[]
  a9?: string[]
  isCommitted?: boolean

  transaction?: boolean
  transactionTokenBalances?: boolean
  logs?: boolean
  innerInstructions?: boolean
}
```

An instruction will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ a4: [] }`) matches no instructions; omit all requests/pass an empty object to match all instructions.

See [`addInstruction()` SDK function reference](/solana-indexing/sdk/solana-batch/instructions) for a detailed description of the fields of this data request; also see [Field selection](/solana-indexing/sdk/solana-batch/field-selection).

### Transactions

```ts
{
  feePayer?: string[]

  instructions?: boolean
  logs?: boolean
}
```

A transaction will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ feePayer: [] }`) matches no transactions; omit all requests/pass an empty object to match all transactions.

See [`addTransaction()` SDK function reference](/solana-indexing/sdk/solana-batch/transactions) for a detailed description of the fields of this data request; also see [Field selection](/solana-indexing/sdk/solana-batch/field-selection).

### Log messages

```ts
{
  programId?: string[]
  kind?: ('log' | 'data' | 'other')[]

  transaction?: boolean
  instruction?: boolean
}
```

A log message will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ kind: [] }`) matches no log messages; omit all requests/pass an empty object to match all log messages.

See [`addLog()` SDK function reference](/solana-indexing/sdk/solana-batch/logs) for a detailed description of the fields of this data request; also see [Field selection](/solana-indexing/sdk/solana-batch/field-selection).

### Balances

```ts
{
  account?: string[]

  transaction?: boolean
  transactionInstructions?: boolean
}
```

A balance update message will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ account: [] }`) matches no balance update messages; omit all requests/pass an empty object to match all balance update messages.

See [`addBalance()` SDK function reference](/solana-indexing/sdk/solana-batch/balances) for a detailed description of the fields of this data request; also see [Field selection](/solana-indexing/sdk/solana-batch/field-selection).

### Token Balances

```ts
{
  account?: string[]
  preProgramId?: string[]
  postProgramId?: string[]
  preMint?: string[]
  postMint?: string[]
  preOwner?: string[]
  postOwner?: string[]

  transaction?: boolean
  transactionInstructions?: boolean
}
```
A token balance update message will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ preProgramId: [] }`) matches no token balance update messages; omit all requests/pass an empty object to match all token balance update messages.

See [`addTokenBalance()` SDK function reference](/solana-indexing/sdk/solana-batch/token-balances) for a detailed description of the fields of this data request; also see [Field selection](/solana-indexing/sdk/solana-batch/field-selection).

### Rewards

```ts
{
  pubkey?: string[]
}
```

A reward message will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ pubkey: [] }`) matches no reward messages; omit all requests/pass an empty object to match all reward messages.

See [`addReward()` SDK function reference](/solana-indexing/sdk/solana-batch/rewards) for a detailed description of the fields of this data request; also see [Field selection](/solana-indexing/sdk/solana-batch/field-selection).

## Data fields selector

A JSON selector of fields for the returned data items. Documented in the [Field selectors](/solana-indexing/sdk/solana-batch/field-selection) section.
