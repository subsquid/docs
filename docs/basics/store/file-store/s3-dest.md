---
sidebar_position: 40
title: S3 support
description: >-
  A Dest class for uploading data to buckets
---

# S3 destination support

## Overview

Writing to Amazon S3-compatible file storage services such as [AWS](https://aws.amazon.com) and [Filebase](https://filebase.com) is supported via the `S3Dest` class from the `@subsquid/file-store-s3` package. Use it by [setting the `dest` field of the `Database` constructor argument](../overview/#database-options) to its instance. Constructor of `S3Dest` accepts the following arguments:
1. **`dir: string`**: the name of the top level output folder within the bucket.
2. **`bucket: string`**: the bucket URL.
3. **`optionsOrClient?: S3Client | S3ClientConfig`**: an optional [S3 client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/s3client.html) or [client config](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html). By default, a simple config parameterized by environment variables is used:
   ```typescript
   {
     region: process.env.S3_REGION,
     endpoint: process.env.S3_ENDPOINT,
     credentials: {
       secretAccessKey: assertNotNull(process.env.S3_SECRET_ACCESS_KEY),
       accessKeyId: assertNotNull(process.env.S3_ACCESS_KEY_ID),
     },
   }
   ```

## Example

This saves the processor data at the `transfers-data` folder of the `subsquid-file-store-test-bucket` bucket. Hardcoded authentication credentials are used instead of the environment variables' values.

```typescript
import {Database} from '@subsquid/file-store'
import {S3Dest} from '@subsquid/file-store-s3'

...

const dbOptions = {
  ...
  dest: new S3Dest(
    'transfers-data',
    'subsquid-file-store-test-bucket',
    {
      region: 'eu-central-1',
      endpoint: 'https://s3.eu-central-1.amazonaws.com',
      credentials: {
        secretAccessKey: 'mySecretAccessKey',
        accessKeyId: 'myAccessKeyId'
      }
    }
  ),
  ...
}

processor.run(new Database(dbOptions), async (ctx) => {
  ...
}
```
