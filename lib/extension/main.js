/* globals window, chrome */

var $ = require('jquery'),
	traceHistoryContainer = '.traces-history ul',
	outputSelector = '.stack-trace-output .output',
	stackTraceInputSelector = '[name="stack-trace"]',
	unscrambleButtonSelector = '[name="unscramble-action"]',
	unscrambler = require('./operations/unscrambler'),
	pageHistory = require('./operations/pageHistoryUpdater'),
	stackTraceHistory = require('./operations/stackTraceHistory');

$(window).load(function() {
	var unscrambleButton = $(unscrambleButtonSelector),
		historyManager = pageHistory(traceHistoryContainer, outputSelector);
	unscrambleButton.on('click', unscrambler(stackTraceInputSelector, outputSelector));
	stackTraceHistory.getStackTraceHistory().then(historyManager.drawHistory);
	stackTraceHistory.whenChanged(historyManager.historyListener);
});

chrome.runtime.onMessage.addListener(function(message) {
	var unscrambleButton = $(unscrambleButtonSelector),
		stackTraceInput = $(stackTraceInputSelector);
	if (message.action === 'unscramble') {
		stackTraceInput.val(message.content);
		unscrambleButton.click();
	}
});