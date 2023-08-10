---
sidebar_position: 1
title: Store interface
description: >-
  Store API for persisting the transformed data
---

# Store Interface

`Store` is a generic interface exposed by `DataHandlerContext.store` to the batch handler that defines an interface for persisting data. Its concrete type is inferred from the `Database` argument of the `run()` method:

```typescript
run<Store>(db: Database<Store>, handler: (ctx: DataHandlerContext<Store, F extends FieldSelection>) => Promise<void>): void
```

The `Database` interface only defines the logic of how the processor persists the processor status and the store. Squid SDK supports `Database` implementations for `TypeORM`-compatible databases ([`TypeormDatabase`](/store/postgres/typeorm-store)) and for file-based datasets ([the `file-store` packages](/store/file-store)). The interface allows implementation of adapters for custom data sinks. Support for more databases and analytics store will be added in the future.

