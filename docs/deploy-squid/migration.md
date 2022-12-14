---
sidebar_position: 30
title: Migration guide
---

# Migrate from older versions of `@subsquid/cli`.

Since `@subsquid/cli@1.x` the commands `squid:deploy` and `squid:update` are deprecated in favor of the manifest-based deployments and `sqd deploy`.

To migrate:

- Create `squid.yaml` in the squid root folder
- Copy the deployment manifest from e.g. [squid-evm-template](https://github.com/subsquid/squid-evm-template/blob/main/squid.yaml)
- Update the squid name, description and version
- Update (if necessary) the run commands for `processor` and `api`
- Add (if necessary) the required env variables and secrets expected from `processor` and `api` service
- Run `sqd deploy .` and inspect the deployment and squid logs

