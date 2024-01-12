"use strict";

const path = require("path");
const expect = require("chai").expect;
const syntax = require("../");

describe("error tests", () => {
	it("require error", () => {
		const html = [
			//
			'<style lang="foo">',
			"Unknown",
			"</style>",
		].join("\n");
		const parser = syntax({
			foo: path.join(__dirname, "./error-test-module.txt"),
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
