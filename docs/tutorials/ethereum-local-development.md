---
id: ethereum-local-development
title: Index a local Ethereum node
description: >-
  Use Subsquid to index an Ethereum development node running locally
sidebar_position: 2
---

# Index a local Ethereum node

## Objective

This tutorial will show you how it's possible to start using Subsquid from the very early stages of development. Simply by using a pre-built docker image of Subsquid's EVM Archive, you'll be able to index your Ethereum development node running locally.

This way, it's possible to start developing a squid ETL or API in the same local development environment your smart contract, or frontend is being developed, without waiting for the smart contract to be deployed to a testnet.

## Pre-requisites

The minimum requirements for this tutorial are as follows:

- Either one of:
  - [Ganache](https://trufflesuite.com/ganache/)
  - [Hardhat](https://hardhat.org/)
- [Subsquid CLI installed](/squid-cli/index.md#0-install-and-setup-squid-cli)
- Docker

## Setup

For the purpose of this tutorial, we are going to start with a squid project, and we are going to use it to manage Hardhat/Ganache configuration. This is not strictly necessary, it is only useful to work on one single folder and keep this tutorial as simple as possible.

### Squid

We are going to assume you have already installed [Subsquid CLI](/squid-cli/index.md#0-install-and-setup-squid-cli). 

In order to create a new squid project, simply open a terminal and launch the command:

```bash
sqd init ethereum-local-indexing -t evm
```

Where `ethereum-local-indexing` is the name we decided to give to our project, you can change it to anything you like. And `-t evm` avoid asking what template should be used and makes sure the setup will create a project from the EVM-indexing template.

The next two sections are instructions dedicated to the two main options for local Ethereum development: [Hardhat](#hardhat) and [Ganache](#ganache). Choose according to your experience, or personal preference, and follow only one of the two setups.

### Hardhat

In order to start working with Hardhat, it's necessary to [install the package](https://hardhat.org/hardhat-runner/docs/getting-started#installation).

#### 1. Create project

In a console window, from the squid project's root folder, launch:

```bash
npx hardhat
```

:::info
**Note:** If you get an error referencing your `README.md` or other files, delete them and run `npx hardhat` again. Alternatively, choose a different folder, but doing so will slightly diverge from this tutorial.
:::

And follow the guided initialization process. For the purpose of this tutorial, I have chosen a **TypeScript project** and left other choices as default.

#### 2. Configure Hardhat automining (optional)
Then, open the `hardhat.config.ts` (the file extension will be `.js` if you selected a JavaScript file in the previous step), and add this in the `HardhatUserConfig` object (or the `module.exports` for a JavaScript file):

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

The `mining` configuration will continuously mine blocks, even if no events or transactions are executed, it can be useful for debugging. You can read more about it on [hardhat official documentation](https://hardhat.org/hardhat-network/docs/reference#mining-modes).

#### 3. Sample contract

In project's folder, there should be a `contracts` subfolder now, with a sample contract named `Lock.sol`. To compile this contract and verify its correctness, in a terminal, launch:

```bash
npx hardhat compile
```

You should find the contract's ABI at the location: `artifacts/contracts/Lock.sol/Lock.json`, **it will be useful for indexing**.

#### 4. Launch hardhat node

From the hardhat project folder chosen in the initialization process (in our case, the project's root folder), run this command in a console window:

```bash
npx hardhat node
```

#### 5. Deploy the contract

The node will keep the console window busy. In a different terminal, run the command:

```bash
npx hardhat run scripts/deploy.ts --network localhost
Lock with 1 ETH and unlock timestamp 1704810454 deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

You should see a log file confirming the successful deployment, like the second line in the code box above. Take note of the contract address, **you'll need it later**.

:::info
**Note:** Alternatively, you can substitute `Lock.sol` with any solidity contract you want to work on. It will be necessary to edit the deployment script (`scripts/deploy.ts`) accordingly.
:::


### Ganache

In order to start working with Ganache node, it's necessary to Install [Truffle](https://trufflesuite.com/docs/truffle/how-to/install/) and [Ganache packages](https://trufflesuite.com/docs/ganache/quickstart/#1-install-ganache).

#### 1. Truffle project, sample contract 

Let's create a new truffle project, by downloading a sample contract. In a console window, from the project's main folder, launch this command:

```bash
truffle unbox metacoin
```

To compile the contracts, launch this command in the same console window:

```bash
truffle compile
```

You should find the contract's ABI at the location: `build/contracts/MetaCoin.json`, **it will be useful for indexing**.

#### 2. Create a workspace

Launch the Ganache tool and select the New Workspace (Ethereum option).

![Create workspace](</img/ganache-create-workspace.png>)

In the following window, provide a name for the workspace, link the Truffle project we just created, by clicking on **Add project** button and selecting the `truffle-config.js` file in the project's root folder. Finally, select the `Server` tab at the top.

![Provide name](</img/ganache-create-workspace-1.png>)

In this window, change the server configuration to the exact values reported in this image.

![Server configuration](</img/ganache-create-workspace-2.png>)

:::info
**Note:** It is not mandatory to change `PORT NUMBER` or `NETWORK ID`, but they are set to the same value as Hardhat, so the rest of the Tutorial will look the same.

The `AUTOMINE` option is disabled, same as in the *Hardhat* section of this tutorial, for debugging purposes. For more information, consult the [official documentation](https://trufflesuite.com/docs/ganache/reference/cli-options/#miner).
:::

#### 3. Deploy smart contract

Deploy the sample smart contract by launching the following command in a console window:

```bash
truffle migrate
```

:::warning
**Note:** Make sure the `development` configuration, in the `networks` section of `truffle-config.js` is uncommented, and has these values (which should be the same as the previous step).

```
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "1337",       // Any network (default: none)
    },
```
:::

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

### Archive Docker image

In order to index the local Ethereum node, we need to use a pre-built Docker image of Subsquid's Ethereum Archive. You can do it, by creating a `docker-compose.archive.yml` file, and paste this:

```yaml
version: "3"

services:
  worker:
    image: subsquid/eth-archive-worker:latest
    environment:
      RUST_LOG: "info"
    ports:
      - 8080:8080
    command: [
            "/eth/eth-archive-worker",
            "--server-addr", "0.0.0.0:8080",
            "--db-path", "/data/db",
            "--request-timeout-secs", "300",
            "--connect-timeout-ms", "1000",
            "--block-batch-size", "10",
            "--http-req-concurrency", "10",
            "--best-block-offset", "10",
            "--rpc-urls", "http://host.docker.internal:8545/",
            "--max-resp-body-size", "30",
            "--resp-time-limit", "5000",
            "--query-concurrency", "16",
    ]
    volumes:
      - db:/data/db

volumes:
  db:
```

Then start the service by opening the terminal and launching the command:

```bash
docker compose -f docker-compose.archive.yml up -d
```

### Squid development

Now you can poke your smart contract however you please, and index events or transactions with Subsquid's SDK. Using the **contract's ABI** ([here](#3-sample-contract) or [here](#1-truffle-project-sample-contract)) and contract **address** ([here](#5-deploy-the-contract) and [here](#3-deploy-smart-contract)) from previous steps.

To develop your squid ETL, indexing events of your smart contract, please head over to the [dedicated tutorial](/tutorials/create-an-ethereum-processing-squid). Just be mindful that in this specific scenario, the data source of the processor class needs to be set to the local environment:

```typescript
// ...

const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: "localhost:8545",
    archive: "localhost:8080",
  })

// ...
```

You can also use environment variables, just like shown in [this complete end-to-end project example](https://medium.com/subsquid/how-to-build-a-performant-and-scalable-full-stack-nft-marketplace-63c12466b959). This will make sure the project will stay the same, and only configuration files containing environment variables will be changed, depending on the deployment.
