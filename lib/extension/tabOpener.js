/* globals chrome */
'use strict';

module.exports = function(url) {
	return new Promise(function(resolve) {
		chrome.tabs.create({url: url}, function(tab) {
			chrome.tabs.onUpdated.addListener(function(tabId, info) {
				if (tabId === tab.id && info.status === 'complete') {
					resolve(tab);
				}
			});
		});
	});
};