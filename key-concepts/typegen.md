---
description: >-
  Squid Typegen is a code generation tool for creating Typescript types for
  substrate Events, Extrinsics, Storage Items (for Substrate) and EVM logs.
---

# Typegen

## Overview

### Substrate entities

[Event](substrate.md#events), [call](substrate.md#extrinsics), and [Storage](substrate.md#storage) data are ingested as raw untyped JSON by the Processor. Not only is it unclear what the exact structure of a particular event or call is but, rather frequently, it can change over time.

Runtime upgrades may change the event data and even the event logic altogether. Fortunately, Squid has got you covered with first-class support for runtime upgrades. This comes in very handy when expressing business logic, mapping Events, Extrinsics, and Storage items with database Entities defined in the GraphQL schema.

Having Class wrappers around them makes it much easier to develop Event or Extrinsic Handlers, as well as pre- or post-block "hooks" and manage multiple metadata versions of a blockchain.

Subsquid SDK comes with a CLI tool called `substrate metadata explorer` which makes it easy to keep track of all runtime upgrades within a certain blockchain. This can then be provided to a different CLI tool called `typegen`, to generate type-safe, spec version-aware wrappers around events and calls.

In the next section we'll be taking the [squid template](https://github.com/subsquid/squid-template) as an example.

### EVM logs

The Ethereum Virtual Machine smart contract is bytecode deployed on an EVM-capable blockchain. There could be several functions in a contract. An _Application Binary Interface_ is the interface between two program modules, one of which is often at the level of machine code. The interface is the de facto method for encoding/decoding data into/out of the machine code.

An ABI is necessary so that you can specify which function in the contract to invoke, as well as get a guarantee that the function will return data in the format you are expecting.

Subsquid has developed a CLI tool that is able to inspect the ABI in JSON format, parse it and create TypeScript interfaces and mappings to decode functions and data, as specified in the ABI itself.

Similarly to Substrate entities, having Interfaces for data and mappings for function decoding, speeds up the development of EVM log handler functions, creating standards for passing data around.

## Blockchain metadata

The template was designed to explore the Kusama blockchain, specifically processing the `'balance.Transfer'` event.

In order to generate wrapper classes, the first thing to do is to explore the entire history of the blockchain and extract its metadata. The `squid-substrate-metadata-explorer` command (for more information on how to run it, head over to this [Guide](../recipes/running-a-squid/generate-typescript-definitions.md)) will do the chain exploration and write it to a file. It will look like this:

```json
[
  {
    "blockNumber": 0,
    "blockHash": "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
    "specVersion": 1020,
    "metadata": "0x6d65746109701853797374656d011853797374656d34304163..."
  },
  // ...
]
```

Where the `metadata` field is cut here, and the rest of the file is omitted for brevity, but there are multiple objects such as this one in this relatively large file. The point is that for every available [Runtime](substrate.md#runtime) version of the blockchain, some metadata is available to be decoded and explored, and this metadata contains the necessary information to process its Events, Extrinsics, and Storage items.

## TypeScript class wrappers

This file is then used by the `typegen` command (again, look at the [Guide](../recipes/running-a-squid/generate-typescript-definitions.md) for how to configure and run it) to decode and interpret the metadata, and then uses that to generate this TypeScript class:

```typescript
export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get isV1020(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === 'e1ceec345fa4674275d2608b64d810ecec8e9c26719985db4998568cfcafa72b'
  }

  /**
   *  Transfer succeeded (from, to, value, fees).
   */
  get asV1020(): [Uint8Array, Uint8Array, bigint, bigint] {
    assert(this.isV1020)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   *  Transfer succeeded (from, to, value).
   */
  get isV1050(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '2082574713e816229f596f97b58d3debbdea4b002607df469a619e037cc11120'
  }

  /**
   *  Transfer succeeded (from, to, value).
   */
  get asV1050(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1050)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Transfer succeeded.
   */
  get isLatest(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '68dcb27fbf3d9279c1115ef6dd9d30a3852b23d8e91c1881acd12563a212512d'
  }

  /**
   * Transfer succeeded.
   */
  get asLatest(): {from: v9130.AccountId32, to: v9130.AccountId32, amount: bigint} {
    assert(this.isLatest)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }
}
```

This manages different runtime versions, including the starting hash for each and instructions for how to process (decode) the event itself.

All of this is better explained in the section dedicated to the [Processor and Event mapping](processor.md), but, given the class definition for a `BalanceTransferEvent`, such a class can be used to handle events such as this:

```typescript
processor.addEventHandler('balances.Transfer', async ctx => {
    let transfer = getTransferEvent(ctx)
    // ...
})

// ...

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
```

Where, upon processing an event, its metadata version is checked, and the metadata is extracted accordingly, making things a lot easier.

## EVM Typegen

Subsquid provides a tool called `squid-evm-typegen` that accepts a JSON file, with an ABI definition as an input, and will generate a TypeScript file, containing Interfaces and decoding mappings as an output.

In the [squid-evm-template](https://github.com/subsquid/squid-evm-template) repository you'll find a JSON file containing [the ERC721 ABI](https://github.com/subsquid/squid-evm-template/blob/master/src/abi/ERC721.json) and right next to it, the TypeScript file generated by such tool. Let's dissect and explain what it contains:

{% code title="erc721.ts" %}
```typescript
import * as ethers from "ethers";

export const abi = new ethers.utils.Interface(getJsonAbi());
```
{% endcode %}

These first two lines import and instantiate a programmatic interface for the ABI.

Then, a series of data interfaces are declared. These are the inputs and outputs of the functions declared in the ABI.

{% code title="erc721.ts" %}
```typescript
export interface ApprovalAddressAddressUint256Event {
  owner: string;
  approved: string;
  tokenId: ethers.BigNumber;
}

export interface ApprovalForAllAddressAddressBoolEvent {
  owner: string;
  operator: string;
  approved: boolean;
}

export interface TransferAddressAddressUint256Event {
  from: string;
  to: string;
  tokenId: ethers.BigNumber;
}

export interface EvmEvent {
  data: string;
  topics: string[];
}
```
{% endcode %}

Below them, you'll find a dictionary that maps the signature of a function to its `topic` and a method to decode it.

{% code title="erc721.ts" %}
```typescript
export const events = {
  "Approval(address,address,uint256)":  {
    topic: abi.getEventTopic("Approval(address,address,uint256)"),
    decode(data: EvmEvent): ApprovalAddressAddressUint256Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Approval(address,address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        owner: result[0],
        approved: result[1],
        tokenId: result[2],
      }
    }
  }
  ,
  "ApprovalForAll(address,address,bool)":  {
    topic: abi.getEventTopic("ApprovalForAll(address,address,bool)"),
    decode(data: EvmEvent): ApprovalForAllAddressAddressBoolEvent {
      const result = abi.decodeEventLog(
        abi.getEvent("ApprovalForAll(address,address,bool)"),
        data.data || "",
        data.topics
      );
      return  {
        owner: result[0],
        operator: result[1],
        approved: result[2],
      }
    }
  }
  ,
  "Transfer(address,address,uint256)":  {
    topic: abi.getEventTopic("Transfer(address,address,uint256)"),
    decode(data: EvmEvent): TransferAddressAddressUint256Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Transfer(address,address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        from: result[0],
        to: result[1],
        tokenId: result[2],
      }
    }
  }
  ,
}
```
{% endcode %}

At the bottom of the file, there will always be an auxiliary function that returns the ABI in a raw JSON format (not reported here, for brevity).

## What's next?

Head over to the [Processor](processor.md) page, for more information on how processing Events impacts database Entities.
