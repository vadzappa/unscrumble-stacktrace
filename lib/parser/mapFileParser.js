exports.getMapFileInfo = (content, next) => {
	const match = content.match("//# sourceMappingURL=(.*)[\\s]*$", "m");
	const result = {};

	if (match && match.length === 2) {
		const mapUri = match[1];
		const embeddedSourceMap = mapUri.match("data:application/json;base64,(.*)");

		if (embeddedSourceMap && embeddedSourceMap[1]) {
			result.content = new Buffer(embeddedSourceMap[1], 'base64').toString('utf8');
		} else {
			result.url = mapUri;
		}
	}
	next(null, result);
};