---
sidebar_position: 45
title: Proxy contracts
description: >-
  Indexing proxy contracts
---

# Indexing proxy contracts

_Proxy contracts_ are smart contracts that use the [DELEGATECALL](https://www.ethervm.io/#F4) EVM instruction to forward calls to some of their methods to another contract (referred to as the _implementation contract_). This setup allows changing the code that runs on method calls without redeploying the contract and losing its [state](https://docs.alchemy.com/docs/smart-contract-storage-layout). Proxy contracts are standardized in [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967).

The easiest way to know if the contract is a proxy or not is to visit the "Contract" tab of its Etherscan page. Proxy contracts will typically have the "Read as Proxy" and "Write as Proxy" buttons available. Here is how it looks for the [USDC contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48):

![Etherscan for proxies](</img/etherscan-proxy.png>)

Clicking on the "Read as Proxy" button reveals the address of the implementation contract, [FiatTokenV2_1](https://etherscan.io/address/0xa2327a938febf5fec13bacfb16ae10ecbc4cbdcf) in this case.

A few scenarios are possible when indexing a proxy contract:

1. **Events and calls that need to be indexed are described in the implementation contract**. This is by far the most common use case. If that is what you need, simply use the implementation ABI to interface with the proxy contract. In our USDC example you would need to retrieve the ABI of the FiatTokenV2_1 contract, e.g. by running
   ```bash
   # 0xa232...bDCF is the implementation contract address
   npx squid-evm-typegen src/abi 0xa2327a938Febf5FEC13baCFb16Ae10EcBc4cbDCF#fiatToken
   ```
   That retrieves the ABI from Etherscan API and uses it to create [TypeScript wrapper classes](/evm-indexing/squid-evm-typegen) for implementation functions and events at './src/abi/fiatToken.ts`. Use these to subscribe to and decode the data of the proxy contract:
   ```ts title=./src/processor.ts
   import * as fiatToken from './abi/fiatToken'
   export const processor = new EvmBatchProcessor()
     .addLog({
       // 0xA0b8...eB48 is the proxy contract address
       address: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
       topic0: [fiatToken.events.Mint.topic],
     })
   ```
   ```ts title=./src/main.ts
     // ...
     let {minter, to, amount} = fiatToken.events.Mint.decode(log)
     // ...
   ```
   Complete example is available [here](/examples/evm/evm-logs-example) (uses `Transfer`s instead of `Mint`s).

2. **Events and calls that need to be indexed are described in the proxy contract itself**. This typically occurs in indexers that track contract upgrades. In this case simply use the ABI of the proxy contract to both request and decode the data:
   ```bash
   npx squid-evm-typegen src/abi 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48#usdcProxy
   ```
   ```ts title=./src/processor.ts
   import * as usdcProxy from './abi/usdcProxy'
   export const processor = new EvmBatchProcessor()
     .addLog({
       address: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
       topic0: [usdcProxy.events.Upgraded.topic],
     })
   ```
   ```ts title=./src/main.ts
     // ...
     let {implementation} = usdcProxy.events.Upgraded.decode(log)
     // ...
   ```

3. **Events and call described in both contracts are needed**. If that is your use case, retrieve ABIs of both the proxy and the implementation and use both:
   ```ts title=./src/processor.ts
   import * as fiatToken from './abi/fiatToken'
   import * as usdcProxy from './abi/usdcProxy'
   export const processor = new EvmBatchProcessor()
     .addLog({
       address: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
       topic0: [
         fiatToken.events.Mint.topic,
         usdcProxy.events.Upgraded.topic,
       ],
     })
   ```
