/* globals window, chrome, document */

var unscrambler = require('./unscrambler');

window.addEventListener('load', function() {
	var unscrambleButton = document.querySelector('[name="unscramble-action"]');
	unscrambleButton.addEventListener('click',
		unscrambler('[name="stack-trace"]', '.stack-trace-output .output')
	);
});

chrome.runtime.onMessage.addListener(function(message) {
	var unscrambleButton = document.querySelector('[name="unscramble-action"]'),
		stackTraceInput = document.querySelector('[name="stack-trace"]');
	if (message.action === 'unscramble') {
		stackTraceInput.value = message.content;
		unscrambleButton.click();
	}
});