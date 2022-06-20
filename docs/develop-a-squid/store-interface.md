# Store interface

When working with Subsquid SDK and building on the `SubstrateProcessor`, the `Store` is a very important concept one. As briefly explained in the Key Concept page dedicated to the Processor, it serves as an interface for the data-persistence layer, often represented by a database.

The `Store` interface we implemented is an extension of the `EntityManager` from the [TypeORM](https://typeorm.io/#/) library. It is a dependency of the project, so it should be installed with the rest of them, but to manually install it, simply run:

```
npm install typeorm
```

In the context of the `SubstrateProcessor`, there are a few noteworthy functions exposed by the `Store`, which we'll focus on during this guide.

The `Store` interface is usually passed as part of the `EventHandlerContext`, `ExtrinsicHandlerContext` or `BlockHandlerContext`, depending on the handler on the receiving end:

```typescript
export interface EventHandlerContext {
    store: Store
    block: SubstrateBlock
    event: SubstrateEvent
    extrinsic?: SubstrateExtrinsic
    /**
     * Not yet public description of chain metadata
     * @internal
     */
    _chain: Chain
}
```

So when defining an Event Handler, it's possible to use all the functions exposed by the interface. Here is a summary of the most important ones:

## Multiple database support

## Lazy transactions

## Finding objects

The `Store` interface exposes various methods for finding objects, here's a few, defined directly as part of `EntityManager` parent interface:

```typescript
export declare class EntityManager {
     // ...
     
     // Finds entities that match given options.
     find<Entity>(entityClass: EntityTarget<Entity>, options?: FindManyOptions<Entity>): Promise<Entity[]>;
     // Finds entities that match given conditions.
     find<Entity>(entityClass: EntityTarget<Entity>, conditions?: FindConditions<Entity>): Promise<Entity[]>;
}

```

Where `options` can be an object containing options arguments like: `select`, `where`, `relations`, `join`, `order`, `cache`. An example of usage might be:

```typescript
let scalar = await em.find(Scalar, {
    order: {
        id: 'ASC'
    }
})

```

Other methods include:

```typescript
export declare class EntityManager {
     // ...
     
     // Finds entities with ids.
     // Optionally find options can be applied.
     findByIds<Entity>(entityClass: EntityTarget<Entity>, ids: any[], options?: FindManyOptions<Entity>): Promise<Entity[]>;
     // Finds entities with ids.
     // Optionally conditions can be applied.
     findByIds<Entity>(entityClass: EntityTarget<Entity>, ids: any[], conditions?: FindConditions<Entity>): Promise<Entity[]>;
}

```

And:

```typescript
export declare class EntityManager {
    // ...
    // Finds first entity that matches given find options.
    findOne<Entity>(entityClass: EntityTarget<Entity>, id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;

    // Finds first entity that matches given find options.
    findOne<Entity>(entityClass: EntityTarget<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;

    // Finds first entity that matches given conditions.
    findOne<Entity>(entityClass: EntityTarget<Entity>, conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
}

```

## Persisting objects

In order to persist objects in the database, the `Store` interface has the `save` method, which has various signatures available:

```typescript
export declare class EntityManager {

    // ...
    
    // Saves all given entities in the database.
    // If entities do not exist in the database then inserts, otherwise updates.
    save<Entity>(entities: Entity[], options?: SaveOptions): Promise<Entity[]>;

    // Saves all given entities in the database.
    // If entities do not exist in the database then inserts, otherwise updates.
    save<Entity>(entity: Entity, options?: SaveOptions): Promise<Entity>;

    // Saves all given entities in the database.
    // If entities do not exist in the database then inserts, otherwise updates.
    save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: EntityTarget<Entity>, entities: T[], options: SaveOptions & {
        reload: false;
    }): Promise<T[]>;

    // Saves all given entities in the database.
    // If entities do not exist in the database then inserts, otherwise updates.
    save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: EntityTarget<Entity>, entities: T[], options?: SaveOptions): Promise<(T & Entity)[]>;

    // Saves a given entity in the database.
    // If entity does not exist in the database then inserts, otherwise updates.
    save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: EntityTarget<Entity>, entity: T, options: SaveOptions & {
        reload: false;
    }): Promise<T>;

    // Saves a given entity in the database.
    // If entity does not exist in the database then inserts, otherwise updates.
    save<Entity, T extends DeepPartial<Entity>>(targetOrEntity: EntityTarget<Entity>, entity: T, options?: SaveOptions): Promise<T & Entity>;    
}
```

A typical usage is, in the body of an Event or Extrinsic Handler function, to save an Entity in the database:

```typescript
processor.addEventHandler('balances.Transfer', async ctx => {
    let transfer = getTransferEvent(ctx)
    let tip = ctx.extrinsic?.tip || 0n
    let from = ss58.codec('kusama').encode(transfer.from)
    let to = ss58.codec('kusama').encode(transfer.to)

    let fromAcc = await getOrCreate(ctx.store, Account, from)
    fromAcc.balance = fromAcc.balance || 0n
    fromAcc.balance -= transfer.amount
    fromAcc.balance -= tip
    await ctx.store.save(fromAcc)

    const toAcc = await getOrCreate(ctx.store, Account, to)
    toAcc.balance = toAcc.balance || 0n
    toAcc.balance += transfer.amount
    await ctx.store.save(toAcc)

    await ctx.store.save(new HistoricalBalance({
        id: ctx.event.id + '-to',
        account: fromAcc,
        balance: fromAcc.balance,
        date: new Date(ctx.block.timestamp)
    }))

    await ctx.store.save(new HistoricalBalance({
        id: ctx.event.id + '-from',
        account: toAcc,
        balance: toAcc.balance,
        date: new Date(ctx.block.timestamp)
    }))
})
```

## Ad-hoc queries

When the offered methods aren't enough, it is still possible to run ad-hoc queries through the `Store` interface, thanks to the `query` method:

```typescript
export declare class EntityManager {
    // ...

    // Executes raw SQL query and returns raw database results.
    query(query: string, parameters?: any[]): Promise<any>;
}

```

Here are a couple of examples:

```typescript
processor.addEventHandler("balances.Transfer", async (ctx) => {

  let schema = `"${processor}_status"`
  await ctx.store.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`)
  await ctx.store.query(`
    CREATE TABLE IF NOT EXISTS ${schema}."status" (
      id int primary key,
      height int not null
    )
  `)
  await ctx.store.query(`INSERT INTO ${schema}.status (id, height) VALUES (0, -1)`)
  let height = await ctx.store.query('SELECT height FROM status WHERE id = 0');
});
```

### Bulk updates

Examples of usage of ad-hoc queries include the possibility to perform bulk-updates:

```typescript
await ctx.store.query(`UPDATE ${schema}.status SET height = $1 WHERE height < $1`, [blockNumber]
```
