---
sidebar_position: 60
description: >-
  Picking the right data on Substrate
title: Substrate data sourcing
---

## How do I know which events and calls I need on Substrate?

This part depends on the runtime business logic of the chain. The primary and the most reliable source of information is thus the Rust sources for the pallets used by the chain.

For a quick lookup of the documentation and the data format, it is often useful to check Runtime section of Subscan (e.g. [Statemine](https://assethub-kusama.subscan.io/runtime)). One can see the deployed pallets and drill down to events and extrinsics from there. One can also choose the spec version on the drop down.
