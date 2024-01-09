const async = require('async');
const _ = require('lodash');

module.exports = (fetchSingle) => ({
	fetchAll: (urls, next) => {
		const steps = urls.map(url => _.partial(fetchSingle, url));

		async.parallel(steps, (error, results) => {
			if (error) {
				return next(error);
			}

			return next(null, results.reduce((result, mapUri) => {
				mapUri[result.url] = result.content;

				return mapUri;
			}, {}));
		});
	},
	fetchSingle,
});
