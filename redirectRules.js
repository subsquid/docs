const urlList = [
    {
        "to": "/basics/overview",
        "from": "/overview"
    },
    {
        "from": "/develop-a-squid",
        "to": "/basics"
    },
    {
        "from": "/develop-a-squid/evm-processor",
        "to": "/evm-indexing"
    },
    {
        "from": "/develop-a-squid/substrate-processor",
        "to": "/substrate-indexing"
    },
    {
        "from": "/develop-a-squid/examples",
        "to": "/examples"
    },
    {
        "from": "/develop-a-squid/schema-file",
        "to": "/store/postgres/schema-file"
    },
    {
        "from": "/schema-file",
        "to": "/store/postgres/schema-file"
    },
    {
        "from": "/develop-a-squid/graphql-api",
        "to": "/graphql-api"
    },
    {
        "from": "/develop-a-squid/typegen/squid-substrate-typegen",
        "to": "/firesquid/substrate-indexing/squid-substrate-typegen"
    },
    {
        "from": "/develop-a-squid/typegen/squid-evm-typegen",
        "to": "/evm-indexing/squid-evm-typegen"
    },
    {
        "from": "/develop-a-squid/evm-processor/configuration",
        "to": "/evm-indexing/configuration"
    },
    {
        "from": "/evm-indexing/data-mapping",
        "to": "/evm-indexing/context-interfaces"
    },
    {
        "from": "/evm-indexing/store-interface",
        "to": "/store"
    },
    {
        "from": "/substrate-indexing/data-handlers",
        "to": "/substrate-indexing/context-interfaces"
    },
    {
        "from": "/substrate-indexing/store-interface",
        "to": "/store"
    },
    {
        "from": "/substrate-indexing/data-subscriptions",
        "to": "/substrate-indexing/setup"
    },
    {
        "from": "/archives/archive-registry",
        "to": "/archives/overview"
    },
    {
        "from": "/archives/archives-advanced-setup",
        "to": "/archives/substrate/self-hosted"
    },
    {
        "from": "/archives/archives-explorer-api",
        "to": "/archives/substrate/archives-explorer-api"
    },
    {
        "from": "/run-squid",
        "to": "/archives/substrate/self-hosted"
    },
    {
        "from": "/run-squid/run-in-docker",
        "to": "/deploy-squid/self-hosting"
    },
    {
        "from": "/run-squid/run-in-production",
        "to": "/deploy-squid/self-hosting"
    },
    {
        "from": "/basics/store/typeorm-store",
        "to": "/store/postgres/typeorm-store"
    },
    {
        "from": "/basics/schema-file",
        "to": "/store/postgres/schema-file"
    },
    {
        "from": "/basics/schema-file/intro",
        "to": "/store/postgres/schema-file/intro"
    },
    {
        "from": "/basics/schema-file/entities",
        "to": "/store/postgres/schema-file/entities"
    },
    {
        "from": "/basics/schema-file/indexes-and-constraints",
        "to": "/store/postgres/schema-file/indexes-and-constraints"
    },
    {
        "from": "/basics/schema-file/entity-relations",
        "to": "/store/postgres/schema-file/entity-relations"
    },
    {
        "from": "/basics/schema-file/unions-and-typed-json",
        "to": "/store/postgres/schema-file/unions-and-typed-json"
    },
    {
        "from": "/basics/schema-file/interfaces",
        "to": "/store/postgres/schema-file/interfaces"
    },
    {
        "from": "/basics/db-migrations",
        "to": "/store/postgres/db-migrations"
    },
    {
        "from": "/basics/store",
        "to": "/store"
    },
    {
        "from": "/basics/store/store-interface",
        "to": "/store/store-interface"
    },
    {
        "from": "/basics/store/postgres",
        "to": "/store/postgres"
    },
    {
        "from": "/basics/store/postgres/typeorm-store",
        "to": "/store/postgres/typeorm-store"
    },
    {
        "from": "/basics/store/postgres/schema-file",
        "to": "/store/postgres/schema-file"
    },
    {
        "from": "/basics/store/postgres/schema-file/intro",
        "to": "/store/postgres/schema-file/intro"
    },
    {
        "from": "/basics/store/postgres/schema-file/entities",
        "to": "/store/postgres/schema-file/entities"
    },
    {
        "from": "/basics/store/postgres/schema-file/indexes-and-constraints",
        "to": "/store/postgres/schema-file/indexes-and-constraints"
    },
    {
        "from": "/basics/store/postgres/schema-file/entity-relations",
        "to": "/store/postgres/schema-file/entity-relations"
    },
    {
        "from": "/basics/store/postgres/schema-file/unions-and-typed-json",
        "to": "/store/postgres/schema-file/unions-and-typed-json"
    },
    {
        "from": "/basics/store/postgres/schema-file/interfaces",
        "to": "/store/postgres/schema-file/interfaces"
    },
    {
        "from": "/basics/store/postgres/db-migrations",
        "to": "/store/postgres/db-migrations"
    },
    {
        "from": "/basics/store/file-store",
        "to": "/store/file-store"
    },
    {
        "from": "/basics/store/file-store/overview",
        "to": "/store/file-store/overview"
    },
    {
        "from": "/basics/store/file-store/csv-table",
        "to": "/store/file-store/csv-table"
    },
    {
        "from": "/basics/store/file-store/parquet-table",
        "to": "/store/file-store/parquet-table"
    },
    {
        "from": "/basics/store/file-store/json-table",
        "to": "/store/file-store/json-table"
    },
    {
        "from": "/basics/store/file-store/s3-dest",
        "to": "/store/file-store/s3-dest"
    },
    {
        "from": "/basics/store/custom-database",
        "to": "/store/custom-database"
    },
    {
        "from": "/squid-cli/redeploy",
        "to": "/squid-cli/restart"
    }
]

module.exports.urlList = urlList;
