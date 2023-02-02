---
sidebar_position: 49
description: Use external APIs and IPFS from a squid
---

# External APIs and IPFS

Squid processor is a usual node.js process, so one can fetch data from external APIs or IPFS gateways within the `processor.run()` method. Normally, one uses API calls in combination with API keys set via [secrets](/deploy-squid/env-variables) when deployed to the Aquarium cloud service.

For reliable indexing of content stored in IPFS (e.g. NFT metadata) we recommend fetching from private production-grade IPFS gateways, e.g. provided by [Filebase](https://docs.filebase.com/ipfs/ipfs-gateways).

### Example

For example, one can enrich the indexed transaction with historical price data using the Coingecko API.

```ts
// ...
processor.run(new TypeormDatabase(), async (ctx) => {
  const burns: Burn[] = []
  for (let c of ctx.blocks) {
    for (let i of c.items) {
      burns.push(new Burn({
        id: formatID(c.header.height, i.transaction.hash),
        block: c.header.height,
        address: i.transaction.from,
        value: i.transaction.value,
        txHash: i.transaction.hash,
        price: await getETHPriceByDate(c.header.timestamp)
      }))
    }
  }
})

async function getETHPriceByDate(timestamp: number): Promise<bigint> {
  const formatted = moment(new Date(timestamp).toISOString()).format("DD-MM-yyyy")
  const res = await 
    axios.get(
        `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${formatted}&localization=false`
    )
  return res.data.market_data.current_price.usd
}
```
