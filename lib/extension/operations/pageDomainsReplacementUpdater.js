/* globals document */
const $ = require('jquery');
const domainsReplacementsStorage = require('./domainsReplacementsStorage');
const internals = {};

internals.removeDomainReplacement = async (event) => {
	event.preventDefault();
	event.stopPropagation();

	const $target = $(event.target);
	const $parent = $target.closest('li');
	const itemId = $parent.data('id');

	$parent.remove();

	await domainsReplacementsStorage.remove(itemId);
};

internals.prepareDomainReplacement = item => {
	const listItem = $('<li>' +
		'<div class="history-data">' +
		'<div class="details"></div>' +
		'</div>' +
		'<div class="history-actions">' +
		'<a href="#">X</a>' +
		'</div>' +
		'</li>');

	listItem.data('id', item.id);
	listItem.find('.details').text(`From: "${item.from}" to "${item.to}"`);

	return listItem;
};

internals.domainsReplacementsDrawer = (selector, items) => {
	const fragment = $(document.createDocumentFragment());
	const itemsList = items ? items.map(internals.prepareDomainReplacement) : [];

	itemsList.reduce((fragment, listItem) => fragment.prepend(listItem), fragment);

	$(selector).html(fragment);
};

module.exports = (selector) => {
	$(selector).on('click', '.history-actions a', internals.removeDomainReplacement);

	return {
		redraw: (items) => internals.domainsReplacementsDrawer(selector, items),
	};
};