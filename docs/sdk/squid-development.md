---
sidebar_position: 20
title: Retrieve a template
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Retrieve a template

## Pre-requisites

- Node v16.x or newer
- [Squid CLI](/squid-cli/installation)
- Docker

## Available templates

Any Git repository containing code of a squid can be used as a template. Squid CLI has aliases for a few especially useful templates:

```mdx-code-block
<Tabs>
<TabItem value="evm" label="EVM">
```
- `evm`: a minimal template intended for developing EVM squids from scratch. Indexes ETH burns.
- `gravatar`: a classic [example Subgraph](/dead) after a [migration](/dead) to Subsquid.

```mdx-code-block
</TabItem>
<TabItem value="substrate" label="Substrate">
```
- For indexing native events emitted by Substrate-based chains, use `substrate`
- For indexing Frontier EVM contracts on Astar and Shiden use `frontier-evm`
- For indexing ink! smart contracts, use `ink`
- For indexing EVM+ contracts on Karura or Acala, use `acala`

```mdx-code-block
</TabItem>
</Tabs>
```

Please note:
- All these templates are **not** compatible with `yarn` and expect a `npm`-generated `package-lock.json` file in the root.

## Retrieve and prepare a template squid

Come up with a new memorable name for your squid and scaffold from the template of your choice:

```bash
sqd init my-awesome-squid --template <template-name>
cd my-awesome-squid
```
Install dependencies

```bash
npm ci
```

## (Recommended) Test the template locally

:::info
To make local runs more convenient squid templates define additional `sqd` commands at `commands.json`. All of `sqd` commands used here are such extras. Take a look at the contents of this file to learn more about how squids work under the hood.
:::

To run your squid:

1. Launch a Postgres container with `sqd up`
2. Start the squid processor with `sqd process`. You should see output that contains lines like these ones:
   ```bash
   04:11:24 INFO  sqd:processor processing blocks from 6000000
   04:11:24 INFO  sqd:processor using archive data source
   04:11:24 INFO  sqd:processor prometheus metrics are served at port 45829
   04:11:27 INFO  sqd:processor 6051219 / 18079056, rate: 16781 blocks/sec, mapping: 770 blocks/sec, 544 items/sec, eta: 12m
   ```
3. (Optional) Start the GraphQL server by running `sqd serve` in a separate terminal, then visit the [GraphiQL console](http://localhost:4350/graphql) to verify that the GraphQL API is up.

When done, shut down and erase your database with `sqd down`.
