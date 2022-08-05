---
sidebar_position: 3
title: New in FireSquid
---

# New in FireSquid

FireSquid has introduced major performance improvements both for squids and Archives.

## Squids

- `SubstrateBatchProcessor` with an up to 100x sync speed improvement. The data mappers receive multiple events in a single batch and transform the data in chunks, dramatically reducing the database roundtrips and the sync time. For example, all the 3.6 million of historical KSM transfers spread over almost 14M blocks are indexed in less than 15 minutes by the new [squid-template](https://github.com/subsquid/squid-template).
- Auto-unwrapping of `sudo` and `util.batch` calls. The processor handlers can now subscribe to calls, not extrinsics. This saves a lot of effort and sync speed when the desired extrinsic is a wrapped into a `sudo` or `batch` call. 
- Data projections in the processor handlers. Now the mapping developers can explicitly specify which data is needed for the handler business logic. The processor fetches only the requested data thus significantly reducing data overfetching and increasing the squid sync speed.
- Wildcard (`*`) handlers to subscribe to all events, extrinsics or calls. Useful for building bespoke APIs for explorers and wallets
- Native logging in the processor handlers provided by `ctx.log`. It supports fine-grained logging levels and colored pretty-printing to console.
- A pluggable `ctx.store` interface opening up new use-cases for squids. A custom implementation of `Store` will allow a squid to write to multiple data targets (e.g. Postgres and ElasticSearch) while retaining full control over the data consistency and the error-handling.

## Archives

The FireSquid release of Squid Archives brought about significant performance improvements:

- FireSquid archives can concurrently source blocks from multiple endpoints. The synchronization can be as fast as 500 blocks per second and is bottlenecked only by the database writes. 
- FireSquid is around 5x more storage-efficient compared to v5. 
- FireSquid API supports a more efficient batching interface to be used in combination with squid processors. 
- FireSquid archives come with experimental support of Cockroach DB clusters as a storage database, making it horizontally scalable. 
- FireSquid Archives natively support lookups for calls wrapped in `batch`, `sudo` and `proxy` extrinsics. 