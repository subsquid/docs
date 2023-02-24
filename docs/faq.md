---
sidebar_position: 130
---

# FAQ

### What is the Premium plan?

The access to Archives is free. Aquarium offers a free and a premium plans. The Premium plan is currently available by invite via the [form](https://luvp4va64ru.typeform.com/to/QrRF66q5). When released to the public, Premium will be based on the fixed subscription fee + pay-as-you-go model. Details will be announced in the official Subsquid channels.

### Do you have a roadmap ?

Yes, see the issue in [the official repo](https://github.com/subsquid/squid-sdk/issues/70)

### How does Subsquid handle unfinalized blocks?

Archives index only finalized blocks. Handling unfinalized blocks and potential block reorganisations will be supported by the Squid SDK in the future, enabling real-time use-cases.  

### What is the latency for the data served by the squid? 

Typically, the data is indexed within a second after the block has been finalized by the chain. The finalization mechanism varies significantly for different chains. For uses-cases where sub-second latency is critical (arbitrage, gaming) Squid SDK will offer indexing of unfinalized blocks in a future release.

### How do I enable GraphQL subscriptions for local runs?

Add `--subscription` flag to the `serve` command defined in `commands.json`. See [Subscriptions](/graphql-api/subscriptions) for details.
