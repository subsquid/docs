# Handler functions

Handlers are a foundational ingredient of the Processor component of a Squid API. Sometimes referred to as _Hooks_, Handlers are, in simpler terms, functions whose execution is triggered by the Processor before (pre-Block hook) or after (post-Block hook) processing a block, or, alternatively, when the Processor encounters a previously configured Substrate Event or Substrate Extrinsic.

The Processor class exposes methods to "attach" these Handlers to it and configure the type of occurrence that should trigger them.

Each Handler "type" (`EventHandler`, `ExtrinsicHandler`, `BlockHandler`, and `EvmLogHandler`) should expect one argument: the Context, which, depending on the type of Handler, has a slightly different structure. Luckily the SDK defines an Interface for each Handler and one for each Context.

This section of the Reference documentation will provide information on:

* [How to define and attach a `Handler` function](handler-interfaces.md)
* [How to set a Range filter on a `Handler` function](handler-options-interfaces.md)
* [What kind of data is passed to a `Handler` function](context-interfaces.md)
* [How the Subsquid SDK can help you deal with Runtime upgrades](runtime-upgrades.md)
* Caveats when working with proxied calls (util.batch and sudo extrinsics) – TBD in v5.1&#x20;
* Logging and debugging best practices
