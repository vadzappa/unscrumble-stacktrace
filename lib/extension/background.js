/* globals chrome */
'use strict';

var openedTab = null,
	tabOpener = require('./operations/tabOpener'),
	sendMessage = function(stackTrace) {
		chrome.tabs.sendMessage(openedTab.id, {
			action: 'unscramble',
			content: stackTrace
		});
		chrome.tabs.update(openedTab.id, {selected: true});
	},
	unscrambleSelection = function unscrambleSelection(info) {
		var textSelected = info.selectionText ? info.selectionText.toString() : '',
			stackTrace = textSelected.split(/\s{3,}/ig).join('\n    ');

		if (!openedTab) {
			tabOpener('unscrambler.html')
				.then(function(tab) {
					openedTab = tab;
					sendMessage(stackTrace);
				});
		} else {
			sendMessage(stackTrace);
		}
	};

chrome.contextMenus.create({
	title: 'Unscramble stack trace',
	contexts: ['selection'],
	onclick: unscrambleSelection
});