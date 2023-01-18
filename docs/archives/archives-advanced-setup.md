# Advanced options

For Substrate-based chains, an Archive consists of a Postgres compatible database for storage,
the ingesting service is [substrate-ingest](https://github.com/subsquid/squid/tree/master/substrate-ingest), and the data is exposed by [substrate-gateway](https://github.com/subsquid/archive-gateway)
and optionally by [substrate-explorer](https://github.com/subsquid/squid/tree/master/substrate-explorer) for human-friendly exploration queries. The startup options for each service are listed below.

For the instructions on how to run an archive locally and recommendations for production setups, [consult this repo](https://github.com/subsquid/squid-archive-setup). 

## Substrate Ingest

`substrate-ingest` fetches blocks from a substrate chain and dumps them into a Postgres-compatible database or as JSON lines. It has the following arguments 

**Startup arguments:**

- `-e`, `--endpoint` A wss RPC endpoint. One can provide as many endpoints as necessary, increasing the ingestion throughput.
- `-c`, `--endpoint-capacity` (optional, `default: 5`. It should follow the endpoint) capacity. The max number of pending requests for the endpoint/
- `--types-bundle`, A path to a local JSON file with substrate type definitions (applicable only to old pre-v14 metadata substrate chains). Types for most chains are already built in, so this option is rarely used. Note that the types bundle format is [slightly different](https://github.com/subsquid/squid/tree/master/substrate-metadata/src/old/definitions) from that of `polkadot.js`
- `--output` A path to a local file or a Postgres-compatible connection string
- `--start-block` (optional) The block height to start. Note that in order to index the runtime metadata and make the archive compatible with `@subsquid/substrate-typegen` one must start from the genesis block. 
- `--write-batch-size` (optional) The number of blocks to write in a single transaction (applies only to Postgres)
- `--prom-port` (optional) Port number for the built-in Prometheus metrics server

**Ports:**

- `9090` (default): Prometheus port

## Substrate Gateway

`substrate-gateway` exposes on-chain data with a GraphQL interface designed for batch requests and metadata exploration by Squid processors. 

**Startup arguments:**

- `--database-url` postgres-compatible connection string to a database populated with `substrate-ingest`
- `--evm-support` (optional) extension for Substrate chains with the Frontier EVM pallet
- `--contracts-support` (optional) extension for Substrate chains with the Contracts (WASM) pallet

**Environment variables:**

- `DATABASE_MAX_CONNECTIONS`: internal db connection pool capacity
- `RUST_LOG`: [Rust log](https://rust-lang-nursery.github.io/rust-cookbook/development_tools/debugging/config_log.html) string

**Ports:**

- `8000` (default): GraphQL server (`/graphql` route) and Prometheus (`/metrics` route)

**Queries:**

The GraphQL endpoint exposes the following queries:

- `batch` -- return an aggregated batch of block, event, call and extrinsic data matching the requested filters and data selectors
- `metadata` -- list all metadata updates up to the current block
- `metadataById` -- lookup spec version details by the metadata ID in the form `<specName>@<version>`
- `status` -- last archived block by the ingester


## Substrate Explorer

`substrate-explorer` provided a human friendly GraphQL API on top of the database populated by `substrate-ingester`. See [Explorer API](/archives/archives-explorer-api) for more details on the schema.

**Environment variables:**

- `DB_TYPE`: `postgres` or `cockroach` 
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`: database connection details

**Ports:**

- `3000` (default): GraphQL server

## Database choice

We recommend using a [Cockroach DB](https://www.cockroachlabs.com/docs/cockroachcloud/quickstart.html?filters=local) cluster in production as several performance issues where reported for large networks. The ingest and the gateway services work with Postrges 12+ out-of-the box, for the explorer service, set `DB_TYPE: cockroach`. 