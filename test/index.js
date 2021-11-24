"use strict";

const expect = require("chai").expect;
const postcss = require("postcss");
const syntax = require("../");

describe("API", () => {
	const html = [
		'<style type="text/less">',
		"@c: #888;",
		".variables {color: @c;}",
		"</style>",
		'<style lang="sugarss">',
		"a",
		"  color: blue",
		"</style>",
		"<style>",
		"a {}",
		"</style>",
	].join("\n");

	it("config map object", () => {
		return postcss([])
			.process(html, {
				syntax: syntax({
					css: postcss,
					sugarss: "sugarss",
					less: "postcss-less",
				}),
				from: "api.vue",
			})
			.then((result) => {
				expect(result.root.nodes).to.have.lengthOf(3);
			});
	});

	it("single line syntax error", () => {
		expect(() => {
			syntax.parse("<style>a {</style>", {
				from: "SyntaxError.vue",
			});
		})
			.to.throw(/SyntaxError.vue:1:8: Unclosed block\b/)
			.with.include({ line: 1, column: 8 })
			.have.property("input")
			.include({ line: 1, column: 8 });

		expect(() => {
			syntax.parse("<style>foo foo</style>", {
				from: "SyntaxError.vue",
			});
		})
			.to.throw(/SyntaxError.vue:1:8: Unknown word\b/)
			.with.include({ line: 1, column: 8, endLine: 1, endColumn: 11 })
			.have.property("input")
			.include({ line: 1, column: 8, endLine: 1, endColumn: 11 });
	});

	it("single line with line ending syntax error", () => {
		expect(() => {
			syntax.parse("<style>a {</style>\n", {
				from: "SyntaxError.vue",
			});
		}).to.throw(/SyntaxError.vue:1:8: Unclosed block\b/);
	});

	it("multi line syntax error", () => {
		expect(() => {
			syntax.parse(
				[
					//
					"<html>",
					"<style>a {</style>",
					"</html>",
				].join("\n"),
				{
					from: "SyntaxError.html",
				}
			);
		})
			.to.throw(/SyntaxError.html:2:8: Unclosed block\b/)
			.with.include({ line: 2, column: 8 })
			.have.property("input")
			.include({ line: 2, column: 8 });

		expect(() => {
			syntax.parse(
				[
					//
					"<html>",
					"<style>foo foo</style>",
					"</html>",
				].join("\n"),
				{
					from: "SyntaxError.html",
				}
			);
		})
			.to.throw(/SyntaxError.html:2:8: Unknown word\b/)
			.with.include({ line: 2, column: 8, endLine: 2, endColumn: 11 })
			.have.property("input")
			.include({ line: 2, column: 8, endLine: 2, endColumn: 11 });
	});

	it("custom parse error", () => {
		expect(() => {
			syntax({
				css: {
					parse() {
						throw new TypeError("custom parse error");
					},
				},
			}).parse(["<html>", "<style>a {}</style>", "</html>"].join("\n"), {
				from: "CustomError.html",
			});
		}).to.throw("custom parse error");
	});
});
