# EVM Processor

Subsquid API framework was initially built with Substrate blockchains in mind. It is fully and natively compatible with all network built with such scheme.

But EVM-compatible projects, such as Moonbeam or Acala, created the demand to add support for EVM logs to our Processors. And Subsquid responded by developing the [@subsquid/substrate-evm-processor](https://www.npmjs.com/package/@subsquid/substrate-evm-processor).

The inner workings are similar in all aspects to the base Substrate Processor. As a matter of facts, the Substrate EVM Processor is an _extension_ of the aforementioned Substrate Processor.

This page will go over the most important customizations a developer would want to make, when building their API.

## Prerequisite

It is important, before even starting, to verify that the Archive our Processor will be connecting to is EVM-compatible.

To know exactly what this means, please check the related section in the [Archive guide](../recipes/how-to-launch-a-squid-archive.md#launch-archives-for-evm-compatible-blockchain).

## Importing and instantiating

The `Substrate EVM Processor` is defined in an `npm` package that needs to be installed before being able to use it:

{% hint style="info" %}
Note: the [subsquid-template](https://github.com/subsquid/squid-template) does not have this package in its dependencies.
{% endhint %}

```bash
npm install @subsquid/substrate-evm-processor
```

Then the `SubstrateEvmProcessor` class can be imported from the package

```typescript
import {SubstrateEvmProcessor} from "@subsquid/substrate-evm-processor"
```

Then, it's finally possible to declare an instance of it:

```typescript
const processor = new SubstrateEvmProcessor('moonbeam')
```

{% hint style="info" %}
Note: all of the code snippets in this page can be found in the [`processor.ts`](https://github.com/subsquid/squid/blob/master/test/moonsama-erc721/src/processor.ts) file in the test subfolder of our main project's repository.
{% endhint %}

### Handlers and interfaces

To know more about Handler functions, Handler Interfaces and Context Interface linked to this processor, take a look at the dedicated pages:

* [EvmLogHandler Interface](handler-functions/handler-interfaces.md#evmloghandler)
* [EvmLogHandlerOptions Interface](handler-functions/handler-options-interfaces.md#evmloghandleroptions)
* [EvmLogHandlerContext Interface](handler-functions/context-interfaces.md#evmloghandlercontext)

## ABI interface and decoding

Solidity developers, and more generally, those who have dealt with EVM contracts should already be familiar with the concept of [ABI](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html), but as a refresher, and specifically for Substrate specialist who are taking a look at this for the first time, ABI stands for Application Binary Interface and it is described as:

> The Contract Application Binary Interface (ABI) is the standard way to interact with contracts in the Ethereum ecosystem, both from outside the blockchain and for contract-to-contract interaction. Data is encoded according to its type, as described in this specification. The encoding is not self describing and thus requires a schema in order to decode.

In many ways, it is a very similar concept to the Types Bundle of Substrate. It collects types, and names, inputs output and properties of functions expressed in contracts. And the resulting interface is noted in a JSON file.

As an example, here is the ABI for the ERC-721 standard

<details>

<summary>ERC-721 ABI</summary>

{% code title="erc721.json" %}
```json
[
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "baseURI",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "baseURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```
{% endcode %}

</details>

Defining an ABI (or more) is crucial for being able to process EVM logs, but there a few more steps to take in order to do so.

The [Typegen automated tool](../key-concepts/typegen.md), takes care of generating TypeScript class wrappers for abstract types. Unfortunately, there is no equivalent to this for the EVM Events and Topics, so this has to be done manually. Let's look at an example:

{% code title="erc721.ts" %}
```typescript
import {Interface} from "@ethersproject/abi"
import erc721Json from "./erc721.json"

const event_name = 'Transfer(address,address,uint256)'

const abi = new Interface(erc721Json)

interface EvmLogData {
    data: string
    topics: string[]
}

export interface TransferEvent {
    from: string
    to: string
    tokenId: bigint
}

const transfer_fragment = abi.getEvent(event_name)

export const events = {
    event_name : {
        topic: abi.getEventTopic(event_name),
        decode(data: EvmLogData): TransferEvent {
            let result = abi.decodeEventLog(transfer_fragment, data.data, data.topics)
            return {
                from: result[0],
                to: result[1],
                tokenId: result[2].toBigInt()
            }
        }
    }
}
```
{% endcode %}

This file uses the official `@ethersproject/abi` to wrap the ABI JSON in an `Interface` class, and then exports an `events` object mapping an event name with its related topic and a function to `decode` the EVM data.

This function can then be used in the body of an `EvmLogHandler` function, like this:

{% code title="processor.ts" %}
```typescript
async fuction evmTransfer (ctx: EvmLogHandlerContext ): Promise<void> {
    let transfer = erc721.events['Transfer(address,address,uint256)'].decode(ctx)

    // ...
    
}
```
{% endcode %}

Where `transfer` will be an object with `from`, `to`, `tokenId` fields, as defined above.
