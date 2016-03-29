/* globals document */
'use strict';

var _ = require('lodash'),
	formatDate = function(date) {
		var datePart = [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/'),
			timePart = [date.getHours(), date.getMinutes()].join(':');
		return [datePart, timePart].join(' ');
	},
	prepareHistoryItem = function(historyItem) {
		var li = document.createElement('li'),
			date = new Date(historyItem.id),
			timestamp = document.createElement('div'),
			details = document.createElement('div');

		li.setAttribute('data-id', historyItem.id);
		timestamp.className = 'timestamp';
		details.className = 'details';

		timestamp.appendChild(document.createTextNode(formatDate(date)));
		details.appendChild(document.createTextNode(historyItem.label));

		li.appendChild(timestamp);
		li.appendChild(details);
		return li;
	},
	historyDrawer = function(selector, history) {
		var historyContainer = document.querySelector(selector),
			fragment = document.createDocumentFragment();

		history
			.map(prepareHistoryItem)
			.forEach(function(historyItem) {
				fragment.insertBefore(historyItem, fragment.firstChild);
			});

		historyContainer.insertBefore(fragment, historyContainer.firstChild);
	};

module.exports = function(selector) {
	return {
		historyListener: _.bind(historyDrawer, null, selector),
		drawHistory: _.bind(historyDrawer, null, selector)
	};
};