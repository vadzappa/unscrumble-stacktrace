const fs = require('fs');
const stackTraceAnalyzer = require('./serverStackTraceAnalyzer');

exports.stackFromFile = (options, path, done) => {
	stackTraceAnalyzer.mapStackTrace(options, fs.readFileSync(path, { encoding: 'utf8' }), done);
};