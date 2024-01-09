const $ = require('jquery');
const makeFetcher = require('./generic');
const cache = {};

module.exports = makeFetcher((url, next) => {
	if (cache[url]) {
		return next(null, {
			url,
			content: cache[url],
		});
	}

	$.get({
		url,
		dataType: 'text',
		success: data => {
			cache[url] = data;
			next(null, {
				url,
				content: data,
			});
		},
		error: () => {
			if (cache[url]) {
				return next(null, {
					url,
					content: cache[url],
				});
			}

			return next(null, {
				url,
				content: '',
			});
		},
	});
});