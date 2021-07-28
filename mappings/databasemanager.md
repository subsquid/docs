---
description: A closer look at the Context types passed to the mappers
---

# Context interfaces

### StoreContext

`StoreContext` is a type  indicating that the mappings context is aware of the `store` property of type `DatabaseManager` . `DatabaseManager` is a wrapper interface incapsulating the persistence layer:

```typescript
export interface StoreContext {
  store: DatabaseManager
}

/**
 * Database access interface. Use typeorm transactional entity manager to perform get/save/remove operations.
 */
export default interface DatabaseManager {
  /**
   * Save given entity instance, if entity is exists then just update
   * @param entity
   */
  save<T>(entity: DeepPartial<T>): Promise<void>;

  /**
   * Removes a given entity from the database.
   * @param entity: DeepPartial<T>
   */
  remove<T>(entity: DeepPartial<T>): Promise<void>;

  /**
   * Finds first entity that matches given options.
   * @param entity: T
   * @param options: FindOneOptions<T>
   */
  get<T>(entity: { new (...args: any[]): T }, options: FindOneOptions<T>): Promise<T | undefined>;

  /**
   * Finds entities that match given options.
   * @param entity: T
   * @param options: FindOneOptions<T>
   */
  getMany<T>(entity: { new (...args: any[]): T }, options: FindOneOptions<T>): Promise<T[]>;
}
```

### BlockContext

Contains information about the block: timestamp, height, hash, as well as the list of all events and extrinsics.

```typescript
export interface BlockContext {
  block: SubstrateBlock
}
```

### EventContext

Contains info about the event being handled and the extrinsic emitted the event. Since some events are emitted without an extrinsic \(system event\), the `extrinsic` parameter is optional.

```typescript
export interface EventContext extends BlockContext {
  event: SubstrateEvent
  extrinsic?: SubstrateExtrinsic
}
```

### ExtrinsicContext

Passed to extrinsic handlers. Similar to `EventContext` but `extrinsic` is now a mandatory property.

```typescript
export interface ExtrinsicContext extends BlockContext {
  event: SubstrateEvent
  extrinsic: SubstrateExtrinsic
}
```

