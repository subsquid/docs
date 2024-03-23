---
sidebar_position: 90
title: PostGraphile support
description: Making your API compatible with the Cloud
---

# PostGraphile support

Although Squid SDK ships with its own [GraphQL server](/sdk/resources/graphql-server), it is also possible to serve squid APIs using third-party tools like [PostGraphile](https://www.graphile.org/postgraphile/) and [Hasura](https://hasura.io). No special configuration is required when the squid is deployed locally; however, if you want to deploy it to Subsquid Cloud and take advantage of the monitoring capabilities, your squid must be able to serve `_squidStatus` queries.

For PostGraphile you can do that by [extending the service with a plugin](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/src/api.ts#L11).

With this, your GraphQL server will require a separate entry point. We recommend that you create [an `sqd` command](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/commands.json#L58) for that. Do not forget to [add it to your manifest](https://github.com/subsquid-labs/squid-postgraphile-example/blob/f1fd1691eb59da2c9d57c475a71d0ed44cfed891/squid.yaml#L15).

Full example is available [here](https://github.com/subsquid-labs/squid-postgraphile-example/).
