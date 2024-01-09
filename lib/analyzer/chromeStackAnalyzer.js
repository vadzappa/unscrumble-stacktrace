const stackTraceAnalyzer = require('./stackTraceAnalyzer');
const chromeFetcher = require('../fetcher/chromeFetcher');

exports.mapStackTrace = (options, stack, done) => {
	stackTraceAnalyzer.mapStackTrace({ ...options, fetcher: chromeFetcher }, stack, done);
};