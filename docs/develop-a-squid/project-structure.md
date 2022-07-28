---
sidebar_position: 5
title: Project structure
---

# Project structure

A squid is expected to follow the structure of [`squid-template`](https://github.com/subsquid/squid-template) and contain the following files and folders in the project root:

- `schema.graphql` -- the data schema file
- `/db` -- the designated folder with the database migrations
- `/src` -- the source folder for the squid processor
- `/assets` -- the folder with additional files need for the squid (e.g. static data files)
- `Dockerfile` -- Docker build file used for local runs and by the Aquarium 
- `tsconfig.json`, `package-lock.json`, `package.json` 

Further, the following scripts must be defined in `package.json`:

- `db:migrate` to run the database migrations. This script is run in a separate init container when the squid is deployed to the Aquarium.
- `processor:start` to start the processor
- `query-node:start` to start the API server
