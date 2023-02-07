---
sidebar_position: 44
title: Run a Squid
---


# Running a Squid

## Pre-requisites

- node 16.x
- docker
- npm (the lock files are not compatible with `yarn`)
- [make](https://www.gnu.org/software/make/) (we recommend using [WSL](https://docs.microsoft.com/en-us/windows/wsl/) on Windows)

## Run a local archive

**This step is needed only if no public archive is available for the target network** 

Check [Aquarium Archives](https://app.subsquid.io/aquarium/archives) for a list of public archives maintained by Subsquid.

Inspect `archive/docker-compose.yml` in [squid-substrate-template](https://github.com/subsquid/squid-substrate-template)
and provide one or several WebSocket endpoints for the target network. Start the stack with

```bash
docker compose -f archive/docker-compose.yml up
```

The archive gateway will be listening on port `8888` and it can immediately be used with the processor (even if it's not in sync):

```typescript
processor.setDataSource({
  archive: `http://localhost:8888/graphql`,
});
```

## Run the squid services

A squid normally consists of the following three services:

- A Postgres-compatible database
- A squid processor that fetches and transforms the data, then stores it into the database
- An API server presenting the data

The processor and the server are usual node.js processes and can be run from an IDE or a node debug environment. 

[Squid template](https://github.com/subsquid/squid-substrate-template) comes with [make](https://www.gnu.org/software/make/) scripts to run each service locally.


**1. Start the database:**
```bash
make up
```
The database is started at port `23798` defined in the `.env` file with `squid/squid` as a superuser.

**2. Start the processor (blocks the terminal):**
```bash
make process
```
On the first start, the script creates a database as defined by the `DB_NAME` variable in the `.env` file (`squid` by default).
The database connection options are defined by `DB_NAME`, `DB_PASS`, `DB_PORT` variables set in `.env`.

The Prometheus metrics are served at port `PROCESSOR_PROMETHEUS_PORT` (`3000` by default) at the `/metrics` route.

**3. Start the API server (blocks the terminal):**

```bash
make serve
```
The server listens at port `GQL_PORT` defined in `.env` (`4350` by default). The endpoint and the playground are available at the `/graphql` route.
