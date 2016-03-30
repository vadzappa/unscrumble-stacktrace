/* globals document */
'use strict';

var _ = require('lodash'),
	$ = require('jquery'),
	moment = require('moment'),
	stackTraceHistory = require('./stackTraceHistory'),
	internals = {};

internals.removeHistoryItem = function(event) {
	event.preventDefault();
	event.stopPropagation();

	var $target = $(event.target),
		$parent = $target.closest('li'),
		historyItemId = $parent.data('id');

	$parent.remove();

	stackTraceHistory.removeFromHistory(historyItemId);
};
internals.loadHistoryItem = function(outputSelector, inputSelector) {
	return function(event) {
		event.preventDefault();
		event.stopPropagation();

		var $target = $(event.target),
			$parent = $target.closest('li'),
			historyItemId = $parent.data('id');

		stackTraceHistory
			.getStackTraceHistory()
			.then(function(history) {
				var historyItemFound = history.find(function(item) {
					return item.id === parseInt(historyItemId, 10);
				});
				if (historyItemFound) {
					$(outputSelector).val(historyItemFound.stack.parsed.join('\n'));
					$(inputSelector).val(historyItemFound.stack.original.join('\n'));
				}
			});
	};
};
internals.prepareHistoryItem = function(historyItem) {
	var listItem = $('<li>' +
			'<div class="history-data">' +
			'<div class="timestamp"></div>' +
			'<div class="details"></div>' +
			'</div>' +
			'<div class="history-actions">' +
			'<a href="#">X</a>' +
			'</div>' +
			'</li>'),
		date = new Date(historyItem.id);

	listItem.data('id', historyItem.id);
	listItem.find('.timestamp').text(moment(date).format('LT'));
	listItem.find('.details').text(historyItem.label);

	return listItem;
};
internals.historyDrawer = function(selector, history) {
	var historyContainer = $(selector),
		fragment = $(document.createDocumentFragment()),
		historyList = _.map(history, internals.prepareHistoryItem);

	_.reduce(historyList, function(fragment, listItem) {
		return fragment.prepend(listItem);
	}, fragment);

	historyContainer.prepend(fragment);
};

module.exports = function(selector, outputSelector, inputSelector) {
	var historyContainer = $(selector);
	historyContainer.on('click', '.history-actions a', internals.removeHistoryItem);
	historyContainer.on('click', 'li', internals.loadHistoryItem(outputSelector, inputSelector));
	return {
		historyListener: _.partial(internals.historyDrawer, selector),
		drawHistory: _.partial(internals.historyDrawer, selector)
	};
};