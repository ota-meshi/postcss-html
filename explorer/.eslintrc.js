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
};
