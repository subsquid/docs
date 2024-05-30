---
sidebar_position: 80
description: >-
  Fuel Beta 5 vs Testnet
---

# Fuel Network Beta 5

In Fuel Squid SDK, Fuel testnet and beta 5 data require different package versions.
To work with Fuel beta 5, you need to set the following versions in your `package.json`:

```json
{
  "dependencies": {
    "@subsquid/fuel-objects": "0.0.3",
    "@subsquid/fuel-stream": "0.0.3"
  }
}
```

and run:

```bash
rm -rf package-lock.json node_modules
npm i
```

## Data sources

To access beta 5 data, you need to set the gateway URL as follows:

```typescript
const dataSource = new DataSourceBuilder()
  .setGateway("https://v2.archive.subsquid.io/network/fuel-stage-5");
```
You may also want to use a Beta 5 GraphQL endpoint for real-time data:
```ts
dataSource.setGraphql({
  url: 'https://beta-5.fuel.network/graphql'
})
```

## Data requests

Data requests are the same as they are in the testnet version:
* [`addInput`](/fuel-indexing/fuel-datasource/input)
* [`addOutput`](/fuel-indexing/fuel-datasource/output)
* [`addReceipt`](/fuel-indexing/fuel-datasource/receipt)
* [`addTransaction`](/fuel-indexing/fuel-datasource/transactions)

## Field Selection

For Fuel `DataSource` the top-level [`Block` interface](/fuel-indexing/fuel-datasource/context-interfaces) is defined the same as in the testnet version.

Here are the differences in Beta 5 data structures, compared to Testnet:

* In [`Transaction` fields](/fuel-indexing/fuel-datasource/field-selection/#transaction):
  - there are fewer transaction types: `'Script' | 'Create' | 'Mint'`
  - `mintGasPrice`, `isUpgrade`, `isUpload`, `bytecodeRoot`, `subsectionIndex`, `subsectionsNumber`, `proofSet`, `upgradePurpose` fields are missing
  - `gasPrice?: bigint` and `bytecodeLength?: bigint` fields are added
  - `inputContract.contractId` subfield is called `inputContract.contract`
  - interface `Policies` lacks the `tip` field, but has an extra `gasPrice?: bigint` field
  - interfaces `SuccessStatus` and `FailureStatus` lack `totalGas` and `totalFee` fields

* In [`Input` fields](/fuel-indexing/fuel-datasource/field-selection/#input):
  - `InputCoin` type has an added `maturity: number` field
  - `InputContract` type field `contractId` is called `contract`

* In [`Output` fields](/fuel-indexing/fuel-datasource/field-selection/#output):
	- `ContractCreated` type's `contract` field instead of a string contains an object:
    ```ts
    contract: {
      id: Bytes
      bytecode: Bytes
      salt: Bytes
    }
    ```

* In [`BlockHeader` fields](/fuel-indexing/fuel-datasource/field-selection/#block-header):
	- `eventInboxRoot`, `consensusParametersVersion`, `stateTransitionBytecodeVersion` and `messageOutboxRoot` fields are missing
  - `transactionsCount` and `messageReceiptCount` have type `bigint` instead of `number`
  - `messageReceiptRoot: string` field is added
