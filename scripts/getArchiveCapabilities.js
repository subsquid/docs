axios = require('axios')

module.exports = getArchiveCapabilities

function getArchiveCapabilities(archiveUrl) {
	return getArchiveHeight(archiveUrl, (height) =>
		getWorkerUrl(archiveUrl, height, (workerUrl, height) =>
			getWorkerCapabilities(workerUrl, height)
		)
	)
}

function getArchiveHeight(archiveUrl, callback) {
	return axios.get(`${archiveUrl}/height`).then(ahdata => callback(ahdata.data))
}

function getWorkerUrl(archiveUrl, height, callback) {
	return height>0 ?
		axios.get(`${archiveUrl}/${height}/worker`).then(wdata => callback(wdata.data, height)) :
		Promise.resolve(callback(undefined, height))
}

function getWorkerCapabilities(workerUrl, height) {
	const capabilities = ['transactions', 'logs', 'stateDiffs', 'traces']
	if (height===0) {
		return Promise.resolve(Object.fromEntries(capabilities.map(c => [c, null])))
	}

	const postConfig = {
		headers: {
			'content-type': 'application/json',
			'accept': 'application/json'
		},
		validateStatus: null
	}

	function getWorkerCapability(capability) {
		return axios.post(workerUrl, `{"fromBlock": ${height}, "toBlock": ${height}, "${capability}": [{}]}`, postConfig)
			.then(response => {
				if (response.status===200) {
					return true
				}
				else if (response.status===400 && response.data.description===`"${capability.toLowerCase()}" data is not supported by this archive on requested block range`) {
					return false
				}
				else {
					console.error(response)
					throw new Error(`Unrecognized response to request on capability ${capability}`)
				}
			})
	}

	return Promise.all(capabilities.map(getWorkerCapability))
		.then(caps => Object.fromEntries(caps.map((cv, i) => [capabilities[i], cv])))
}

