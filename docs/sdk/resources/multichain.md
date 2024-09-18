---
sidebar_position: 60
title: Multichain
description: Combine data from multiple chains
---

# Multichain indexing

Squids can extract data from multiple chains into a shared data sink. If the data is [stored to Postgres](/sdk/resources/persisting-data/typeorm) it can then be served as a unified multichain [GraphQL API](/sdk/resources/serving-graphql).

To do this, run one [processor](/sdk/overview) per source network:

1. Make a separate entry point (`main.ts` or equivalent) for each processor. The resulting folder structure may look like this:
  ```
  ├── src
  │   ├── bsc
  │   │   ├── main.ts
  │   │   └── processor.ts
  │   ├── eth
  │   │   ├── main.ts
  │   │   └── processor.ts
  ``` 

  Alternatively, parameterize your processor using environment variables: you can [set these on a per-processor basis](/cloud/reference/manifest/#processor) if you use a deployment manifest to run your squid.

2. Arrange for running the processors alongside each other conveniently:
   - Add `sqd` commands for running each processor to [`commands.json`](/squid-cli/commands-json), e.g.
     ```json title="commands.json"
     ...
       "process:eth": {
         "deps": ["build", "migration:apply"],
         "cmd": ["node", "lib/eth/main.js"]
       },
       "process:bsc": {
         "deps": ["build", "migration:apply"],
         "cmd": ["node", "lib/bsc/main.js"]
       },
     ...
     ```
     [Full example](https://github.com/subsquid-labs/multichain-transfers-example/blob/master/commands.json)
   - If you are going to use [`sqd run`](/squid-cli/run) for local runs or deploy your squid to [SQD Cloud](/cloud), list your processors at the `deploy.processor` section of your [deployment manifest](/cloud/reference/manifest/#processor):
     ```yaml
     deploy:
       processor:
         - name: eth-processor
           cmd: [ "sqd", "process:prod:eth" ]
         - name: bsc-processor
           cmd: [ "sqd", "process:prod:bsc" ]
     ```
     Make sure to give each processor a unique name!

## On Postgres

Also ensure that

1. State schema name for each processor is unique
  ```ts title="src/bsc/main.ts"
  processor.run(
    new TypeormDatabase({
      stateSchema: 'bsc_processor'
    }),
    async ctx => { // ...
  ```
  ```ts title="src/eth/main.ts"
  processor.run(
    new TypeormDatabase({
      stateSchema: 'eth_processor'
    }),
    async (ctx) => { // ...
  ```

2. [Schema](/sdk/reference/schema-file) and [GraphQL API](/sdk/resources/serving-graphql) are shared among the processors.

### Handling concurrency

- Cross-chain data dependencies are to be avoided. With the [default isolation level](/sdk/reference/store/typeorm/#typeormdatabase-constructor-arguments) used by `TypeormDatabase`, `SERIALIZABLE`, one of the processors will crash with an error whenever two cross-dependent transactions are submitted to the database simultaneously. It will write the correct data when restarted, but such restarts can impact performance, especially in squids that use many (>5) processors.

- The alternative isolation level is `READ COMMITTED`. At this level data dependencies will not cause the processors to crash, but the execution is not guaranteed to be deterministic unless the sets of records that different processors read/write do not overlap.

- To avoid cross-chain data dependencies, use per-chain records for volatile data. E.g. if you track account balances across multiple chains you can avoid overlaps by storing the balance for each chain in a different table row.

  When you need to combine the records (e.g. get a total of all balaces across chains) use a [custom resolver](/sdk/reference/openreader-server/configuration/custom-resolvers) to do it on the GraphQL server side.

- It is OK to use cross-chain [entities](/sdk/reference/schema-file/entities) to simplify aggregation. Just don't store any data in them:
  ```graphql
  type Account @entity {
    id: ID! # evm address
    balances: [Balance!]! @derivedFrom("field": "account")
  }

  type Balance @entity {
    id: ID! # chainId + evm address
    account: Account!
    value: BigInt!
  }
  ```

## On [file-store](/sdk/resources/persisting-data/file)

Ensure that you use a unique target folder for each processor.

## Example

A complete example is available [here](https://github.com/subsquid-labs/squid-multichain-template).
