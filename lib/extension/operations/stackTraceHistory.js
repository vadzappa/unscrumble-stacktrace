/* globals chrome */
const storageArea = chrome.storage.local;
const _ = require('lodash');
const historyKey = 'unscrambler-history';

exports.whenChanged = handler => {
	chrome.storage.onChanged.addListener((changes, areaName) => {
		if (areaName !== 'local') {
			return;
		}

		if (!_.has(changes, historyKey)) {
			return;
		}

		const newValue = changes[historyKey].newValue;
		const oldValue = changes[historyKey].oldValue;
		const changesMade = _.differenceWith(newValue, oldValue, (first, second) => _.isEqual(first.id, second.id));

		handler(changesMade);
	});
};

exports.removeFromHistory = async (historyItemId) => {
	let history = await exports.getStackTraceHistory();

	if (!Array.isArray(history)) {
		return;
	}

	const historyItem = _.find(history, { id: historyItemId });

	history = _.without(history, historyItem);
	const update = {};

	update[historyKey] = history;
	return new Promise(resolve => chrome.storage.local.set(update, resolve));
};

exports.getStackTraceHistory = () => new Promise(resolve => storageArea.get(historyKey, allKeys => {
	resolve(allKeys[historyKey]);
}));

exports.saveStackTraceHistory = async (stack) => {
	const date = new Date();
	const id = date.getTime();

	let history = await exports.getStackTraceHistory();

	if (!Array.isArray(history)) {
		history = [];
	}
	history.push({
		id: id,
		label: _.first(stack.original),
		stack: stack,
	});
	const update = {};

	update[historyKey] = history;

	return new Promise(resolve => chrome.storage.local.set(update, resolve));
};