---
description: >-
  A brief description of the blockchain framework upon which Subsquid is based
  and its main concepts.
---

# Substrate

## What is Substrate

[Substrate ](https://substrate.io)is, as per their self-appointed definition:

> The only flexible, open, interoperable, and future-proof blockchain framework.

Substrate is the blockchain framework used by [Parity Technologies](https://www.parity.io) to build [Polkadot](https://polkadot.network). As a consequence, any blockchain built with Substrate is compatible with Polkadot.

In the words of Polkadot and Parity Technologies founder, Gavin Wood:

> Substrate is not a blockchain in itself, but akin to a blockchain SDK framework

A blockchain built with Substrate is not necessarily a Polkadot parachain, it does not have to, but it can be. Substrate makes it much easier than alternative methods to build Polkadot parachains, but a chain built with Substrate can exist independently.

### Runtime

The runtime of a blockchain is where the business logic that dictates its behavior is defined. In Substrate-based chains, it is also referred to as the state transition function, because it is where the storage items that define a state are defined, as well functions that allow for transitioning from one state to another.

It's worth noting that while it is the _core_ of a Substrate node, such nodes have other components, responsible for other tasks, such as peer discovery, consensus, and RPC calls handling.

For more information, see the [official documentation](https://docs.substrate.io/v3/concepts/runtime/).

### Extrinsics

The official documentation for Substrate gives this definition for Extrinsics:

> An extrinsic is a piece of information that comes from outside the chain and is included in a block. Extrinsics fall into three categories: inherents, signed transactions, and unsigned transactions.

Extrinsics are stored in each block as an array, more precisely, they are bundled into a _series_, to be executed by the runtime.

For security and verification, in the block headers is also stored a cryptographic digest of this series, called _extrinsics root_.

#### Inherents

> Inherents are pieces of information that are not signed and only inserted into a block by the block author

This type of Extrinsic brings information that has been deemed reasonable by the validators and, as such, it is assumed to be true, because it is more difficult to prove than other kinds of information, such as a funds transaction. A good example can be the block timestamp.

#### Signed transactions

> Signed transactions contain a signature of the account that issued the transaction and stand to pay a fee to have the transaction included on-chain.

#### Unsigned transactions

Unsigned transactions are to be considered an exception, they are seldom used and with care. Key characteristics of Unsigned transactions are:

* Since they are not signed, no one must pay a fee for them
* They lack Economic logic to prevent spamming
* They lack a _nonce_, meaning replay protection is more difficult

### Events

An Event is a way for a Runtime to notify external entities such as users, chain explorers or dApps about changes or conditions in the runtime itself.

For more information on how Events are defined, what information they can contain and when they are emitted, head over to the [official documentation about it](https://docs.substrate.io/v3/runtime/events-and-errors/).&#x20;



## Why Substrate
