---
sidebar_position: 40
title: Substrate API
description: Access the data of Substrate blockchains
---

# Substrate SQD Network API

:::warning
The Substrate API of SQD Network is currently in beta. Breaking changes may be introduced in the future releases.
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

Main URLs of EVM gateways are available on the [Supported networks page](/subsquid-network/reference/networks).

Implementation example:

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

**Example response:** `20856599`.

</details>

<details>

<summary><code>GET</code> <code><b>$&#123;firstBlock&#125;/worker</b></code> <code>(get a suitable worker URL)</code></summary>

The returned worker is capable of processing `POST /` requests in which the `"fromBlock"` field is equal to `${firstBlock}`.

**Example response:** `https://rb05.sqd-archive.net/worker/query/czM6Ly9wb2xrYWRvdC00`.

</details>

## Worker API

<details>

<summary><code>POST</code> <code><b>/</b></code> <code>(query Substrate data)</code></summary>

##### Query Fields

- **type**: `"substrate"`
- **fromBlock**: Block number to start from (inclusive).
- **toBlock**: (optional) Block number to end on (inclusive). If this is not given, the query will go on for a fixed amount of time or until it reaches the height of the dataset.
- **includeAllBlocks**: (optional) If true, SQD Network workers will include blocks that contain no data selected by data requests into their responses.
- **fields**: (optional) A [selector](#data-fields-selector) of data fields to retrieve. Common for all data items.
- **events**: (optional) A list of [event requests](#events).
- **calls**: (optional) A list of [call requests](#calls).
- **contractsEvents**: (optional) A list of [Contracts.ContractEmitted event requests](#contractsEvents).
- **evmLogs**: (optional) A list of [EVM.Log event requests](#evmLog).
- **ethereumTransactions**: (optional) A list of [Ethereum.transact call requests](#ethereumTransact).
- **gearMessagesQueued**: (optional) A list of [Gear.MessageQueued event requests](#gearMessageQueued).
- **gearUserMessagesSent**: (optional) A list of [Gear.UserMessageSent event requests](#gearUserMessageSent).

The response is a JSON array of per-block data items that covers a block range starting from `fromBlock`. The last block of the range is determined by the worker. You can find it by looking at the `header.number` field of the last element in the response array.

The first and the last block in the range are returned even if all data requests return no data for the range.

In most cases the returned range will not contain all the range requested by the user (i.e. the last block of the range will not be `toBlock`). To continue, [retrieve a new worker URL](#router-api) for blocks starting at the end of the current range *plus one block* and repeat the query with an updated value of `fromBlock`.

<details>

<summary>

##### Example Request
</summary>

```json
{
  "type": "substrate",
  "fromBlock": 4669000,
  "toBlock":4669010,
  "fields": {
    "event": {
      "name": true,
      "args": true
    },
    "call": {
      "name": true,
      "args": true   
    }               
  },
  "events": [
    {        
      "name": ["Balances.Transfer"] 
    }              
  ]              
}
```
Run
```bash
curl https://v2.archive.subsquid.io/network/<your-network>/4669000/worker
```
to get an URL of a worker capable of processing this query.

</details>

<details>

<summary>

##### Example Response
</summary>

Note that the last block in the range is included despite having no matching events.

```json
[
  {
    "header": {
      "number": 4669000,
      "hash": "0xa4667263922a1f71708993dc923b974bdece3a117538d3654f44ace403e6614f",
      "parentHash": "0x068d9e6dc7f3245df45a00a6a18ed1a07e64a53997f5f3f89e8b09c9db267b2b"
    },
    "events": []
  },
  {
    "header": {
      "number": 4669005,
      "hash": "0x7ae89bccf9d8a3fcb33b9310bff5d83aaf905099e32dd7766443c9b96143cde9",
      "parentHash": "0x36c515ee7a74db78a4ddee5734e8a79440e08bafd7e440886c7fcfd0d6389088"
    },
    "events": [
      {
        "index": 1,
        "extrinsicIndex": 1,
        "callAddress": [],
        "name": "Balances.Transfer",
        "args": [
          "0x3a7b188d341fcd76ffdc8e684ac26c1e0720e35ca01b3f7c2308c3bde14571c2",
          "0x8cdbbe675b1ea872e9f4b1d1f7258c3757b4247ef4e4d8f5d3a600d2a6dc7e59",
          "378293330000"
        ]
      }
    ]
  },
  {
    "header": {
      "number": 4669010,
      "hash": "0xbfd4448702ab2def722c6638c3d2062b7ca2cd62f71801ab467b1484bcb259a6",
      "parentHash": "0x5cb9bfcd169b9cacfa8f3b58212c151fc69e5cadf661162cd88f221888420942"
    },
    "events": []
  }
]
```
</details>

</details>

## Data requests

### Events

```ts
{
  name: string[],
  call: boolean,
  stack: boolean,
  extrinsic: boolean
}
```

An event will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ name: [] }`) matches no events; omit all requests/pass an empty object to match all events.

See [`addEvent()` SDK function reference](/sdk/reference/processors/substrate-batch/data-requests/#events) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/substrate-batch/field-selection).

### Calls

```ts
{
  name: string[],
  subcalls: boolean,
  extrinsic: boolean,
  stack: boolean,
  events: boolean
}
```

A call will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ name: [] }`) matches no calls; omit all requests/pass an empty object to match all calls.

See [`addCall()` SDK function reference](/sdk/reference/processors/substrate-batch/data-requests/#calls) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/substrate-batch/field-selection).

### `Contracts.ContractEmitted` events {#contractsEvents}

:::info
Contract addresses supplied with this data request must be hexadecimal (i.e. decoded from SS58) and lowecased. Addresses in all responses will be in the same format.
:::

```ts
{
  contractAddress: string[],
  call: boolean,
  stack: boolean,
  extrinsic: boolean
}
```

A `Contracts.ContractEmitted` event will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ contractAddress: [] }`) matches no events; omit all requests/pass an empty object to match all events.

See [`addContractsContractEmitted()` SDK function reference](/sdk/reference/processors/substrate-batch/data-requests/#addcontractscontractemitted) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/substrate-batch/field-selection) and [ink! contracts support](/sdk/resources/substrate/ink).

### `EVM.Log` events {#evmLog}

:::info
Contract addresses supplied with this data request must be in lowercase. Addresses in all responses will be in the same format.
:::

```ts
{
  address: string[],
  topic0: string[],
  topic1: string[],
  topic2: string[],
  topic3: string[],
  call: boolean,
  stack: boolean,
  extrinsic: boolean
}
```
An `EVM.Log` event will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ topic0: [] }`) matches no events; omit all requests/pass an empty object to match all events.

See [`addEvmLog()` SDK function reference](/sdk/reference/processors/substrate-batch/data-requests/#addevmlog) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/substrate-batch/field-selection) and [Frontier EVM support](/sdk/resources/substrate/frontier-evm).

### `Ethereum.transact` calls {#ethereumTransact}

:::info
Contract addresses supplied with this data request must be in lowercase. Addresses in all responses will be in the same format.
:::

```ts
{
  to: string[],
  sighash: string[],
  extrinsic: boolean,
  stack: boolean,
  events: boolean
}
```

An `Ethereum.transact` call will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ sighash: [] }`) matches no calls; omit all requests/pass an empty object to match all calls.

See [`addEthereumTransaction()` SDK function reference](/sdk/reference/processors/substrate-batch/data-requests/#addethereumtransaction) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/substrate-batch/field-selection) and [Frontier EVM support](/sdk/resources/substrate/frontier-evm).

### `Gear.MessageQueued` events {#gearMessageQueued}

```ts
{
  programId: string[],
  call: boolean,
  stack: boolean,
  extrinsic: boolean
}
```

A `Gear.MessageQueued` event will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ programId: [] }`) matches no events; omit all requests/pass an empty object to match all events.

See [`addGearMessageQueued()` SDK function reference](/sdk/reference/processors/substrate-batch/data-requests/#addgearmessagequeued) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/substrate-batch/field-selection) and [Gear support](/sdk/resources/substrate/gear).

### `Gear.UserMessageSent` events {#gearUserMessageSent}

```ts
{
  programId: string[],
  call: boolean,
  stack: boolean,
  extrinsic: boolean
}
```

A `Gear.UserMessageSent` event will be included in the response if it matches all the requests. A request with an empty array (e.g. `{ programId: [] }`) matches no events; omit all requests/pass an empty object to match all events.

See [`addGearUserMessageSent()` SDK function reference](/sdk/reference/processors/substrate-batch/data-requests/#addgearusermessagesent) for a detailed description of the fields of this data request; also see [Field selection](/sdk/reference/processors/substrate-batch/field-selection) and [Gear support](/sdk/resources/substrate/gear).

## Data fields selector

A JSON selector of fields for the returned data items. Documented in the [Field selectors](/sdk/reference/processors/substrate-batch/field-selection/#data-item-types-and-field-selectors) section.
