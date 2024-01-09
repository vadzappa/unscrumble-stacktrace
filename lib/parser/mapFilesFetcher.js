const async = require('async');
const _ = require('lodash');
const mapFileParser = require('./mapFileParser');
const domainsReplacementsStorage = require('../extension/operations/domainsReplacementsStorage');
const internals = {};

const findOriginReplacement = async (origin) => {
	const all = await domainsReplacementsStorage.getAll();
	const existing = all.find(item => item.from === origin);

	if (!existing) {
		return origin;
	}

	return existing.to;
};

internals.detectMapFileUrl = async (scriptUrl, mapFileUrl) => {
	const absUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

	if (!absUrlRegex.test(mapFileUrl)) {
		// relative url; according to sourcemaps spec is 'source origin'
		let origin;

		const lastSlash = scriptUrl.lastIndexOf('/');
		if (lastSlash !== -1) {
			origin = scriptUrl.slice(0, lastSlash + 1);

			const originParts = origin.split('//');
			const domainParts = originParts[1].split('/');

			domainParts[0] = await findOriginReplacement(domainParts[0]);

			originParts[1] = domainParts.join('/');

			origin = originParts.join('//');

			mapFileUrl = origin + mapFileUrl;
		}
	}

	const urlParts = scriptUrl.split('?');

	mapFileUrl += urlParts.length > 1 ? '?' + urlParts[1] : '';

	return mapFileUrl;
};

internals.getMapFileContent = (fetcher, scriptUrl, mapFileInfo, next) => {
	if (mapFileInfo.content) {
		mapFileInfo.url = scriptUrl;
		return next(null, mapFileInfo);
	}

	internals.detectMapFileUrl(scriptUrl, mapFileInfo.url)
		.then(mapUrl => fetcher.fetchSingle(mapUrl, (error, mapFileDetails) => {
			if (mapFileDetails) {
				mapFileDetails.url = scriptUrl;
			}
			next(error, mapFileDetails);
		}))
		.catch(err => next(err));
};

module.exports = fetcher => (scriptUrl, next) => {
	async.waterfall([_.partial(fetcher.fetchSingle, scriptUrl), (mapUrl, next) => {
		if (_.isNil(mapUrl.content)) {
			next(Error('Content is not provided for parsing!'));
		} else {
			next(null, mapUrl.content);
		}
	}, mapFileParser.getMapFileInfo, _.partial(internals.getMapFileContent, fetcher, scriptUrl)], next);
};