---
sidebar_position: 30
title: Solana API
description: Access the data of Solana blockchain
---

# Solana Subsquid Network API

:::warning
The Solana API of Subsquid Network is currently in beta. Breaking changes may be introduced in the future releases.
:::

Subsquid Network API distributes the requests over a ([potentially decentralized](/subsquid-network/public)) network of _workers_. The main dataset URL now points at a _router_ that provides URLs of workers that do the heavy lifting. Each worker has its own range of blocks that it serves. The recommended data retrieval procedure is as follows:

1. Retrieve the dataset height from the router with `GET /height`.
2. Query the dataset endpoint for an URL of a worker that has the data for the first block of the relevant range with `GET /${firstBlock}/worker`.
3. Retrieve the data from the worker with `POST /`, making sure to set the `"fromBlock"` query field to `${firstBlock}`.
4. Exclude the received blocks from the relevant range by setting `firstBlock` to the value of `header.number` of the last received block plus one.
5. Repeat steps 2-4 until all the required data is retrieved.

Implementation examples:

<details>

<summary>Manually with cURL</summary>

Suppose we want data on Solana transactions from block 241974500. We begin by finding the main URL for the Solana Mainnet dataset. Then we have to:

1. Verify that the dataset has reached the required height:

   ```bash
   $ curl https://v2.archive.subsquid.io/network/solana-mainnet/height
   ```

   Output

   ```
   241974599
   ```

2. Get a worker URL

   ```bash
   $ curl https://v2.archive.subsquid.io/network/solana-mainnet/241974500/worker
   ```

   Output

   ```
   https://rb04.sqd-archive.net/worker/query/czM6Ly9zb2xhbmEtbWFpbm5ldC1kZW1v
   ```

3. Retrieve the data from the worker

   ```bash
   $ curl https://rb04.sqd-archive.net/worker/query/czM6Ly9zb2xhbmEtbWFpbm5ldC1kZW1v \
   -X 'POST' -H 'content-type: application/json' -H 'accept: application/json' \
   -d '{
       "type": "solana","fromBlock":241974500,
       "toBlock":241974599,
       "fields":{"instruction":{"programId":true, "data": true}}, "instructions":[ {"isCommitted": true}]

   }' | jq
   ```

   Output:

   ```json
   [
     {
       "transactionIndex": 176,
       "instructionAddress": [2, 0],
       "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
       "data": "3DUnaFFJfjwV"
     },
     {
       "transactionIndex": 177,
       "instructionAddress": [0],
       "programId": "ComputeBudget111111111111111111111111111111",
       "data": "JC3gyu"
     },
     {
       "transactionIndex": 177,
       "instructionAddress": [1],
       "programId": "11111111111111111111111111111111",
       "data": "3Bxs4PckVVt51W8w"
     },
     {
       "transactionIndex": 177,
       "instructionAddress": [2],
       "programId": "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
       "data": "GHtpPniXKj7w1cJepxVj14syWib24D1Ceff7hEw5GNiWhb9Rut9mcCSc2KVwx1YFVkhzXrbEoEgLPfSR5upe6sf8jPfuiTnVDHUGmYgatuZ8RACvKXyvMMN1opc6tDX1Yny9VGmCp8mPTtWbuX5CXkaiToB5HwRiexoAyc1a"
     }
   ]
   ```

4. Observe that we received the transactions up to and including block 16031419. To get the rest of the data, we find a worker who has blocks from 16031420 on:

   ```bash
   $ curl https://v2.archive.subsquid.io/network/solana-mainnet/16031420/worker
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
       "type": "solana","fromBlock":241974500,
       "toBlock":241974599,
       "fields":{"instruction":{"programId":true, "data": true}}, "instructions":[ {"isCommitted": true}]

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

**Example response:** `16576911`.

</details>

<details>

<summary><code>GET</code> <code><b>$&#123;firstBlock&#125;/worker</b></code> <code>(get a suitable worker URL)</code></summary>

The returned worker will be capable of processing `POST /` requests in which the `"fromBlock"` field is equal to `${firstBlock}`.

**Example response:** `https://v2.archive.subsquid.io/worker/1/query/czM6Ly9ldGhlcmV1bS1tYWlubmV0`.

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
- **transactions**: (optional) A list of [transaction requests](#transactions). An empty list requests no data.
- **instructions**: (optional) A list of [intructions requests](#instructions). An empty list requests no data.
- **tokenBalances**: (optional) A list of [token balances requests](#token-balances). An empty list requests no data.

<details>

<summary>

##### Example Request

</summary>

```json
{
  "type": "solana",
  "fromBlock": 241974500,
  "toBlock": 241974599,
  "fields": {
    "instruction": { "programId": true, "data": true },
    "log": { "programId": true }
  },
  "instructions": [{ "isCommitted": true }]
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
    "transactionIndex": 1009,
    "instructionAddress": [2],
    "programId": "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
    "data": "2ZenJuK2YLQXxmR6RhCDBFmYeXKR8fAtg8FHoUiwrNZXLwG7MrMkfiRhDGvhsSKr2W47vCLTLBsigZ5hGQzXazVoz35cyL5LHgezJTAoi8f81HugigF16VFNtM38fU4t9sy9ceHhdn1md2xmgJEpxnhwfgM5547wrTA8hkQzKNoacqCCYgP5N37Fy5NaBG8iG7mGhFNhcfChFHXnh2kg9nUxe7Q8h1"
  },
  {
    "transactionIndex": 1009,
    "instructionAddress": [2, 0],
    "programId": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    "data": "TvFbJqcQ3CiB"
  },
  {
    "transactionIndex": 1009,
    "instructionAddress": [2, 1],
    "programId": "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV",
    "data": "2GJh7oUmkZKomMt3bwcNnzjXhq11v37kEraess4g4VxyZKut3Kq9QCt8Z3ZtPvMn9sSgKWA7StrHkZVeoC61vPvBqBZJmXbzCGg8fsVqWkBshm9YoREe4hZqmhat84fo6fTNzRCGpxiN1gw1UZNUUChYYT2R3pmJpEkoopxgeWtDjgud9hvKyUBJreEsDAPBCt4TyWxepqcxUutcCNzWwR6vCQaLn65TxMtAAUU5VdjMGRNvNiyfFo1hj1qNX79nJTXn25QjQaJUouBupuT7xScehbmmE"
  },
  {
    "transactionIndex": 1009,
    "instructionAddress": [2, 2],
    "programId": "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK",
    "data": "8RkZ9BWdS73Ey9DR5C8vgB6FYXCjQ3VprDot476gAKkPGPZ6zv5vXfi"
  },
  {
    "transactionIndex": 1009,
    "instructionAddress": [2, 2, 0],
    "programId": "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV",
    "data": "11sv4oEoEnm721QeSwTL34C93xZBMA1mqG6K5tzidA6hPMjiNQxFX6rpYQMrBiJYQk67mDR5XcgkqwtViMMhP9AJZSx62uYSczuTD8FfZKV8nJZVZALxBsm3cCsNWjqfMpqvuktb8nNwiy2Mh3mGqic1nqGMrgphUiRLcjBjLLYwrnAHbTpq9abpqXDngmKgSDwVAK4m1AnAGNWpSsiCnBc4xyyFqwCcsp1FW7JqwFFiGkbBaWkNoiJvhidLXhP8dEg8gMn5oovcuznpQc8vknGHUXvGP8V8GmM8WFVEzEsFqTZxhdU1eje4rV4vByUjyqAZpZPAj9pvEnqq3yCxs2YKyz1qPVLrbDNySBr88oqLutQBMoeFBURLkNBaqSEBbDdZBr3G9GXaJcF4hjdi3vBMhkyxVJqBtR3gRYAh8o2k7EFp8eQwcpZHhX6zo4JzKENnWFqKBEhss5UfrzbMgT2Jwdq79feU6CatYrEs3RkJtfk8KkUyvCqRqXBk8ZSzkdrR6t8Ea8P9qN1rMK6oJBtLwrbgjXWJkVqiwzieHQSeQy98BpgTjwcFsdHpor17iwz6jUvvYDrgdKQopp7d1Zj6gMg2Gqa2CaBg2HD4nEYxLKFEqXcqR1bHa2j1BTbJxAcTc24ak8WHF9ZhncNEkJNRFwaY8jcDuqDr4qBD3PFAV9RXUD7WD2rtxe7pxf7qC9RNrRZBEWeNpJdVWMvWeAe3WBxxt5zLQxK3GfkSNn5WDyERGH93x7t39TLT4FtwxqVCG1YiMiUMMkdUfKjYAbzdSQVxe7ok5ioXpdEXo7hGjmefZbrmeE3r43xkh2QU4abGsecQPekg7bv9p1ECriHLAjE2Wso67zoQ57xm3NEnfVWqiAh8epkQJzP3MXmmk22oUFT3B9u4LSnKhGQBBmbgJwC8XitEK43Q75Mrhf4oxvZiXKhVfRNst3w3SFxqWueGG2NxvUvZWgnmFb8THqH3MJWoAS1dj1yzHfS41VbkUTGeYSVMQJM9y6nH8oEYjE6WwiTvKcpBP8LMpFYjYeyMg2U7Gt3ztVaazeSMYLwdpkicKFVFET9AeLyKqNqiwYPFoorVfcUf"
  }
]
```

</details>

</details>

## Data requests

:::warning
Addresses in all data requests must be in lowercase. All addresses in the responses will be in lowercase, too.
:::

### Logs

```ts
{
  transactionIndex: number
    logIndex: number
    instructionAddress: number[]
    programId: Base58Bytes
    kind: 'log' | 'data' | 'other'
    message: string
}
```

A log will be included in the response if it matches all the requests. An empty array matches no logs; omit all requests to match all logs. See [Solana logs](/sdk/reference/processors/solana-batch/logs) for a detailed description of data request fields.

### Transactions

```ts
{
   transactionIndex: number
    version: 'legacy' | number
    // transaction message
    accountKeys: Base58Bytes[]
    addressTableLookups: AddressTableLookup[]
    numReadonlySignedAccounts: number
    numReadonlyUnsignedAccounts: number
    numRequiredSignatures: number
    recentBlockhash: Base58Bytes
    signatures: Base58Bytes[]
    // meta fields
    err: null | object
    computeUnitsConsumed: bigint
    fee: bigint
    loadedAddresses: {
        readonly: Base58Bytes[]
        writable: Base58Bytes[]
    }
    hasDroppedLogMessages: boolean
}
```

A transaction will be included in the response if it matches all the requests. An empty array matches no transactions; omit all requests to match all transactions. See [Solana transactions](/sdk/reference/processors/solana-batch/transactions) for a detailed description of data request fields.

### Instructions

```ts
{
  transactionIndex: number
    instructionAddress: number[]
    programId: Base58Bytes
    accounts: Base58Bytes[]
    data: Base58Bytes
    // execution result extracted from logs
    computeUnitsConsumed?: bigint
    error?: string
    /**
     * `true` when transaction completed successfully, `false` otherwise
     */
    isCommitted: boolean
    hasDroppedLogMessages: boolean
}
```

Instruction will be included in the response if it matches all the requests. An empty array matches no instructions; omit all requests to match all instructions. See [Instructions](/sdk/reference/processors/solana-batch/instructions) for a detailed description of data request fields.

### Token Balances

```ts
{
    transactionIndex: number
    account: Base58Bytes
    preProgramId?: Base58Bytes
    preMint: Base58Bytes
    preDecimals: number
    preOwner?: Base58Bytes
    preAmount: bigint

    postProgramId?: Base58Bytes
    postMint: Base58Bytes
    postDecimals: number
    postOwner?: Base58Bytes
    postAmount: bigint
}
```

A token balance will be included in the response if it matches all the requests. An empty array matches no state diffs; omit all requests to match all state diffs. See [Storage state diffs](/sdk/reference/processors/solana-batch/token-balances) for a detailed description of data request fields.

## Data fields selector

A JSON selector of fields for the returned data items. Documented in the [Field selectors](/solana-indexing/sdk/field-selection/#field-selectors) section.
