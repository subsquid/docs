---
description: >-
  A brief description of the blockchain framework upon which Subsquid is based
  and its main concepts.
---

# Substrate

## What is Substrate

According to Parity's official documentation, [Substrate ](https://substrate.io)is:

> the only flexible, open, interoperable, and future-proof blockchain framework.

Substrate is the blockchain framework used by [Parity Technologies](https://www.parity.io) to build [Polkadot](https://polkadot.network). As a consequence, any blockchain built with Substrate is compatible with Polkadot.

In the words of Polkadot and Parity Technologies founder, Gavin Wood:

> Substrate is not a blockchain in itself, but akin to a blockchain SDK framework

A blockchain built with Substrate does not necessarily have to be a Polkadot parachain. However, it can become one, if its developers so choose.\
\
Substrate makes it much easier than alternative methods to build Polkadot parachains, but a chain built with Substrate can exist independently.

### Runtime

The runtime contains the definition of the business logic, dictating the behavior of a blockchain. In Substrate-based chains, it is also referred to as the state transition function, since this is where the storage items that define a state, as well as functions that allow for transitioning from one state to another, are defined.

It's worth noting that while this is the _core_ of a Substrate node, such nodes have other components that are responsible for other tasks, such as peer discovery, consensus, and RPC calls handling.

For more information, see the [official documentation](https://docs.substrate.io/v3/concepts/runtime/).

### Extrinsics

The official documentation for Substrate gives this definition for Extrinsics:

> An extrinsic is a piece of information that comes from outside the chain and is included in a block. Extrinsics fall into three categories: inherents, signed transactions, and unsigned transactions.

Extrinsics are stored in each block as an array. More precisely, they are bundled into a _series_, to be executed by the runtime.

For security and verification, in each block header, there is also stored a cryptographic digest of this series, called the _extrinsics root_.

#### Inherents

> Inherents are pieces of information that are not signed and only inserted into a block by the block author

This type of Extrinsic brings information that has been deemed reasonable by the validators and, as such, is assumed to be true. Inherents are more difficult to prove than other kinds of information, such as the size of a fund's transaction. A good example could be the block timestamp.

#### Signed transactions

> Signed transactions contain a signature of the account that issued the transaction and stand to pay a fee to have the transaction included on-chain.

#### Unsigned transactions

Unsigned transactions are to be considered an exception, they are seldom used and must be done so with care. Key characteristics of Unsigned transactions are:

* They do not imply a fee (since they are not signed, there is no one to pay for it).
* They lack Economic logic to prevent spamming.
* They lack a _nonce_, meaning replay protection is more difficult.

### Events

An Event is a way for a Runtime to notify external entities such as users, chain explorers, or dApps about changes or conditions in the runtime itself.

For more information on how Events are defined, what information they can contain, and when they are emitted, head over to the [official documentation](https://docs.substrate.io/v3/runtime/events-and-errors/).

### Storage

As previously mentioned, the Runtime is also referred to as the state transition function, since this is where the storage items that define a state, as well as functions that allow for transitioning from one state to another, are defined.

It is the case, then to talk about Storage and Storage Items. Substrate offers a variety of ways to store information, thanks to modular and layered storage APIs, so that runtime developers can choose what fits their needs best.

Storage items can be introduced by any Substrate pallet and become part of the blockchain state. The quality of these Storage items can vary from simpler values to very complex maps. The choice depends on the developer and Runtime logic.
