---
sidebar_position: 70
description: >-
  EVMBatchProcessor in action
title: Processor in action
---

# `EvmBatchProcessor` in action

An end-to-end idiomatic usage of `EvmBatchProcessor` can be inspected in the [gravatar-template repository](https://github.com/subsquid/gravatar-squid) and also learned from more elaborate [examples](/examples).

In order to illustrate the concepts covered thus far, here we highlight the key steps, put together a processor configuration and a data handling definition.

## 1. Model the target schema and generate entity classes

Create or edit `schema.graphql` to define the target entities and relations. Consult [the schema reference](/basics/schema-file).

Update the entity classes, start a fresh database and regenerate migrations:
```bash
sqd codegen
sqd down
sqd up
sqd migration:generate
```

## 2. Generate Typescript ABI modules

Use [`evm-typegen`](/evm-indexing/squid-evm-typegen) to generate the facade classes, for example like this:
```bash
npx squid-evm-typegen src/abi 0x2E645469f354BB4F5c8a05B3b30A929361cf77eC#Gravity --clean
```

## 3. Configuration

See [Configuration section](/evm-indexing/configuration) for more details.

```ts
const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
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
  // storing the new/updated entities in
  // an in-memory identity map
  const gravatars: Map<string, Gravatar> = new Map();
  // iterate over the data batch stored in ctx.blocks
  for (const c of ctx.blocks) {
    for (const e of c.items) {
      // the batch will contain a mixture of 'evmLog'
      // items and parent 'transaction' items
      if(e.kind !== 'evmLog') {
        continue
      }
      // decode the item data
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
  // Upsert the entities that were updated.
  // Note that store.save() automatically updates 
  // the existing entities and creates new ones.
  // It splits the data into suitable chunks to
  // guarantee an adequate performance.
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

Run the processor with
```bash
sqd process
```
The script will build the code automatically before running.

In a separate terminal window, run
```bash
sqd serve
```
Inspect the GraphQL API at [`http://localhost:4350/graphql`](http://localhost:4350/graphql).
