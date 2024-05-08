---
sidebar_position: 40
title: Monitoring
description: Prometheus endpoints for squid services
---

# Monitoring

Each deployed squid version exposes Prometheus metrics for external monitoring with e.g. Grafana. 

## Processor metrics

The processor metrics are available at `https://${org}.subsquid.io/${squid_name}/v/v${version}/processors/${processor}/metrics`. It is also exposed for the [production alias](/cloud/resources/production-alias) at `https://${org}.subsquid.io/${squid_name}/processors/${processor}/metrics`.

`${processor}` here is the processor name; it defaults to `processor` unless specified.

The metrics are documented inline. They include some values reflecting the squid health:
- `sqd_processor_last_block`. The last processed block.
- `sqd_processor_chain_height`. Current chain height as reported by the RPC endpoint (when [RPC ingestion](/sdk/resources/basics/unfinalized-blocks) is enabled) or by [Subsquid Network](/subsquid-network) (when it is disabled).

Inspect the metrics endpoint for a full list.

## Postgres metrics

Postgres metrics will be available in the future Subsquid Cloud releases. 

## API metrics

API metrics will be available in the future Subsquid Cloud releases. 
