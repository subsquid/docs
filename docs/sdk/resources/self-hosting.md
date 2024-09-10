---
sidebar_position: 90
title: Self-hosting
description: Deploy squid locally or on-premises
---

# Self-hosting

:::tip
Many tips from our [best practices guide](/cloud/resources/best-practices) apply to self-hosted squids, too. Check it out if you intend to use your squid in production.
:::

To deploy a squid locally or on-premises, use the following Dockerfile template to build a single image for both `api` and `processor` services:

```dockerfile title="Dockerfile"
FROM node:16-alpine AS node
FROM node AS node-with-gyp
RUN apk add g++ make python3
FROM node-with-gyp AS builder
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
# remove if needed
ADD assets assets 
# remove if needed
ADD db db
# remove if needed
ADD schema.graphql .
RUN npm ci
ADD tsconfig.json .
ADD src src
RUN npm run build
FROM node-with-gyp AS deps
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
RUN npm ci --production
FROM node AS squid
WORKDIR /squid
COPY --from=deps /squid/package.json .
COPY --from=deps /squid/package-lock.json .
COPY --from=deps /squid/node_modules node_modules
COPY --from=builder /squid/lib lib
# remove if no assets folder
COPY --from=builder /squid/assets assets
# remove if no db folder
COPY --from=builder /squid/db db
# remove if no schema.graphql is in the root
COPY --from=builder /squid/schema.graphql schema.graphql
# remove if no commands.json is in the root
ADD commands.json .
RUN echo -e "loglevel=silent\\nupdate-notifier=false" > /squid/.npmrc
RUN npm i -g @subsquid/commands && mv $(which squid-commands) /usr/local/bin/sqd
ENV PROCESSOR_PROMETHEUS_PORT 3000
```

Then build an image with 
```bash
docker buildx build . -t my-squid
```
or with
```bash
docker build . -t my-squid
```
if you're using an older Docker version.

## Sample compose file

Once can the run the squid services with the freshly built image. Here is a sample `docker-compose` file:

```yaml
version: "3"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: squid
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-d", "db_prod"]
      interval: 30s
      timeout: 60s
      retries: 5
      start_period: 80s
    # Uncomment for logging all SQL statements
    # command: ["postgres", "-c", "log_statement=all"]
  api:
    image: my-squid
    environment:
      - DB_NAME=squid
      - DB_PORT=5432
      - DB_HOST=db
      - DB_PASS=postgres
      - GQL_PORT=4350
    ports:
      # GraphQL endpoint at port 4350
      - "4350:4350"
    command: ["sqd", "serve:prod"]
    depends_on:
      - db
  processor:
    image: my-squid
    environment:
      - DB_NAME=squid
      - DB_PORT=5432
      - DB_HOST=db
      - DB_PASS=postgres
    ports:
      # prometheus metrics exposed at port 3000
      - "3000:3000"
    command: ["sqd", "process:prod"]
    depends_on:
      - db
```

Note that `sqd serve:prod` and `sqd process:prod` commands are defined in the [`commands.json` file](/squid-cli/commands-json).
