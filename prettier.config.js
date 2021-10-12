"use strict";

module.exports = {
	tabWidth: 2,
	semi: true,
	useTabs: true,
	overrides: [
		{
			files: ["*.json"],
			options: {
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
};
