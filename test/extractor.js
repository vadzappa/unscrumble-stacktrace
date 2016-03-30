var stackTraceAnalyzer = require('../lib/analyzer/fileStackTraceAnalyzer');
stackTraceAnalyzer.stackFromFile({browser: 'chrome'}, '../stack.log', function(error, stack) {
	console.log(stack.join('\n'));
});