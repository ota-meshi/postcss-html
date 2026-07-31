"use strict";

module.exports = {
	extends: "stylelint-config-recommended-vue",
	// Workaround for stylelint 17: formatter resolution evaluates the config
	// without a target file, and an overrides-only config has no top-level
	// `rules`, which stylelint 17 treats as a configuration error.
	rules: {},
};
