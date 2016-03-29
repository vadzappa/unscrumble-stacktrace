'use strict';

var extractStack = require('./stackExtractor'),
	analyzeStackTrace = require('./stackAnalyzer'),
	printStackTo = require('./stackPrinter'),
	displayLoading = require('./displayLoading'),
	saveStackTraceHistory = require('./stackTraceHistory').saveStackTraceHistory;

module.exports = function unscrambleWrapper(origin, output) {
	return function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		var toggleLoading = displayLoading.bind(null, '.loading', 'show');

		toggleLoading()
			.then(extractStack.bind(null, origin))
			.then(analyzeStackTrace)
			.then(saveStackTraceHistory)
			.then(printStackTo(output))
			.then(toggleLoading);
	};
};