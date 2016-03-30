'use strict';

var _ = require('lodash'),
	stackTraceAnalyzer = require('./stackTraceAnalyzer'),
	chromeFetcher = require('../fetcher/chromeFetcher');

exports.mapStackTrace = function(options, stack, done) {
	var opts = _.extend({}, options, {fetcher: chromeFetcher});
	stackTraceAnalyzer.mapStackTrace(opts, stack, done);
};