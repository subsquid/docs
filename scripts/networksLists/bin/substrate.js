const substrateJsonUrl = 'https://cdn.subsquid.io/archives/substrate.json'

require('axios')
	.get(substrateJsonUrl)
	.then(
		resp => {
			console.log(substrateNetworksList(resp.data.archives))
		},
		e => {
			const errorDescription = e.code==='ERR_BAD_REQUEST' ? `${e.code} ${e.response.status}` : e.code
			console.error(`Retrieving ${substrateJsonUrl} failed with ${errorDescription}`)
		}
	)

function substrateNetworksList(networksJson) {
	const nameMapping = arch => {
		switch (arch.network) {
			case 'asset-hub-kusama':
			case 'asset-hub-polkadot':
				return `${arch.chainName} (*)`
			case 'avail':
				return `${arch.chainName} (**)`
			default:
				return arch.chainName
		}
	}
	const rows = networksJson.map(a => ({
		network: nameMapping(a),
		url: a.providers.find(p => p.provider==='subsquid' && p.release==='ArrowSquid')?.dataSourceUrl
	}))
	const header = {
		network: 'Network',
		url: 'Gateway URL'
	}
	return require('../lib/formatTable')(rows, header, ['network', 'url'])
}
