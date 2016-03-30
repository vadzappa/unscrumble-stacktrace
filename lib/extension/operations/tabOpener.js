/* globals chrome */
'use strict';

var openedTab = null;

module.exports.openedTab = openedTab;

module.exports = function(url) {
	return new Promise(function(resolve) {
		chrome.tabs.create({url: url}, function(tab) {
			chrome.tabs.onUpdated.addListener(function(tabId, info) {
				if (tabId === tab.id && info.status === 'complete') {
					openedTab = module.exports.openedTab = tab;
					resolve();
				}
			});
		});
	});
};