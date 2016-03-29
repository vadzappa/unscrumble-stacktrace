/* globals window, chrome, document */
'use strict';

var openedTab = null,
	unscrambleSelection = function genericOnClick(info) {
		var textSelected = info.selectionText ? info.selectionText.toString() : '',
			stackTrace = textSelected.split(/\s{3,}/ig).join('\n    '),
			sendMessage = function() {
				chrome.tabs.sendMessage(openedTab.id, {
					action: 'unscramble',
					content: stackTrace
				});
				chrome.tabs.update(openedTab.id, {selected: true});
			};

		if (!openedTab) {
			chrome.tabs.create({url: 'unscrambler.html'}, function(tab) {
				openedTab = tab;
				chrome.tabs.onUpdated.addListener(function(tabId, info) {
					if (tabId === openedTab.id && info.status === 'complete') {
						sendMessage();
					}
				});
			});
		} else {
			sendMessage();
		}
	};

chrome.contextMenus.create({
	title: 'Unscramble stack trace',
	contexts: ['selection'],
	onclick: unscrambleSelection
});