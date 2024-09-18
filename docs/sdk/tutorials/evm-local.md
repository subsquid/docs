---
title: Use with Ganache or Hardhat
description: >-
  Use SQD to index an Ethereum dev node
sidebar_position: 30
---

# Run squids with Ganache or Hardhat

## Objective

Here we show how it is possible to index an Ethereum development node running locally. This is useful for those who want to start developing a squid ETL or API in a local environment without waiting for the contract to be deployed to a testnet.

## Pre-requisites

- Either one of [Ganache](https://trufflesuite.com/ganache/) or [Hardhat](https://hardhat.org/)
- [Squid CLI](/squid-cli/installation)
- Docker

## Setup

In this tutorial we will be using a layout in which the squid and the Hardhat/Ganache setup share the same folder. Create a new squid by running:

```bash
sqd init ethereum-local-indexing -t evm
```
Here, `ethereum-local-indexing` is the project name and `evm` refers to the [`evm` template](https://github.com/subsquid-labs/squid-evm-template).

Install the dependencies and update `evm-processor` and `typeorm-store` to their ArrowSquid versions:
```bash
cd ethereum-local-indexing
npm i
npm i @subsquid/evm-processor@next @subsquid/typeorm-store@next
```

Next, we set up a local EVM development environment. We consider two common options: [Hardhat](#hardhat) and [Ganache](#ganache).

## If you chose Hardhat {#hardhat}

[Install the package](https://hardhat.org/hardhat-runner/docs/getting-started#installation).

#### 1. Create project

In a terminal, navigate to the squid project root folder. Prepare it by running
```bash
rm README.md
mv tsconfig.json tsconfig.json.save
```
This will prevent collisions between SQD and Hardhat files.

Next, run

```bash
npx hardhat
```
to initialize the Hardhat project. When prompted, choose **TypeScript project** and keep all other options at defaults. Finally, overwrite `tsconfig.json` provided by Hardhat:
```bash
mv tsconfig.json.save tsconfig.json
```

#### 2. Configure Hardhat automining

Then, open the `hardhat.config.ts` and replace the `HardhatUserConfig` object with this one:

```typescript
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: false,
        interval: [4800, 5200]
      }
    },
  },
  solidity: "0.8.17",
};
```

The `mining` configuration will continuously mine blocks, even if no events or transactions are executed. This can be useful for debugging. You can read more about it on [hardhat official documentation](https://hardhat.org/hardhat-network/docs/reference#mining-modes).

#### 3. Sample contract

There should be a `contracts` subfolder in the project folder now, with a sample contract named `Lock.sol`. To compile this contract and verify its correctness, run

```bash
npx hardhat compile
```

You should find the contract's ABI at `artifacts/contracts/Lock.sol/Lock.json`. **We will use this file in squid development.**

#### 4. Launch hardhat node

From the project root folder, run

```bash
npx hardhat node
```

#### 5. Deploy the contract

The node will keep the console window busy. In a different terminal, run this command:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```
If the contract deployed successfully, the output should look like
```
Lock with 1 ETH and unlock timestamp 1704810454 deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
```
Take note of the contract address, **you'll need it later**.

## If you chose Ganache {#ganache}

Install [Truffle](https://trufflesuite.com/docs/truffle/how-to/install/) and [Ganache](https://trufflesuite.com/docs/ganache/quickstart/#1-install-ganache) packages.

#### 1. Truffle project, sample contract 

Let's create a new truffle project with a sample contract. In the project main folder run

```bash
truffle unbox metacoin
```

Compile the contracts with
```bash
truffle compile
```

You should find the contract's ABI at `build/contracts/MetaCoin.json`. **It will be useful for indexing**.

#### 2. Create a workspace

Launch the Ganache tool and select the *New Workspace (Ethereum)* option.

![Create workspace](</img/ganache-create-workspace.png>)

Next, provide a name for the workspace and link the Truffle project we just created to it. To do that, click **Add project** and select the `truffle-config.js` file in the project root folder. Finally, select the `Server` tab at the top.

![Provide name](</img/ganache-create-workspace-1.png>)

In this window, change the server configuration to the exact values reported in this image.

![Server configuration](</img/ganache-create-workspace-2.png>)

The [`AUTOMINE` option](https://trufflesuite.com/docs/ganache/reference/cli-options/#miner) is disabled to ease the debugging.

Finally, click "Start" to launch the blockchain emulator.

#### 3. Deploy a smart contract

Configure Truffle by uncommenting the `development` section in `truffle-config.js` and setting its properties as follows:

```javascript
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "1337",    // Any network (default: none)
    },
```

Deploy the sample smart contract by running

```bash
truffle migrate
```

Log information similar to this should be displayed:

```bash
   Deploying 'MetaCoin'
   --------------------
   > transaction hash:    0xcdb820827306ebad7c6905d750d07536c3db93f4ef76fd777180bdac16eaa2ca
   > Blocks: 1            Seconds: 4
   > contract address:    0xd095211a90268241D75919f12397b389b1062f6F
   > block number:        329
   > block timestamp:     1673277461
   > account:             0x131D37F433BAf649111278c1d6E59843fFB26D28
   > balance:             99.98855876
   > gas used:            414494 (0x6531e)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00828988 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.01144124 ETH
```

Take note of the contract address, **you'll need it later**.

## Squid development

The indexing setup is ready to use. To test it, replace the contents of `src/processor.ts` with the following.

```ts
import {TypeormDatabase} from '@subsquid/typeorm-store'
import {EvmBatchProcessor} from '@subsquid/evm-processor'

const processor = new EvmBatchProcessor()
  .setRpcEndpoint('http://localhost:8545')
  .setFinalityConfirmation(5)
  .addTransaction({})
  .setFields({
    transaction: {
      contractAddress: true
    }
  })

processor.run(new TypeormDatabase(), async (ctx) => {
  for (let blk of ctx.blocks) {
    for (let txn of blk.transactions) {
      console.log(txn)
    }
  }
})
```
This defines a squid that retrieves all chain transactions from the local node RPC endpoint without filtering, making sure to retrieve the addresses of the deployed contracts for deployment transactions. Run the squid with

```bash
docker compose up -d
npm run build
npx squid-typeorm-migration apply
node -r dotenv/config lib/main.js
```
You should see the data of one (for Hardhat) or two (for Truffle+Ganache) contract deployment transactions printed to your terminal.

Now you can develop a SQD-based indexer alongside your contracts. Head over to the [dedicated tutorial](/sdk/tutorials/bayc) for guidance on squid development. Use the **contract's ABI** ([here](#3-sample-contract) or [here](#1-truffle-project-sample-contract)) and contract **address** ([here](#5-deploy-the-contract) and [here](#3-deploy-a-smart-contract)) from previous steps and be mindful that the data source of the processor class needs to be set to the local node RPC endpoint, as in the example above:

```typescript
// ...
  .setRpcEndpoint('http://localhost:8545')
// ...
```
You can also set the data source through an environment variable like it is done in [this complete end-to-end project example](https://medium.com/subsquid/how-to-build-a-performant-and-scalable-full-stack-nft-marketplace-63c12466b959) (outdated, but still useful). This will make sure the project code stays the same and only the environment variables change depending on where the project is deployed.
