"use strict";

// const version = require("./package.json").version

module.exports = {
	parserOptions: {
		sourceType: "script",
		ecmaVersion: 2020,
	},
	env: {
		node: true,
	},
	extends: [
		"plugin:@ota-meshi/recommended",
		"plugin:@ota-meshi/+node",
		"plugin:@ota-meshi/+yaml",
		"plugin:@ota-meshi/+json",
		"plugin:@ota-meshi/+package-json",
		"plugin:@ota-meshi/+prettier",
	],
	rules: {
		"require-jsdoc": "off", // TODO
		"no-tabs": ["error", { allowIndentationTabs: true }],
		"no-warning-comments": "warn",
		"no-lonely-if": "off",
		"new-cap": "off",
		"no-shadow": "off",
		"prettier/prettier": [
			"error",
			{},
			{
				usePrettierrc: true,
			},
		],
		"prefer-const": "error",
	},
	overrides: [
		{
			files: ["test/**/*.js"],
			rules: {
				"require-jsdoc": "off",
				"no-console": "off",
			},
		},
	],
};
