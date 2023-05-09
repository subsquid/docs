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
- **toBlock**: Block number to end on (inclusive) (optional). If this is not given, the query will go on for a fixed amount of time or until it reaches the height of the archive.
- **logs.address**: Array of addresses to query for. A log will be included in the response if the log's address matches any of the addresses given in the query. (null or empty array means any address).
- **log.topics**: Array of arrays of topics. Outer array has an element for each topic an EVM log can have. Each inner array represents possible matching values for a topic. For example topics[2] is an array of possible values that should match the log's third topic or the log won't be included in the response. Empty arrays match everything.
- **transactions.from** and **transactions.to**: Array of addresses that should match the transaction's `to` field or the transaction's `from`. If none of these match, the transaction won't be included in the response. If both are null or empty array, any address will pass.
- **transactions.sighash**: Array of values that should match first four bytes of the transaction input. null or empty array means any value will pass.

<details>

<summary>

##### Example Request
</summary>

```json
{
  "fromBlock": 14495889,
  "toBlock": 14495889,
  "logs": [
    {
      "address": [
        "0x3883f5e181fccaF8410FA61e12b59BAd963fb645"
      ],
      "topics": [
        [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        ]
      ],
      "fieldSelection": {
        "block": {
          "parentHash": true,
          "sha3Uncles": true,
          "miner": true,
          "stateRoot": true,
          "transactionsRoot": true,
          "receiptsRoot": true,
          "logsBloom": true,
          "difficulty": true,
          "number": true,
          "gasLimit": true,
          "gasUsed": true,
          "timestamp": true,
          "extraData": true,
          "mixHash": true,
          "nonce": true,
          "totalDifficulty": true,
          "baseFeePerGas": true,
          "size": true,
          "hash": true
        },
        "transaction": {
          "type": true,
          "nonce": true,
          "to": true,
          "gas": true,
          "value": true,
          "input": true,
          "maxPriorityFeePerGas": true,
          "maxFeePerGas": true,
          "yParity": true,
          "chainId": true,
          "v": true,
          "r": true,
          "s": true,
          "from": true,
          "blockHash": true,
          "blockNumber": true,
          "index": true,
          "gasPrice": true,
          "hash": true,
          "status": true
        },
        "log": {
          "address": true,
          "blockHash": true,
          "blockNumber": true,
          "data": true,
          "index": true,
          "removed": true,
          "topics": true,
          "transactionHash": true,
          "transactionIndex": true
        }
      }
    }
  ],
  "transactions": [
    {
      "address": [
        "0x3883f5e181fccaf8410fa61e12b59bad963fb645"
      ],
      "sighash": [
        "0xa9059cbb"
      ],
      "fieldSelection": {
        "block": {
          "parentHash": true,
          "sha3Uncles": true,
          "miner": true,
          "stateRoot": true,
          "transactionsRoot": true,
          "receiptsRoot": true,
          "logsBloom": true,
          "difficulty": true,
          "number": true,
          "gasLimit": true,
          "gasUsed": true,
          "timestamp": true,
          "extraData": true,
          "mixHash": true,
          "nonce": true,
          "totalDifficulty": true,
          "baseFeePerGas": true,
          "size": true,
          "hash": true
        },
        "transaction": {
          "type": true,
          "nonce": true,
          "to": true,
          "gas": true,
          "value": true,
          "input": true,
          "maxPriorityFeePerGas": true,
          "maxFeePerGas": true,
          "yParity": true,
          "chainId": true,
          "v": true,
          "r": true,
          "s": true,
          "from": true,
          "blockHash": true,
          "blockNumber": true,
          "index": true,
          "gasPrice": true,
          "hash": true,
          "status": true
        },
        "log": {
          "address": true,
          "blockHash": true,
          "blockNumber": true,
          "data": true,
          "index": true,
          "removed": true,
          "topics": true,
          "transactionHash": true,
          "transactionIndex": true
        }
      }
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
{
  "data": [
    [
      {
        "block": {
          "parentHash": "0x455864413159d92478ad496a627533ce6fdd83d6ed47528b8790b96135325d64",
          "sha3Uncles": "0x9098605a7fc9c4c70622f6458f168b9acb302e6f84d02235670b49e263a3bd13",
          "miner": "0xea674fdde714fd979de3edf0f56aa9716b898ec8",
          "stateRoot": "0xfb8b174c4e118d95ff5097014ed1d60c8b49094b541b1e9e4e16198963ddbdf6",
          "transactionsRoot": "0xb8eebad6f727be7afa3d6812ff2c05adb1e3053ac15bfb6acdd0265c8ffd2cce",
          "receiptsRoot": "0x4fa02eab7297cfbadd39d3e47cdf52f85159f4b9719621c2ec6a9b608638a482",
          "logsBloom": "0xb43fd1cee1dfdf4b7cbef44ced7f9ebe70c8e7ddfe764cb84ba96beb352ff49d751f196fd0b87fcf3d3e5a2241f56f714a1280c30be3ed27ef7f9f7bf0b7aa7d94de4fe8ea476fea6f7364ed917bd3e3af3f7a1ec3d4f910fee067a6cabffb7f7eaadbe70e5e8a6ec4ecf6f8959b7adbec62fdbc8513855c66ea15fbacca1b64517c8f94e766be97b4fefdd8a5952ef45ae56ffbc9cad78948b32ddf6ed4b83333fdee65b97d6897fe9fe8f9ed583c4c4a90e2cbe9d5bb9f2375932c77bddd77bf08ffa3df263f777de5228103bff47b8d6df97fa79fce9b0c7a3fea0f43e73f143c388f5d732b9cb9e5fe889bd04ff31b4b84e1ffe407d222ffce85f8567aeb",
          "difficulty": "0x2e878564548bfa",
          "number": 14495889,
          "gasLimit": "0x01ca35ef",
          "gasUsed": "0x01c9e9fe",
          "timestamp": "0x6246042d",
          "extraData": "0x617369612d65617374322d3134",
          "mixHash": "0xbfcdb3683cbefbfe178e0334acf34005cd20dc06440f311cd9270236b6dea952",
          "nonce": "17265704492997010732",
          "totalDifficulty": "0x0991caa08ff39c6e95a4",
          "baseFeePerGas": "0x0c97b03dcf",
          "size": "0x023860",
          "hash": "0x344fc5e67555bfb42f759be7ee372fad30bcbebf780cbfb901f546683ed22517"
        },
        "transactions": [
          {
            "type": 2,
            "nonce": "6",
            "to": "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
            "gas": "0xd3bb",
            "value": "0x00",
            "input": "0xa9059cbb000000000000000000000000254d3f04543145f3a991b61675ca0bb353f669c90000000000000000000000000000000000000000000000008ac7230489e80000",
            "maxPriorityFeePerGas": "0x4a817c80",
            "maxFeePerGas": "0x0cff79e223",
            "chainId": 1,
            "v": "0",
            "r": "0xbd768420f1c173f6942d201b83bc7aedef90d4b9947598a2e931525560b722ed",
            "s": "0x78387f73fd4b6cd006eaf8deeda0857234e29740c06e01221460c7118daef348",
            "from": "0x5bf2f6612dfc3d0d1e0c6799534228b41369d39e",
            "blockHash": "0x344fc5e67555bfb42f759be7ee372fad30bcbebf780cbfb901f546683ed22517",
            "blockNumber": 14495889,
            "index": 299,
            "gasPrice": "0x0ce231ba4f",
            "hash": "0x8f45965dd61dc189b94306b0f13cc3338374f687d527c64c1f19c994b39ae3b2"
          }
        ],
        "logs": [
          {
            "address": "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
            "blockHash": "0x344fc5e67555bfb42f759be7ee372fad30bcbebf780cbfb901f546683ed22517",
            "blockNumber": 14495889,
            "data": "0x0000000000000000000000000000000000000000000000008ac7230489e80000",
            "index": 379,
            "removed": false,
            "topics": [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x0000000000000000000000005bf2f6612dfc3d0d1e0c6799534228b41369d39e",
              "0x000000000000000000000000254d3f04543145f3a991b61675ca0bb353f669c9"
            ],
            "transactionHash": "0x8f45965dd61dc189b94306b0f13cc3338374f687d527c64c1f19c994b39ae3b2",
            "transactionIndex": 299
          }
        ]
      }
    ]
  ],
  "archiveHeight": 16577057,
  "nextBlock": 14495890,
  "totalTime": 220
}
```
</details>

</details>
