---
sidebar_position: 40
title: Monitoring
description: Prometheus endpoints for squid services
---

# Monitoring

Each deployed squid version exposes Prometheus metrics for external monitoring with e.g. Grafana. 

## Processor metrics

The processor metrics are available at

- `https://${org}.squids.live/${name}@${slot}/processors/${processor}/metrics`, and at
- `https://${org}.squids.live/${name}:${tag}/processors/${processor}/metrics` for each tag attached to the slot.

See the [slots and tags guide](/cloud/resources/slots-and-tags).

`${processor}` here is the processor name; it defaults to `processor` unless specified.

The metrics are documented inline. They include some values reflecting the squid health:
- `sqd_processor_last_block`. The last processed block.
- `sqd_processor_chain_height`. Current chain height as reported by the RPC endpoint (when [RPC ingestion](/sdk/resources/unfinalized-blocks) is enabled) or by [SQD Network](/subsquid-network) (when it is disabled).

Inspect the metrics endpoint for a full list.

## Postgres metrics

Postgres metrics will be available in the future SQD Cloud releases. 

## API metrics

API metrics will be available in the future SQD Cloud releases. 
