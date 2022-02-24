---
description: >-
  Version 5 of Squid introduced many changes, and a good part of them are not
  retro-compatible, so some actions are required to update and make sure the
  project still runs as it's supposed to.
---

# Migrate to v5

## Package update

The first thing to do is remove old packages named `hydra`, since package names have changed and those are not used anymore, and install new ones.

Here is a list of commands to this:

```bash
npm uninstall @subsquid/hydra-common
npm uninstall @subsquid/hydra-processor
npm uninstall @subsquid/openreader
npm uninstall @subsquid/hydra-cli
npm uninstall @subsquid/hydra-typegen
npm uninstall typeorm

npm install dotenv
npm install @subsquid/ss58@next
npm install @subsquid/graphql-server@next
npm install @subsquid/substrate-processor@next
npm install @subsquid/cli@next --save-dev
npm install @subsquid/substrate-metadata-explorer@next --save-dev
npm install @subsquid/substrate-typegen@next --save-dev
```

Note: these can be wrapped in a shell file and executed.

## Scripts update

Because of package name changes, some scripts in `package.json` have changed as well. These can simply be replaced with new ones [found here](https://github.com/subsquid/squid-template/blob/main/package.json#L4).

Be aware that custom scripts might need changing as well.

## File structure updates

The overall file structure of the project has changed, although thankfully, this did not have any impacts on GraphQL schema and codegen parts.

The best thing to do in this case is to delete the `src/generated` folder and recreate the models with codegen. Then create and apply a database migration.

Here is a list of commands to accomplish this:

```
rm -rf src/generated/
npx sqd codegen
npm run build
npx sqd db create-migration
npx sqd db migrate
```

Also, `Dockerfile` , `docker-compose.yml`, `.env`, files should be replaced with the ones from [this repository](https://github.com/subsquid/squid-template).

## Types update (optional but recommended)

Just as with the previous version, it is possible to circumvent the `typegen` feature and parse all received JSON documents manually.

However, the newest version brings massive upgrades to types. Now it can automatically create different types for the same event, depending on the spec version, preventing future crashes and bugs.

For this reason, it is recommended to replace the old types with new ones.

The process to generate types is explained in the [dedicated tutorial](running-a-squid/generate-typescript-definitions.md) and details about type bundles can be found in the [Cheatsheet](../faq/where-do-i-get-a-type-bundle-for-my-chain.md).

## Mappings

One more thing to do is to update package paths and names in the codebase.

Furthermore, `manifest.yml` is no longer used. The typegen section contained in it has been transferred to the `typegen.json` file as mentioned in the previous section.\
The other part, referring to mappings, now uses the logic of the processor class.

Instead of specifying the necessary parameters in `manifest.yml`, you should define a processor object and set them there (for more information head to the [conceptual guide on the subject](../key-concepts/processor.md)). Here is [an example](https://github.com/subsquid/squid-template/blob/main/src/processor.ts), let's go through it:

#### Initialization

The parameter passed is a custom name

```typescript
const processor = new SubstrateProcessor('kusama_balances')
```

#### Setting the number of blocks per request to be processed

```typescript
processor.setBatchSize(500)
```

#### Setting Squid Archive and chain addresses:

```typescript
processor.setDataSource({
    archive: 'https://kusama.indexer.gc.subsquid.io/v4/graphql', 
    chain: 'wss://kusama-rpc.polkadot.io'
})
```

Moreover, you can set demanded range of blocks with:

```typescript
processor.setBlockRange({from: , to: })
```

#### Add events and extrinsic handlers or pre/postBlock hooks, using:

```typescript
processor.addEventHandler(eventName, fn)
processor.addExtrinsicHandler(extrinsicName, fn)
```

The function `fn` can be one of the existing handlers. For example:

```typescript
processor.addEventHandler('balances.Transfer', ctx => balancesTransfer(ctx));
```

Where `balancesTransfer(ctx)` is the previously existing handler, as defined:

```typescript
export async function balancesTransfer({ 
    store, 
    event, 
    block, 
    extrinsic, 
}: EventContext & StoreContext): Promise<void> {
    // your code here
}
```

However, it’s recommended to modify the event arguments handling inside the function according to new type processing. From the example linked above, it should go from this:

```typescript
const [from, to, value] = new Balances.TransferEvent(event).params;
```

To this:

```typescript
function getTransferEvent(ctx: EventHandlerContext): TransferEvent { 
    let event = new BalancesTransferEvent(ctx)
    if (event.isV1020) { 
        let [from, to, amount] = event.asV1020
        return {from, to, amount}
    } else if (event.isV1050) { 
        let [from, to, amount] = event.asV1050 
        return {from, to, amount} 
    } else { 
        return event.asLatest 
    } 
}

// other code here

const {from, to, amount} = getTransferEvent(ctx);
```

Where `BalancesTransferEvent` and `TransferEvent` are, respectively, a class and an interface generated by typegen.
