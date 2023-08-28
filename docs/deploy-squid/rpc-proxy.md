---
sidebar_position: 35
title: RPC proxy
description: Built-in caching RPC endpoints
---

# RPC proxy

Since the Arrowsquid release, Aquarium provides a built-in caching RPC proxy service. Currently, it is a premium feature, with plans to make a subset of calls available to free tier users.

## Available networks

| network:protocol                     |
|:------------------------------------:|
| `eth:http`                           | 
| `eth-sepolia:http`                   |          
|  `eth-goerli:http`                |
|  `moonbeam:http`                  |
|  `moonriver:http`                 |
|  `moonbase-alpha:http`            |
|  `arbitrum-one:http`              |
|  `arbitrum-goerli:http`           |
|  `arbitrum-nova:http`             |
|  `polygon:http`                   |
|  `polygon-testnet:http`           |
|  `base-goerli:http`               |
|  `astar:http`                     |
|  `shiden:http`                    |
|  `shibuya:http`                   |
|  `optimism:http`                  |
|  `optimism-goerli:http`           |
|  `bsc:http`                       |
|  `bsc-testnet:http`               |
|  `fantom:http`                    |
|  `fantom-testnet:http`            |
  
Enable the RPC add-on like this:
```yaml
deploy:
  addons:
    rpc:
      - moonriver:http

scale:
  addons:
    rpc:
      max-rate: 10rps
```

## Processor configuration

With the addon successfully enabled, your squid will get a unique proxied endpoint to the requested network. Aquarium will set the `RPC_${Upper(network)}_${Upper(protocol)}` environment variable to its URL. For example, to configure the processor to use the RPC requested above call
```ts
processor.setDataSource({
  chain: process.env.RPC_MOONRIVER_HTTP,
  archive: /* archive URL */
})
```
