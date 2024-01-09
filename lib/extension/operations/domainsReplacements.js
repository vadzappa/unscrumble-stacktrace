const $ = require('jquery');
const domainReplacementsStorage = require('./domainsReplacementsStorage');
const fromSelector = '[name="domain-replace-from"]';
const toSelector = '[name="domain-replace-to"]';

const cleanupInputs = () => {
	$(fromSelector).val('');
	$(toSelector).val('');
};

module.exports = async (ev) => {
	ev.preventDefault();
	ev.stopPropagation();

	const current = {
		from: $(fromSelector).val(),
		to: $(toSelector).val(),
	};

	const allItems = await domainReplacementsStorage.getAll();
	const existing = allItems ? allItems.find(item => item.from === current.from) : null;

	if (!existing) {
		await domainReplacementsStorage.add(current);

		return cleanupInputs();
	}

	await domainReplacementsStorage.update(existing.id, current);

	return cleanupInputs();
};