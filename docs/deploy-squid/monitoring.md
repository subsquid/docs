---
sidebar_position: 60
title: Monitoring
description: Prometheus endpoints for squid services
---

# Monitoring

Each deployed squid version exposes Prometheus metrics for external monitoring with e.g. Grafana. 

## Processor metrics

The processor metrics are available at `https://squid.subsquid.io/${name}/v/v${version}/processors/${processor}/metrics`. It is also exposed for the [production alias](/deploy-squid/promote-to-production) at `https://squid.subsquid.io/${name}/processors/${processor}/metrics`.

 `${processor}` here is the processor name; it defaults to `processor` unless specified.

The metrics are documented inline and include: 
- `sqd_processor_last_block`. The last processed block.
- `sqd_processor_chain_height`. Current chain height as reported by the archive.
- `sqd_processor_archive_http_errors_in_row`. The number of consecutive failed Archive requests

Inspect the metrics endpoint for a full list.

## Postgres metrics

Postgres metrics will be available in the future Aquarium releases. 

## API metrics

API metrics will be available in the future Aquarium releases. 
