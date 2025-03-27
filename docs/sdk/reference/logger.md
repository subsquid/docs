---
sidebar_position: 30
description: Native logger of Squid SDK
---

# Logger

A [`Logger`](https://github.com/subsquid/squid/tree/master/util/logger) interface is injected into the [handler context](/sdk/reference/processors/architecture/#batch-context) with `ctx.log`. It is bound to the namespace `sqd:processor:mapping`. The context logger is a recommended way of logging for squid processors.

`Logger` exposes the following logging levels, in order of increasing severity:

* `TRACE`
* `DEBUG`
* `INFO`
* `WARN`
* `ERROR`
* `FATAL`

By default, the logging level is set to `INFO`. 

And here is an example:

```typescript
processor.run(new TypeormDatabase(), async (ctx) => {
  ctx.log.trace("Trace Log example");
  ctx.log.debug("Debug Log example");
  ctx.log.info("Info Log example");
  ctx.log.warn("Warn Log example");
  ctx.log.error("Error Log example");
  ctx.log.fatal("Fatal Log example")
});
```

## Overriding the log level

The log level can be overridden by setting a matching namespace selector to one of the `SQD_TRACE`, ..., `SQD_FATAL` env variables. In particular, to set the handler logs level to `DEBUG` set the environment variable `SQD_DEBUG` to `sqd:processor:mapping`:

```bash
SQD_DEBUG=sqd:processor:mapping
```

The namespace selector supports wildcards, so one can also enable internal debug logs of `@subsquid/substrate-processor` with
```
SQD_DEBUG=sqd:processor*
```
since all processor context loggers inherit the processor-level namespace `sqd:processor`.


## Accessing logs of a deployed Squid

Processor logs can be inspected once the squid is deployed to Cloud:

```bash
sqd logs -n <name> -s <slot> -f --level=<level>
```
or
```bash
sqd logs -n <name> -t <tag> -f --level=<level>
```
<details>

<summary>For older version-based deployments...</summary>

...the slot string is `v${version}`, so use
```bash
sqd logs -n <name> -s v<version> -f --level=<level>
```
Check out the [Slots and tags guide](/cloud/resources/slots-and-tags) to learn more.

</details>

The available levels are:
 * `info`
 * `warning`
 * `debug`
 * `error` - will fetch messages emitted by
   - `ctx.log.error`
   - `ctx.log.fatal`
   - `ctx.log.trace`

See [CLI Reference](/squid-cli/logs) or `sqd logs --help` for a full list of log options supported by SQD Cloud.
