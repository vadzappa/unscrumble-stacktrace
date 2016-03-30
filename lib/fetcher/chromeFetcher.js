'use strict';

var async = require('async'),
	_ = require('lodash'),
	$ = require('jquery'),
	internals = {},
	cache = {};

internals.fetchFromUrl = function(url, next) {
	if (cache[url]) {
		return next(null, {
			url: url,
			content: cache[url]
		});
	}

	$.get({
		url: url,
		dataType: 'text',
		success: function(data) {
			cache[url] = data;
			next(null, {
				url: url,
				content: data
			});
		},
		error: function() {
			next(null, {
				url: url,
				content: ''
			});
		}
	});
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