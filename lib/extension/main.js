/* globals window, chrome, document */

var tabId = parseInt(window.location.search.substring(1));

window.addEventListener("load", function() {
	chrome.debugger.sendCommand({tabId: tabId}, "Network.enable");
	chrome.debugger.onEvent.addListener(onEvent);
});

window.addEventListener("unload", function() {
	chrome.debugger.detach({tabId: tabId});
});

function onEvent(debuggeeId, message, params) {
	if (message === "Network.requestWillBeSent") {
		var requestDiv = document.createElement("div");
		requestDiv.className = "request";
		var urlLine = document.createElement("div");
		urlLine.textContent = params.request.url;
		requestDiv.appendChild(urlLine);
		document.getElementById("container").appendChild(requestDiv);
	}
}