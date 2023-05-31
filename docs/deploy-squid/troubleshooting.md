---
sidebar_position: 110
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

To make a dry run locally, create a local `Dockerfile` as described on the [self-hosting](/deploy-squid/self-hosting) page.

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
