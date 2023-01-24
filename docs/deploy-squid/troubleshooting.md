---
sidebar_position: 21
title: Troubleshooting
description: Common gotchas deploying a squid
---

# Troubleshooting

Below are the most common deployment issues:

- Unexpected folder structure. See [the squid structure](/basics/squid-structure) for details.
- Docker build failures. Build a Docker images locally (see below) to troubleshoot.
- Database migration failures. Troubleshoot by executing the DB migration locally with a locally built image (see below).
- Outdated Squid SDK packages. Update to the latest SDK lib versions with `npm run update`.


## Local Docker build

To make a dry run locally, create a local `Dockerfile` with the following content:

```dockerfile title="Dockerfile"
FROM node:16-alpine AS node
FROM node AS node-with-gyp
RUN apk add g++ make python3

FROM node-with-gyp AS builder
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
RUN npm ci
ADD tsconfig.json .
ADD src src
# next line only if 'assets' is present
ADD assets assets
# next line only if 'db' is present
ADD db db
# next line only if schema.graphql is present
ADD schema.graphql .
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
# next line only if 'assets' is present
COPY --from=builder /squid/assets assets
# next line only if 'db' is present
COPY --from=builder /squid/db db
# next line only if schema.graphql is present
COPY --from=builder /squid/schema.graphql .
RUN echo -e "loglevel=silent\\nupdate-notifier=false" > /squid/.npmrc
```

Then build an image locally with 
```bash
docker build . -t my-squid
```
and fix the squid if necessary.

## Local migration run

To test the migration scripts:

1. Start a fresh database:

```bash
docker compose down 
docker compose up db -d
```

2. Run `npx squid-typeorm-migration apply` with the local squid image:

```bash
docker run --rm -e DB_HOST=host.docker.internal --env-file=.env my-squid npx squid-typeorm-migration apply
```
