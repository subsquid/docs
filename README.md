---
description: Introducing Subsquid, a GraphQL query node for substrate chains.
cover: .gitbook/assets/discord-1584x200.png
coverY: 0
---

# Overview

## Welcome

Welcome to Subsquid! This documentation is intended to introduce the general public to the project, as well as to serve as a guide for anyone who may be developing software using the Subsquid query node framework.

The various sections and pages of this material cover a variety of subjects. The documentation includes an overview of all the project's key concepts. Also included are operational guides, as well as plenty of reference material.

## What is Subsquid

[Subsquid ](https://subsquid.io)is a query node framework for Substrate-based blockchains. In very simple terms, Subsquid can be thought of as an ETL tool, with a GraphQL server included.

Subsquid's [multi-layer approach](key-concepts/architecture.md) aims to pre-process and decode raw chain data and store it for easier access by query nodes, providing increased performance over direct RPC calls.

Thanks to Subsquid, the complexity of fetching and transforming blockchain data can be vastly reduced. On top of that, developers get a batteries-included GraphQL server with comprehensive filtering, pagination, and even full-text search capabilities.

### Data retrieval made ~~easy~~ easier :smile:

Blockchains produce, add, and store data in a very different way than do centralized sources. As a result, how one must search for information stored on blockchains is different as well.\
\
The beauty of blockchain is that anyone can tap into on-chain data in order to create their own DApps. However, a massive uptick in the development of decentralized applications has led to a morass of data spread across blockchains. This information has become difficult to access and utilize.

Furthermore, in this ever-evolving environment, updates and changes upstream can have breaking consequences to data processing pipelines.

Poor data leads to poor products, and before we know it, blockchain solutions may start to fail as a result of data feeds that are simply not up to the job. This would be a shame, as we have barely begun to scratch the surface of what could be achieved in a decentralized world!

This is where Subsquid comes in. Subsquid has a multi-layered [architecture](key-concepts/architecture.md), composed of [Archive(s)](key-concepts/architecture.md#squid-archive) and [Squid(s)](key-concepts/architecture.md#squid).

Subsquid is rapidly deploying Archives to gather data from available blockchains on behalf of developers who wish to use this data to develop DApps. These Archives are constantly ingesting and decoding data from the blockchains that they were built to synchronize with and storing (archiving, hence the name... 😜 ) it for a much easier access by developers.

The power of Subsquid is the framework it provides. This framework allows developers to create APIs using the technology and techniques with which they are already familiar. All of this can be developed on top of blockchain data provided by Archives, instead of direct gRPC node access, thus reducing the friction and inertia of starting a new project.

## Where do I start?

This documentation provides information for all degrees of expertise, varying from complete beginner, to those who only need a refresher on specific commands.

To jump straight into the action, follow our [Quickstart](quickstart.md) page. You'll get the template project up and running and start familiarizing with the SDK.

[Quickstart](quickstart.md){: .btn }

{% content-ref url="quickstart.md" %}
[quickstart.md](quickstart.md)
{% endcontent-ref %}

If you want to learn more about the project, head over to the [Key Concepts](key-concepts/) section, where you can learn about the fundamentals and get to know more about our multi-layer Architecture

{% content-ref url="key-concepts/" %}
[key-concepts](key-concepts/)
{% endcontent-ref %}

To see an example and learn how to customize the template project to fit your own needs, take a look at this Tutorial

{% content-ref url="tutorial/create-a-simple-squid.md" %}
[create-a-simple-squid.md](tutorial/create-a-simple-squid.md)
{% endcontent-ref %}

For information about how to deploy a Squid API using our SaaS cloud hosting, visit this page

{% content-ref url="recipes/deploying-a-squid/" %}
[deploying-a-squid](recipes/deploying-a-squid/)
{% endcontent-ref %}

If you need information on how to migrate from previous versions, head over to the dedicated guide:

{% content-ref url="recipes/migrate-to-v5.md" %}
[migrate-to-v5.md](recipes/migrate-to-v5.md)
{% endcontent-ref %}
