# Logging

A `Logger` interface is injected into the new Handler Contexts. This is the new recommended way of logging as these will be tracked by our hosting service and even when used locally, they are color coded and have increased readability.

The `Logger` interface expose, among others, six methods to write log messages with increasing level of severity. These methods, and their respective Log Levels are:

* `trace`
* `debug`
* `info`
* `warn`
* `error`
* `fatal`

And here is an example that uses them all:

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

These log messages will be tracked by future releases of Subsquid's hosting service (a.k.a. Aquarium) and are very useful for local development as well, as they are configured to be color coded, and formatted for increased readability.

Furthermore, each log message reports useful information about the context in which the log happened. This is why they are the recommended way to log messages from now on.

Below is a screenshot of the log messages printed by the code above. As you can see, by default, log messages with a log level inferior to `INFO` are ignored.

![New log messages appearance](<../.gitbook/assets/image (2).png>)

It is possible, however, to override the default setting, by specifying the appropriate environment variable.

The processor instantiates various `Logger` instances to track useful debug information, and to distinguish them, each one has been given a namespace. The namespace of the `Logger` instance injected in the Handlers is `sqd:processor:mapping`, as can be seen from the image above.

Launching the processor with this environment variable set: `SQD_DEBUG=*` means that every `Logger` instance used by the processor will print log messages with log level equal to `DEBUG` or higher, and this would be filling the console window with log messages at a **very high rate**.

Different environment variables and values, which relate to the namespace of the logger instance determine the final output. In order to lower the log level of user code, it is advised to always specify the namespace, for example: `SQD_TRACE=sqd:processor:mapping` will lead to this:

![](<../.gitbook/assets/image (4).png>)

All of the log messages we added now appear, plus two (`begin` and `end`) which are default ones.
