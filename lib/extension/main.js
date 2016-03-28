/* globals window, chrome, document */

var unscrambler = require('./unscrambler');

window.addEventListener('load', function() {
	var unscrambleButton = document.querySelector('[name="unscramble-action"]');
	unscrambleButton.addEventListener('click',
		unscrambler('[name="stack-trace"]', '.stack-trace-output .output')
	);
});