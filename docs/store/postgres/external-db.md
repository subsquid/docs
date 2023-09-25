---
sidebar_position: 60
title: External PostgreSQL
description: Supplying database credentials via env vars
---

# Using an external database

It is possible to use `TypeormDatabase` with non-local PostgreSQL. Credentials must be supplied via the environment variables:

* `DB_HOST` (default `localhost`)
* `DB_PORT` (default `5432`)
* `DB_NAME` (default `postgres`)
* `DB_USER` (default `postgres`)
* `DB_PASS` (default `postgres`)
* `DB_SSL` (SSL will not be used unless set to `true`)

`DB_SSL` sometimes does not suffice for connecting to SSL-only cloud databases. The workaround is to set `PGSSLMODE=require` in the [environment](/deploy-squid/env-variables).
