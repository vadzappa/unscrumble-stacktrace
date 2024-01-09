const $ = require('jquery');

module.exports = (selector, className) => $(selector).toggleClass(className);