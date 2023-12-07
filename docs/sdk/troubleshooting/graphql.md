---
sidebar_position: 30
---

# GraphQL

### API queries are too slow

- Make sure all the necessary fields are [indexed](/sdk/reference/schema-file/indexes-and-constraints/)
- Annotate the schema and [set reasonable limits](/sdk/resources/graphql-server/dos-protection/) for the incoming queries to protect against DoS attacks

### `response might exceed the size limit`

Make sure the input query has limits set or the entities are decorated with `@cardinality`. We recommend using `XXXConnection` queries for pagination. For configuring limits and max response sizes, see [DoS protection](/sdk/resources/graphql-server/dos-protection/).
