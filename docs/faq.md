---
sidebar_position: 130
---

# FAQ

### What is the Premium plan?

The access to Archives is free. Aquarium offers a free and a premium plans. The Premium plan is currently available by invite via the [form](https://luvp4va64ru.typeform.com/to/QrRF66q5). When released to the public, Premium will be based on the fixed subscription fee + pay-as-you-go model. Details will be announced in the official Subsquid channels.

### Do you have a roadmap ?

Yes, see the issue in [the official repo](https://github.com/subsquid/squid-sdk/issues/70)

### How does Subsquid handle unfinalized blocks?

Archives index only finalized blocks. Handling unfinalized blocks and potential block reorganisations is supported by the Squid SDK since the ArrowSquid release, see [Indexing unfinalized blocks](/basics/unfinalized-blocks).

### What is the latency for the data served by the squid? 

Since the ArrowSquid release, the Squid SDK has the option to ingest unfinalized blocks directly from an RPC endpoint, making the indexing real-time. Archive-only squids without an RPC datasource typically have a latency of a few minutes to a few hours.

### How do I enable GraphQL subscriptions for local runs?

Add `--subscription` flag to the `serve` command defined in `commands.json`. See [Subscriptions](/graphql-api/subscriptions) for details.

### Where do squid processors keep their state between batches?

Depends on the data sink used. Squid processors that use [`TypeormDatabase`](/basics/store/postgres) keep their state in a [schema](https://www.postgresql.org/docs/current/sql-createschema.html), not in a table. By default the schema is called `squid_processor` (name must be overridden in [multiprocessor squids](/basics/multichain)). You can view it with
```sql
select * from squid_processor.status;
```
and manually drop it with
```sql
drop schema squid_processor cascade;
```
to reset the processor status.

Squids that store their data in [file-based datasets](/basics/store/file-store) store their status in `status.txt` by default. This can be overridden by defining custom [database hooks](/basics/store/file-store/overview/#filesystem-syncs-and-dataset-partitioning).
