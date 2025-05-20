---
sidebar_position: 10
title: Best practices
description: Checklist for going to production
---

# Best practices

Here is a list of items to check out before you deploy your squid for use in production:

* Make sure that you use [batch processing](/sdk/resources/batch-processing) throughout your code. Consider using [`@belopash/typeorm-store`](/external-tools/#belopashtypeorm-store) for large projects with extensive [entity relations](/sdk/reference/schema-file/entity-relations) and frequent [database reads](/sdk/reference/store/typeorm/#typeorm-methods).

* Filter your data in the batch handler. E.g. if you [request event logs](/sdk/reference/processors/evm-batch/logs) from a particular contract, do check that the `address` field of the returned data items matches the contract address before processing the data. This will make sure that any future changes in your processor configuration will not cause the newly added data to be routed to your old processing code by mistake.

:::info
Batch handler data filtering used to be compulsory before the release of `@subsquid/evm-processor@1.13.0`. Now it is optional but highly recommended.
:::

* If your squid [saves its data to a database](/sdk/resources/persisting-data/typeorm), make sure your [schema](/sdk/reference/schema-file) has [`@index` decorators](/sdk/reference/schema-file/indexes-and-constraints) for all entities that will be looked up frequently.
  - Follow the [queries optimization procedure](/cloud/resources/query-optimization) for best results.

* If your squid serves a [GraphQL API](/sdk/resources/serving-graphql)
  1. Do not use [OpenReader](/sdk/resources/serving-graphql/#openreader) if your application uses subscriptions. Instead, use [PostGraphile](/sdk/resources/serving-graphql/#postgraphile) or [Hasura](/sdk/resources/serving-graphql/#hasura).
  2. If you do use OpenReader:
     - configure the built-in [DoS protection](/sdk/reference/openreader-server/configuration/dos-protection) against heavy queries;
     - configure [caching](/sdk/reference/openreader-server/configuration/caching).
  3. If you use PostGraphile or Hasura, follow their docs to harden your service in a similar way.

* If you deploy your squid to SQD Cloud:
  1. Deploy your squid to a [Professional organization](/cloud/resources/organizations/#professional-organizations).
  2. Do not use [`dedicated: false`](/cloud/reference/scale/#dedicated) in the `scale:` section of the manifest.
  3. Make sure that your [`scale:` section](/cloud/reference/scale) requests a sufficient but not excessive amount of resources.
  4. Set your deployment up for [zero downtime updates](/cloud/resources/slots-and-tags/#zero-downtime-updates). Use a tag-based URL and and not slot-based URLs to access your API e.g. from your frontend app.
  5. Make sure to use [secrets](/cloud/resources/env-variables/#secrets) for all sensitive data you might've used in your code. The most common type of such data is API keys and URLs containing them.
  6. Follow the recommendations from the [Cloud logging page](/cloud/resources/logging).
