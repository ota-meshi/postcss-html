"use strict";

const path = require("path");
const chai = require("chai");
const { jestSnapshotPlugin } = require("mocha-chai-jest-snapshot");
const syntax = require("../");
const { listupFixtures } = require("./utils");

chai.use(jestSnapshotPlugin());

const AST_FIXTURE_ROOT = path.resolve(__dirname, "../test-fixtures/ast");

describe("AST tests", () => {
	for (const { filename, content } of listupFixtures(AST_FIXTURE_ROOT)) {
		describe(filename, function () {
			it("ast", () => {
				const document = syntax.parse(content, {
					from: `/${filename}`,
				});
				for (const root of document.nodes) {
					if (document === root.document) {
						Object.defineProperty(root, "document", {
							configurable: true,
							enumerable: true,
							writable: true,
							value: "$document",
						});
					}
				}
				chai.expect(document).toMatchSnapshot();
			});
			it("toString", () => {
				const document = syntax.parse(content, {
					from: `/${filename}`,
				});
				chai.expect(document.toString()).equal(content);
			});
		});
	}
});
