---
description: >-
  Subsquid SDK's latest release, code-named: 🔥🦑 brings a lot of new features
  and powerful improvements.
---

# Fire Squid Release

## Overview

This guide goes through the necessary steps to migrate v5 projects to it and provides a summary of the new features and changes:

### Handling of call wrappers

The most common call wrappers (batch, proxy, sudo, etc...) are now being correctly handled and wrapped extrinsics can now be extracted and processed.

### Batch processing

A new `Processor` class has been developed, to ingest and process on-chain data in batches, significantly improving performance, when this is needed.

### Data Selection on Handler Context

This is a completely optional functionality, but this setting can be applied while attaching a Handler to the processor and will make sure the handler function will received only the specified fields.

### Multiple databases (foundational) support

New Database interfaces have been developed, that ensure support for different kind of databases.

### Lazy transactions

One of the aforementioned Database interfaces introduces lazy transactions, which reduce the resources dedicated to I/O against the DB and, as such, increase data handling speed. As a result, processing time are reduced.

### Logger interface

A `Logger` interface is injected into the new Handler Contexts. This is the new recommended way of logging as these will be tracked by our hosting service and even when used locally, they are color coded and have increased readability.

### WASM support

A complete new feature, support for `Contracts.ContractEmitted` event, which means, in fact, support for WASM contracts.
