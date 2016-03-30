'use strict';

var fs = require('fs'),
	stackTraceAnalyzer = require('./serverStackTraceAnalyzer');

exports.stackFromFile = function(options, path, done) {
	var fileContent = fs.readFileSync(path, {encoding: 'utf8'});
	stackTraceAnalyzer.mapStackTrace(options, fileContent, done);
};