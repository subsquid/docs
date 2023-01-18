---
sidebar_position: 1
title: Store Interface
description: >-
  Store API for persisting the transformed data
---

# Store Interface

`Store` is a generic interface exposed by `XXXContext.store` to the batch handler. The concrete type is inferred from the `Database` argument of the `BatchProcessor.run` method:

```typescript
run<Store>(db: Database<Store>, handler: (ctx: BatchContext<Store, Item>) => Promise<void>): void
```

The `Database` interface only defines the logic of how the processor persists the processor status: