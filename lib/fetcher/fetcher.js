const URL = require('url');
const requesters = {
	https: require('https'),
	http: require('http'),
};
const makeFetcher = require('./generic');
const cache = {};

module.exports = makeFetcher((url, next) => {
	if (cache[url]) {
		return next(null, {
			url: url,
			content: cache[url],
		});
	}
	const urlParts = URL.parse(url, false);
	const protocol = urlParts.protocol.replace(/:/ig, '');
	const requestLib = requesters[protocol] || requesters.https;
	const request = requestLib.request(urlParts, res => {
		let data = '';

		res.on('data', chunk => {
			data += chunk.toString();
		});
		res.on('end', () => {
			cache[url] = data;
			next(null, {
				url: url,
				content: data,
			});
		});
	});
	request.on('error', error => next(error));
	request.end();
});