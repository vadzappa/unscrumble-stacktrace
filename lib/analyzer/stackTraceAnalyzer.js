const _ = require('lodash');
const async = require('async');
const mapFilesFetcher = require('../parser/mapFilesFetcher');
const sourceMapConsumer = require('source-map');
const STACK_FIELDS = 5;
const internals = {};

internals.detectStackRegex = userAgent => {
	if (internals.isFirefox(userAgent)) {
		return /@(.*):([0-9]+):([0-9]+)/;
	}
	return /^ +at\s*(.+)\((.*):([0-9]+):([0-9]+)/;
};

internals.isFirefox = userAgent => userAgent.toLowerCase().indexOf('firefox') > -1;

internals.formatLine = (source, line, column, name) => "    at " + (name ? name : "(unknown)") +
	" (" + source + ":" + line + ":" + column + ")";

internals.processSourceMaps = (stackInfo, mapForUri, done) => {
	const parsedStack = [];
	const result = { original: stackInfo.lines, parsed: parsedStack };

	let map;

	for (let i = 0; i < stackInfo.lines.length; i++) {
		const row = stackInfo.rows[i];

		if (row) {
			const originalName = row[1];
			const uri = row[2];
			const line = parseInt(row[3], 10);
			const column = parseInt(row[4], 10);

			map = mapForUri[uri];

			try {
				if (map) {
					JSON.parse(map);
				}
			} catch (e) {
				map = false;
				delete mapForUri[uri];
			}

			if (map) {
				const smc = new sourceMapConsumer.SourceMapConsumer(map);
				const origPos = smc.originalPositionFor({ line: line, column: column });

				parsedStack.push(internals.formatLine(origPos.source, origPos.line, origPos.column, origPos.name || originalName));
			} else {
				parsedStack.push(internals.formatLine(uri, line, column, originalName));
			}
		} else {
			parsedStack.push(stackInfo.lines[i]);
		}
	}

	done(null, result);
};

exports.mapStackTrace = (options, stack, done) => {
	const scriptsUrls = [];
	const stackInfo = { lines: [], rows: [] };
	const fetcher = mapFilesFetcher(options.fetcher);
	const regex = internals.detectStackRegex(options.browser);

	stackInfo.lines = stack.split(/\n|\r/ig);

	for (let i = 0; i < stackInfo.lines.length; i++) {
		const fields = stackInfo.lines[i].match(regex);

		if (fields && fields.length === STACK_FIELDS) {
			stackInfo.rows[i] = fields;
			scriptsUrls.push(fields[2]);
		}
	}


	const fetchMaps = _.partial(async.parallel, scriptsUrls.map(scriptUrl => _.partial(fetcher, scriptUrl)));

	async.waterfall([
		fetchMaps,
		(results, next) => {
			next(null, results.reduce((result, mapsUri) => {
				mapsUri[result.url] = result.content;

				return mapsUri;
			}, {}));
		},
		_.partial(internals.processSourceMaps, stackInfo),
	], done);
};