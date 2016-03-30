'use strict';

var _ = require('lodash'),
	serverFetcher = require('../fetcher/fetcher'),
	stackTraceAnalyzer = require('./stackTraceAnalyzer');

exports.mapStackTrace = function(options, stack, done) {
	var opts = _.extend({}, options, {fetcher: serverFetcher});
	stackTraceAnalyzer.mapStackTrace(opts, stack, done);
};