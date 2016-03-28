/**
 * Created by vadzim on 3/28/2016.
 */
'use strict';

module.exports = function extractor(selector) {
	return new Promise(function(resolve, reject) {
		var element = document.querySelector(selector);
		if (!element || !element.value) {
			return resolve('');
		}
		resolve(element.value);
	});
};