---
sidebar_position: 80
description: Use external APIs and IPFS from a squid
---

# External APIs and IPFS

Squid processor is a usual node.js process, so one can fetch data from external APIs or IPFS gateways within the `processor.run()` method. Normally, one uses API calls in combination with API keys set via [secrets](/deploy-squid/env-variables) when deployed to the Aquarium cloud service.

### Example

For example, one can enrich the indexed transaction with historical price data using the Coingecko API.

```ts
// ...
processor.run(new TypeormDatabase(), async (ctx) => {
  const burns: Burn[] = []
  for (let c of ctx.blocks) {
    for (let txn of c.transactions) {
      burns.push(new Burn({
        id: formatID(c.header.height, txn.hash),
        block: c.header.height,
        address: txn.from,
        value: txn.value,
        txHash: txn.hash,
        price: await getETHPriceByDate(c.header.timestamp)
      }))
    }
  }
})

async function getETHPriceByDate(timestamp: number): Promise<bigint> {
  const formatted = moment(new Date(timestamp).toISOString()).format("DD-MM-yyyy")
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${formatted}&localization=false`
  )
  return res.data.market_data.current_price.usd
}
```

## IPFS fetching

For reliable indexing of content stored on IPFS (e.g. NFT metadata) we recommend fetching from dedicated IPFS gateways, e.g. provided by [Cloudflare](https://www.cloudflare.com/web3/).

For a more elaborate example of with IPFS gateway and external API calls, inspect the [BAYC NFT indexing squid](https://github.com/subsquid-labs/ipfs-example).

### Example

```typescript
// FIXME: replace with a dedicated gateway
export const BASE_URL = 'https://cloudflare-ipfs.com/ipfs/'

export const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 5000,
  httpsAgent: new https.Agent({ keepAlive: true }),
})

export const fetchMetadata = async (
  ctx: DataHandlerHandlerContext<Store, typeof fieldSelection>,
  cid: string
): Promise<any | null> => {
  try {
    const { status, data } = await api.get(`${BASE_URL}/${cid}`)
    ctx.log.info(`[IPFS] ${status} CID: ${cid}`)
    if (status < 400) {
      return data
    }
  } catch (e) {
    ctx.log.warn(
      `[IPFS] ERROR CID: ${cid} TRY ${(e as Error).message}`
    )
  }
  return null
}

processor.run(new TypeormDatabase(), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let log of c.logs) {
      // track and decode NFT events to get CID
      // use fetchMetadata() to fetch metadata
    }
  }
})
```


