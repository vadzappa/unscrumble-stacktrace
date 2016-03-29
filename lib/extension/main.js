/* globals window, chrome, document */

var unscrambler = require('./unscrambler'),
	pageHistory = require('./pageHistoryUpdater')('.traces-history ul'),
	stackTraceHistory = require('./stackTraceHistory'),
	outputSelector = '.stack-trace-output .output',
	getParent = function(element, tagName) {
		if (!element || element.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element;
		}
		return getParent(element.parentElement, tagName);
	};

window.addEventListener('load', function() {
	var unscrambleButton = document.querySelector('[name="unscramble-action"]'),
		historyContainer = document.querySelector('.traces-history ul');
	unscrambleButton.addEventListener('click',
		unscrambler('[name="stack-trace"]', outputSelector)
	);
	stackTraceHistory.getStackTraceHistory()
		.then(pageHistory.drawHistory);
	stackTraceHistory.whenChanged(pageHistory.historyListener);

	historyContainer.addEventListener('click', function(event) {
		if (event.target.tagName === 'ul') {
			return;
		}
		var parentLi = getParent(event.target, 'li'),
			historyItemId = parentLi.attributes.getNamedItem('data-id').value;
		stackTraceHistory
			.getStackTraceHistory()
			.then(function(history) {
				var historyItemFound = history.find(function(item) {
					return item.id === parseInt(historyItemId, 10);
				});
				if (historyItemFound) {
					var output = document.querySelector(outputSelector);
					output.value = historyItemFound.stack.join('\n');
				}
			});
	});
});

chrome.runtime.onMessage.addListener(function(message) {
	var unscrambleButton = document.querySelector('[name="unscramble-action"]'),
		stackTraceInput = document.querySelector('[name="stack-trace"]');
	if (message.action === 'unscramble') {
		stackTraceInput.value = message.content;
		unscrambleButton.click();
	}
});