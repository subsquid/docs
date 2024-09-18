---
sidebar_position: 70
title: RPC addon
description: Built-in RPC endpoints
---

# RPC addon

[List of available networks](/cloud/reference/rpc-proxy-networks) and their aliases is available on the reference page.

SQD Cloud provides a built-in RPC service. The service is available as an addon to all squids deployed to the Cloud, although [playground](/cloud/resources/organizations/#playgrounds) squids only have access to a limited number of calls.

[Professional organizations](/cloud/resources/organizations/#professional-organizations) do not have that limitation and [can access](#external-access) their RPC endpoints from outside of the Cloud.

Enable the RPC add-on in the [manifest](/cloud/reference/manifest) like this:
```yaml
deploy:
  addons:
    rpc:
      - eth-goerli.http
```

## Processor configuration

With the add-on successfully enabled, your squid will get a unique proxied endpoint to the requested network. SQD Cloud will make its URL available to the deployed squid at the `RPC_${Upper(network)}_${Upper(protocol)}` environment variable. Assert it to avoid compilation errors. We also recommend rate limiting RPC addon requests on the processor side to the same rate as was used in the manifest:
```ts
import {assertNotNull} from '@subsquid/util-internal'

processor.setRpcEndpoint({
  // dash in "eth-goerli" becomes an underscore
  url: assertNotNull(process.env.RPC_ETH_GOERLI_HTTP),
  rateLimit: 10
})
```

## External access

[Professional organizations](/cloud/resources/organizations/#professional-organizations) can [access their RPC proxies from outside](https://app.subsquid.io/rpc) of the SQD Cloud.

Among other things, this enables a development process that uses the service for both local and Cloud runs transparently. Here an example configuration for Ethereum Mainnet:

<details>

<summary>Here is an example configuration for Ethereum Mainnet</summary>

1. Add the following variable to `.env`:
   ```bash
   # get the url from https://app.subsquid.io/rpc/chains/eth
   RPC_ETH_HTTP=<your_rpc_url_for_external_use>
   ```

2. Enable the RPC addon in squid.yaml:
   ```yaml
   deploy:
     addons:
       rpc:
         - eth.http
   ```
   This will add and populate the `RPC_ETH_HTTP` variable for Cloud deployments.


3. Configure the processor to use the URL from from `RPC_ETH_HTTP`:
   ```ts
   import {EvmBatchProcessor} from '@subsquid/evm-processor'
   import {assertNotNull} from '@subsquid/util-internal'

   export const processor = new EvmBatchProcessor()
     .setRpcEndpoint(assertNotNull(process.env.RPC_ETH_HTTP))
     // ...the rest of the processor configuration
   ```

</details>

## Pricing

RPC addon requests are priced [at a flat rate](/cloud/pricing/#rpc-requests), with substantial packages included for free for all [organization types](/cloud/resources/organizations). Pricing does not depend on the call method.
