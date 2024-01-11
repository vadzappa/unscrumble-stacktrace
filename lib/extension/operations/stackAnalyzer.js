const chromeStackAnalyzer = require('../../analyzer/chromeStackAnalyzer');

module.exports = stack => new Promise((resolve, reject) => {
	chromeStackAnalyzer.mapStackTrace({}, stack, (error, result) => {
		if (error) {
			return reject(error);
		}
		resolve(result);
	});
});