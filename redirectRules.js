const urlList = [
    {
        "to": "/overview",
        "from": "/overview"
    },
    {
        "from": "/develop-a-squid",
        "to": "/sdk"
    },
    {
        "from": "/develop-a-squid/evm-processor",
        "to": "/sdk"
    },
    {
        "from": "/develop-a-squid/substrate-processor",
        "to": "/sdk"
    },
    {
        "from": "/develop-a-squid/examples",
        "to": "/sdk/examples"
    },
    {
        "from": "/develop-a-squid/schema-file",
        "to": "/sdk/reference/schema-file"
    },
    {
        "from": "/schema-file",
        "to": "/sdk/reference/schema-file"
    },
    {
        "from": "/develop-a-squid/graphql-api",
        "to": "/sdk/reference/graphql-server"
    },
    {
        "from": "/develop-a-squid/typegen/squid-substrate-typegen",
        "to": "/sdk/reference/typegen"
    },
    {
        "from": "/develop-a-squid/typegen/squid-evm-typegen",
        "to": "/sdk/reference/typegen"
    },
    {
        "from": "/develop-a-squid/evm-processor/configuration",
        "to": "/sdk/reference/processors/evm-batch"
    },
    {
        "from": "/evm-indexing/data-mapping",
        "to": "/sdk/reference/processors/evm-batch/context-interfaces"
    },
    {
        "from": "/evm-indexing/store-interface",
        "to": "/sdk/resources/persisting-data"
    },
    {
        "from": "/substrate-indexing/data-handlers",
        "to": "/sdk/reference/processors/subtrate-batch/context-interfaces"
    },
    {
        "from": "/substrate-indexing/store-interface",
        "to": "/sdk/resources/persisting-data"
    },
    {
        "from": "/substrate-indexing/data-subscriptions",
        "to": "/sdk/reference/processors/subtrate-batch"
    },
    {
        "from": "/substrate-indexing/configuration",
        "to": "/sdk/reference/processors/subtrate-batch"
    },
    {
        "from": "/substrate-indexing/evm-support",
        "to": "/sdk/resources/substrate/frontier-evm"
    },
    {
        "from": "/substrate-indexing/wasm-support",
        "to": "/sdk/resources/substrate/ink"
    },
    {
        "from": "/substrate-indexing/gear-support",
        "to": "/sdk/resources/substrate/gear"
    },
    {
        "from": "/archives/archive-registry",
        "to": "/archives/overview"
    },
    {
        "from": "/archives/archives-advanced-setup",
        "to": "/archives/overview"
    },
    {
        "from": "/archives/substrate/batch-api",
        "to": "/archives/substrate/api"
    },
    {
        "from": "/archives/substrate/self-hosted",
        "to": "/archives/overview"
    },
    {
        "from": "/archives/substrate/explorer-api",
        "to": "/archives/substrate/api"
    },
    {
        "from": "/run-squid/run-in-docker",
        "to": "/sdk/resources/self-hosting"
    },
    {
        "from": "/run-squid/run-in-production",
        "to": "/sdk/resources/self-hosting"
    },
    {
        "from": "/basics/store/typeorm-store",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/basics/schema-file",
        "to": "/sdk/reference/schema-file"
    },
    {
        "from": "/basics/schema-file/intro",
        "to": "/sdk/reference/schema-file/intro"
    },
    {
        "from": "/basics/schema-file/entities",
        "to": "/sdk/reference/schema-file/entities"
    },
    {
        "from": "/basics/schema-file/indexes-and-constraints",
        "to": "/sdk/reference/schema-file/indexes-and-constraints"
    },
    {
        "from": "/basics/schema-file/entity-relations",
        "to": "/sdk/reference/schema-file/entity-relations"
    },
    {
        "from": "/basics/schema-file/unions-and-typed-json",
        "to": "/sdk/reference/schema-file/unions-and-typed-json"
    },
    {
        "from": "/basics/schema-file/interfaces",
        "to": "/sdk/reference/schema-file/interfaces"
    },
    {
        "from": "/basics/db-migrations",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/basics/store",
        "to": "/sdk/resources/persisting-data"
    },
    {
        "from": "/basics/store/store-interface",
        "to": "/sdk/resources/persisting-data/overview"
    },
    {
        "from": "/basics/store/postgres",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/basics/store/postgres/typeorm-store",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/basics/store/postgres/schema-file",
        "to": "/sdk/reference/schema-file"
    },
    {
        "from": "/basics/store/postgres/schema-file/intro",
        "to": "/sdk/reference/schema-file/intro"
    },
    {
        "from": "/basics/store/postgres/schema-file/entities",
        "to": "/sdk/reference/schema-file/entities"
    },
    {
        "from": "/basics/store/postgres/schema-file/indexes-and-constraints",
        "to": "/sdk/reference/schema-file/indexes-and-constraints"
    },
    {
        "from": "/basics/store/postgres/schema-file/entity-relations",
        "to": "/sdk/reference/schema-file/entity-relations"
    },
    {
        "from": "/basics/store/postgres/schema-file/unions-and-typed-json",
        "to": "/sdk/reference/schema-file/unions-and-typed-json"
    },
    {
        "from": "/basics/store/postgres/schema-file/interfaces",
        "to": "/sdk/reference/schema-file/interfaces"
    },
    {
        "from": "/basics/store/postgres/db-migrations",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/basics/store/file-store",
        "to": "/sdk/resources/persisting-data/file"
    },
    {
        "from": "/basics/store/file-store/overview",
        "to": "/sdk/resources/persisting-data/file"
    },
    {
        "from": "/basics/store/file-store/csv-table",
        "to": "/sdk/reference/store/file/csv"
    },
    {
        "from": "/basics/store/file-store/parquet-table",
        "to": "/sdk/reference/store/file/parquet"
    },
    {
        "from": "/basics/store/file-store/json-table",
        "to": "/sdk/reference/store/file/json"
    },
    {
        "from": "/basics/store/file-store/s3-dest",
        "to": "/sdk/reference/store/file/s3-dest"
    },
    {
        "from": "/basics/store/custom-database",
        "to": "/sdk/resources/persisting-data/overview"
    },
    {
        "from": "/squid-cli/redeploy",
        "to": "/squid-cli/restart"
    }
]

module.exports.urlList = urlList;
