---
description: >-
  Interface containing the required information about the emitted Substrate
  event
---

# SubstrateEvent

The`SubstrateEvent` object is passed as the second argument for each event handler and contains all the essential information about the event being processed by Hydra Indexer. Let us take a closer look at the interface.

```typescript
import BN from 'bn.js';

export interface EventParam {
  type: string
  name: string
  value: AnyJsonField
}

export interface ExtrinsicArg {
  type: string
  name: string
  value: AnyJsonField
}

export interface SubstrateExtrinsic {
  method: string
  section: string
  versionInfo?: string
  meta?: AnyJson
  era?: AnyJson
  signer: string
  args: ExtrinsicArg[]
  signature?: string
  hash?: string
  tip: BN
}

export interface SubstrateEvent {
  name: string
  method: string
  section?: string
  params: Array<EventParam>
  index: number
  id: string
  blockNumber: number
  extrinsic?: SubstrateExtrinsic
}
```

As can be seen above, the `SubstrareEvent` also provides a reference to the extrinsic that has emitted the event.

