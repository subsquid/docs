const help =
`This script expects the RPC chains JSON at its stdin. Supply it e.g. with\n
 $ curl -s -H 'Authorization: Bearer <your_token>' https://app.subsquid.io/api/v1/orgs/<your_org>/rpc/chains | node scripts/networksLists/bin/rpcProxy.js\n
Consult your browser's dev console at https://app.subsquid.io/rpc to get the token.`

if (process.argv[2] === '--help') {
	console.log(help)
	process.exit(0)
}

const inputChunks = []

process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin.on('data', chunk => {
	inputChunks.push(chunk)
})
process.stdin.on('end', () => {
	const inputJSON = inputChunks.join('')
	try {
		const parsedData = JSON.parse(inputJSON)
		console.log(makeRpcProxyTables(parsedData.payload))
	}
	catch (e) {
		console.error('Invalid JSON input, see --help', e)
		process.exit(1)
	}
})

function makeRpcProxyTables(allChains) {
	const uncategorizedNetworks = allChains.filter(r => r.type!='evm' && r.type!='substrate' && r.type!='solana')
	if (uncategorizedNetworks.length > 0) {
		console.error('Found uncategorized networks', uncategorizedNetworks)
	}
	return [
		makeRpcProxyTable(allChains.filter(r => r.type=='evm')),
		makeRpcProxyTable(allChains.filter(r => r.type=='substrate')),
		makeRpcProxyTable(allChains.filter(r => r.type=='solana'))
	].join('\n\n')
}

function makeRpcProxyTable(chains) {
	const urlType = a => {
		if (a.url.startsWith('https')) {
			return 'http'
		}
		else {
			console.error('Got a network with an unsupported protocol', a)
			process.exit(1)
		}
	}

	const rows = chains.map(a => ({
		network: a.title,
		alias: `\`${a.id}.${urlType(a)}\``
	}))
	const header = {
		network: 'Network name',
		alias: 'network.protocol'
	}
	return require('../lib/formatTable')(rows, header, ['network', 'alias'])
}
