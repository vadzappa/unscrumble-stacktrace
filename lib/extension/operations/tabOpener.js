/* globals chrome */
let openedTab = null;

module.exports.openedTab = openedTab;

module.exports = url => new Promise(resolve => {
	chrome.tabs.onRemoved.addListener(tabId => {
		if (openedTab && tabId === openedTab.id) {
			openedTab = module.exports.openedTab = null;
		}
	});

	chrome.tabs.create({ url: url }, tab => {
		chrome.tabs.onUpdated.addListener((tabId, info) => {
			if (tabId === tab.id && info.status === 'complete') {
				openedTab = module.exports.openedTab = tab;
				resolve();
			}
		});
	});
});