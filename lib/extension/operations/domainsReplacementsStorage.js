/* globals chrome */
const storageArea = chrome.storage.local;
const storageKey = 'unscrambler-domains-replacement';

exports.whenChanged = handler => chrome.storage.onChanged.addListener(async (changes, areaName) => {
	if (areaName !== 'local') {
		return;
	}

	if (!(storageKey in changes)) {
		return;
	}

	handler(await exports.getAll());
});

exports.remove = async (itemId) => {
	let allKeys = await exports.getAll();

	if (!Array.isArray(allKeys)) {
		return;
	}

	const update = {
		[storageKey]: allKeys.reduce((updated, item) => {
			if (Number(item.id) !== Number(itemId)) {
				updated.push(item);
			}

			return updated;
		}, []),
	};

	return new Promise(resolve => chrome.storage.local.set(update, resolve));
};

exports.update = async (itemId, value) => {
	let allKeys = await exports.getAll();

	if (!Array.isArray(allKeys)) {
		return;
	}

	const update = {
		[storageKey]: allKeys.reduce((updated, item) => {
			updated.push(Number(item.id) === Number(itemId) ? { ...item, ...value } : item);

			return updated;
		}, []),
	};
	return new Promise(resolve => chrome.storage.local.set(update, resolve));
};

exports.getAll = () => new Promise(resolve => storageArea.get(storageKey, allKeys => {
	resolve(allKeys[storageKey]);
}));

exports.add = async (replacement) => {
	const id = new Date().getTime();

	let allKeys = await exports.getAll();

	if (!Array.isArray(allKeys)) {
		allKeys = [];
	}

	allKeys.push({
		id,
		...replacement,
	});

	const update = {
		[storageKey]: allKeys,
	};

	return new Promise(resolve => chrome.storage.local.set(update, resolve));
};