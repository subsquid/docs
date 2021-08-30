# Hydra Indexer

Hydra Indexer is a daemon that ingests raw substrate data such as events and extrinsics from a substrate chain and saves it into a Postgres database. It is typically used in conjunction with [Hydra Indexer Gateway](hydra-indexer-gateway.md) providing a GraphQL API interface.

## Installation

Hydra Indexer is distributed as a set of docker containers.
Please have a look at [https://github.com/subsquid/hydra-template/blob/main/indexer/docker-compose.yml](https://github.com/subsquid/hydra-template/blob/main/indexer/docker-compose.yml)
for an example of how to setup your own indexer instance.


## Environment variables

The indexer is set up using the following environment variables

| Variable | Default | Required | Description |
| :--- | :---: | ---: | ---: |
| WS\_PROVIDER\_ENDPOINT\_URI | - | **Yes** | Substrate API endpoint to connect |
| REDIS\_URI | - | **Yes** | Redis instance URI |
| DB\_NAME | - | **Yes** | Database name |
| DB\_PORT | - | **Yes** | Database port |
| DB\_HOST | - | **Yes** | Database host |
| DB\_USER | - | **Yes** | Database user |
| DB\_PASS | - | **Yes** | Database password |
| BLOCK\_HEIGHT | 0 | No | Block height to start indexing. Ignored if the database already contains indexed blocks |
| TYPES\_JSON | - | No | Path to a JSON file with [custom types](https://polkadot.js.org/docs/api/start/types.extend#extension) (`ApiPromise.create({types: TYPES_JSON})`) |
| TYPES\_ALIAS | - | No | Path to a JSON file with [type aliases](https://polkadot.js.org/docs/api/start/types.extend#type-clashes) (`ApiPromise.create({typesAlias: TYPES_ALIAS})`) |
| SPEC\_TYPES | - | No | Path to a JSON file with [spec types](https://polkadot.js.org/docs/api/start/types.extend#node-and-chain-specific-types) (`ApiPromise.create({typesSpec: SPEC_TYPES})`) |
| CHAIN\_TYPES | - | No | Path to a JSON file with [chain types](https://polkadot.js.org/docs/api/start/types.extend#node-and-chain-specific-types) (`ApiPromise.create({typesChain: CHAIN_TYPES})`) |
| BUNDLE\_TYPES | - | No | Path to a JSON file with `typesBundle` (`ApiPromise.create({typesChain: BUNDLE_TYPES})`) |

### Advanced environment variables

Some optional environment variables are available for fine-tuning.

| Variable | Default | Description |
| :--- | :---: | ---: |
| BLOCK\_CACHE\_TTL\_SEC | `60*60` | TTL for processed blocks in the Redis cache |
| INDEXER\_HEAD\_TTL\_SEC | `60*15` | TTL for the indexer head block entry |
| WORKERS\_NUMBER | 5 | Number of concurrent workers fetching the blocks |
| BLOCK\_PRODUCER\_FETCH\_RETRIES | 3 | Number of attempts fetching each a block before throwing an error. Set to `-1` for indefinite attempts |
| SUBSTRATE\_API\_TIMEOUT | `1000 * 60 * 5` | Timeout in \(milliseconds\) for API calls |
| NEW\_BLOCK\_TIMEOUT\_MS | `60 * 10 * 1000` | Panic if no blockchain blocks have been received within this time |
| DB\_LOGGING | `error` | No | TypeORM logging level |