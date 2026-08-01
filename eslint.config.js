import * as myPlugin from "@ota-meshi/eslint-plugin";
import globals from "globals";

export default [
	{
		ignores: [
			"**/node_modules/",
			"**/coverage/",
			"**/.nyc_output/",
			"!**/.github/",
			"!**/.vscode/",
			"explorer/dist/",
			"test-fixtures/",
		],
	},
	...myPlugin.config({
		node: true,
		vue3: true,
		json: true,
		yaml: true,
		packageJson: true,
		prettier: true,
	}),
	{
		rules: {
			"jsdoc/require-jsdoc": "off",
			"no-tabs": ["error", { allowIndentationTabs: true }],
			"no-warning-comments": "warn",
			"no-lonely-if": "off",
			"new-cap": "off",
			"no-shadow": "off",
		},
	},
	{
		files: ["explorer/src/**/*.{js,vue}"],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		// The explorer is a sub-project with its own package.json whose
		// dependencies are not installed by the root `npm install`.
		files: ["explorer/**"],
		rules: {
			"n/no-missing-import": "off",
			"n/no-missing-require": "off",
		},
	},
	{
		// eslint-plugin-vue's setup config sets `sourceType: "module"` for all
		// files, so set the CommonJS files back.
		files: ["**/*.cjs", "explorer/*.js", "explorer/shim/**/*.js"],
		languageOptions: {
			sourceType: "commonjs",
			globals: {
				...globals.commonjs,
			},
		},
	},
];
