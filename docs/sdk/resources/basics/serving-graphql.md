---
sidebar_position: 80
title: Serving GraphQL
description: GraphQL servers commonly used in squids
---

# Serving GraphQL

It is common (although not required) for squids to serve GraphQL APIs. Historically, the most common way to do that was to [persist the squid data to PostgreSQL](/sdk/resources/persisting-data/typeorm), then attach the [SQD GraphQL server](#the-sqd-graphql-server) to it. Although this is still supported, we encourage using [PostGraphile](#postgraphile) or [Hasura](#hasura) in new PostgreSQD-based projects. See [SQD GraphQL server known issues](/sdk/reference/graphql-server/overview/#known-issues) if you're curious about our motivation.

## PostGraphile

[PostGraphile](https://www.graphile.org/postgraphile/) is an open-source tool that builds powerful, extensible and performant GraphQL APIs from PostgreSQL schemas.

The recommended way of integrating PostGraphile into squid projects is by making a dedicated entry point at `src/api.ts`. A complete example squid implementing this approach is available in [this repository](https://github.com/subsquid-labs/squid-postgraphile-example/).

With this entry point in place, we [create a `sqd` command](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/commands.json#L58) for running PostGraphile with [`commands.json`](/squid-cli/commands-json), then use it in the [`deploy.api` entry](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/squid.yaml#L15) of [Squid manifest](/cloud/reference/manifest). Although none of this is required, this makes it easier to run the squid both locally (with [`sqd run`](/squid-cli/run)) and in the [Cloud](/cloud).

As per usual with PostGraphile installations, you can freely extend it with plugins, including your own. Here is an [example plugin for serving the `_squidStatus` queries](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/src/api.ts#L11) from the standard Squid SDK GraphQL server schema. A plugin for making PostGraphile API fully compatible with old APIs served by the SQD GraphQL server will be made available soon.

## Hasura

[Hasura](https://hasura.io) is a powerful open-source GraphQL engine geared towards exposing multiple data sources via a single GraphQL API. You can integrate it with your squid in two ways:
1. **Use Hasura to gather data from multiple sources, including your squid.**

   For this scenario we recommend separating your Hasura instance from your squid, which should consist of just one service, [the processor](/sdk/reference/processors/architecture), plus the database. Supply your database credentials to Hasura, then configure it to produce the desired API.

   If you run your squid in our [Cloud](/cloud) you can find database credentials in [the app](https://app.subsquid.io/squids):

   ![database creds](serving-graphql-database-creds.png)

2. **Run a dedicated Hasura instance for serving the data just from your squid.**

   A complete example implementing this approach is available in [this repository](https://github.com/subsquid-labs/squid-hasura-example). More TBA.

<!-- If you want to run Hasura in [Subsquid Cloud](/cloud), visit the [`hasura` addon page](/cloud/reference/hasura). -->

## The SQD GraphQL server

The [SQD GraphQL server](/sdk/reference/graphql-server) is a GraphQL server developed by the SQD team. Although still supported, it's not recommeded for new PostgreSQL-powered projects due to its [known issues](/sdk/reference/graphql-server/overview/#known-issues), especially for APIs implementing GraphQL subscriptions.

The server uses the [schema file](/sdk/reference/schema-file) to produce its [core API](/sdk/reference/graphql-server/openreader) that can be extended with [custom resolvers](/sdk/reference/graphql-server/configuration/custom-resolvers). Extra features include [DoS protection](/sdk/reference/graphql-server/configuration/dos-protection).
