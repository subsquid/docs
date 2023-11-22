---
sidebar_position: 20
title: Balances squid
description: >-
  Switching between multiple chains
---

# Multichain balance tracking squid

This [complex squid](https://github.com/subsquid-labs/balances-squid) illustrates the usage of [`SubstrateBatchProcessor`](/substrate-indexing), [storage calls](/substrate-indexing/storage-state-calls) and [custom resolvers](/graphql-api/custom-resolvers). 

:::warning
The squid uses Makefile for local commands, a solution that is currently deprecated in favor of [`sqd` commands](/squid-cli). Please keep that in mind.
:::

## Quickstart

Clone the repo and enter its directory:
```bash
git clone https://github.com/subsquid-labs/balances-squid
cd balances-squid
```
There, create a `.env` file with the following contents:
```bash
DB_NAME=postgres
DB_PORT=23798
GQL_PORT=4350
```
Prepare the squid and start a processor by running

```bash
npm ci
make build
make up
make migrate
CHAIN=<chain_name> node -r dotenv/config ./lib/processor.js
```
Supported values for `<chain_name>`: `hydradx`, `kusama`, `polkadot`, `acala`, `karura`, `moonriver`, `moonbeam`, `bifrost`, `phala`.

Processor will block the terminal. Open another one in the same folder and run
```bash
make serve
```
there to get a GraphQL server running at [`localhost:4350/graphql`](http://localhost:4350/graphql).

## Public endpoints

Browse GraphiQL playgrounds of this squid's public endpoints at the following URLs:

### Polkadot:
* https://squid.subsquid.io/polkadot-balances/graphql
* https://squid.subsquid.io/acala-balances/graphql
* https://squid.subsquid.io/moonbeam-balances/graphql
* https://squid.subsquid.io/phala-balances/graphql

### Kusama:
* https://squid.subsquid.io/kusama-balances/graphql
* https://squid.subsquid.io/karura-balances/graphql
* https://squid.subsquid.io/moonbeam-balances/graphql
* https://squid.subsquid.io/bifrost-balances/graphql
