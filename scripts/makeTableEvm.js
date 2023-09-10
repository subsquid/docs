registry = require('@subsquid/archive-registry')
getArchiveCapabilities = require('../scripts/getArchiveCapabilities')

function getAValidArrowSquidCommandAndUrl(network, archEntry) {
	let command, url
	for (const prov of archEntry.providers) {
		if (prov.release === 'ArrowSquid') {
			try {
				url = registry.lookupArchive(network)
				if (url !== registry.lookupArchive(network, {release: 'ArrowSquid'})) {
					throw new Error(`ArrowSquid is not the default release for ${network}`)
				}
				command = `\`lookupArchive('${network}')\``
			}
			catch (error) {
				if (error.message === `There are multiple networks with name ${network}. Provide network type to disambiguate.`) {
					url = registry.lookupArchive(network, {type: 'EVM'}) // no catching here
					if (url !== registry.lookupArchive(network, {type: 'EVM', release: 'ArrowSquid'})) {
						throw new Error(`ArrowSquid is not the default release for ${network}`)
					}
					command = `\`lookupArchive('${network}',\` \`{type: 'EVM'})\``
				}
			}
		}
	}
	return command && { command, url }
}

rows = []
for (const arch of registry.archivesRegistryEVM().archives) {
	const arrowSquidCommandAndUrl = getAValidArrowSquidCommandAndUrl(arch.network, arch)
	if (arrowSquidCommandAndUrl) {
		rows.push({
			network: arch.network,
			...arrowSquidCommandAndUrl
		})
	}
}

Promise.all(rows.map(({network, command, url}) => {
	return getArchiveCapabilities(url)
		.then(caps => {
			if ((caps.transactions!==null && !caps.transactions) || (caps.logs!==null && !caps.logs)) {
				throw new Error(`Archive for ${network} reports being incapable of handling logs or transactions`)
			}
			return {
				network,
				command,
				stateDiffs: caps.stateDiffs===null ? '?' : (caps.stateDiffs ? 'Y' : ' '),
				traces: caps.traces===null ? '?' : (caps.traces ? 'Y' : ' ')
			}
		})
}))
.then(res => { console.log(formatTable(res)) })
.then(() => process.exit(0))

function formatTable(rows) {
	const fields = ['network', 'stateDiffs', 'traces', 'command']
	const fieldsHeaders = {
		network: 'Network',
		stateDiffs: 'State diffs',
		traces: 'Traces',
		command: 'Lookup command'
	}

	const maxWidths = Object.fromEntries(fields.map(f => [f, Math.max(fieldsHeaders[f].length, ...rows.map(r => r[f].length))]))

	function padFieldContents(fieldContents, nominalWidth) {
		return ' ' + fieldContents + ' '.repeat(nominalWidth-fieldContents.length+1)
	}

	function toTableRow(row) {
		return '|' + fields.map(fn => padFieldContents(row[fn], maxWidths[fn])).join('|') + '|'
	}

	const header = toTableRow(fieldsHeaders) + '\n|' + fields.map(fn => ':' + '-'.repeat(maxWidths[fn]) + ':').join('|') + '|\n'
	const table = rows.map(r => toTableRow(r)).join('\n')

	return header + table
}
