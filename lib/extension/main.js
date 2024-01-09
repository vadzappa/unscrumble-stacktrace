/* globals window, chrome */
const $ = require('jquery');
const unscrambler = require('./operations/unscrambler');
const domainsReplacements = require('./operations/domainsReplacements');
const domainsReplacementsStorage = require('./operations/domainsReplacementsStorage');
const pageHistory = require('./operations/pageHistoryUpdater');
const pageDomainsReplacement = require('./operations/pageDomainsReplacementUpdater');
const stackTraceHistory = require('./operations/stackTraceHistory');

const traceHistoryContainer = '.right-side-container .traces-history ul';
const outputSelector = '.stack-trace-output .output';
const stackTraceInputSelector = '[name="stack-trace"]';
const unscrambleButtonSelector = '[name="unscramble-action"]';
const domainsReplacementsContainer = '.right-side-container .domain-replacements ul';
const saveReplacementButtonSelector = '[name="save-domain-replacement"]';

$(window).load(() => {
	const unscrambleButton = $(unscrambleButtonSelector);
	const saveReplacementButton = $(saveReplacementButtonSelector);
	const historyManager = pageHistory(traceHistoryContainer, outputSelector, stackTraceInputSelector);
	const domainsReplacementsManager = pageDomainsReplacement(domainsReplacementsContainer);

	unscrambleButton.on('click', unscrambler(stackTraceInputSelector, outputSelector));
	stackTraceHistory.getStackTraceHistory().then(historyManager.redraw);
	stackTraceHistory.whenChanged(historyManager.redraw);

	saveReplacementButton.on('click', domainsReplacements);
	domainsReplacementsStorage.getAll().then(domainsReplacementsManager.redraw);
	domainsReplacementsStorage.whenChanged(domainsReplacementsManager.redraw);
});

chrome.runtime.onMessage.addListener(message => {
	const unscrambleButton = $(unscrambleButtonSelector);
	const stackTraceInput = $(stackTraceInputSelector);

	if (message.action === 'unscramble') {
		stackTraceInput.val(message.content);
		unscrambleButton.click();
	}
});