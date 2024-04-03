registry = require('@subsquid/archive-registry')

rows = []
for (const arch of registry.archivesRegistrySubstrate().archives) {
	let network = arch.network
	let fireSquidCommand, arrowSquidCommand
	for (const prov of arch.providers) {
		if (prov.release === 'FireSquid') {
			try {
				let url = registry.lookupArchive(network)
				if (url !== registry.lookupArchive(network, {release: 'FireSquid'})) {
					throw new Error(`FireSquid is not the default release for ${network}`)
				}
				fireSquidCommand = `\`lookupArchive('${network}')\``
			}
			catch (error) {
				if (error.message === `There are multiple networks with name ${network}. Provide network type to disambiguate.`) {
					let url = registry.lookupArchive(network, {type: 'Substrate'}) // no catching here
					if (url !== registry.lookupArchive(network, {type: 'Substrate', release: 'FireSquid'})) {
						throw new Error(`FireSquid is not the default release for ${network}`)
					}
					fireSquidCommand = `\`lookupArchive('${network}',\` \`{type: 'Substrate'})\``
				}
				else {
					throw error
				}
			}
		}
		else if (prov.release === 'ArrowSquid') {
			try {
				let url = registry.lookupArchive(network, {release: 'ArrowSquid'})
				arrowSquidCommand = `\`lookupArchive('${network}',\` \`{release: 'ArrowSquid'})\``
			}
			catch (error) {
				if (error.message === `There are multiple networks with name ${network}. Provide network type to disambiguate.`) {
					let url = registry.lookupArchive(network, {type: 'Substrate', release: 'ArrowSquid'}) // no catching here
					arrowSquidCommand = `\`lookupArchive('${network}',\` \`{type: 'Substrate',\` \`release: 'ArrowSquid'})\``
				}
			}
		}
		else {
			throw new Error(`unknown release ${prov.release} for network ${network}`)
		}
	}
	fireSquidCommand ??= 'not available'
	arrowSquidCommand ??= 'temporarily unavailable'

	rows.push({ network, fireSquidCommand, arrowSquidCommand })
}

maxWidths = {
	network: Math.max(...rows.map(r => r.network.length)),
	fireSquidCommand: Math.max(...rows.map(r => r.fireSquidCommand.length)),
	arrowSquidCommand: Math.max(...rows.map(r => r.arrowSquidCommand.length))
}

const fields = ['network', 'arrowSquidCommand']

function padFieldContents(fieldContents, nominalWidth) {
	return ' ' + fieldContents + ' '.repeat(nominalWidth-fieldContents.length+1)
}

function toTableRow(row) {
	return '|' + fields.map(fn => padFieldContents(row[fn], maxWidths[fn])).join('|') + '|'
}

const header = toTableRow({
	network: 'Network',
	arrowSquidCommand: 'ArrowSquid lookup command'
}) + '\n|' + fields.map(fn => ':' + '-'.repeat(maxWidths[fn]) + ':').join('|') + '|\n'

const table = rows.map(r => toTableRow(r)).join('\n')

console.log(header + table)
