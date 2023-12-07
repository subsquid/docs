---
sidebar_position: 50
title: TypeORM model generation
description: Generate TypeORM models from a schema file
---

# TypeORM model generation

TypeORM entities can be automatically generated from the [schema file](/sdk/reference/schema-file) defined in `schema.graphql`.
The tool is called [`squid-typeorm-codegen(1)`](https://github.com/subsquid/squid-sdk/tree/master/typeorm/typeorm-codegen) and has no additonal options.

Install with 
```sh
npm i @subsquid/typeorm-codegen --save-dev
```

If `codegen` CLI alias is defined in the `commands.json` file in the project root, run:

```sh
sqd codegen
```

Alternatively, run:
```sh
npx squid-typeorm-codegen
```
