/* globals chrome, alert */
var version = "1.0";

chrome.browserAction.onClicked.addListener(function onActivated(tab) {
	chrome.debugger.attach({tabId: tab.id}, version,
		onAttach.bind(null, tab.id));
});

function onAttach(tabId) {
	if (chrome.runtime.lastError) {
		alert(chrome.runtime.lastError.message);
		return;
	}

	chrome.windows.create(
		{url: "unscrambler.html?" + tabId, type: "popup", width: 800, height: 600});
}