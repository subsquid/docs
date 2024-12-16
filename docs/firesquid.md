---
sidebar_class_name: hidden
pagination_next: null
pagination_prev: null
---

# On the FireSquid release

Previous major release of SQD was called FireSquid. It featured GraphQL-based archives ([EVM](https://github.com/subsquid/eth-archive), [Substrate](https://github.com/subsquid/substrate-archive-setup)) that were replaced by [SQD Network](/subsquid-network). Interfaces for data requests on the [SDK](/sdk) side were changed without keeping backwards compatibility.

Actions are needed if:

1. You're relying on a squid that's using an older SDK version. One way to know that is to look at the signatures of the data requesting methods (`.addEvent()`, `.addLog()` etc): if call signatures are different from what you see in the docs ([EVM](/sdk/reference/processors/evm-batch), [Substrate](/sdk/reference/processors/substrate-batch)), then you need to migrate to the modern [ArrowSquid SDK](/sdk).

2. You're relying on a GraphQL API of an older archive. Your options are:
   - To rely on SQD Network instead. See its [reference documentation](/subsquid-network/reference) for info on available datasets and the API used to access them.
   - To fork an older archive setup and maintain it yourself. For EVM you can just fork [the repo](https://github.com/subsquid/eth-archive). If you would like to do the same for the Substrate archives, that'd require pulling some old code out of the repos' history. Ping us in the [SquidDevs TG chat](https://t.me/HydraDevs).
