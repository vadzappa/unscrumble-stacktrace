/**
 * Created by vadzim on 3/28/2016.
 */
'use strict';

module.exports = function toggleClass(selector, className) {
	return new Promise(function(resolve) {
		var element = document.querySelector(selector),
			allClasses = element.className || '';
		if (allClasses.indexOf(className) === -1) {
			allClasses += ' ' + className;
		} else {
			allClasses = allClasses.replace(className, '');
		}
		element.className = allClasses;
		resolve();
	});
};