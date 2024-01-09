/* globals chrome */
const tabOpener = require('./operations/tabOpener');
const sendMessage = stackTrace => {
	chrome.tabs.sendMessage(tabOpener.openedTab.id, {
		action: 'unscramble', content: stackTrace,
	});
	chrome.tabs.update(tabOpener.openedTab.id, { selected: true });
};
const unscrambleSelection = info => {
	const textSelected = info.selectionText ? info.selectionText.toString() : '';
	const stackTrace = textSelected.split(/\s{3,}/ig).join('\n    ');

	if (!tabOpener.openedTab) {
		tabOpener('unscrambler.html')
			.then(() => sendMessage(stackTrace));
	} else {
		sendMessage(stackTrace);
	}
};

chrome.contextMenus.onClicked.addListener(unscrambleSelection);

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		title: 'Unscramble stack trace', id: 'unscramble-stack-trace', contexts: ['selection'],
	});
});

chrome.action.onClicked.addListener(() => tabOpener('unscrambler.html'));