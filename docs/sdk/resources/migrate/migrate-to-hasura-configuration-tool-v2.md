---
sidebar_position: 5
title: hasura-configuration tool v2
description: Breaking change in the Hasura configuration tool
---

# Migrating to Hasura configuration tool v2

Pre-2.0.0 [`@subsquid/hasura-configuration`](/sdk/resources/tools/hasura-configuration) used a fixed naming schema for [relation fields](/sdk/reference/schema-file/entity-relations/):

 - Forward relation fields were _always_ named after the type they referred to. Type names were `snake_case`d. For example, any field referring to an entity called `BurnTest` was called `burn_test`.
 - Inverse relation fields names were also determined by the relation type:
   + In one-to-one relation their names were `to_snake_case(typeName)`, where `typeName` is the name of the entity that the inverse field is typed with.
   + In one-to-many inverse relations they were named `${to_snake_case(typeName)}s`.

Any names given to the fields in the [schema](/sdk/reference/schema-file) were ignored.

`@subsquid/hasura-configuration@2.0.0` introduces full support for in-schema field names. Now the fields will be called exactly as they are in the schema file. If these field names are different from what's described above, your API will have a breaking change. If you'd like to avoid it, please make sure that the fields in your `schema.graphql` are named exactly as described above.

To update the tool and your Hasura config:
```bash
npm i @subsquid/hasura-configuration@latest
npx squid-hasura-configuration regenerate
```
If you deployed to the Cloud you can safely (barring the field names change) redeploy your squid in-place.

If you opted to not change your schema to accommodate the old relation field names, please follow this up by revising GraphQL queries in any of your client apps.
