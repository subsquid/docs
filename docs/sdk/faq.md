---
sidebar_position: 80
title: FAQ
description: Frequently asked questions
---

### What are some real-world applications for which Squid SDK was a good fit? {#real-world-applications}

Here is an incomplete list:
- DeFi dashboards, tracking addresses and internal transactions
- NFT marketplaces, with a dynamic sets of NFT contracts to watch
- Historical price feeds, tracking Uniswap trades and Chainlink oracle contracts
- Mining smart contract deployments and the bytecode
- Real-time bots (\<1sec delay) triggered by on-chain activity


### How does Squid SDK handle unfinalized blocks?

The Subsquid Network only serves finalized blocks and is typically ~1000 blocks behind the tip. The most recent blocks, as well as the unfinalized blocks are seamlessly handled by the SDK from a complementary RPC data source, set by the `chain` config. Potential chain reorgs are automatically handled under the hood. See [Indexing unfinalized blocks](/sdk/resources/basics/unfinalized-blocks) for details.

### What is the latency for the data served by the squid? 

Since the ArrowSquid release, the Squid SDK has the option to ingest unfinalized blocks directly from an RPC endpoint, making the indexing real-time. 

### How do I enable GraphQL subscriptions for local runs?

Add `--subscription` flag to the `serve` command defined in `commands.json`. See [Subscriptions](/sdk/reference/graphql-server/configuration/subscriptions) for details.

### How do squids keep track of their sync progress?

Depends on the data sink used. Squid processors that use [`TypeormDatabase`](/sdk/resources/persisting-data/typeorm) keep their state in a [schema](https://www.postgresql.org/docs/current/sql-createschema.html), not in a table. By default the schema is called `squid_processor` (name must be overridden in [multiprocessor squids](/sdk/resources/basics/multichain)). You can view it with
```sql
select * from squid_processor.status;
```
and manually drop it with
```sql
drop schema squid_processor cascade;
```
to reset the processor status.

Squids that store their data in [file-based datasets](/sdk/resources/persisting-data/file) store their status in `status.txt` by default. This can be overridden by defining custom [database hooks](/sdk/resources/persisting-data/file/#hooks).

### Is there a healthcheck endpoint for the indexer?

Yes, the processor exposes the key prometheus metrics at the `${process.env.PROMETHEUS_PORT}/metric` endpoint. The squids deployed to the Subsquid Cloud also publicly explose the metrics, see [Monitoring in the Cloud](/cloud/resources/monitoring/)
