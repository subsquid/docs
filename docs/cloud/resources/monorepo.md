---
sidebar_position: 65
title: Working with monorepos
description: Custom build command + external lock files
---

# Working with monorepos

When a squid is a part of some large project it is often convenient to keep it in a monorepo. These setups typically keep [shrinkwrap](https://nodejs.org/en/blog/npm/managing-node-js-dependencies-with-shrinkwrap) files such as `package-lock.json` in some centralized location.

By default, [`sqd deploy`](/squid-cli/deploy) relies on shrinkwrap-based installation commands such as `npm ci`. These expect to find a shrinkwrap file in the root folder of the squid, so not having it there may complicate the deployment.

Circumvent the issue by overriding the dependency installation command in your squid's [manifest](/cloud/reference/manifest/#install). The quick-and-dirty solution is to just ask for a fresh install, e.g.:
```yaml
build:
  install:
    - pnpm
    - install
```
