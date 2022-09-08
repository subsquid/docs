---
sidebar_position: 30
title: DoS protection
---

# DoS protection

**Available since `@subsquid/graphql-server@2.1.0`**

The squid [GraphQL API server](https://github.com/subsquid/squid/tree/master/graphql-server) accepts the following optional start arguments to fend off heavy queries. The arguments should be added to the `query-node:start` script in `package.json` of the squid (for Aquarium deployments) and to `Makefile` (for local runs):

```json title=package.json
{
  ... 
 "scripts": {
    "build": "rm -rf lib && tsc",
    "db:migrate": "npx squid-typeorm-migration apply",
    "processor:start": "node lib/processor.js",
    "query-node:start": "squid-graphql-server --max-root-fields 10 --max-response-size 1000"
  },
  ...
}
```

```bash title=Makefile
...
serve:
	@npx squid-graphql-server --max-root-fields 10 --max-response-size 1000
...
```

**`--max-request-size <kb>`**

The argument limits the size of a request in kilobytes. It is set to `256kb` by default. 

**`--max-root-fields <count>`**

The maximal allowed number of root-level queries in a single GraphQL request.

**`--max-response-size <nodes>`**

This option limits the *estimated* query response size and errors if it exceeds the provided value. Note, that the estimated size depends only on the decorators in `schema.graphql` and the requested fields. 


The estimate is the product of the cardinality of the entity list and the response item weight.

The cardinality is estimated as the minimum of

- the query limit argument (`Infinity` if not provided)
- `@cardinality` value defined `schema.graphql` (if the requested entity type is decorated in the schema file, `Infinity` otherwise)
- `_eq` and `id_in` filters in the `where` clause (if applicable)

In particular, if there are no `@cardinality` decorators in `schema.graphql`, the client queries must explicitly provide limits or where filters to pass through.

The response item weight is calculated recursively:

- `byteWeight` for each scalar field or `1` if it's not decorated
- for non-scalar fields, the estimated weight times the estimated cardinality (if it's a list)
- each non-leaf node in the query AST tree adds a weight of `1`

In a nutshell, assuming that the schema file is properly decorated with `@cardinality` and `@byteWeight`, the estimated response size should roughly be at the same scale as the byte size of the query result. 

**`--subscription-max-response-size <nodes>`**

Same as `--max-response-size` but for live query [subscriptions](/develop-a-squid/graphql-api/subscriptions).

### Example 

Assume the schema is defined as follows, and server is launched with `--max-response-size 1000`.

```ts title=schema.graphql
type Foo @entity {
    id: ID!
    // a large string 
    bigField: String! @byteWeight(value: 1000.0)
    bar: Bar!
}

type Bar @entity {
    id: ID!
    // bar.foos typically contain about 100 items
    foos: [Foo!]! @derivedFrom(field: "bar") @cardinality(value: 100)
    bazs: [Baz!]! @derivedFrom(field: "bar")
}

// there are around 100 entities of type Baz
type Baz @entity @cardinality(value: 100) {
    id: ID!
    bar: Bar!
}


```

The following queries will be bounced:

```graphql
query A {
    bars {
        id
    }
}

query B {
    bars(limit: 1001) {
        id
    }
}

query C {
    bars(limit: 100) {
        id 
        foos(limit: 10) {
            id
        }
    }
}

query D {
    bars(limit: 10) {
        id 
        foos {
            id
        }
    }
}

query E {
    foos(id_eq: "1") {
        id
        bigField
    }
}
```

- The estimated cardinality of query A is `Infinity`
- The estimated cardinality of query B `1001` and so the expected size exceeds the limit
- The estimated cardinality of query C is `100` while the item size is `13`, so the size is estimated to `1300`.
- The estimated cardinality of query D is `10` while the item size is `103`, so the size is estimated to `1030`. 
- The estimated cardinality of query E is `1` while the item size is `1001` (due to `bigField` having weight `1000`).

At the same time, the following queries will go through:
```graphql
query A {
    bars(limit: 100) {
        id
    }
}

query B {
    bars(limit: 3) {
        id
        foos {
            id
        }
        bazs {
            id
        }
    }
}

query C {
    bazs {
        id
        bar {
            foos(where: { id_in ["1", "2" ]}) {
                id
            }
            id
        }
    }
}
```