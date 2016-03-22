exports.toArray = function(arrayLike, from) {
	return Array.prototype.splice.call(arrayLike, from || 0);
};