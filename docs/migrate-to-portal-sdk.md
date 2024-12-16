---
sidebar_position: 1
title: Source data from a portal
description: Get data from the permissionless SQD Network  
sidebar_class_name: hidden
pagination_next: null
pagination_prev: null
---

# Source data from a portal

:::info
SQD Network portals are currently in closed beta. Please report any bugs or suggestions to the SQD Portal chat or to [Squid Devs](https://t.me/HydraDevs).
:::

This guide lets you replace a gateway of the [open private version of SQD Network](/subsquid-network/overview/#open-private-network) with a *portal* of the [permissionless SQD Network](/subsquid-network/overview/#permissionless-public-network) as your primary source of data.

Benefits include:

 - **Reduced reliance on centralized services:**
   * The permissionless SQD Network consists of [over 1200](https://arbiscan.io/address/0x36e2b147db67e76ab67a4d07c293670ebefcae4e#readContract#F6) nodes [ran by independent operators](/subsquid-network/participate/worker), with a total capacity of roughly 1.1Pb. This allows for a great deal of redundancy.
   * You can [query the network without relying on any centralized services](/subsquid-network/participate/portal). You can also use the public portal ran by the SQD team to just try it out.
 - **Improved speed:** The permissionless version of SQD Network has a lot more bandwidth than the open private network; moreover, portals use the available bandwidth more effectively than gateways. Data fetching was 5-10 times faster in some of our tests. For squids that are not bottlenecked by write operations this will translate into better sync performance.
 - **Simplified API:** compared to the [request-response approach](/subsquid-network/reference/evm-api) used by gateways, portals offer a simpler stream-based API.
 - **Being future-proof:** All future development will be focused on portals and the permissionless SQD Network. Open private network will be sunset around May 2025.

Here are the steps to migrate:

## Step 1

Navigate to your squid's folder and install the `portal-api` version of `@subsquid/evm-processor`:
```bash
npm i @subsquid/evm-processor@portal-api
```

## Step 2

Obtain an URL of an SQD portal for your dataset.

 - If you are an existing user of [the SQD Cloud](https://app.subsquid.io):
    * [enable the preview mode](https://app.subsquid.io/preview)
    * navigate to [the portals page](https://app.subsquid.io/portal)
    * click on the tile of your network and follow the instructions

   Once you're done you should be able to run your (now portal-powered) squid both locally and in the Cloud. You can skip [step 3](#step-3) - it should be already done.

 - If you want to use a private portal:
    * [set it up](/subsquid-network/participate/portal)
    * get your portal's [dataset-specific API URL](/subsquid-network/participate/portal/#using-your-portal) for the network you're interested in

 - If you don't have an SQD Cloud account and just want to see a portal in action, you can use the following URL template:
   ```
   https://portal.sqd.dev/datasets/<dataset-slug>
   ```
   where `<dataset-slug>` is the last path segment of the gateway URL for your network found on [this page](/subsquid-network/reference/networks). For example, the URL for the Ethereum dataset is
   ```
   https://portal.sqd.dev/datasets/ethereum-mainnet
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

If your squid used an RPC endpoint, keep the call for now: portals do not have the ability to ingest data in real time. **Yet.**

Your squid is now ready to source its data from an SQD Network portal. Give it a try!
