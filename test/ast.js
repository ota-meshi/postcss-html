"use strict";

const path = require("path");
const fs = require("fs");
const chai = require("chai");
const { jestSnapshotPlugin } = require("mocha-chai-jest-snapshot");
const syntax = require("../");

chai.use(jestSnapshotPlugin());

const AST_FIXTURE_ROOT = path.resolve(__dirname, "../test-fixtures/ast");

describe("AST tests", () => {
	for (const filename of fs.readdirSync(AST_FIXTURE_ROOT)) {
		describe(filename, function () {
			const filePath = path.join(AST_FIXTURE_ROOT, filename);
			const content = fs.readFileSync(filePath, "utf-8");
			it("ast", () => {
				const document = syntax.parse(content, {
					from: `/${filename}`,
				});
				for (const root of document.nodes) {
					if (document === root.document) root.document = "$document";
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
