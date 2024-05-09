---
sidebar_position: 70
description: >-
  Track rewards with addReward()
---

# Rewards

#### `addReward(options)` {#add-reward}

This allows for tracking rewards. `options` has the following structure:

```typescript
{
  // data requests
  where?: {
    pubkey?: string[]
  }

  range?: {
    from: number
    to?: number
  }
}
```

`pubkey` here is the set public keys of reward receivers. Leave undefined to subscribe to all rewards.

Selection of the exact fields to be retrieved for each reward item is done with the `setFields()` method documented on the [Field selection](../field-selection) page.
