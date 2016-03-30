var stackTraceAnalyzer = require('../lib/analyzer/fileStackTraceAnalyzer');
stackTraceAnalyzer.stackFromFile({browser: 'chrome'}, '../stack.log', function(error, stack) {
	console.log(stack.original.join('\n'));
	console.log(stack.parsed.join('\n'));
});