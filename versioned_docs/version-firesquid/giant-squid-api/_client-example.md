# Client example

[link](#address-encoding)

:::warning
The Giant Squid API is currently under active development and this part of the documentation is largely outdated. Reach out at [DevSquid chat](https://t.me/HydraDevs) to get support on the Giant Squid API.
:::

As mentioned before, any client wanting to aggregate multi-chain data available via the Giant Squid API, needs to perform two tasks:

* Encode the address with the codec appropriate to the chain in question (if the objective is to monitor an account's activity across multiple chains)
* Generate a query including all the chains interested by the exploration
* Perform the request and process the result by aggregating the resulting data

The simple client example we are going to build is a Node.js simple project, with only two dependencies. Let's start by initializing the project and installing necessary dependencies, by opening a console window, heading to the directory where we want to create our project and launching these two commands:

```
npm init
npm i @subsquid/ss58 graphql-request
```

The first dependency is one of Subsquid's library, specifically used for address encoding (the subject of next section) and the second one is a simple library to perform GraphQL requests, it represent the "actual" client and can be substituted, depending on personal preferences.

## Address encoding

In this guide we are going to take a look at an example that does exactly this. For the purpose of this guide, we are using this address as the subject of our research:

`YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk`

This is the address of a nominator, and it is in the format known as "Any network". As such, it is possible to search it in [Polkadot's Subscan](https://polkadot.subscan.io/account/YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk), for example, and it will be evident that the address reported in the result is different.

![pos.dog account on Polkadot's Subscan](/img/.gitbook/assets/image.png)

This is because it gets encoded with Polkadot's own codec. If we were to search it on [Kusama's Subscan](https://kusama.subscan.io/account/YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk) we'd still be able to find it, but the reported address is different:

![pos.dog account on Kusama's Subscan](</img/.gitbook/assets/image-1.png>)

As mentioned at the start, Subsquid's SDK provides a utility package for this, called `ss58`, which is what we are going to use in our client example:

```typescript
import * as ss58 from "@subsquid/ss58";

const ANY_ADRESS = "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk";

const chainNames = [
  "kusama",
  "polkadot",
  "astar"
];

// Creating multichain Account entity
interface Account {
  addressBase: Uint8Array;
  adresses: Map<string, string>;
}

const account: Account = {
  addressBase: ss58.decode(ANY_ADRESS).bytes,
  adresses: new Map(),
};

// Creating codec for every chain
var chainCodecs: Map<string, ss58.Codec> = new Map();

chainNames.forEach((chainName) => {
  try {
    chainCodecs.set(chainName, ss58.codec(chainName));
  } catch {
    console.error(
      `Can't find codec for name ${chainName}. Please specify its prefix manually`
    );
    process.exit(1);
  }
});

// Getting account's addresses for every chain
chainCodecs.forEach((codec, chain) => {
  account.adresses.set(chain, codec.encode(account.addressBase));
});
```

The above code accomplishes these tasks:

* Compiles a list of blockchains we are interested in
* Creates an `Account` interface and instance, containing the base address (the one discussed above) and an empty map
* Then proceeds in creating a map, named `chainCodecs` that links a chain's name to its related encoding function, using the appropriate codec version.
* Finally, using `chainCodecs`, it fills the `Account` instance's map with encoded addresses

:::caution
The only exception to everything explained above are Moonbeam and Moonriver networks, which have Ethereum-formatted `AccountId` addresses, and as such, cannot be directly converted from the "Any network" format.
:::

## Generating the query

I has been mentioned in the Query page of this guide that when performing queries against the Giant Squid API, every chain is a separate query on its own.

For this reason, it may be convenient to programmatically build different sub-queries from a template and merging them into a single query object.

This is shown in the code snippet below, leveraging the code shown in the previous section

```typescript
// Query sample for a single chain
// Latest 10 transfers from every chain
function chainTransfersQuery(chainName: string, address: string) {
  return gql`
  ${chainName} {
    accountById(id: "${address}") {
      id
      transfers(limit: 10, orderBy: transfer_blockNumber_DESC) {
        direction
        transfer {
          fromId
          toId
          success
          amount
          timestamp
        }
      }
    }
  }
  `;
}

// Use sample query to every chain
let query = "";
account.adresses.forEach((address, chain) => {
  query += chainTransfersQuery(chain, address);
});

// Wrap final query to gql query syntax
const finalQuery = gql`query AccountTransfersQuery {${query}}`;
```

## Perform request and collect result

The only thing left to do, for a client, although it might seem trivial is to perform the quest and collect the result.

Here is a code snippet that takes in the query generated in the previous section, performs the query request and writes the result in a json file.

```typescript
import { request, gql, GraphQLClient } from "graphql-request";
import * as fs from "fs";

// Specify stitched squid endpoint
const GQL_ENDPOINT = "https://app.devsquid.net/squids/super-api/v2/graphql";

const graphQLClient = new GraphQLClient(GQL_ENDPOINT);
graphQLClient
  .request(finalQuery)
  .then((res) =>
    fs.writeFileSync("result.json", JSON.stringify(res, null, 2))
  );
```

<details>

<summary>And here is the resulting JSON:</summary>

```typescript title="result.json"
{
  "kusama": {
    "accountById": {
      "id": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
      "transfers": [
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "DpExh9RyJZdye1LNw2JXKNRefDuC5hVhq8XGnYD7wwJJBQQ",
            "success": true,
            "amount": "20000000000000000",
            "timestamp": "2020-08-22T16:04:48.001000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "DpExh9RyJZdye1LNw2JXKNRefDuC5hVhq8XGnYD7wwJJBQQ",
            "success": true,
            "amount": "20000000000000000",
            "timestamp": "2020-08-20T15:44:12.000000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "DpExh9RyJZdye1LNw2JXKNRefDuC5hVhq8XGnYD7wwJJBQQ",
            "success": true,
            "amount": "20000000000000000",
            "timestamp": "2020-08-18T16:09:12.000000Z"
          }
        },
        {
          "direction": "TO",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "success": true,
            "amount": "20000000000000000",
            "timestamp": "2020-08-18T16:04:54.000000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "success": true,
            "amount": "20000000000000000",
            "timestamp": "2020-08-18T16:04:54.000000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "success": true,
            "amount": "20000000000000000",
            "timestamp": "2020-08-18T15:32:24.000000Z"
          }
        },
        {
          "direction": "TO",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "success": true,
            "amount": "20000000000000000",
            "timestamp": "2020-08-18T15:32:24.000000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "DpExh9RyJZdye1LNw2JXKNRefDuC5hVhq8XGnYD7wwJJBQQ",
            "success": true,
            "amount": "10000000000000000",
            "timestamp": "2020-08-18T13:26:42.000000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "DpExh9RyJZdye1LNw2JXKNRefDuC5hVhq8XGnYD7wwJJBQQ",
            "success": true,
            "amount": "10000000000000000",
            "timestamp": "2020-08-17T18:18:00.000000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "EtcZsDjmn4p4e1hNAd6FkAN62yhAV1Zc1Epc4PT7teuNL2s",
            "toId": "DpExh9RyJZdye1LNw2JXKNRefDuC5hVhq8XGnYD7wwJJBQQ",
            "success": true,
            "amount": "7677000000000000",
            "timestamp": "2020-08-17T17:36:30.000000Z"
          }
        }
      ]
    }
  },
  "polkadot": {
    "accountById": {
      "id": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
      "transfers": [
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "14rCAVdFmbG8QN6MWyeAPHtyM9MbjqxHGDJGBXbcZFkmmYvT",
            "success": true,
            "amount": "62300000000000",
            "timestamp": "2021-11-13T02:11:12.002000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "14rCAVdFmbG8QN6MWyeAPHtyM9MbjqxHGDJGBXbcZFkmmYvT",
            "success": true,
            "amount": "563750000000000",
            "timestamp": "2021-11-10T17:26:48.001000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "14rCAVdFmbG8QN6MWyeAPHtyM9MbjqxHGDJGBXbcZFkmmYvT",
            "success": true,
            "amount": "9500000000000000",
            "timestamp": "2021-11-10T16:22:36.002000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "14rCAVdFmbG8QN6MWyeAPHtyM9MbjqxHGDJGBXbcZFkmmYvT",
            "success": true,
            "amount": "128850000000000",
            "timestamp": "2021-11-09T07:24:00.003000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "14rCAVdFmbG8QN6MWyeAPHtyM9MbjqxHGDJGBXbcZFkmmYvT",
            "success": true,
            "amount": "2077200000000000",
            "timestamp": "2021-11-05T09:24:36.016000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "14rCAVdFmbG8QN6MWyeAPHtyM9MbjqxHGDJGBXbcZFkmmYvT",
            "success": true,
            "amount": "20000000000",
            "timestamp": "2021-11-05T09:24:00.002000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "16AF7zYfPCPN6J7XsQGqRVoDqrnfdLz2roXWCSxGgQMEVgLq",
            "success": true,
            "amount": "209880000000000",
            "timestamp": "2021-06-27T16:24:00.001000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "16AF7zYfPCPN6J7XsQGqRVoDqrnfdLz2roXWCSxGgQMEVgLq",
            "success": true,
            "amount": "117000000000000",
            "timestamp": "2021-06-22T16:32:06.002000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "16AF7zYfPCPN6J7XsQGqRVoDqrnfdLz2roXWCSxGgQMEVgLq",
            "success": true,
            "amount": "557000000000000",
            "timestamp": "2021-06-19T15:48:30.000000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM",
            "toId": "16AF7zYfPCPN6J7XsQGqRVoDqrnfdLz2roXWCSxGgQMEVgLq",
            "success": true,
            "amount": "61720000000000",
            "timestamp": "2021-06-19T15:47:42.000000Z"
          }
        }
      ]
    }
  },
  "astar": {
    "accountById": {
      "id": "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk",
      "transfers": [
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk",
            "toId": "ZnVTTLGh3dmBf7g3e3HGoE6aa551m6tCv4vFwp7sXjDAvgs",
            "success": true,
            "amount": "2216000000000000000000000",
            "timestamp": "2022-01-21T15:26:18.510000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk",
            "toId": "ZnVTTLGh3dmBf7g3e3HGoE6aa551m6tCv4vFwp7sXjDAvgs",
            "success": true,
            "amount": "5000000000000000000000",
            "timestamp": "2022-01-17T12:21:30.810000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk",
            "toId": "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk",
            "success": true,
            "amount": "5000000000000000000000",
            "timestamp": "2022-01-17T12:20:30.262000Z"
          }
        },
        {
          "direction": "TO",
          "transfer": {
            "fromId": "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk",
            "toId": "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk",
            "success": true,
            "amount": "5000000000000000000000",
            "timestamp": "2022-01-17T12:20:30.262000Z"
          }
        },
        {
          "direction": "FROM",
          "transfer": {
            "fromId": "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk",
            "toId": "ZnVTTLGh3dmBf7g3e3HGoE6aa551m6tCv4vFwp7sXjDAvgs",
            "success": true,
            "amount": "25570000000000000000000000",
            "timestamp": "2022-01-17T12:18:42.372000Z"
          }
        }
      ]
    }
  }
}
```


</details>

## Conclusion

This client example is purely for demonstrative purposes, most likely a frontend application implementation would look slightly differently, but the base principles shown in this guide like address encoding and query generation should still apply.

<details>

<summary>You can look at the complete code example here:</summary>

```typescript title="index.md"
import * as ss58 from "@subsquid/ss58";
import { request, gql, GraphQLClient } from "graphql-request";
import * as fs from "fs";

// Specify stitched squid endpoint
const GQL_ENDPOINT = "https://app.devsquid.net/squids/super-api/v2/graphql";
// Specify  account's address in ANY chain or just substrate address (it is shown in polkadot.js extension)
const ANY_ADRESS = "YFbLqqwvegzXpE65mGAPSxe2VQaL2u8ApuDT7KMWTSND8Hk";

const chainNames = [
  "kusama",
  "polkadot",
  "astar"
];

// Creating multichain Account entity
interface Account {
  addressBase: Uint8Array;
  adresses: Map<string, string>;
}

const account: Account = {
  addressBase: ss58.decode(ANY_ADRESS).bytes,
  adresses: new Map(),
};

// Creating codec for every chain
var chainCodecs: Map<string, ss58.Codec> = new Map();

chainNames.forEach((chainName) => {
  try {
    chainCodecs.set(chainName, ss58.codec(chainName));
  } catch {
    console.error(
      `Can't find codec for name ${chainName}. Please specify its prefix manually`
    );
    process.exit(1);
  }
});

// Suppose we can't find astar and we specify its prefix manually
// chainCodecs.set("astar", ss58.codec(5));

// Getting account's addresses for every chain
chainCodecs.forEach((codec, chain) => {
  account.adresses.set(chain, codec.encode(account.addressBase));
});

// Query sample for a single chain
// Latest 10 transfers from every chain
function chainTransfersQuery(chainName: string, address: string) {
  return gql`
  ${chainName} {
    accountById(id: "${address}") {
      id
      transfers(limit: 10, orderBy: transfer_blockNumber_DESC) {
        direction
        transfer {
          fromId
          toId
          success
          amount
          timestamp
        }
      }
    }
  }
  `;
}

// Use sample query to every chain
let query = "";
account.adresses.forEach((address, chain) => {
  query += chainTransfersQuery(chain, address);
});

// Wrap final query to gql query syntax
const finalQuery = gql`query AccountTransfersQuery {${query}}`;

// Connect to the endpoint, make ONLY one request and see the result
const graphQLClient = new GraphQLClient(GQL_ENDPOINT);
graphQLClient
  .request(finalQuery)
  .then((res) =>
    fs.writeFileSync("result.json", JSON.stringify(res, null, 2))
  );
```


</details>
