'use strict';

var $ = require('jquery');

module.exports = function toggleClass(selector, className) {
	return new Promise(function(resolve) {
		$(selector).toggleClass(className);
		resolve();
	});
};