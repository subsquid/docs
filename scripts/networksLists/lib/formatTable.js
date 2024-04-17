module.exports = formatTable

/**
 * @param {{[field: string]: string}[]} rows - The rows of the table
 * @param {{[field: string]: string}} fieldsHeaders - The headers of the fields of the table
 * @param {string[]} fields - The fields of the table
 * @returns {string} The formatted table
 */
function formatTable(rows, fieldsHeaders, fields) {
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
