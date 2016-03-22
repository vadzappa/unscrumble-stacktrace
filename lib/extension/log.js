var utils = require('../util/utils'),
	consoleMethods = ['log', 'warn', 'error'],
	closure = function(chrome) {
		var backgroundPage = chrome.extension.getBackgroundPage(),
			pageConsole = backgroundPage.console,
			logMessage = function(level) {
				var loggingFn = pageConsole[level] || pageConsole.log;
				loggingFn.apply(pageConsole, utils.toArray(arguments, 1));
			},
			consoleLogger = {};

		consoleMethods.forEach(function(methodName) {
			consoleLogger[methodName] = function() {
				var args = utils.toArray(arguments);
				args.unshift(methodName);
				logMessage.apply(null, args);
			};
		});
		return consoleLogger;
	};

exports.console = function(chrome) {
	return closure(chrome);
};