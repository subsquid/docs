---
sidebar_position: 7

---

# Logging

A `Logger` interface is injected into the handler context with `ctx.log`. This is the recommended way to debug and log in mappings. 

The `Logger` exposes different levels of severity:

* `trace`
* `debug`
* `info`
* `warn`
* `error`
* `fatal`

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

The mapping logs can be inspected once the squid is deployed to Aquarium:

```
npx sqd squid logs <name>@<version> -f --level <level>
```

See [CLI Reference](../deploy-squid/squid-cli/squid.md) for a full list of supported options.
