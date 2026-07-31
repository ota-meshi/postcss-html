"use strict";

// Verifies that CommonJS consumers on Node.js 22.12+ can still load
// postcss-html via require() and get the same API as v1.
const { expect } = require("chai");
const syntax = require("postcss-html");

describe("CommonJS interop", () => {
	it("require() returns the callable syntax function", () => {
		expect(syntax).to.be.a("function");
		expect(syntax.parse).to.be.a("function");
		expect(syntax.stringify).to.be.a("function");
	});

	it("parses and stringifies through the require()d API", () => {
		const html = '<style>a{color:red}</style><div style="color: blue">x</div>';
		const document = syntax.parse(html, { from: "cjs-interop.html" });
		expect(document.nodes).to.have.lengthOf(2);
		expect(document.toString()).to.equal(html);

		const configured = syntax({});
		expect(configured.parse).to.be.a("function");
		expect(configured.stringify).to.be.a("function");
	});
});
