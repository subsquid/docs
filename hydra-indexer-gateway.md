# Hydra Indexer Gateway

Hydra Indexer Gateway is a GraphQL server exposing the indexed Substrate data \(primarily, extrinsics and events\), indexed by Hydra Indexer.

## Installation

The project is built using [Warthog](https://github.com/goldcaddy77/warthog) library.

### Local development

For local development, first inspect `env.yml` and generate a dev `.env` file using run `yarn config:dev`. Then the server can be run with `yarn start:dev`

### Production/Docker

For production a pre-built Docker image in recommended. The following environment variables must be set:

| Variable | Description |
| :--- | :--- |
| WARTHOG\_STARTER\_DB\_DATABASE | Indexer database name |
| WARTHOG\_STARTER\_DB\_HOST | Indexer database host |
| WARTHOG\_STARTER\_DB\_PORT | Indexer database port |
| WARTHOG\_STARTER\_DB\_USERNAME | User to access the indexer database |
| WARTHOG\_STARTER\_DB\_PASSWORD | User password |
| WARTHOG\_STARTER\_REDIS\_URI | Redis connection string \(must be the same as used by the Indexer\) |
| PORT | Port at which the GraphQL server will listen for connections |

