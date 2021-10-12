"use strict";

const path = require("path");
const postcssParse = require("postcss/lib/parse");
const postcssStringify = require("postcss/lib/stringify");

const postcssSafeParser = require("postcss-safe-parser");

const cssSyntax = {
	parse: postcssParse,
	stringify: postcssStringify,
};

const defaultRules = [
	{
		test: /^sass$/i,
		lang: "sass",
	},
	{
		test: /^scss$/i,
		lang: "scss",
	},
	{
		test: /^less$/i,
		lang: "less",
	},
	{
		test: /^s(?:ugar)?ss$/i,
		lang: "sugarss",
	},
	{
		test: /^styl(?:us)?$/i,
		lang: "stylus",
	},
];
const defaultSyntaxes = {
	sass: "postcss-sass",
	scss: "postcss-scss",
	less: "postcss-less",
	sugarss: "sugarss",
	stylus: "postcss-styl",
};

module.exports = function buildSyntaxResolver(config) {
	const { rules = [], ...syntaxes } = config || {};

	return function resolve(baseLang) {
		let lang = baseLang || "css";
		for (const rule of [...rules, ...defaultRules]) {
			if (new RegExp(rule.test).test(lang)) {
				lang = rule.lang;
				break;
			}
		}
		lang = lang.toLowerCase();
		const syntax = syntaxes[lang] || defaultSyntaxes[lang];
		if (syntax) {
			if (typeof syntax === "string") {
				return loadFromString(syntax);
			}
			if (typeof syntax.parse === "function") {
				return syntax;
			}
		}
		return cssSyntax;
	};
};

function loadFromString(syntax) {
	if (syntax === "postcss") {
		return cssSyntax;
	}
	if (syntax === "postcss-safe-parser") {
		return {
			parse: postcssSafeParser,
			stringify: postcssStringify,
		};
	}

	try {
		const m = require("module");
		const cwd = process.cwd();
		const relativeTo = path.join(cwd, "__placeholder__.js");
		// eslint-disable-next-line node/no-unsupported-features/node-builtins -- ignore
		return m.createRequire(relativeTo)(syntax);
	} catch {
		throw new Error(`The module cannot be loaded: ${syntax}`);
	}
}
