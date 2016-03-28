/**
 * Created by vadzim on 3/28/2016.
 */
'use strict';

var _ = require('lodash'),
	stackTraceAnalyzer = require('../stackTraceAnalyzer'),
	chromeFetcher = require('./chromeFetcher');

exports.mapStackTrace = function(options, stack, done) {
	var opts = _.extend({}, options, {fetcher: chromeFetcher});
	stackTraceAnalyzer.mapStackTrace(opts, stack, done);
};