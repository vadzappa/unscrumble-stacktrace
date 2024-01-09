const serverFetcher = require('../fetcher/fetcher');
const stackTraceAnalyzer = require('./stackTraceAnalyzer');

exports.mapStackTrace = (options, stack, done) => {
	stackTraceAnalyzer.mapStackTrace({ ...options, fetcher: serverFetcher }, stack, done);
};