---
sidebar_position: 7

---

# Logging

A `Logger` interface is injected into the handler context with `ctx.log` and it is bound to the namespace `sqd:processor:mapping`. This is the recommended way of logging for squid processors. 

The `Logger` exposes different the following levels of severity, in the increasing order:

* `TRACE`
* `DEBUG`
* `INFO`
* `WARN`
* `ERROR`
* `FATAL`

By default, the logging level is set to `INFO`. 

And here is an example:

```typescript
processor.addEventHandler("Balances.Transfer", processTransfers);

async function processTransfers(
  ctx: EventHandlerContext<Store, { event: { args: true } }>
) {
  ctx.log.trace("Trace Log example");
  ctx.log.debug("Debug Log example");
  ctx.log.info("Info Log example");
  ctx.log.warn("Warn Log example");
  ctx.log.error("Error Log example");
  ctx.log.fatal("Fatal Log example");
}
```

## Overriding the log level

The log level can be overriden by setting a matching namespace selector to one of the `SQD_TRACE`, ..., `SQD_FATAL` env varibales. In particular, to set the handler logs level to `DEBUG` set the environment variable `SQD_DEBUG` to `sqd:processor:mapping`:

```bash
SQD_DEBUG=sqd:processor:mapping
```

The namespace selector supports wildcards, so one can also enable internal debug logs of `@subsquid/substrate-processor` with
```
SQD_DEBUG=sqd:processor:*
```
as all the lib loggers inherit the lib-level namespace `sqd:processor`.

For more info, check the [Logger lib](https://github.com/subsquid/squid/tree/master/util/logger)


## Accessing logs of a deployed Squid

The processor logs can be inspected once the squid is deployed to Aquarium:

```
npx sqd squid logs <name>@<version> -f --level <level>
```

See [CLI Reference](/docs/deploy-squid/squid-cli) for a full list of log options supported by Aquarium.
