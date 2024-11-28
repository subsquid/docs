---
sidebar_position: 1
title: Source data from a portal
description: Get data from the permissionless SQD Network  
sidebar_class_name: hidden
---

# Source data from a portal

This guide lets you replace the [open private version of SQD Network](/subsquid-network/overview/#open-private-network) with the [permissionless version](/subsquid-network/overview/#permissionless-public-network) as your primary source of data. Benefits include:

 - **Reduced reliance on centralized services:** you can now make queries to the network in a fully decentralized manner via [self-hosted portals](/subsquid-network/participate/portal).
 - **Improved speed:** data fetching was 5-10 times faster in some of our tests. For squids that are not bottlenecked by write operations this will translate into better sync performance.
 - **Simplified API:** the [request-response approach](/subsquid-network/reference/evm-api) of older APIs is now replaced by a simpler stream-based API.
 - **Being future-proof:** all future development will be focused on the permissionless SQD Network.

Here are the steps to migrate:

## Step 1

Get an URL of a portal URL for your dataset.

 - If you intend to run your squid in [the Cloud](/cloud):
   * [enable the preview mode](https://app.subsquid.io/preview)
   * navgate to [the portals page](https://app.subsquid.io/portal)
   * click on the tile for your network and follow the instructions
 - If you want to use the public portal locally - TBA
 - If you want to use a private portal:
   * [set it up](/subsquid-network/participate/portal)
   * get your portal's [dataset-specific API URL](/subsquid-network/participate/portal/#using-your-portal) for the network you're interested in

## Step 2

Install the `portal-api` version of `@subsquid/evm-processor`:
```bash
npm i @subsquid/evm-processor@portal-api
```

## Step 3

Configure your squid to ingest data from the portal by replacing the call to `.setGateway` in the processor configuration (conventionally at `src/processor.ts`) with a `.setPortal` call.
 - If you're using a private portal or a public portal on a local machine, the change will look like this
   ```diff
    export const processor = new EvmBatchProcessor()
   -  .setGateway('<gateway URL for your dataset>')
   +  .setPortal('<portal URL for your dataset>')
   ```
 - If you intend to run your squid in [the Cloud](/cloud), you should source the URL from the environment variable you configured in the manifest, e.g.
   ```diff
   +import { assertNotNull } from '@subsquid/util-internal';

    export const processor = new EvmBatchProcessor()
   -  .setGateway('<gateway URL for your dataset>')
   +  .setPortal(assertNotNull(
   +    process.env.PORTAL_URL, 
   +    'Required env variable PORTAL_URL is missing'
   +  ))
   ```

Your squid is now ready to source its data from an SQD Network portal. Give it a try!
