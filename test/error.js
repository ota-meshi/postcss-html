import { fileURLToPath } from "node:url";
import chai from "chai";
import syntax from "postcss-html";

const expect = chai.expect;

describe("error tests", () => {
	it("require error", () => {
		const html = [
			//
			'<style lang="foo">',
			"Unknown",
			"</style>",
		].join("\n");
		const parser = syntax({
			foo: fileURLToPath(new URL("./error-test-module.txt", import.meta.url)),
		});
		expect(() =>
			parser.parse(html, {
				from: "markdown.md",
			}),
		).to.throw("TEST");
	});

	it("define rules option", () => {
		const html = [
			//
			'<style lang="foo">',
			"Unknown",
			"</style>",
		].join("\n");
		const parser = syntax({
			rules: [
				{
					test: /^foo$/,
					lang: "foo",
				},
			],
		});
		expect(() =>
			parser.parse(html, {
				from: "markdown.md",
			}),
		).to.throw("Unknown word");
	});
	it("define syntax option", () => {
		const html = [
			//
			'<style lang="foo">',
			"Unknown",
			"</style>",
		].join("\n");
		const parser = syntax({
			foo: "postcss-foo",
		});
		expect(() =>
			parser.parse(html, {
				from: "markdown.md",
			}),
		).to.throw('Cannot resolve module "postcss-foo"');
	});
});
