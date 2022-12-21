---
sidebar_position: 70
description: >-
  An idiomatic usage of the batch processor and the context
title: Processor in action
---

# `EvmBatchProcessor` in action

An end-to-end idiomatic usage of `EvmBatchProcessor` can be inspected in the [squid-gravatar-template](https://github.com/subsquid/gravatar-squid) and also learned from more elaborate [examples](/develop-a-squid/examples).

Here we highlight the key steps and put together the configuration and the data handling definition to illustrate the concepts covered so far.

## 1. Model the target schema

Create or edit `schema.graphql` to define the target entities and relations. Consult [the schema reference](/develop-a-squid/schema-file).

Start a fresh database:
```bash
make down
make up
```

## 2. Generate entities and facade classes with the ABI

Use [`evm-typegen`](/develop-a-squid/typegen/squid-evm-typegen) to generate the facade classes:
```bash
npx squid-evm-typegen src/abi 0x2E645469f354BB4F5c8a05B3b30A929361cf77eC#Gravity --clean
```

Use [`codegen`](/develop-a-squid/schema-file) to generate the entity classes from `schema.graphql`:
```bash
npx squid-typeorm-codegen
```
Generate the database migrations
```bash
# remove the old migrations
rm -rf db/migrations/*.js
# build the sources
npm run build
# generated the new schema migrations in db/migrations
npx squid-typeorm-migration generate
```

## 3. Configuration

See [Configuration section](/develop-a-squid/evm-processor/configuration) for more details.

```ts
const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://eth.archive.subsquid.io',
  })
  .setBlockRange({ from: 6175243 })
  // fetch logs emitted by '0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'
  // matching either `NewGravatar` or `UpdatedGravatar`
  .addLog('0x2E645469f354BB4F5c8a05B3b30A929361cf77eC', {
    filter: [[
      events.NewGravatar.topic,
      events.UpdatedGravatar.topic,
   ]],
    data: {
        evmLog: {
            topics: true,
            data: true,
        },
    } as const,
});
```

## 4. Iterate over the batch items and group events

The following code snippet illustrates a typical data transformation in a batch. The strategy is to

- Iterate over `ctx.blocks` and `block.items`
- Decode each item using a suitable facade class
- Enrich and transform the data 
- Upsert arrays of entities in batches using `ctx.save()`

The `processor.run()` method the looks as follows:

```ts
processor.run(new TypeormDatabase(), async (ctx) => {
    // it is a typical case of storing the new/updated
    // entities in an in-memory identity map.
    const gravatars: Map<string, Gravatar> = new Map();
    // iterate over the data batch stored in ctx.blocks
    for (const c of ctx.blocks) {
        for (const e of c.items) {
        // we know that only `evmLog` items are
        // present in the batch, so we put this boilerplate
        // for type-safety only
        if(e.kind !== "evmLog") {
            continue
        }
        // decode the item data, see below
        const { id, owner, displayName, imageUrl } = extractData(e.evmLog)
        // transform and normalize to match the target entity (Gravatar)
        gravatars.set(id.toHexString(), new Gravatar({
            id: id.toHexString(),
            owner: decodeHex(owner),
            displayName,
            imageUrl
        })) 
        }
    }
    // upsert the entities that were updated 
    // Note that store.save() automatically updates 
    // the existing entities and creates new ones.
    // It splits the data into suitable chunks to
    // guarantee an adequate performance
    await ctx.store.save([...gravatars.values()])
});
```

In the snippet above, we decode both `NewGravatar` and `UpdatedGravatar` with a single helper function that uses the 
generated `events` facade class:
```ts
function extractData(evmLog: any): { id: ethers.BigNumber, owner: string, displayName: string, imageUrl: string} {
  if (evmLog.topics[0] === events.NewGravatar.topic) {
    return events.NewGravatar.decode(evmLog)
  }
  if (evmLog.topics[0] === events.UpdatedGravatar.topic) {
    return events.UpdatedGravatar.decode(evmLog)
  }
  throw new Error('Unsupported topic')
}
```

## 5. Run the processor and store the transformed data into the target database

Build the processor with `npm run build` and run with
```bash
make process
```

In a separate terminal window, run
```bash
make serve
```
Inspect the GraphQL API at `http://localhost:4350`.