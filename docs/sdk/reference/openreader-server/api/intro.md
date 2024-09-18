---
sidebar_position: 10
title: Intro
description: >-
  GraphQL and its support in SQD
---

:::info
At the moment, [Squid SDK GraphQL server](/sdk/reference/openreader-server) can only be used with squids that use Postgres as their target database.
:::

GraphQL is an API query language, and a server-side runtime for executing queries using a custom type system. Head over to the [official documentation website](https://graphql.org/learn/) for more info.

A GraphQL API served by the [GraphQL server](/sdk/reference/openreader-server) has two components:

1. Core API is defined by the [schema file](/sdk/reference/schema-file).
2. Extensions added via [custom resolvers](/sdk/reference/openreader-server/configuration/custom-resolvers).

In this section we cover the core GraphQL API, with short explanations on how to perform GraphQL queries, how to paginate and sort results. This functionality is supported via [OpenReader](https://github.com/subsquid/squid-sdk/tree/master/graphql/openreader), SQD's own implementation of [OpenCRUD](https://www.opencrud.org).
