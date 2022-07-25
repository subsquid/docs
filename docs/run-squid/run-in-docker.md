---
sidebar_position: 1
title: Run in Docker
---

# Run with Docker

Squid template comes with a Dockerfile containing build targets for the processor and the api server.

**Build the processor:**
```bash
docker build . --target processor -t squid-processor 
```

**Build the API server:**
```bash
docker build . --target query-node -t graphql-server
```

Assuming the database is already running at localhost,
run the freshly build `squid-processor` and `graphq-server` images:

```bash
docker run --rm -e DB_HOST=host.docker.internal --env-file=.env squid-processor
```
and
```bash
docker run --rm -e DB_HOST=host.docker.internal --env-file=.env -p 4350:4350 graphql-server
```

Note, that `host.docker.internal` works only on Docker desktop and is suitable only for development, see [here](https://docs.docker.com/desktop/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host).

