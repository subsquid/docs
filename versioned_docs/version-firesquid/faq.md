---
sidebar_position: 130
---

# FAQ

### What is the Premium plan?

The access to Archives is free. Aquarium offers a free and a premium plans. The Premium plan is currently available by invite via the [form](https://docs.google.com/forms/d/e/1FAIpQLSchqvWxRhlw7yfBlfiudizLJI9hEfeCEuaSlk3wOcwB1HQf6g/viewform?usp=sf_link). When released to the public, Premium will be based on the fixed subscription fee + pay-as-you-go model. Details will be announced in the official Subsquid channels.

### Do you have a roadmap ?

Yes, see the issue in [the official repo](https://github.com/subsquid/squid-sdk/issues/70)

### How does Subsquid handle unfinalized blocks?

Archives index only finalized blocks. Handling unfinalized blocks and potential block reorganisations is supported by the Squid SDK since the ArrowSquid release, enabling real-time use-cases. The blocks not yet indexed by the Archive are ingested directly from an RPC endpoint. 

### What is the latency for the data served by the squid? 

Since the ArrowSquid release, the Squid SDK has the option to ingest unfinalized blocks directly from an RPC endpoint, making the indexing real-time. Archive-only squids without an RPC datasource typically have a latency of a few minutes to a few hours.

### How do I enable GraphQL subscriptions for local runs?

Add `--subscription` flag to the `serve` command defined in `commands.json`. See [Subscriptions](/firesquid/graphql-api/subscriptions) for details.
