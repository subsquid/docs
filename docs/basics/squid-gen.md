---
sidebar_position: 100
title: Squid generation tools
description: Tools that generate squids from ABIs
---

# Squid generation tools

Subsquid provides [tools](https://github.com/subsquid/squid-gen) for generating ready-to-use squids that index events and function calls of smart contracts. EVM/Solidity and WASM/ink! smart contracts are supported. The tools can be configured to make squids that save data to a [PostgreSQL database](/store/postgres/typeorm-store/) or to a [file-based dataset](/store/file-store/). All that is required is NodeJS, [Subsquid CLI](/squid-cli/installation/) and, if your squid will be using a database, Docker.

Squid generation procedure is very similar for both contract types. Here are the steps:

1. Create a new blank squid with `sqd init` using a suitable template:
   ```bash
   # for EVM/Solidity contracts
   sqd init my-squid -t abi
   # OR
   # for WASM/ink! contracts
   sqd init my-squid -t https://github.com/subsquid-labs/squid-ink-abi-template
   ```
   Enter the squid folder and install the dependencies:
   ```bash
   cd my-squid
   npm i
   ```

2. Write the [configuration](#configuration) of the future squid to `squidgen.yaml`. Retrieve any necessary contract ABIs and store them at `./abi`. For simple use cases that only involve one contract and a database consider using CLI instead (documented in `npx squid-gen abi --help`).

3. Generate the squid code:
   ```bash
   npx squid-gen config squidgen.yaml
   ```

4. Prepare your squid for launching. If it is using a database, start a PostgreSQL container and generate migations:
   ```bash
   sqd up
   sqd migration:generate
   ```
   If it is storing its data to a dataset, [strip the project folder of database-related facilities](#strip-the-squid-folder-for-file-store) that are no longer needed.

5. Test the complete squid by running it locally. Start a [processor](/basics/squid-processor/) with `sqd process`. If your squid will be serving GraphQL also run `sqd serve` in a separate terminal. Make sure that the squid saves the requested data to its target dataset:
   - if it is serving GraphQL, visit the local [GraphiQL playground](http://localhost:4350/graphql);
   - for PostgreSQL-based squids you can also connect to the database with `PGPASSWORD=postgres psql -U postgres -p 23798 -h localhost squid` and take a look at the contents;
   - if it is storing data to a file-based dataset, [wait for the first filesystem sync](/store/file-store/overview/#filesystem-syncs-and-dataset-partitioning) then verify that all the expected files are present and contain the expected data.

At this point your squid is ready. You can run it on your own infrastructure or [deploy it to Aquarium](/deploy-squid/).

## Configuration

A valid config for the `squid-gen config` is a YAML file with the following sections:

* **archive** is an alias or an endpoint URL of an [Archive](/archives/overview/). Find an appropriate public archive at the [Supported networks](/evm-indexing/supported-networks/) page or in [Archive Registry](/archives/overview/#archive-registry).

* **target** section describes how the scraped data should be stored. Set
   ```yaml
   target:
     type: postgres
   ```
   to use a PostgreSQL database that can be presented to users as a GraphQL API or used as-is. Another option is to [store the data to a file-based dataset](#file-store-targets).

* **contracts** is a list of contracts to be indexed. Define the following fields for each contract:
  - **name**
  - **address**
  - **range** (optional): block range to be indexed. An object with `from` and `to` properties, each of which can be omitted. Defaults to indexing the whole chain.
  - **abi** (optional on EVM): path to the contract JSON ABI. If omitted for an EVM contract, the tool will attempt to fetch the ABI by address from the Etherscan API or a compatible alternative set by the `etherscanApi` root option.
  - **proxy** (EVM-only): when indexing a [proxy contract](https://eips.ethereum.org/EIPS/eip-1967) for events or calls defined in the implementation, set this option to its address and the `address` option to the address of the implementation contract. That way the tool will retrieve the ABI of the implementation and use it to index the output of the proxy.
  - **events** (optional): a list of events to be indexed or a boolean value. Set to `true` to index all events defined in the ABI. Defaults to `false`, meaning that no events are to be indexed.
  - **functions** (EVM-only, optional): a list of functions the calls of which are to be indexed or a boolean value. Set to `true` to index calls of all functions defined in the ABI. Defaults to `false`, meaning that no function calls are to be indexed.

* **etherscanApi** (EVM-only, optional): Etherscan API-compatible endpoint to fetch contract ABI by a known address. Default: https://api.etherscan.io/.

## `file-store` targets

Currently the only [file-based data target type](/store/file-store/) supported by `squid-gen` packages is [`parquet`](/store/file-store/parquet-table/). When used, it requires that the `path` field is also set alongside `type`. A `path` can be a local path or an URL pointing to a folder within a bucket on an S3-compatible cloud service.

Support for `file-store` is in alpha stage. Known caveats:

* If a S3 URL is used, then the S3 region, endpoint and user credentials will be [taken from the default environment variables](/store/file-store/s3-dest/). Fill your `.env` file and/or set your [Aquarium secrets](/deploy-squid/env-variables/) accordingly.

* Unlike their PostgreSQL-powered equivalents, the squids that use `file-store` may not write their data often. You may have to configure the `chunkSizeMb` and `syncIntervalBlocks` parameters of the `Database` class manually to strike an acceptable balance between the lag of the indexed data and the number of files in the resulting dataset. See [Filesystem store overview](/store/file-store/overview/) for details.

* For `parquet` targets, the [`Decimal(38)`](/store/file-store/parquet-table/#columns) column type is used by the code generator to represent `uint256`. This is done for compatibility reasons: very few tools seem to support reading wider decimals from Parquet files. If you're getting a lot of errors containing `value ... does not fit into Decimal(38, 0)`, consider replacing the `Decimal(38)` column type with `Decimal(78)` or `String()` at `src/table.ts`.

* At the moment, squids generated with file-based data targets contain a lot of facilities for managing the database and have to be [stripped](#strip-the-squid-folder-for-file-store) of them before use.

## Strip the squid folder for `file-store`

Steps to convert a squid made with a database-enabled template for use with `file-store`:

1. Remove unneeded files and packages.
```bash
rm docker-compose.yml
npm uninstall @subsquid/graphql-server @subsquid/typeorm-migration @subsquid/typeorm-store @subsquid/util-internal-json pg typeorm @subsquid/typeorm-codegen
```

2. Replace `commands.json` with the one from the [file-store-parquet-example repo](https://github.com/subsquid-labs/file-store-parquet-example).
```bash
curl -o commands.json https://raw.githubusercontent.com/subsquid-labs/file-store-parquet-example/main/commands.json
```

3. In `squid.yaml`, remove the `deploy.addons` section and replace the `deploy.api` section with
```bash
  api:
    cmd: [ "sleep", "3600" ]
```

4. Install any required `file-store` packages.
```bash
# if target.type was `parquet`
npm install @subsquid/file-store-parquet
# if target.path was an S3 URL
npm install @subsquid/file-store-s3
```

## Configuration examples

### EVM/Solidity

* Index `LiquidationCall` events of the [AAVE V2 Lending Pool contract](https://etherscan.io/address/0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9), starting from block 11362579 when it was deployed. Save the results to PostgreSQL. Use the ABI located at `./abi/aave-v2-pool.json`.
  ```yaml
  archive: eth-mainnet
  target:
    type: postgres
  contracts:
    - name: aave-v2-pool
      address: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"
      abi: ./abi/aave-v2-pool.json
      range:
        from: 11362579
      events:
        - LiquidationCall
  ```

* Index events and function calls by the [DPX contract](https://arbiscan.io/address/0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55) (a proxy) on Arbitrum, based on the ABI of the [implementation contract](https://arbiscan.io/address/0x3f770ac673856f105b586bb393d122721265ad46) retrieved from [Arbiscan](https://arbiscan.io) API. Save the results to Parquet files at './data'.
  ```yaml
  archive: arbitrum
  target:
    type: parquet
    path: ./data
  contracts:
    - name: dpx
      address: "0x3f770Ac673856F105b586bb393d122721265aD46"
      proxy: "0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55"
      events: true
      functions: true
  etherscanApi: https://api.arbiscan.io/
  ```
  **Note:** this example is known to run into the integer length issue described in the [`file-store` targets](#file-store-targets) section. One way to make it work is to widen all `Decimal` column types from 38 to 78 symbols:
  ```bash
  sed -i -e 's/38/78/g' src/table.ts
  ```

* Index all events and function calls of the [Positions NFT](https://etherscan.io/address/0xc36442b4a4522e871399cd717abdd847ab11fe88) and [Factory](https://etherscan.io/address/0x1f98431c8ad98523631ae4a59f267346ea31f984) contracts of Uniswap, send the results to the `uniswap-data` folder of the `subsquid-testing-data` bucket.
  ```yaml
  archive: eth-mainnet
  target:
    type: parquet
    path: s3://subsquid-testing-bucket/uniswap-data
  contracts:
    - name: positions
      address: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
      events: true
      functions: true
    - name: factory
      address: "0x1F98431c8aD98523631AE4a59f267346ea31F984"
      events: true
      functions: true
  ```
  **Notes:**
   - This example is also susceptible to the integer length issue and will drop at least two events if used as-is, without widening the column types.
   - The generated squid requires some variables to be set to connect to S3. Here's an example of what `.env` may look like:
     ```bash
     S3_REGION=us-east-1
     S3_ENDPOINT=https://s3.filebase.com
     S3_ACCESS_KEY_ID=myAccessKeyId
     S3_SECRET_ACCESS_KEY=mySecretAccessKey
     ```

### WASM/ink!

* Index `Transfer` events emitted by a ERC20 contract on Shibuya, save results to PostgreSQL. Do not forget to use the [ink-abi template](https://github.com/subsquid-labs/squid-ink-abi-template)!
  ```yaml
  archive: shibuya
  target:
    type: postgres
  contracts:
    - name: testToken
      abi: "./abi/erc20.json"
      address: "0x5207202c27b646ceeb294ce516d4334edafbd771f869215cb070ba51dd7e2c72"
      events:
        - Transfer
  ```
  **Note:** you can get the ABI from the `squid-gen` repository:
  ```bash
  curl -o abi/erc20.json https://raw.githubusercontent.com/subsquid/squid-gen/master/tests/ink-erc20/abi/erc20.json
  ```
