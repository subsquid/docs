---
sidebar_position: 30
description: >-
  Additional support for indexing Gear programs
---

# Gear support

:::info
SQD Network has gateways for two networks that use Gear Protocol: **Vara** and **Vara Testnet**. Here are their endopint URLs:
```
https://v2.archive.subsquid.io/network/vara
```
```
https://v2.archive.subsquid.io/network/vara-testnet
```
:::

Indexing [Gear](https://gear-tech.io/) programs is supported with [`addGearMessageQueued()`](/sdk/reference/processors/substrate-batch/data-requests/#addgearmessagequeued) and [`addGearUserMessageSent()`](/sdk/reference/processors/substrate-batch/data-requests/#addgearusermessagesent) specialized data requests. These subscribe to the events [`Gear.MessageQueued`](https://wiki.gear-tech.io/docs/api/events/#messagequeued) and [`Gear.UserMessageSent`](https://wiki.gear-tech.io/docs/api/events/#usermessagesent) emitted by a specified Gear program.

The processor can also subscribe to any other event with [`addEvent()`](/sdk/reference/processors/substrate-batch/data-requests/#events) and filter by program ID in the batch handler, if so necessary. 

An example of a squid indexing a Gear program (an NFT contract) can be found [here](https://github.com/subsquid/squid-sdk/tree/master/test/gear-nft).
