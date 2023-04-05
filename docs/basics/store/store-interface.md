---
sidebar_position: 1
title: Store interface
description: >-
  Store API for persisting the transformed data
---

# Store Interface

`Store` is a generic interface exposed by `BatchContext.store` to the batch handler that defines an interface for persisting data. Its concrete type is inferred from the `Database` argument of the `run()` method:

```typescript
run<Store>(db: Database<Store>, handler: (ctx: BatchContext<Store, Item>) => Promise<void>): void
```

The `Database` interface only defines the logic of how the processor persists the processor status and the store. Squid SDK supports `Database` implementations for `TypeORM`-compatible databases ([`TypeormDatabase`](/basics/store/typeorm-store)) and flat files. The interface allows implementation of adapters for custom data sinks. Support for more databases and analytic store will be added in the future.

