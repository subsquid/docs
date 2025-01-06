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

## Deploying to SQD Cloud

We discourage uploading any sensitive data with squid code when [deploying](/cloud) to SQD Cloud. To pass your [credentials JSON](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) to your squid, create a [Cloud secret](/cloud/resources/env-variables/#secrets) variable populated with its contents:
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

An end-to-end example geared towards local runs can be found in [this repo](https://github.com/subsquid-labs/squid-bigquery-example). Look at [this branch](https://github.com/subsquid-labs/squid-bigquery-example/tree/cloud-secrets) for an example of a squid made for deployment to SQD Cloud.

## Troubleshooting

### Transaction is aborted due to concurrent update

This means that your project has an open [session](https://cloud.google.com/bigquery/docs/sessions-intro) that is updating some of the tables used by the squid.

Most commonly, the session is left by a squid itself after an unclean termination. You have two options:

1. If you are not sure if your squid is the only app that uses sessions to access your BigQuery project, find the faulty session manually and terminate it. See [Get a list of your active sessions](https://cloud.google.com/bigquery/docs/sessions-get-ids#list_active) and [Terminate a session by ID](https://cloud.google.com/bigquery/docs/sessions-terminating#terminate_a_session_by_id).

2. **DANGEROUS** If you are absolutely certain that the squid is the only app that uses sessions to access your BigQuery project, you can terminate all the dangling sessions by running

   ```sql
   FOR session in (
     SELECT
       session_id,
       MAX(creation_time) AS last_modified_time,
     FROM `region-us`.INFORMATION_SCHEMA.SESSIONS_BY_PROJECT
     WHERE
       session_id IS NOT NULL
       AND is_active
     GROUP BY session_id
     ORDER BY last_modified_time DESC
   )
   DO
     CALL BQ.ABORT_SESSION(session.session_id);
   END FOR;
   ```
   Replace `region-us` with your dataset's region in the code above.

   You can also enable `abortAllProjectSessionsOnStartup` and supply `datasetRegion` in your database config to perform this operation at startup:
   ```ts
   const db = new Database({
     // ...
     abortAllProjectSessionsOnStartup: true,
     datasetRegion: 'region-us'
   })
   ```

   This method **will** cause data loss if, at the moment when the squid starts, some other app happens to be writing data anywhere in the project using the sessions mechanism.

### Error 413 (Request Entity Too Large)

Squid produced too much data per batch per table and BigQuery refused to handle it. Begin by finding out which table causes the issue (e.g. by counting `insert()` calls), then enable pagination for that table:

```ts
const db = new Database({
  bq: new BigQuery(), // set GOOGLE_APPLICATION_CREDENTIALS at .env
  dataset: `${projectId}.${datasetId}`,
  tables: {
    TransfersTable: new Table(
      'transfers',
      {
        from: Column(Types.String()),
        to: Column(Types.String()),
        value: Column(Types.BigNumeric(38))
      },
      5000 // <- page size for the insert operation
    )
  },
  ...
```
