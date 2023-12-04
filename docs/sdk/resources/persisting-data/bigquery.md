---
sidebar_position: 25
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
 * `bq` is a `BigQuery` instance. When created without arguments like this it'll look at the `GOOGLE_APPLICATION_CREDENTIALS` environment variable for a path to a JSON with authentication details. When providing such a file is undesirable for any reason the credentials may be supplied to the constructor. An example is available at the [Deploying to Subsquid Cloud](#deploying-to-subsquid-cloud) section.
 * `dataset` is the path to the target dataset.
:::warning
The dataset must be created prior to running the processor.
:::
 * `tables` lists the tables that will be created and populated within the dataset. For every field of the `tables` object an eponymous field of the `ctx.store` object will be created; calling `insert()` or `insertMany()` on such a field will result in data being queued for writing to the corresponding dataset table. The actual writing will be done at the end of the batch in a single transaction, ensuring dataset integrity.

Tables are made out of statically typed columns. Available types are listed on the [reference page](/sdk/reference/store/bigquery).

## Deploying to Subsquid Cloud

We discourage uploading any sensitive data with squid code when [deploying](/cloud) to Subsquid Cloud. For BigQuery squids that means that accessing a [credentials JSON](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) is typically not possible. The solution is to use [Cloud secrets](/cloud/resources/env-variables/#secrets) to store credentials.

Assuming that the name of the project is `subsquid-datasets` as in the example above and not sensitive, you can initialize your `BigQuery` instance like this:
```ts title="src/main.ts"
...
import {assertNotNull} from `@subsquid/util-internal`

const client_id = assertNotNull(process.env.GOOGLE_CLIENT_ID)
const client_email = assertNotNull(process.env.GOOGLE_CLIENT_EMAIL)
const private_key = assertNotNull(
  process.env.GOOGLE_PRIVATE_KEY
).replace(/\\n/g, '\n')

const bq = new BigQuery({
  projectId: 'subsquid-datasets',
  credentials: {client_id, client_email, private_key}
})

const db = new Database({
  bq,
...
```
Request that the required secret variables are visible from your squid in [`squid.yaml`](/cloud/reference/manifest):
```yaml title="squid.yaml"
...
deploy:
  secrets:
    - GOOGLE_CLIENT_ID
    - GOOGLE_CLIENT_EMAIL
    - GOOGLE_PRIVATE_KEY
...
```
Finally, set the variables with the [sqd secrets](/squid-cli/secrets) command, taking the values from the credentials JSON:
```bash
sqd secrets:set GOOGLE_CLIENT_ID <your_client_id>
sqd secrets:set GOOGLE_CLIENT_EMAIL <your_client_email>
sqd secrets:set GOOGLE_PRIVATE_KEY <your_private_key>
```
:::warning
Escape the newline symbol with four backslashes when setting the private key:
```bash
sqd secrets:set GOOGLE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\\\\n...
```
:::


At this point your squid will be able to authenticate with Google Cloud once deployed.

## Examples

An end-to-end example geared towards local runs can be found in [this repo](https://github.com/subsquid-labs/squid-bigquery-example). Look at [this branch](https://github.com/subsquid-labs/squid-bigquery-example/tree/cloud-secrets) for an example of a squid made for deployment to Subsquid Cloud.
