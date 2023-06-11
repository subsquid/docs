---
sidebar_position: 50
title: S3 support
description: >-
  A Dest class for uploading data to buckets
---

# S3 destination support

## Overview

Writing to Amazon S3-compatible file storage services such as [AWS](https://aws.amazon.com) and [Filebase](https://filebase.com) is supported via the `S3Dest` class from the `@subsquid/file-store-s3` package. Use it by [setting the `dest` field of the `Database` constructor argument](../overview/#database-options) to its instance. Constructor of `S3Dest` accepts the following arguments:
* **`dir: string`**: name of the top level output folder within the bucket.
* **`bucket: string`**: bucket name.
* **`optionsOrClient?: S3Client | S3ClientConfig`**: an optional [S3 client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/s3client.html) or [client config](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html). By default, a simple config parameterized by environment variables is used:
   ```typescript
   {
     region: process.env.S3_REGION,
     endpoint: process.env.S3_ENDPOINT,
     credentials: {
       accessKeyId: assertNotNull(process.env.S3_ACCESS_KEY_ID),
       secretAccessKey: assertNotNull(process.env.S3_SECRET_ACCESS_KEY),
     },
   }
   ```

## Example

This saves the processor data in the `transfers-data` folder of the bucket defined by the `S3_BUCKET_NAME` environment variable at the [Filebase](https://filebase.com) service. The service only has one region and one endpoint, and here they are hardcoded to reduce the number of required envirionment variables and illustrate how connection parameters can be supplied programmatically. Full squid code is available in [this repo](https://github.com/subsquid-labs/file-store-s3-example) (link out of date).

[//]: # (!!!! Update the github URL)

```typescript
import {Database} from '@subsquid/file-store'
import {S3Dest} from '@subsquid/file-store-s3'
import {assertNotNull} from '@subsquid/util-internal' // pulled by @subsquid/file-store-s3

...

const dbOptions = {
  ...
  dest: new S3Dest(
    'transfers-data',
    assertNotNull(process.env.S3_BUCKET_NAME),
    {
      region: 'us-east-1',
      endpoint: 'https://s3.filebase.com',
      credentials: {
        accessKeyId: assertNotNull(process.env.S3_ACCESS_KEY_ID),
        secretAccessKey: assertNotNull(process.env.S3_SECRET_ACCESS_KEY)
      }
    }
  ),
  ...
}

processor.run(new Database(dbOptions), async (ctx) => {
  ...
}
```
