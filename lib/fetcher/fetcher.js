'use strict';

var async = require('async'),
	_ = require('lodash'),
	URL = require('url'),
	internals = {},
	cache = {};

internals.fetchFromUrl = function(url, next) {
	if (cache[url]) {
		return next(null, {
			url: url,
			content: cache[url]
		});
	}
	var urlParts = URL.parse(url, false),
		requestLib = require(urlParts.protocol.replace(/:/ig, '')),
		request = requestLib.request(urlParts, function(res) {
			var data = '';
			res.on('data', function(chunk) {
				data += chunk.toString();
			});
			res.on('end', function() {
				cache[url] = data;
				next(null, {
					url: url,
					content: data
				});
			});
		});
	request.on('error', function(error) {
		next(error);
	});
	request.end();
};

exports.fetchAll = function(urls, next) {
	var steps = _.map(urls, function(url) {
		return _.partial(internals.fetchFromUrl, url);
	});

	async.parallel(steps, function(error, results) {
		if (error) {
			return next(error);
		}

		return next(null, _.transform(results, function(mapUri, result) {
			mapUri[result.url] = result.content;
			return mapUri;
		}, {}));
	});
};

exports.fetchSingle = function(url, done) {
	return internals.fetchFromUrl(url, done);
};