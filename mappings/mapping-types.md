---
description: >-
  A mapping can be triggered not only by a runtime event, but also at the end of
  an extrinsic execution or  at the beginning or at the end of arbitrary block
---

# Mapping Types

The manifest file provides flexible control over when and which mappings are executed by the processor. All mappings are identified by the exported function name, as defined by the `handler` property. 

The following types are supported:

* Event mappings: executed when a matching event was emitted by runtime. Defined in the `eventMappings` section of the manifest:

```yaml
eventHandlers:
    - event: balances.Transfer 
      handler: balancesTransfer
```

* Extrinsic mappings: executed when the corresponding event is triggered by the matching extrinsic. By default, the trigger event is `system.ExtrinsicSuccess` but may be extended by the optional property `triggerEvents` in the definition

```yaml
extrinsicHandlers:
    - extrinsic: timestamp.set 
      handler: timestampCall
      triggerEvents: # optional list of events triggering the execution
        - system.ExtrinsicSuccess
        - system.ExtrinsicFailure
```

* Pre-block hooks: Executed prior to any events in the block. 

```yaml
preBlockHooks:
    - handler: preHook
```

* Post-block hooks. Executed after all the event and extrinsic mappings in the block

```yaml
preBlockHooks:
    - handler: preHook
```

### Mapping Filters



