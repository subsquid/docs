---
sidebar_position: 40
title: Saving to BigQuery
description: >-
  Support for Google's data warehouse
---

# BigQuery support

Squids can store their data to BigQuery datasets using the `@subsquid/bigquery-store` package. Define and use the `Database` object as follows:

```ts title="src/main.ts"
import {
  Column,
  Table,
  Types,
  Database
} from '@subsquid/bigquery-store'
import {BigQuery} from '@google-cloud/bigquery'

const db = new Database({
  bq: new BigQuery(),
  dataset: 'subsquid-datasets.test_dataset',
  tables: {
    TransfersTable: new Table(
      'transfers',
      {
        from: Column(Types.String()),
        to: Column(Types.String()),
        value: Column(Types.BigNumeric(38))
      }
    )
  }
})

processor.run(db, async ctx => {
  // ...
  let from: string = ...
  let to: string = ...
  let value: bigint | number = ...
  ctx.store.TransfersTable.insert({from, to, value})
})
```
Here,
 * `bq` is a `BigQuery` instance. When created without arguments like this it'll look at the `GOOGLE_APPLICATION_CREDENTIALS` environment variable for a path to a JSON with authentication details.
 * `dataset` is the path to the target dataset.
:::warning
The dataset must be created prior to running the processor.
:::
 * `tables` lists the tables that will be created and populated within the dataset. For every field of the `tables` object an eponymous field of the `ctx.store` object will be created; calling `insert()` or `insertMany()` on such a field will result in data being queued for writing to the corresponding dataset table. The actual writing will be done at the end of the batch in a single transaction, ensuring dataset integrity.

Tables are made out of statically typed columns. Available types are listed on the [reference page](/sdk/reference/store/bigquery).

## Deploying to Subsquid Cloud

We discourage uploading any sensitive data with squid code when [deploying](/cloud) to Subsquid Cloud. To pass your [credentials JSON](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) to your squid, create a [Cloud secret](/cloud/resources/env-variables/#secrets) variable populated with its contents:
```bash
sqd secrets set GAC_JSON_FILE < creds.json
```
Then in `src/main.ts` write the contents to a file:
```ts title=src/main.ts
import fs from 'fs'

fs.writeFileSync('creds.json', process.env.GAC_JSON_FILE || '')
```
Set the `GOOGLE_APPLICATION_CREDENTIALS` variable and request the secret in the [deployment manifest](/cloud/reference/manifest):
```yaml title="squid.yaml"
deploy:
  processor:
    env:
      GAC_JSON_FILE: ${{ secrets.GAC_JSON_FILE }}
      GOOGLE_APPLICATION_CREDENTIALS: creds.json
```

## Examples

An end-to-end example geared towards local runs can be found in [this repo](https://github.com/subsquid-labs/squid-bigquery-example). Look at [this branch](https://github.com/subsquid-labs/squid-bigquery-example/tree/cloud-secrets) for an example of a squid made for deployment to Subsquid Cloud.
