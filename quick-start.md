---
description: Build a Hydra Indexer and GraphQL server from scratch under five minutes
---

# Quickstart

{% hint style="info" %}
Before starting, make sure`hydra-cli`is [installed](install-hydra.md) on your machine together with all the prerequisites. Use @subsquid/hydra-cli@next version to use the latest features.
{% endhint %}

## 0. Hello Hydra!

Start off by setting up a project folder

```bash
mkdir hello-hydra && cd hello-hydra
```

## 1. From zero to one

Run the scaffold command, which generates all the required files in a new folder `hydra-sample`

```bash
hydra-cli scaffold -d hydra-sample
```

Answer the prompts and the scaffolder will generate a sample backbone for our Hydra project. This includes:

* Sample GraphQL data [schema](docs/schema-spec/) in `schema.graphql` describing proposals in the Kusama network
* Sample [mapping](docs/mappings/) scripts in the `./mapping` folder translating substrate events into the `Proposal` entity CRUD operations
* `docker` folder with scripts for running a Hydra Indexer and Hydra Processor locally
* `.env` with all the necessary environment variables. It is pre-populated with the prompt answers but can be edited at any time.
* `package.json` with a few utility yarn scripts to be used later on.

## 2. Codegen

Make sure a Postgres database is up and running in the background and is accessible with the credentials provided during the scaffolding. Run

```bash
yarn && yarn bootstrap
```

It will generate the model files as defined in `schema.graphql`, create the database schema and run all the necessary migrations.

NB! Use with caution in production, as it will delete all the existing records in the processor database.

Under the fold, `yarn booststrap` creates  `generated/graphql-server` with a ready-to-use Apollo GraphQL server powering the query node API. 

## 3. Typegen for events and extrinsics

Now let's inspect `manifest.yml` which defines which events and extrinsics are going to be processed by Hydra Processor. Two most important sections are `typegen` and `mappings`

`hydra-typegen` is an auxiliary tool for generating typesafe event and extrinsic classes from the on-chain metadata. It is not strictly necessary to use it, but type safety significantly simplifies the development of the event and extrinsic handlers.

The typegen section of the manifest lists the events and extrinsics for which typescript classes will be generated together with the metadata source and the output directory. 

```yaml
typegen:
  typegen:
  metadata:
    source: wss://rpc.polkadot.io
    blockHash: '0xab5c9230a7dde8bb90a6728ba4a0165423294dac14336b1443f865b796ff682c'
  events:
    - balances.Transfer
  calls:
    - timestamp.set
  outDir: ./mappings/generated/types
```

Typegen fetches the metadata from the chain from the block with a given hash \(or from the top block if no hash is provided\). For chains with non-standard types one should additionally provide custom type definitions, as below:

```yaml
typegen:
  metadata:
    source: ws://arch.subsocial.network:9944
    # add hash of the block if the metadata from a specific block
    # should be used by typegen
    # blockHash: 0x....
  events:
    - posts.PostCreated
  calls:
    - posts.CreatePost
  customTypes: 
    lib: '@subsocial/types/substrate/interfaces'
    typedefsLoc: typedefs.json
  outDir: ./mappings/generated/types
```

Run 

```text
yarn typegen
```

and inspect `mappings/generated/types` where the newly created classes for the declared events and extrinsics will be generated. 

## 4. Mappings 

Mapping are defined in the `mappings` section of the manifest file and reside in the `mappings` folder. 

```yaml
mappings:
  # the transpiled js module with the mappings
  mappingsModule: mappings/lib/mappings
  imports:
    # generated types to be loaded by the processor
    - mappings/lib/mappings/generated/types
  eventHandlers:
      # event to handle
    - event: posts.PostCreated
      # handler function with argument types
      handler: postCreated
  extrinsicHandlers:
      # extrinsic to handle
    - extrinsic: timestamp.set 
      handler: timestampCall
```

Run

```text
yarn mappings:build
```

to build the mappings into a js module. Make sure the mappings are rebuilt after each change.

## 5. Run Hydra Indexer locally

Hydra's two-tier architecture separates data ingesting and indexing \(done by Hydra Indexer\) and processing \(done by Hydra Processor, of course\). Hydra Indexer + API gateway is a set-and-forget service which requires maintainance only when there is a major runtime upgrade.  The scaffolder conveniently creatres a stub for running the indexer stack with docker-compose, as defined in `docker-compose-indexer.yml`

The `WS_PROVIDER_ENDPOINT_URI`environment variable defines the node to connect. Additionally, one can map volumes as json files with runtime type definitions. The following environment variables 

* `TYPES_JSON`  
* `SPEC_TYPES`
* `CHAIN_TYPES`
* `BUNDLE_TYPES`

can be used to inject custom types and type overrides for spec, chain and bundle definitions. For more info, consult [polkadot.js docs](https://polkadot.js.org/docs/api/start/types.extend) 

Let's run a local indexer against a Polkadot chain. Since all Polkadot type definitions are already included in polkadot.js library, there is no need to add type definition and the only change is to set `WS_PROVIDER_ENDPOINT_URI=wss://rpc.polkadot.io` together with the database variables and run

```bash
docker-compose -f docker-compose-indexer.yml up -d 
```

Check the status of the indexer by navigating to the indexer playground at `localhost:4001/graphql` and querying

```graphql
query {
  indexerStatus {
    chainHeight # current chain height
    head # last indexed block
    inSync # if the processor is fully in sync
    hydraVersion # processor version
  }
}
```

Make sure the major `hydraVersion` matches the one of `hydra-cli` and declared in `manifest.yml`

## 6. Run Hydra Processor locally

Hydra Processor connects to a Hydra Indexer gateway for sourcing the indexed block, event and extrinsic data for processing. 

Set `INDEXER_ENDPOINT_URL` in `.env` to the local indexer `http://localhost:4001/graphql` and run

```text
yarn processor:run
```

## 7. Run Query Node API

Run

```text
yarn query-node:start:dev
```

The query node API is now available at `http://localhost:4000/graphql` and you can find some transfers:

```graphql
query {
  transfers(orderBy:block_ASC) {
    from
    to
    block
  }
}
```

## 7. Dockerize & deploy

Among other things, the scaffolder generates a `docker` folder with Dockerfiles.

First, build the builder image:

```bash
$ docker build . -f docker/Dockerfile.builder -t builder
```

Now the images for the GraphQL query node and the processor can be built \(they use the builder image under the hood\)

```bash
$ docker build . -f docker/Dockerfile.query-node -t query-node:latest
$ docker build . -f docker/Dockerfile.processor -t processor:latest
```

In order to run the docker-compose stack, we need to create the schema and run the database migrations.

```bash
$ docker-compose up -d db 
$ yarn docker:db:migrate
```

The last command runs `yarn db:bootstrap` in the `builder` image. A similar setup strategy may be used for Kubernetes \(with `builder`as a starter container\).

Now everything is ready:

```bash
$ docker-compose up
```

## What to do next?

* Explore more [examples](https://github.com/Joystream/hydra/tree/master/examples)
* Describe your own [schema](docs/schema-spec/) in `schema.graphql`
* Write your indexer [mappings](docs/mappings/)
* Push your Hydra indexer and GraphQL Docker images to [Docker Hub](https://hub.docker.com/) and deploy  

