/* globals document */
const $ = require('jquery');
const moment = require('moment');
const stackTraceHistory = require('./stackTraceHistory');
const internals = {};

internals.removeHistoryItem = async (event) => {
	event.preventDefault();
	event.stopPropagation();

	const $target = $(event.target);
	const $parent = $target.closest('li');
	const historyItemId = $parent.data('id');

	$parent.remove();

	await stackTraceHistory.removeFromHistory(historyItemId);
};

internals.loadHistoryItem = (outputSelector, inputSelector) => async (event) => {
	event.preventDefault();
	event.stopPropagation();

	const $target = $(event.target);
	const $parent = $target.closest('li');
	const historyItemId = $parent.data('id');
	const history = await stackTraceHistory.getStackTraceHistory();
	const historyItemFound = history.find(item => item.id === parseInt(historyItemId, 10));

	if (historyItemFound) {
		$(outputSelector).val(historyItemFound.stack.parsed.join('\n'));
		$(inputSelector).val(historyItemFound.stack.original.join('\n'));
	}
};

internals.prepareHistoryItem = historyItem => {
	const listItem = $('<li>' +
		'<div class="history-data">' +
		'<div class="timestamp"></div>' +
		'<div class="details"></div>' +
		'</div>' +
		'<div class="history-actions">' +
		'<a href="#">X</a>' +
		'</div>' +
		'</li>');
	const date = new Date(historyItem.id);

	listItem.data('id', historyItem.id);
	listItem.find('.timestamp').text(moment(date).format('LT'));
	listItem.find('.details').text(historyItem.label);

	return listItem;
};

internals.redraw = (selector, history) => {
	const historyContainer = $(selector);
	const fragment = $(document.createDocumentFragment());
	const historyList = history ? history.map(internals.prepareHistoryItem) : [];

	historyList.reduce((fragment, listItem) => fragment.prepend(listItem), fragment);

	historyContainer.prepend(fragment);
};

module.exports = (selector, outputSelector, inputSelector) => {
	const historyContainer = $(selector);

	historyContainer.on('click', '.history-actions a', internals.removeHistoryItem);
	historyContainer.on('click', 'li', internals.loadHistoryItem(outputSelector, inputSelector));

	return {
		redraw: (history) => internals.redraw(selector, history),
	};
};