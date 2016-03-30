/* globals chrome */
'use strict';

var _ = require('lodash'),
	tabOpener = require('./operations/tabOpener'),
	sendMessage = function(stackTrace) {
		chrome.tabs.sendMessage(tabOpener.openedTab.id, {
			action: 'unscramble',
			content: stackTrace
		});
		chrome.tabs.update(tabOpener.openedTab.id, {selected: true});
	},
	unscrambleSelection = function unscrambleSelection(info) {
		var textSelected = info.selectionText ? info.selectionText.toString() : '',
			stackTrace = textSelected.split(/\s{3,}/ig).join('\n    ');

		if (!tabOpener.openedTab) {
			tabOpener('unscrambler.html')
				.then(function() {
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

chrome.browserAction.onClicked.addListener(_.bind(tabOpener, 'unscrambler.html'));