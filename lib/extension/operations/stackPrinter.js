'use strict';

var $ = require('jquery');

module.exports = function bindPrinterTo(selector) {
	var $element = $(selector);
	return function(stackTrace) {
		return new Promise(function(resolve) {
			$element.val(stackTrace.parsed.join('\n'));
			resolve();
		});
	};
};