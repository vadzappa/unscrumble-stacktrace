/**
 * Created by vadzim on 3/28/2016.
 */
'use strict';

var _ = require('lodash'),
	serverFetcher = require('./fetcher'),
	stackTraceAnalyzer = require('./stackTraceAnalyzer');

exports.mapStackTrace = function(options, stack, done) {
	var opts = _.extend({}, options, {fetcher: serverFetcher});
	stackTraceAnalyzer.mapStackTrace(opts, stack, done);
};