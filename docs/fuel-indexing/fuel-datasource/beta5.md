---
sidebar_position: 5
description: >-
Fuel Beta 5 vs Testnet
---

# Fuel Network Beta 5

In Fuel Squid SDK, Fuel testnet and beta 5 data require different package versions.
To work with Fuel beta 5, you need to set the following versions in your `package.json`:

````json
{
  "dependencies": {
    "@subsquid/fuel-objects": "0.0.3",
    "@subsquid/fuel-stream": "0.0.3"
  }
}

and run:

```bash
rm -rf package-lock.json node_modules
npm i
````

## Gateway

To access beta 5 data, you need to set the following gateway URL:

```typescript
const dataSource = new DataSourceBuilder()
  // Provide Subsquid Network Gateway URL.
  .setGateway("https://v2.archive.subsquid.io/network/fuel-stage-5");
```

## Data Requests

For Fuel `DataSource` the `Block` interface is defined the same as in the testnet version.

`Input` and `Output` data requests are the same as in the testnet version.

`Receipt` interface in the beta 5 version has the following structure:

```typescript
{
  // data requests
   type?: ReceiptType[]
   contract?: string[] // logDataContract in the testnet version
  // related data retrieval

  transaction?: boolean

}
```

where `contract` sets the contract addresses to track instead of `logDataContract` in the testnet version.

`Transaction` data requests are the same as in the testnet version. link

## Field Selection

`Output` data in beta 5 version do have an option of `'ContractCreated'` for `type`field.
