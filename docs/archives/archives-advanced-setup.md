# Advanced options

For Substrate-based chains, an Archive consists of a Postgres compatible database for storage,
the ingest service is [substrate-ingest](https://github.com/subsquid/squid/tree/master/substrate-ingest), and the data is exposed by [substrate-gateway](https://github.com/subsquid/archive-gateway)
and optionally by [substrate-explorer](https://github.com/subsquid/squid/tree/master/substrate-explorer) for human-friendly exploration queries. 

## Substrate Ingest

`substrate-ingest` fetches blocks from a substrate chain and dumps them into a Postgres-compatible database or as JSON lines. It has the following arguments 

- `-e`, `--endpoint` A wss RPC endpoint. One can provide as many endpoints as necessary, increasing the ingestion throughput.
- `-c`, `--capacity` (optional, `default: 5`. should follow the endpoint) capacity. The max number of pending requests for the endpoint/
- `--types-bundle`, A path to a local JSON file with substrate type definitions (applicable only to old pre-v14 metadata substrate chains). Types for most chains are already built in, so this option is rarely used. Note that the types bundle format is [slight different](https://github.com/subsquid/squid/tree/master/substrate-metadata/src/old/definitions) than that of `polkadot.js`
- `--output` A path to a local file or a Postgres-compatible connection string
- `--start-block` (optional) The block height to start
- `--write-batch-size` (optional) The number of blocks to write in a single transaction (applies only to Postgres)
- `--prom-port` (optional) Port number for the built-in Prometheus metrics server

## Substrate Gateway




## Substrate Explorer