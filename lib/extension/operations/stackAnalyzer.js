'use strict';

var chromeStackAnalyzer = require('../../analyzer/chromeStackAnalyzer');

module.exports = function(stack) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			chromeStackAnalyzer.mapStackTrace({browser: 'chrome'}, stack, function(error, result) {
				if (error) {
					return reject(error);
				}
				resolve(result);
			});
		});
	});
};