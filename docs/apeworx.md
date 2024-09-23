---
title: ApeWorx plugin
description: >-
  Use SQD Network as a data source for ApeWorx
sidebar_position: 40
---

# ApeWorx SQD plugin

:::info
The `subsquid` ApeWorx plugin is currently in beta. Please report any bugs or suggestions to [Squid Devs](https://t.me/HydraDevs) or open an issue at the [GitHub repo](https://github.com/subsquid/ape-subsquid/) of the plugin.
:::

[ApeWorx](https://apeworx.io) is a modular Web3 development framework for Python programmers. Among other things, it is capable of [retrieving blockchain data in bulk](https://docs.apeworx.io/ape/stable/userguides/data.html). The data can come from various sources, including SQD Network.

The network provides free access to blocks and event logs data. On long block ranges (>1k blocks) data retrieval is orders of magnitude (>10x) faster compared to RPC-based data sources.

## Basic usage

In an existing [ApeWorx installation](https://docs.apeworx.io/ape/stable/userguides/quickstart.html#installation), run the following to install the `subsquid` plugin:
```bash
ape plugins install "ape-subsquid@git+https://github.com/subsquid/ape-subsquid.git@main"
```
To source data from SQD Network, start `ape console` as usual, e.g. with
```bash
ape console --network ethereum:mainnet:geth
```
then pass
```python
engine_to_use='subsquid'
```
to your data query methods. You can speed up the following calls:

1. Bulk block data retrieval with `chain.blocks.query`:
   ```python
   df = chain.blocks.query(
       '*',
       start_block=18_000_000,
       stop_block=19_000_000,
       engine_to_use='subsquid'
   )
   ```
   This query retrieves data on 1M blocks in about 11 minutes.

2. Contract events retrieval:
   ```python
   contract = Contract('0xdac17f958d2ee523a2206206994597c13d831ec7', abi='usdt.json')
   df = contract.Transfer.query(
       '*',
       start_block=18_000_000,
       stop_block=18_100_000,
       engine_to_use='subsquid'
   )
   ```
   This query retrieves 1.6M events emitted over 100k block in about 17 minutes.

:::warning
At the moment, all SQD Network datasets are updated only once every several thousands of blocks. The current dataset height can be retrieved with `get_network_height()`:
```python
from ape_subsquid import get_network_height

get_network_height() # currently 19212115 while the chain is at 19213330
```
Queries that request blocks above the current dataset height **will fail** with an `ape_subsquid.exceptions.DataRangeIsNotAvailable` exception. That includes queries without an explicitly set `stop_block`. If you don't need the recent data, you can explicitly request the data up to the block height of the SQD dataset, e.g.

```python
subsquid_height = get_network_height()
df = chain.blocks.query(
    '*',
    start_block=19_000_000,
    stop_block=subsquid_height,
    engine_to_use='subsquid'
)
```
To get the latest data, retrieve the tail with the default engine and append it to the dataframe:
```python
taildf = chain.blocks.query('*', start_block=subsquid_height+1)
df = pd.concat([df, taildf], ignore_index=True, copy=False)
```
:::

:::info
When working with block ranges much longer than 1M blocks, the plugin may occasionally fail due to HTTP 503 errors rarely returned by the network. If you encounter this issue, split your block range into sub-1M blocks intervals and retrieve the data for each interval separately, retrying when the queries throw exceptions.
:::

## Networks support

The following networks available via plugins from `ape plugins list --all` are supported:

* `arbitrum`
* `avalanche`
* `base`
* `bsc`
* `ethereum`
* `fantom`
* `optimism`
* `polygon`
* `polygon-zkevm`

## Extra functionality

### Low-level queries

The plugin supports the following [low-level queries](https://docs.apeworx.io/ape/stable/methoddocs/api.html#module-ape.api.query):

* [`BlockQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.BlockQuery)
* [`ContractEventQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.ContractEventQuery)
* [`ContractCreationQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.ContractCreationQuery) (only for [networks with traces support](/subsquid-network/reference/networks/#evm--ethereum-compatible))
* [`AccountTransactionQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.AccountTransactionQuery)

The following queries are **NOT** supported:

* [`BlockTransactionQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.BlockTransactionQuery): uses hashes instead of numbers to identify blocks. This is not supported by SQD Network.
* [`ContractMethodQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.ContractMethodQuery): not used by any high-level methods at the moment. If you need it, let us know at the [Squid Devs channel](https://t.me/HydraDevs).

### Account history retrieval

The plugin can be used to retrieve historical data for individual accounts, although this is much slower than working with specialized APIs such as Etherscan.

```python
accountHistory = chain.history._get_account_history('vitalik.eth')
accountHistory.query('value', engine_to_use='subsquid')
```
