'use strict';

var $ = require('jquery');

module.exports = function extractor(selector) {
	return new Promise(function(resolve) {
		resolve($(selector).val());
	});
};