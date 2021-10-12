"use strict";

const extract = require("./html/extract-styles");
const parseStyles = require("./html/parse-styles");
const patchPostcss = require("./patch-postcss");

module.exports = function parse(source, opts) {
	patchPostcss();
	const document = parseStyles(source, opts, extract(source, opts));
	document.source.lang = "html";
	document.source.syntax = opts.syntax;
	return document;
};
