/**
 * Created by vadzim on 3/28/2016.
 */
'use strict';

var wrapLine = function wrapLine(line) {
	return line + '\n';
};

module.exports = function bindPrinterTo(selector) {
	var element = document.querySelector(selector);
	return function(stackTrace) {
		return new Promise(function(resolve, reject) {
			element.value =  stackTrace.join('\n');
			resolve(element);
		});
	};
};