/* eslint-disable */
const extractFromHTML = require('./lib/extract-from-html').extractFromHTML;
const extractData = require('./lib/extract-data').extractFromHTML;
const extractFromElement = require('./lib/extract-from-element').extractFromHTML;

module.exports = extractFromHTML;
module.exports.extractFromHTML = extractFromHTML;
module.exports.extractData = extractData;
module.exports.extractFromElement = extractFromElement;
