const urlList = [
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
        "to": "/sdk/reference/processors/substrate-batch/context-interfaces"
    },
    {
        "from": "/substrate-indexing/store-interface",
        "to": "/sdk/resources/persisting-data"
    },
    {
        "from": "/substrate-indexing/data-subscriptions",
        "to": "/sdk/reference/processors/substrate-batch"
    },
    {
        "from": "/substrate-indexing/configuration",
        "to": "/sdk/reference/processors/substrate-batch"
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
        "to": "/subsquid-network/overview"
    },
    {
        "from": "/archives/archives-advanced-setup",
        "to": "/subsquid-network/overview"
    },
    {
        "from": "/archives/substrate/batch-api",
        "to": "/subsquid-network/reference/substrate-api"
    },
    {
        "from": "/archives/substrate/self-hosted",
        "to": "/subsquid-network/overview"
    },
    {
        "from": "/archives/substrate/explorer-api",
        "to": "/subsquid-network/reference/substrate-api"
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
    },
    {
        "from": "/basics/batch-processing",
        "to": "/sdk/resources/batch-processing"
    },
    {
        "from": "/basics/external-api",
        "to": "/sdk/resources/external-api"
    },
    {
        "from": "/basics/multichain",
        "to": "/sdk/resources/multichain"
    },
    {
        "from": "/basics/logging",
        "to": "/sdk/reference/logger"
    },
    {
        "from": "/basics/squid-development",
        "to": "/sdk/squid-development"
    },
    {
        "from": "/basics/squid-gen",
        "to": "/sdk/resources/squid-gen"
    },
    {
        "from": "/basics/squid-processor",
        "to": "/sdk/overview"
    },
    {
        "from": "/basics/squid-structure",
        "to": "/sdk/reference/layout"
    },
    {
        "from": "/basics/unfinalized-blocks",
        "to": "/sdk/resources/unfinalized-blocks"
    },
    {
        "from": "/deploy-squid/best-practices",
        "to": "/cloud/resources/best-practices"
    },
    {
        "from": "/deploy-squid/organizations",
        "to": "/cloud/resources/organizations"
    },
    {
        "from": "/deploy-squid/deploy-manifest",
        "to": "/cloud/reference/manifest"
    },
    {
        "from": "/deploy-squid/env-variables",
        "to": "/cloud/resources/env-variables"
    },
    {
        "from": "/deploy-squid/logging",
        "to": "/cloud/resources/logging"
    },
    {
        "from": "/deploy-squid/monitoring",
        "to": "/cloud/resources/monitoring"
    },
    {
        "from": "/deploy-squid/migration",
        "to": "/cloud/resources/migration"
    },
    {
        "from": "/deploy-squid/pg-addon",
        "to": "/cloud/reference/pg"
    },
    {
        "from": "/deploy-squid/pricing",
        "to": "/cloud/reference/pricing"
    },
    {
        "from": "/deploy-squid/promote-to-production",
        "to": "/cloud/resources/production-alias"
    },
    {
        "from": "/deploy-squid/quickstart",
        "to": "/cloud/overview"
    },
    {
        "from": "/deploy-squid/rpc-proxy",
        "to": "/cloud/reference/rpc-proxy"
    },
    {
        "from": "/deploy-squid/scale",
        "to": "/cloud/reference/scale"
    },
    {
        "from": "/deploy-squid/self-hosting",
        "to": "/sdk/resources/self-hosting"
    },
    {
        "from": "/deploy-squid/troubleshooting",
        "to": "/cloud/troubleshooting"
    },
    {
        "from": "/deploy-squid",
        "to": "/cloud"
    },
    {
        "from": "/evm-indexing/configuration/data-selection",
        "to": "/sdk/reference/processors/evm-batch/field-selection"
    },
    {
        "from": "/evm-indexing/configuration/evm-logs",
        "to": "/sdk/reference/processors/evm-batch/logs"
    },
    {
        "from": "/evm-indexing/configuration/initialization",
        "to": "/sdk/reference/processors/evm-batch/general"
    },
    {
        "from": "/evm-indexing/configuration/state-diffs",
        "to": "/sdk/reference/processors/evm-batch/state-diffs"
    },
    {
        "from": "/evm-indexing/configuration/traces",
        "to": "/sdk/reference/processors/evm-batch/traces"
    },
    {
        "from": "/evm-indexing/configuration/transactions",
        "to": "/sdk/reference/processors/evm-batch/transactions"
    },
    {
        "from": "/evm-indexing/configuration",
        "to": "/sdk/reference/processors/evm-batch"
    },
    {
        "from": "/evm-indexing/context-interfaces",
        "to": "/sdk/reference/processors/evm-batch/context-interfaces"
    },
    {
        "from": "/evm-indexing/factory-contracts",
        "to": "/sdk/resources/evm/factory-contracts"
    },
    {
        "from": "/evm-indexing/proxy-contracts",
        "to": "/sdk/resources/evm/proxy-contracts"
    },
    {
        "from": "/evm-indexing/query-state",
        "to": "/sdk/reference/typegen/state-queries"
    },
    {
        "from": "/evm-indexing/squid-evm-typegen",
        "to": "/sdk/reference/typegen"
    },
    {
        "from": "/evm-indexing/batch-processor-in-action",
        "to": "/sdk/tutorials/batch-processor-in-action"
    },
    {
        "from": "/evm-indexing/evm-processor",
        "to": "/sdk/overview"
    },
    {
        "from": "/evm-indexing",
        "to": "/sdk"
    },
    {
        "from": "/examples",
        "to": "/sdk/examples"
    },
    {
        "from": "/examples/evm/list",
        "to": "/sdk/examples"
    },
    {
        "from": "/examples/substrate/list",
        "to": "/sdk/examples"
    },
    {
        "from": "/examples/evm",
        "to": "/sdk/examples"
    },
    {
        "from": "/examples/substrate",
        "to": "/sdk/examples"
    },
    {
        "from": "/evm-indexing/configuration/showcase",
        "to": "/sdk/examples"
    },
    {
        "from": "/faq",
        "to": "/sdk/faq"
    },
    {
        "from": "/graphql-api/authorization",
        "to": "/sdk/reference/graphql-server/authorization"
    },
    {
        "from": "/graphql-api/caching",
        "to": "/sdk/reference/graphql-server/caching"
    },
    {
        "from": "/graphql-api/custom-resolvers",
        "to": "/sdk/reference/graphql-server/custom-resolvers"
    },
    {
        "from": "/graphql-api/dos-protection",
        "to": "/sdk/reference/graphql-server/dos-protection"
    },
    {
        "from": "/graphql-api/overview",
        "to": "/sdk/reference/graphql-server/overview"
    },
    {
        "from": "/graphql-api/subscriptions",
        "to": "/sdk/reference/graphql-server/subscriptions"
    },
    {
        "from": "/graphql-api",
        "to": "/sdk/reference/graphql-server"
    },
    {
        "from": "/migrate/subsquid-vs-thegraph",
        "to": "/sdk/resources/subsquid-vs-thegraph"
    },
    {
        "from": "/migrate/migrate-to-arrowsquid-on-substrate",
        "to": "/sdk/resources/migrate/migrate-to-arrowsquid-on-substrate"
    },
    {
        "from": "/migrate/migrate-subgraph",
        "to": "/sdk/resources/migrate/migrate-subgraph"
    },
    {
        "from": "/migrate/migrate-to-arrowsquid",
        "to": "/sdk/resources/migrate/migrate-to-arrowsquid"
    },
    {
        "from": "/migrate",
        "to": "/sdk/resources/migrate"
    },
    {
        "from": "/query-squid/nested-field-queries",
        "to": "/sdk/reference/openreader/nested-field-queries"
    },
    {
        "from": "/query-squid/sorting",
        "to": "/sdk/reference/openreader/sorting"
    },
    {
        "from": "/query-squid/intro",
        "to": "/sdk/reference/openreader/intro"
    },
    {
        "from": "/query-squid/and-or-filters",
        "to": "/sdk/reference/openreader/and-or-filters"
    },
    {
        "from": "/query-squid/resolve-union-types-interfaces",
        "to": "/sdk/reference/openreader/resolve-union-types-interfaces"
    },
    {
        "from": "/query-squid/cross-relation-field-queries",
        "to": "/sdk/reference/openreader/cross-relation-field-queries"
    },
    {
        "from": "/query-squid/json-queries",
        "to": "/sdk/reference/openreader/json-queries"
    },
    {
        "from": "/query-squid/queries",
        "to": "/sdk/reference/openreader/queries"
    },
    {
        "from": "/query-squid/paginate-query-results",
        "to": "/sdk/reference/openreader/paginate-query-results"
    },
    {
        "from": "/query-squid",
        "to": "/sdk/reference/openreader"
    },
    {
        "from": "/quickstart/quickstart-substrate",
        "to": "/sdk/squid-development"
    },
    {
        "from": "/quickstart/quickstart-ethereum",
        "to": "/sdk/squid-development"
    },
    {
        "from": "/quickstart/quickstart-abi",
        "to": "/sdk/resources/squid-gen"
    },
    {
        "from": "/quickstart",
        "to": "/sdk/squid-development"
    },
    {
        "from": "/store/postgres/schema-file/entities",
        "to": "/sdk/reference/schema-file/entities"
    },
    {
        "from": "/store/postgres/schema-file/indexes-and-constraints",
        "to": "/sdk/reference/schema-file/indexes-and-constraints"
    },
    {
        "from": "/store/postgres/schema-file/intro",
        "to": "/sdk/reference/schema-file/intro"
    },
    {
        "from": "/store/postgres/schema-file/entity-relations",
        "to": "/sdk/reference/schema-file/entity-relations"
    },
    {
        "from": "/store/postgres/schema-file/interfaces",
        "to": "/sdk/reference/schema-file/interfaces"
    },
    {
        "from": "/store/postgres/schema-file/unions-and-typed-json",
        "to": "/sdk/reference/schema-file/unions-and-typed-json"
    },
    {
        "from": "/store/postgres/schema-file",
        "to": "/sdk/reference/schema-file"
    },
    {
        "from": "/store/bigquery-store",
        "to": "/sdk/resources/persisting-data/bigquery"
    },
    {
        "from": "/store/file-store/overview",
        "to": "/sdk/resources/persisting-data/file"
    },
    {
        "from": "/store/file-store/csv-table",
        "to": "/sdk/reference/store/file/csv"
    },
    {
        "from": "/store/file-store/parquet-table",
        "to": "/sdk/reference/store/file/parquet"
    },
    {
        "from": "/store/file-store/json-table",
        "to": "/sdk/reference/store/file/json"
    },
    {
        "from": "/store/file-store/s3-dest",
        "to": "/sdk/reference/store/file/s3-dest"
    },
    {
        "from": "/store/file-store",
        "to": "/sdk/resources/persisting-data/file"
    },
    {
        "from": "/store/postgres/typeorm-store",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/store/postgres/db-migrations",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/store/postgres/external-db",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/store/postgres",
        "to": "/sdk/resources/persisting-data/typeorm"
    },
    {
        "from": "/store/store-interface",
        "to": "/sdk/resources/persisting-data/overview"
    },
    {
        "from": "/store/custom-database",
        "to": "/sdk/resources/persisting-data/overview"
    },
    {
        "from": "/store",
        "to": "/sdk/resources/persisting-data"
    },
    {
        "from": "/substrate-indexing/setup/data-requests",
        "to": "/sdk/reference/processors/substrate-batch/data-requests"
    },
    {
        "from": "/substrate-indexing/setup/general",
        "to": "/sdk/reference/processors/substrate-batch/general"
    },
    {
        "from": "/substrate-indexing/setup/field-selection",
        "to": "/sdk/reference/processors/substrate-batch/field-selection"
    },
    {
        "from": "/substrate-indexing/setup",
        "to": "/sdk/reference/processors/substrate-batch"
    },
    {
        "from": "/substrate-indexing/batch-processor-in-action",
        "to": "/sdk/tutorials/batch-processor-in-action"
    },
    {
        "from": "/substrate-indexing/squid-substrate-typegen",
        "to": "/sdk/reference/typegen"
    },
    {
        "from": "/substrate-indexing/storage-state-calls",
        "to": "/sdk/reference/typegen/state-queries"
    },
    {
        "from": "/substrate-indexing/context-interfaces",
        "to": "/sdk/reference/processors/substrate-batch/context-interfaces"
    },
    {
        "from": "/substrate-indexing/substrate-processor",
        "to": "/sdk/overview"
    },
    {
        "from": "/substrate-indexing/specialized/evm",
        "to": "/sdk/resources/substrate/frontier-evm"
    },
    {
        "from": "/substrate-indexing/specialized/wasm",
        "to": "/sdk/resources/substrate/ink"
    },
    {
        "from": "/substrate-indexing/specialized/gear",
        "to": "/sdk/resources/substrate/gear"
    },
    {
        "from": "/substrate-indexing",
        "to": "/sdk"
    },
    {
        "from": "/tutorials/run-a-subgraph",
        "to": "/subgraphs-support"
    },
    {
        "from": "/tutorials/development-environment-set-up",
        "to": "/sdk/resources/development-environment-set-up"
    },
    {
        "from": "/tutorials/case-studies",
        "to": "/sdk/tutorials/case-studies"
    },
    {
        "from": "/tutorials/bayc/step-one-indexing-transfers",
        "to": "/sdk/tutorials/bayc/step-one-indexing-transfers"
    },
    {
        "from": "/tutorials/bayc/step-two-deriving-owners-and-tokens",
        "to": "/sdk/tutorials/bayc/step-two-deriving-owners-and-tokens"
    },
    {
        "from": "/tutorials/bayc/step-three-adding-external-data",
        "to": "/sdk/tutorials/bayc/step-three-adding-external-data"
    },
    {
        "from": "/tutorials/bayc/step-four-optimizations",
        "to": "/sdk/tutorials/bayc/step-four-optimizations"
    },
    {
        "from": "/tutorials/bayc",
        "to": "/sdk/tutorials/bayc"
    },
    {
        "from": "/tutorials/create-a-wasm-processing-squid",
        "to": "/sdk/tutorials/ink"
    },
    {
        "from": "/tutorials/create-an-evm-processing-squid",
        "to": "/sdk/tutorials/frontier-evm"
    },
    {
        "from": "/tutorials/create-a-simple-squid",
        "to": "/sdk/tutorials/substrate"
    },
    {
        "from": "/tutorials/ethereum-local-development",
        "to": "/sdk/tutorials/evm-local"
    },
    {
        "from": "/tutorials/index-to-local-csv-files",
        "to": "/sdk/tutorials/file-csv"
    },
    {
        "from": "/tutorials/parquet-file-store",
        "to": "/sdk/tutorials/file-parquet"
    },
    {
        "from": "/tutorials",
        "to": "/sdk/tutorials"
    },
    {
        "from": "/evm-indexing/supported-networks",
        "to": "/subsquid-network/reference/evm-networks"
    },
    {
        "from": "/substrate-indexing/supported-networks",
        "to": "/subsquid-network/reference/substrate-networks"
    },
    {
        "from": "/evm-indexing/configuration/caveats",
        "to": "/sdk/troubleshooting"
    },
    {
        "from": "/troubleshooting",
        "to": "/sdk/troubleshooting"
    },
    {
        "from": "/basics",
        "to": "/sdk"
    },
    {
        "from": "/basics/overview",
        "to": "/overview"
    }
]

module.exports.urlList = urlList;
