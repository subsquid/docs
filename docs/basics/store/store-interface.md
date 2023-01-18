---
sidebar_position: 1
title: Store Interface
description: >-
  Store API for persisting the transformed data
---

# Store Interface

`Store` is a generic interface exposed by `BatchContext.store` to the batch handler and defines the interface for persisting the data. The concrete type is inferred from the `Database` argument of the `run()` method:

```typescript
run<Store>(db: Database<Store>, handler: (ctx: BatchContext<Store, Item>) => Promise<void>): void
```

The `Database` interface only defines the logic of how the processor persists the processor status and the store. Squid SDK supports `Database` implementations for `TypeORM`-compatible databases ([`TypeORMDatabase`](/basics/store/typeorm-store)) and flat files. The interface allows implementation of adapters for custom data sinks, and support for more databases and analytic store is planned for the future.

