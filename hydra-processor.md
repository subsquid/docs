# Hydra Processor

Hydra Processor is a 'sink' tool used to fetch substrate events from a Hydra indexer. It sequentially applies the event handlers one by one in the order the events have been emitted.

## Commands

* [`hydra-processor migrate`](hydra-processor.md#hydra-processor-migrate)
* [`hydra-processor run`](hydra-processor.md#hydra-processor-run)

## `hydra-processor migrate`

```text
undefined

USAGE
  $ hydra-processor migrate

OPTIONS
  -e, --env=env  [default: .env] Path to a file with environment variables
```

## `hydra-processor run`

```text
undefined

USAGE
  $ hydra-processor run

OPTIONS
  -e, --env=env            [default: .env] Path to a file with environment variables
  -m, --manifest=manifest  [default: manifest.yml] Manifest file
  --id=id                  ID of the processor (useful for multi-processor setups)
  --indexer=indexer        Indexer URL to source events
```

## Quickstart

`hydra-processor` is driven by environment variables \(loaded from `.env` file or supplied by a shell\)
and by settings from `manifest.yml` \(by default, it looks up `manifest.yml` in the current folder\).

Before the first run, the processor should set up auxiliary database tables required for its work:

```text
hydra-processor migrate
```

Then processing may be started:

```text
hydra-processor run
```

## Environment variables

| Variable | Default | Required | Description |
| :--- | :---: | ---: | ---: |
| INDEXER\_ENDPOINT\_URL | - | **Yes** | Hydra indexer endpoint to source the raw event and extrinsic data |
| DB\_NAME | - | **Yes** | Database name |
| DB\_PORT | - | **Yes** | Database port |
| DB\_HOST | - | **Yes** | Database host |
| DB\_USER | - | **Yes** | Database user |
| DB\_PASS | - | **Yes** | Database password |
| PROMETHEUS\_PORT | 3000 | **No** | A prometheus metrics endpoint is started at this port |
| POLL\_INTERVAL\_MS | 1 sec \(60000 msec\) | **No** | How often the processor polls the indexer for new blocks |

## Manifest file

The manifest file describes which and how the events and extrinsics should be processed.
See [mappings](mappings) for more details.
