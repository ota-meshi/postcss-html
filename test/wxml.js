"use strict";

const expect = require("chai").expect;
const syntax = require("../");

describe("wxml tests", () => {
	it("ignore style-like content inside wxs", () => {
		const document = syntax.parse(
			[
				'<wxs module="bar">',
				"  var tpl = '<view style=\"color: blue;\"></view>'",
				"</wxs>",
				'<view style="color: red;"></view>',
			].join("\n"),
			{
				from: "app.wxml",
			},
		);

		expect(document.nodes).to.have.lengthOf(1);
		expect(document.first.source).to.have.property("lang", "css");
		expect(document.first.nodes).to.have.lengthOf(1);
		expect(document.first.first).to.have.property("prop", "color");
		expect(document.first.first).to.have.property("value", "red");
	});

	it("skip full mustache style value", () => {
		const document = syntax.parse('<view style="{{ style }}"></view>', {
			from: "app.wxml",
		});

		expect(document.nodes).to.have.lengthOf(0);
	});

	it("parse mixed declarations with mustache", () => {
		const document = syntax.parse(
			"<view style=\"font-weight: bold; font-size: {{ fontSize }}rpx; color: {{ color }}; background-image: url('{{ backgroundColor }}');\"></view>",
			{
				from: "app.wxml",
			},
		);

		expect(document.nodes).to.have.lengthOf(1);
		const root = document.first;
		expect(root.source).to.have.property("lang", "custom-template");
		expect(root.nodes).to.have.lengthOf(4);
		expect(root.nodes[0]).to.include({ prop: "font-weight", value: "bold" });
		expect(root.nodes[1]).to.include({
			prop: "font-size",
			value: "{{ fontSize }}rpx",
		});
		expect(root.nodes[2]).to.include({ prop: "color", value: "{{ color }}" });
		expect(root.nodes[3]).to.include({
			prop: "background-image",
			value: "url('{{ backgroundColor }}')",
		});
	});
});
