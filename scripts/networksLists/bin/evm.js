main('https://cdn.subsquid.io/archives/evm.json')

async function main(evmJsonUrl) {
	let resp
	try {
		resp = await require('axios').get(evmJsonUrl)
	}
	catch (e) {
		const errorDescription = e.code==='ERR_BAD_REQUEST' ? `${e.code} ${e.response.status}` : e.code
		console.error(`Retrieving ${evmJsonUrl} failed with ${errorDescription}`)
	}

	const rows = await evmNetworksRows(resp.data.archives)

	const header = {
		network: 'Network',
		chainId: 'Chain ID',
		stateDiffs: 'State diffs',
		traces: 'Traces',
		url: 'Gateway URL'
	}
	console.log(require('../lib/formatTable')(rows, header, ['network', 'chainId', 'stateDiffs', 'traces', 'url']))
}

async function evmNetworksRows(networksJson) {
	const nameMapping = arch => {
		switch (arch.network) {
			case 'astar':
			case 'moonbase':
			case 'moonbeam':
			case 'moonriver':
			case 'shibuya-testnet':
			case 'shiden-mainnet':
				return `${arch.chainName} (!)`
			case 'bitfinity-testnet':
				return `${arch.chainName} (*1)`
			case 'bittensor-mainnet-evm':
				return `${arch.chainName} (*2)`
			case 'bittensor-testnet-evm':
				return `${arch.chainName} (*3)`
			case 'crossfi-testnet':
			case 'crossfi-mainnet':
				return `${arch.chainName} (*4)`
			case 'hyperliquid-testnet':
				return `${arch.chainName} (*5)`
			case 'neon-devnet':
				return `${arch.chainName} (*6)`
			default:
				return arch.chainName
		}
	}

	const minirows = networksJson.map(a => ({
		network: nameMapping(a),
		chainId: a.chainId != null ? a.chainId.toString() : '',
		url: a.providers.find(p => p.provider==='subsquid' && p.release==='ArrowSquid')?.dataSourceUrl
	}))

	const capsMapping = (network, capName, capIsPresent) => {
		if (capName==='stateDiffs') {
			switch (network) {
				case 'bitgert-mainnet':
					return '<UpToBlockTooltip tip="4298094">?</UpToBlockTooltip>'
				case 'optimism-mainnet':
					return capIsPresent ? '<FromBlockTooltip tip="105235063">✓</FromBlockTooltip>' : ' '
				default:
					return capIsPresent ? '✓' : ' '
			}
		}
		if (capName==='traces') {
			switch (network) {
				case 'arbitrum-sepolia':
					return '<UpToBlockTooltip tip="55667987">?</UpToBlockTooltip>'
				case 'zksync-mainnet':
					return capIsPresent ? '<FromBlockTooltip tip="15500000">✓</FromBlockTooltip>' : ' '
        case 'metis-mainnet':
          return capIsPresent ? '<ExceptOnBlocksTooltip gapStart="16861274" gapEnd="16861286">✓</ExceptOnBlocksTooltip>' : ' '
				default:
					return capIsPresent ? '✓' : ' '
			}
		}
	}

	getArchiveCapabilities = require('../lib/getArchiveCapabilities')
	const booleanCaps = await Promise.all(minirows.map(r => getArchiveCapabilities(r.url)))
	const stringCaps = booleanCaps.map((c, i) => Object.fromEntries(Object.entries(c).map(([k, v]) => [k, capsMapping(networksJson[i].network, k, v)])))

	return minirows.map((r, i) => ({
		...r,
		...stringCaps[i]
	}))
}
