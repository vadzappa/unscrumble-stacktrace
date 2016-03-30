/* globals chrome */
var storageArea = chrome.storage.local,
	_ = require('lodash'),
	historyKey = 'unscrambler-history';

exports.whenChanged = function(handler) {
	chrome.storage.onChanged.addListener(function(changes, areaName) {
		if (areaName !== 'local') {
			return;
		}
		if (!_.has(changes, historyKey)) {
			return;
		}
		var newValue = changes[historyKey].newValue,
			oldValue = changes[historyKey].oldValue,
			changesMade = _.differenceWith(newValue, oldValue, function(first, second) {
				return _.isEqual(first.id, second.id);
			});
		handler(changesMade);
	});
};

exports.removeFromHistory = function(historyItemId) {
	return new Promise(function(resolve) {
		exports.getStackTraceHistory()
			.then(function(history) {
				if (!_.isArray(history)) {
					return resolve();
				}
				var historyItem = _.find(history, {id: historyItemId});
				history = _.without(history, historyItem);
				var update = {};
				update[historyKey] = history;
				chrome.storage.local.set(update, resolve);
			});
	});
};

exports.getStackTraceHistory = function() {
	return new Promise(function(resolve) {
		storageArea.get(historyKey, function(allKeys) {
			resolve(allKeys[historyKey]);
		});
	});
};

exports.saveStackTraceHistory = function(stack) {
	return new Promise(function(resolve) {
		var date = new Date(),
			id = date.getTime();

		exports.getStackTraceHistory()
			.then(function(history) {
				if (!_.isArray(history)) {
					history = [];
				}
				history.push({
					id: id,
					label: _.first(stack.original),
					stack: stack
				});
				var update = {};
				update[historyKey] = history;
				chrome.storage.local.set(update, _.partial(resolve, stack));
			});
	});
};