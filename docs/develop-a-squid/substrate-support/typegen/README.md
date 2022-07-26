---
description: >-
  Squid Typegen is a code generation tool for creating Typescript types for
  substrate Events, Extrinsics, Storage Items (for Substrate) and EVM logs.
---

# Typegen

## Overview

### Substrate entities

[Events](https://docs.substrate.io/reference/glossary/#events), [extrinsics](https://docs.substrate.io/reference/glossary/#extrinsic), and [state calls](https://docs.substrate.io/reference/glossary/#state) are processed as raw untyped JSON by the Processor. Not only is it unclear what the exact structure of a particular event or call is but, rather frequently, it can change over time.

One of the most useful functionalities offered by the Subsquid SDK is the ability to automatically manage changes in the Runtime, due to upgrades for example.

Having Class wrappers around them makes it much easier to develop Event or Extrinsic Handlers, as well as pre- or post-block "hooks" and manage multiple metadata versions of a blockchain.

Subsquid SDK comes with a CLI tool called `substrate metadata explorer` which makes it easy to keep track of all runtime upgrades within a certain blockchain. This can then be provided to a different CLI tool called `typegen`, to generate type-safe, spec version-aware wrappers around events and calls.
