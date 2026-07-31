"use strict";

module.exports = {
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
	},
	extends: [
		"plugin:@ota-meshi/+vue3",
		"plugin:@ota-meshi/+json",
		"plugin:@ota-meshi/+prettier",
	],
	rules: {
		"n/no-unsupported-features/es-syntax": "off",
		"n/no-unsupported-features/node-builtins": "off",
		"n/no-missing-import": "off",
		"n/no-missing-require": "off",
		"n/no-extraneous-require": "off",
		"n/no-unpublished-import": "off",
		"n/no-unpublished-require": "off",
		complexity: "off",
		"no-console": "off",
	},
	overrides: [
		{
			files: [
				".eslintrc.js",
				"babel.config.js",
				"vue.config.js",
				"shim/**/*.js",
			],
			env: {
				commonjs: true,
			},
			globals: {
				__dirname: "readonly",
				__filename: "readonly",
				exports: "writable",
				module: "readonly",
				require: "readonly",
			},
			parserOptions: {
				sourceType: "script",
			},
		},
	],
};
