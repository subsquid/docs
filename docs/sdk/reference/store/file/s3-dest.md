---
sidebar_position: 50
title: S3 support
description: >-
  A Dest class for uploading data to buckets
---

# S3 destination support

## Overview

Writing to Amazon S3-compatible file storage services such as [AWS](https://aws.amazon.com) and [Filebase](https://filebase.com) is supported via the `S3Dest` class from the `@subsquid/file-store-s3` package. Use it by [setting the `dest` field of the `Database` constructor argument](/sdk/resources/persisting-data/file/#database-options) to its instance. Constructor of `S3Dest` accepts the following arguments:
* **`url: string`**: S3 URL in the `s3://bucket/path` format.
* **`optionsOrClient?: S3Client | S3ClientConfig`**: an optional [S3 client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-s3/Class/S3Client/) or [client config](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html). By default, a simple config parameterized by environment variables is used:
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

This saves the processor data in the `transfers-data` folder of the `subsquid-testing-bucket` bucket at the [Filebase](https://filebase.com) service. The service only has one region and one endpoint, and here they are hardcoded to reduce the number of required envirionment variables and illustrate how connection parameters can be supplied programmatically. Full squid code is available in [this repo](https://github.com/subsquid-labs/file-store-s3-example).

```typescript
import {Database} from '@subsquid/file-store'
import {S3Dest} from '@subsquid/file-store-s3'
import {assertNotNull} from '@subsquid/util-internal' // pulled by @subsquid/file-store-s3

...

const dbOptions = {
  ...
  dest: new S3Dest(
    's3://subsquid-testing-bucket/transfers-data',
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
