---
description: >-
  This quick start is intended for intermediate to advanced developers, already
  familiar with the technology used. For a more in-depth introduction to
  Subsquid, head to our tutorial!
---

# Quickstart

## Getting started

### Pre-requisites

* node 16.x
* docker

For more information on how to set up the Development Environment, take a look at the [Tutorial on this topic](tutorial/development-environment-set-up.md)

### Run the template project

Clone the Squid Template repository

```bash
git clone git@github.com:subsquid/squid-template.git
```

#### Install dependencies

```bash
npm ci
```

#### Compile TypeScript files

```bash
npm run build
```

#### Launch Postgres database container for your Squid

```bash
docker compose up -d
```

#### Apply database migrations to the database

```bash
npx sqd db migrate
```

#### Launch the Processor

This command will block the terminal, fetching chain data transforming and storing it in the target database

```bash
node -r dotenv/config lib/processor.js
```

#### Start the GraphQL server

In a new terminal window

```bash
npx squid-graphql-server
```

For a tutorial on how to deploy your project to our Cloud-hosted&#x20;
