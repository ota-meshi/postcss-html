"use strict";

const syntax = require("../");

// https://github.com/ota-meshi/postcss-html/issues/146
describe("issue 146 test", () => {
	it("should not fail when you call `toJSON()`", () => {
		const document = syntax.parse("<style>a {}</style>", {
			from: `/test.html`,
		});
		document.toJSON();
	});
});
