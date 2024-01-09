const $ = require('jquery');
const analyzeStackTrace = require('./stackAnalyzer');
const toggleLoading = require('./toggleLoading');
const { saveStackTraceHistory } = require('./stackTraceHistory');

module.exports = (origin, output) => async (ev) => {
	ev.preventDefault();
	ev.stopPropagation();

	toggleLoading('.loading', 'show');

	const trace = $(origin).val();
	const analyzed = await analyzeStackTrace(trace);

	await saveStackTraceHistory(analyzed);

	$(output).val(analyzed.parsed.join('\n'));

	toggleLoading('.loading', 'show');
};