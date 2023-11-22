---
sidebar_position: 115
---

# GraphQL

### API queries are too slow

- Make sure all the necessary fields are [indexed](/store/postgres/schema-file/indexes-and-constraints/)
- Annotate the schema and [set reasonable limits](/graphql-api/dos-protection/) for the incoming queries to protect against DoS attacks

### `response might exceed the size limit`

Make sure the input query has limits set or the entities are decorated with `@cardinality`. We recommend using `XXXConnection` queries for pagination. For configuring limits and max response sizes, see [DoS protection](/graphql-api/dos-protection/).
