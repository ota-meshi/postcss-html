"use strict";

const expect = require("chai").expect;
const syntax = require("../");

describe("backward compatible tests", () => {
	it("Config", () => {
		const html = `
		<style lang="custom">
		// comment
		</style>`;
		const document = syntax({
			rules: [
				{
					test: /\.custom$/,
					lang: "scss",
				},
			],
		}).parse(html, {
			from: "foo.html",
		});
		expect(document.source).to.haveOwnProperty("lang", "html");
		expect(document.nodes).to.have.lengthOf(1);
		expect(document.nodes[0].type).equal("root");
		expect(document.nodes[0].nodes).to.have.lengthOf(1);
		expect(document.nodes[0].nodes[0].type).equal("comment");
	});
});
