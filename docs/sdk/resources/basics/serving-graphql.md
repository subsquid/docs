---
sidebar_position: 80
title: Serving GraphQL
description: Options available for serving GraphQL APIs
---

# Options available for serving GraphQL APIs

We encourage using squids with third-party GraphQL tools like [PostGraphile](https://www.graphile.org/postgraphile/) and [Hasura](https://hasura.io). No special configuration is required and there aren't any constraints on running them in [Subsquid Cloud](/cloud).

## PostGraphile

Here we cover one possible way of integrating PostGraphile into a squid project ([full example](https://github.com/subsquid-labs/squid-postgraphile-example/)). Note the following:

* There is a dedicated entry point for PostGraphile (`src/api.ts`). It is complemented by an [`sqd` command](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/commands.json#L58) and a [manifest entry](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/squid.yaml#L15). This makes it easier to run the squid both locally (with [`sqd run`](/squid-cli/run)) and in [Cloud](/cloud).

* As per usual with PostGraphile installations, you can freely extend it with plugins, including your own. Here is an [example plugin for serving the `_squidStatus` queries](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/src/api.ts#L11) from the standard Squid SDK GraphQL server schema.

## Hasura

If you want to run Hasura in [Subsquid Cloud](/cloud), visit the [`hasura` addon page](/cloud/reference/hasura).

When running it elsewhere, simply supply database credentials in your Hasura configuration. For squids running in Subsquid Cloud you can find the credentials in [the Cloud app](https://app.subsquid.io/squids).

![database creds](serving-graphql-database-creds.png)
