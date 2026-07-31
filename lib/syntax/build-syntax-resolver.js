import { createRequire } from "node:module";
import path from "node:path";
import postcssSafeParser from "postcss-safe-parser";
import { cssSyntax, cssSafeSyntax } from "./syntaxes.js";
import { loadModule, isModuleNotFoundError } from "../shared/load-module.js";

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
	{
		test: /^postcss$/i,
		lang: "css",
	},
];
const defaultSyntaxes = {
	sass: "postcss-sass",
	scss: "postcss-scss",
	less: "postcss-less",
	sugarss: "sugarss",
	stylus: "postcss-styl",
};

export default function buildSyntaxResolver(config) {
	const { rules = [], ...syntaxes } = config || {};
	const allRules = [...rules, ...defaultRules];

	const definedLangs = new Set([
		"css",
		...rules.map((rule) => rule.lang),
		...Object.keys(syntaxes),
	]);

	return function resolve(baseLang, baseOptions) {
		let lang = baseLang || "css";
		const options = baseOptions || {};

		const cwd = process.cwd();
		const placeholderFilePath = path.join(cwd, `__placeholder__.${lang}`);

		for (const rule of allRules) {
			const regex = new RegExp(rule.test);
			if (regex.test(lang) || regex.test(placeholderFilePath)) {
				lang = rule.lang;
				break;
			}
		}
		lang = lang.toLowerCase();
		const syntax = syntaxes[lang] || defaultSyntaxes[lang];
		if (syntax) {
			if (typeof syntax === "string") {
				const syntaxModule = loadFromString(syntax, options);
				if (syntaxModule) {
					return syntaxModule;
				}
				if (definedLangs.has(lang)) {
					throw new Error(
						`Cannot resolve module "${syntax}". It's likely that the module isn't installed correctly. Try reinstalling by running the \`npm install ${syntax}@latest --save-dev\``,
					);
				}
			}
			if (syntax === postcssSafeParser) {
				return cssSafeSyntax;
			}
			if (typeof syntax.parse === "function") {
				return syntax;
			}
		}

		if (!definedLangs.has(lang)) {
			return null;
		}

		return options.defaultSyntax || cssSyntax;
	};
}

const requireFromHere = createRequire(import.meta.url);
const standardModuleResolvers = {
	"postcss-sass": () => requireFromHere("postcss-sass"),
	"postcss-scss": () => requireFromHere("postcss-scss"),
	"postcss-less": () => requireFromHere("postcss-less"),
	sugarss: () => requireFromHere("sugarss"),
	"postcss-styl": () => requireFromHere("postcss-styl"),
};

function loadFromString(syntax, options) {
	if (syntax === "postcss") {
		return options.defaultSyntax || cssSyntax;
	}
	if (syntax === "postcss-safe-parser") {
		return cssSafeSyntax;
	}

	const loadedModule = loadModule(syntax);
	if (loadedModule) {
		return loadedModule;
	}

	/* c8 ignore start -- fallback for syntaxes not resolvable from cwd */
	if (standardModuleResolvers[syntax]) {
		try {
			return standardModuleResolvers[syntax]();
		} catch (error) {
			if (!isModuleNotFoundError(error)) {
				throw error;
			}
			// ignore
		}
	}
	/* c8 ignore stop */

	return null;
}
