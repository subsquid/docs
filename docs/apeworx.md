---
title: ApeWorx plugin
description: >-
  Use Subsquid Network as a data source for ApeWorx
sidebar_position: 40
---

# ApeWorx Subsquid plugin

:::info
The `subsquid` ApeWorx plugin is currently in beta. Please report any bugs or suggestions to [Squid Devs](https://t.me/HydraDevs) or open an issue at the [GitHub repo](https://github.com/subsquid/ape-subsquid/) of the plugin.
:::

[ApeWorx](https://apeworx.io) is a modular Web3 development framework for Python programmers. Among other things, it is capable of [retrieving blockchain data in bulk](https://docs.apeworx.io/ape/stable/userguides/data.html). The data can come from various sources, including Subsquid Network.

In an existing [ApeWorx installation](https://docs.apeworx.io/ape/stable/userguides/quickstart.html#installation), run the following to install the `subsquid` plugin:
```bash
ape plugins install "ape-subsquid@git+https://github.com/subsquid/ape-subsquid.git@main"
```
To source data from Subsquid Network, start `ape console` as usual, e.g. with
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
* [`ContractCreationQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.ContractCreationQuery) (only for [networks with traces support](/subsquid-network/reference/evm-networks))
* [`AccountTransactionQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.AccountTransactionQuery)

The following queries are **NOT** supported:

* [`BlockTransactionQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.BlockTransactionQuery): uses hashes instead of numbers to identify blocks. This is not supported by Subsquid Network.
* [`ContractMethodQuery`](https://docs.apeworx.io/ape/stable/methoddocs/api.html#ape.api.query.ContractMethodQuery): not used by any high-level methods at the moment. If you need it, let us know at the [Squid Devs channel](https://t.me/HydraDevs).

### Account history retrieval

The plugin can be used to retrieve historical data for individual accounts, although this is much slower than working with specialized APIs such as Etherscan.

```python
accountHistory = chain.history._get_account_history('vitalik.eth')
accountHistory.query('value', engine_to_use='subsquid')
```
