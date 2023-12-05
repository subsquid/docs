---
sidebar_position: 97
title: Best practices
description: Checklist for going to production
---

# Best practices

Here is a list of items to check out before you deploy your squid for use in production:

* If your squid [saves its data to a database](/arrowsquid-docs-v0/store/postgres), make sure your [schema](/arrowsquid-docs-v0/store/postgres/schema-file) has [`@index` decorators](/arrowsquid-docs-v0/store/postgres/schema-file/indexes-and-constraints) for all entities that will be looked up frequently.

* If your squid serves a [GraphQL API](/arrowsquid-docs-v0/graphql-api), consider:
  1. configuring the built-in [DoS protection](/arrowsquid-docs-v0/graphql-api/dos-protection) against heavy queries;
  2. configuring [caching](/arrowsquid-docs-v0/graphql-api/caching).

* If you deploy your squid to Subsquid Cloud:
  1. Deploy your squid to a [Professional organization](../organizations/#professional-organizations).
  2. Use [`dedicated: true`](../scale/#dedicated) in the `scale:` section of the manifest.
  3. Make sure that your [`scale:` section](../scale) requests a sufficient but not excessive amount of resources.
  4. Once you deploy, set a [production alias URL](../promote-to-production) to simplify subsequent updates. Use it and not API URLs of squid versions to access your API e.g. from your frontend app.
  5. Make sure to use [secrets](../env-variables/#secrets) for all sensitive data you might've used in your code. The most common type of such data is API keys and URLs containing them.
