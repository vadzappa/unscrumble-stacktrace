/**
 * Created by vadzim on 3/28/2016.
 */
'use strict';

var async = require('async'),
	_ = require('lodash'),
	internals = {},
	cache = {};

internals.fetchFromUrl = function(url, next) {
	if (cache[url]) {
		return next(null, {
			url: url,
			content: cache[url]
		});
	}

	var oReq = new XMLHttpRequest(),
		reqListener = function() {
			cache[url] = this.responseText;
			next(null, {
				url: url,
				content: this.responseText
			});
		};
	oReq.addEventListener('load', reqListener);
	oReq.open('GET', url);
	oReq.send();
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