/**
 * Created by vadzim on 3/28/2016.
 */
'use strict';

var extractStack = require('./stackExtractor'),
	analyzeStackTrace = require('./stackAnalyzer'),
	printStackTo = require('./stackPrinter'),
	displayLoading = require('./displayLoading');

module.exports = function unscrambleWrapper(origin, output) {
	return function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		var toggleLoading = displayLoading.bind(null, '.loading', 'show');

		toggleLoading()
			.then(extractStack.bind(null, origin))
			.then(analyzeStackTrace)
			.then(printStackTo(output))
			.then(toggleLoading);
	};
};