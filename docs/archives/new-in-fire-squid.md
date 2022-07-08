# What's new in FireSquid Archives

The FireSquid release of Squid Archives brought about significant performance improvements:

- FireSquid archives can concurrently source blocks from multiple endpoints. The synchronization can be as fast as 500 blocks per second and is bottlenecked only by the database writes. 
- FireSquid is around 5x more storage-efficient compared to v5. 
- FireSquid API supports a more efficient batching interface to be used in combination with squid processors. 
- FireSquid archives come with experimental support of Cockroach DB clusters as a storage database, making it horizontally scalable. 
- FireSquid Archives natively support lookups for calls wrapped in `batch`, `sudo` and `proxy` extrinsics. 