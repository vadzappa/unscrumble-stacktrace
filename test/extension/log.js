var assert = require('assert'),
	sinon = require('sinon'),
	logTests = function logTests() {
		var chrome = {
			extension: {
				getBackgroundPage: function() {
					return {
						console: console
					};
				}
			}
		};

		it('inits log', function(done) {
			var consoleReplacer = require('../../lib/extension/log').console(chrome);
			assert(consoleReplacer, 'console replacer should exist');
			done();
		});

		it('verifies that set of methods exist', function(done) {
			var consoleReplacer = require('../../lib/extension/log').console(chrome);
			assert(consoleReplacer.log, 'log should exist');
			assert(consoleReplacer.warn, 'warn should exist');
			assert(consoleReplacer.error, 'error should exist');
			done();
		});

		it('verifies logging actually is operable', function(done) {

			var getBackgroundStub = sinon.stub(chrome.extension, 'getBackgroundPage'),
				fakeConsole = {
					console: {
						log: sinon.spy(),
						warn: sinon.spy(),
						error: sinon.spy()
					}
				};
			getBackgroundStub.returns(fakeConsole);

			var consoleReplacer = require('../../lib/extension/log').console(chrome);
			assert(consoleReplacer.log, 'log should exist');

			consoleReplacer.log('somedata', 'somemoredata');

			var spyDetails = fakeConsole.console.log,
				spyCall = spyDetails.getCall(0),
				spyThisValue = spyDetails.thisValues[0],
				spyCallArgs = spyCall.args;

			assert.equal(spyDetails.callCount, 1, 'logger should be called once');
			assert.equal(spyCallArgs.length, 2, 'log should be called with 2 arguments');
			assert.deepEqual(spyThisValue, fakeConsole.console, 'should be called on correct context');

			getBackgroundStub.restore();
			done();
		});

	};

describe('log.test', logTests);