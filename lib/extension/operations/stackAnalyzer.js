const chromeStackAnalyzer = require('../../analyzer/chromeStackAnalyzer');

module.exports = stack => new Promise((resolve, reject) => {
	setTimeout(() => {
		chromeStackAnalyzer.mapStackTrace({ browser: 'chrome' }, stack, (error, result) => {
			if (error) {
				return reject(error);
			}
			resolve(result);
		});
	});
});