"use strict";

const expect = require("chai").expect;
const syntax = require("../");

describe("Root node tests", () => {
	it("toString", () => {
		const html = [
			'<style lang="stylus">',
			"a",
			"  display flex",
			".b",
			"  color red",
			"  .c",
			"    color red",
			"</style>",
		].join("\n");
		const document = syntax.parse(html, {
			from: "stylus.html",
		});
		expect(document.source).to.haveOwnProperty("lang", "html");
		expect(document.nodes).to.have.lengthOf(1);
		expect(document.nodes[0].toString()).equal(
			[
				"a",
				"  display flex",
				".b",
				"  color red",
				"  .c",
				"    color red",
				"",
			].join("\n")
		);
	});
});
