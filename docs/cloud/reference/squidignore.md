---
sidebar_position: 50
title: .squidignore file(s)
description: Exclude files from squid images
---

# .squidignore file(s)

**Since @subsquid/cli@2.9.0**

* If a `.squidignore` file is present in any of the squid folders (including the project root), [`sqd deploy`](/squid-cli/deploy) will read filename patterns from it and omit the matching files from the bundle to be sent to the Cloud.
* Filename patterns follow the [gitignore pattern format](https://git-scm.com/docs/gitignore#_pattern_format).
* Patterns read from `.squidignore` files from higher level folders (the project root being the highest) are overridden by patterns read from lower level folders.
* When no `.squidignore` files are supplied, `sqd deploy` will omit the following files and folders:
  ```
  node_modules
  builds
  lib
  Dockerfile
  .git
  .github
  .idea
  ```
