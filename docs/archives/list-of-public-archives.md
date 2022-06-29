# List of public Archives

Subsquid publishes the list of currently active and maintained Archives in the [Archive Registry](https://github.com/subsquid/archive-registry/) repository.

The list is also available via the published [`@subsquid/archive-registry`](https://www.npmjs.com/package/@subsquid/archive-registry) NPM package. This is already installed in the Subsquid template repository, but can be manually installed by running the following command in a console window.

```bash
npm i @subsquid/archive-registry
```

This library allows developers to leverage the registry while building their Squid API, without having to hard-code the Archive URL for the network they are building for. Here's an example, setting the data source for the processor of a Squid API using the `lookupArchive` function, imported from the package mentioned above:

```typecript
import { lookupArchive } from "@subsquid/archive-registry";
import { SubstrateBatchProcessor } from "@subsquid/substrate-processor";

const processor = new SubstrateProcessor();

processor.setDataSource({
    // Lookup archive by the network name in the Subsquid registry
    archive: lookupArchive("kusama"),
    chain: "wss://kusama-rpc.polkadot.io",
})
```
